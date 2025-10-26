import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [showCitationModal, setShowCitationModal] = useState(false);
  const [selectedCitation, setSelectedCitation] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    initializeChat();
  }, []);

  const initializeChat = async () => {
    try {
      const response = await axios.post('/chat/start');
      setSessionId(response.data.sessionId);
      setMessages([
        {
          role: 'assistant',
          content: response.data.message,
          timestamp: new Date()
        }
      ]);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to start interview';
      toast.error(message);
      
      if (error.response?.status === 400) {
        // User doesn't have required documents
        navigate('/upload');
      }
    } finally {
      setInitializing(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || loading) return;

    const userMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await axios.post('/chat/query', {
        message: inputMessage,
        sessionId
      });

      const assistantMessage = {
        role: 'assistant',
        content: response.data.message,
        score: response.data.score,
        feedback: response.data.feedback,
        citations: response.data.citations,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // If there's a follow-up message, add it as a separate message
      if (response.data.showFollowUp && response.data.followUpMessage) {
        const followUpMessage = {
          role: 'assistant',
          content: response.data.followUpMessage,
          timestamp: new Date()
        };
        
        // Add follow-up message after a short delay for better UX
        setTimeout(() => {
          setMessages(prev => [...prev, followUpMessage]);
        }, 1000);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send message';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    // Auto-resize textarea on mobile
    if (window.innerWidth <= 640) {
      e.target.style.height = 'auto';
      e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
    }
  };

  const openCitationModal = (citation) => {
    setSelectedCitation(citation);
    setShowCitationModal(true);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-600 bg-green-100';
    if (score >= 6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing your interview session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-3 sm:px-4 py-3 sm:py-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
              AI Interview Simulation
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
              Practice your interview skills with personalized questions
            </p>
          </div>
          <button
            onClick={() => navigate('/upload')}
            className="btn-secondary text-xs sm:text-sm px-3 sm:px-4 py-2 ml-3 whitespace-nowrap touch-manipulation"
            aria-label="Upload new documents"
          >
            <span className="hidden sm:inline">Upload New Documents</span>
            <span className="sm:hidden">Upload</span>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 sm:py-6 pb-safe">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-3xl rounded-lg px-3 sm:px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white border border-gray-200 shadow-sm'
                }`}
              >
                <div className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed">{message.content}</div>
                
                {/* Score and Citations for AI messages */}
                {message.role === 'assistant' && (message.score || message.citations) && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    {message.score && (
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-xs sm:text-sm text-gray-600">Score:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(message.score)}`}>
                          {message.score}/10
                        </span>
                      </div>
                    )}
                    
                    {message.citations && message.citations.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-xs sm:text-sm text-gray-600">References:</span>
                        <div className="flex flex-wrap gap-2">
                          {message.citations.map((citation, citationIndex) => (
                            <button
                              key={citationIndex}
                              onClick={() => openCitationModal(citation)}
                              className="text-xs bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 px-2 py-1 rounded transition-colors touch-manipulation min-h-[32px] flex items-center"
                              aria-label={`View reference from ${citation.documentType === 'resume' ? 'Resume' : 'Job Description'}`}
                            >
                              {citation.documentType === 'resume' ? 'Resume' : 'Job Description'}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <div className={`text-xs mt-2 ${message.role === 'user' ? 'text-primary-200' : 'text-gray-500'}`}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-lg px-3 sm:px-4 py-3 shadow-sm max-w-[85%] sm:max-w-3xl">
                <div className="flex items-center space-x-2">
                  <div className="loading-spinner"></div>
                  <span className="text-gray-600 text-sm sm:text-base">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-3 sm:px-4 py-3 sm:py-4 pb-safe">
        <div className="max-w-4xl mx-auto">
          <div className="flex space-x-2 sm:space-x-4">
            <div className="flex-1">
              <textarea
                value={inputMessage}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Type your response here..."
                className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-sm sm:text-base max-h-32 sm:max-h-none"
                rows="3"
                disabled={loading}
                aria-label="Type your interview response"
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || loading}
              className="btn-primary px-4 sm:px-6 py-3 h-fit min-w-[48px] min-h-[48px] flex items-center justify-center touch-manipulation"
              aria-label="Send message"
            >
              {loading ? (
                <div className="loading-spinner w-5 h-5"></div>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 hidden sm:block">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>

      {/* Citation Modal */}
      {showCitationModal && selectedCitation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto mx-4">
            <div className="p-4 sm:p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 pr-4">
                  Reference from {selectedCitation.documentType === 'resume' ? 'Resume' : 'Job Description'}
                </h3>
                <button
                  onClick={() => setShowCitationModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Close modal"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{selectedCitation.snippet}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;