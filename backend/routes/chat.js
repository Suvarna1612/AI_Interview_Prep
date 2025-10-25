const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
// Simple cosine similarity function
const cosineSimilarity = (a, b) => {
  const dotProduct = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
  return dotProduct / (magnitudeA * magnitudeB);
};
const { v4: uuidv4 } = require('uuid');
const Chat = require('../models/Chat');
const Document = require('../models/Document');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure Google Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper function to get embedding for a single text using Gemini (with fallback)
const getEmbedding = async (text) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'embedding-001' });
    const result = await model.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.error('Error getting embedding:', error);
    // Fallback: return dummy embedding for now
    console.log('Using fallback embedding due to API limits');
    return new Array(768).fill(0).map(() => Math.random());
  }
};

// Helper function to find similar chunks using cosine similarity
const findSimilarChunks = (queryEmbedding, documents, topK = 2) => {
  const allChunks = [];

  documents.forEach(doc => {
    doc.chunks.forEach(chunk => {
      const similarity = cosineSimilarity(queryEmbedding, chunk.embedding);
      allChunks.push({
        ...chunk.toObject(),
        similarity,
        documentType: doc.type,
        documentId: doc._id
      });
    });
  });

  return allChunks
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);
};

// @route   POST /api/chat/start
// @desc    Initialize interview session
// @access  Private
router.post('/start', auth, async (req, res) => {
  try {
    // Check if user has both resume and job description
    const documents = await Document.find({ userId: req.user._id });
    const resume = documents.find(doc => doc.type === 'resume');
    const jobDescription = documents.find(doc => doc.type === 'job_description');

    if (!resume || !jobDescription) {
      return res.status(400).json({
        message: 'Both resume and job description are required to start interview'
      });
    }

    // Generate initial question based on job description
    const prompt = `Based on this job description, generate 1 engaging interview question that would be appropriate for this role. 

Choose from these question types:
- Technical skills and knowledge
- Problem-solving scenarios
- Experience and achievements
- Behavioral situations
- Role-specific challenges
- Industry knowledge

Job Description:
${jobDescription.extractedText.substring(0, 2000)}

Please provide just one clear, specific interview question without numbering or additional text. Make it engaging and relevant to the role.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
    const fullPrompt = `You are an experienced interviewer. Generate relevant, professional interview questions based on the provided job description.

${prompt}`;

    const result = await model.generateContent(fullPrompt);
    const question = result.response.text();

    // Create new chat session
    const sessionId = uuidv4();
    const chat = new Chat({
      userId: req.user._id,
      sessionId,
      resumeDocumentId: resume._id,
      jobDescriptionId: jobDescription._id,
      messages: [
        {
          role: 'system',
          content: 'Interview session started'
        },
        {
          role: 'assistant',
          content: `Welcome to your interview simulation! I've analyzed the job description and prepared a question for you.\n\n${question}\n\nPlease provide your response to this question.`
        }
      ]
    });

    await chat.save();

    res.json({
      sessionId,
      message: `Welcome to your interview simulation! I've analyzed the job description and prepared a question for you.\n\n${question}\n\nPlease provide your response to this question.`,
      question
    });
  } catch (error) {
    console.error('Start chat error:', error);
    res.status(500).json({
      message: 'Error starting interview session',
      error: error.message
    });
  }
});

// @route   POST /api/chat/query
// @desc    Process user message and generate AI response
// @access  Private
router.post('/query', auth, async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message || !sessionId) {
      return res.status(400).json({ message: 'Message and session ID are required' });
    }

    // Find chat session first
    const chat = await Chat.findOne({
      sessionId,
      userId: req.user._id,
      isActive: true
    });

    if (!chat) {
      return res.status(404).json({ message: 'Chat session not found' });
    }

    // Check if user is requesting a new question
    const requestingNewQuestion = /^(yes|next|next question|another|more|continue)$/i.test(message.trim());

    if (requestingNewQuestion) {
      // Generate a new question
      const documents = await Document.find({
        userId: req.user._id,
        _id: { $in: [chat.resumeDocumentId, chat.jobDescriptionId] }
      });

      const jobDescription = documents.find(doc => doc.type === 'job_description');

      const questionPrompt = `Based on this job description, generate 1 engaging interview question that would be appropriate for this role. 

Choose from these question types:
- Technical skills and knowledge
- Problem-solving scenarios
- Experience and achievements
- Behavioral situations
- Role-specific challenges
- Industry knowledge

Job Description:
${jobDescription.extractedText.substring(0, 2000)}

Please provide just one clear, specific interview question without numbering or additional text. Make it engaging and relevant to the role.`;

      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
      const fullPrompt = `You are an experienced interviewer. Generate relevant, professional interview questions based on the provided job description.

${questionPrompt}`;

      const result = await model.generateContent(fullPrompt);
      const newQuestion = result.response.text();

      // Add the new question to chat
      const questionMessage = {
        role: 'assistant',
        content: newQuestion
      };

      chat.messages.push(questionMessage);
      await chat.save();

      return res.json({
        message: newQuestion,
        isNewQuestion: true
      });
    }

    // Continue with regular response evaluation (chat session already found above)

    // Get user documents
    const documents = await Document.find({
      userId: req.user._id,
      _id: { $in: [chat.resumeDocumentId, chat.jobDescriptionId] }
    });

    // For now, use simple text matching instead of embeddings to avoid API limits
    const resumeText = documents.find(doc => doc.type === 'resume')?.extractedText || '';
    const jobDescText = documents.find(doc => doc.type === 'job_description')?.extractedText || '';

    // Use first 500 characters of each document as context
    const resumeContext = resumeText.substring(0, 500);
    const jobContext = jobDescText.substring(0, 500);

    // Get the last assistant message to understand the context/question
    const lastAssistantMessage = chat.messages
      .filter(msg => msg.role === 'assistant')
      .pop();

    // Create evaluation prompt
    const ragPrompt = `You are an experienced interviewer evaluating a candidate's response. 

Context from candidate's resume:
${resumeContext}

Context from job description:
${jobContext}

Previous Question/Context: ${lastAssistantMessage ? lastAssistantMessage.content : 'General interview question'}

Candidate's Response: ${message}

Please evaluate this response and provide:
1. A score from 1-10 (where 10 is excellent)
2. Constructive feedback (max 150 words)

Be encouraging and specific about what was good and what could be improved. Do NOT include a new question in this response.

Format your response as:
SCORE: [number]
FEEDBACK: [your detailed feedback]`;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
    const fullPrompt = `You are an experienced and encouraging interviewer providing constructive feedback and evaluation. Be supportive while being honest about areas for improvement. Vary your question types to keep the interview engaging and comprehensive.

${ragPrompt}`;

    const result = await model.generateContent(fullPrompt);
    const aiResponse = result.response.text();

    // Parse the AI response
    const scoreMatch = aiResponse.match(/SCORE:\s*(\d+)/i);
    const feedbackMatch = aiResponse.match(/FEEDBACK:\s*(.*?)$/is);

    const score = scoreMatch ? parseInt(scoreMatch[1]) : null;
    const feedback = feedbackMatch ? feedbackMatch[1].trim() : '';

    // Create simple citations
    const citations = [
      {
        chunkIndex: 0,
        documentType: 'resume',
        snippet: resumeContext.substring(0, 100) + '...'
      },
      {
        chunkIndex: 0,
        documentType: 'job_description',
        snippet: jobContext.substring(0, 100) + '...'
      }
    ];

    // Add user message to chat
    chat.messages.push({
      role: 'user',
      content: message
    });

    // Add assistant response with feedback only
    const feedbackMessage = {
      role: 'assistant',
      content: feedback,
      score,
      feedback,
      citations
    };

    chat.messages.push(feedbackMessage);

    // Add a follow-up message asking if they want another question
    const followUpMessage = {
      role: 'assistant',
      content: "Great job! Would you like me to ask you another interview question? Just type 'yes' or 'next question' to continue, or feel free to ask me anything else about your interview preparation."
    };

    chat.messages.push(followUpMessage);
    await chat.save();

    res.json({
      message: feedback,
      score,
      feedback,
      followUpMessage: "Great job! Would you like me to ask you another interview question? Just type 'yes' or 'next question' to continue",
      showFollowUp: true,
      citations: citations.map(citation => ({
        documentType: citation.documentType,
        snippet: citation.snippet
      }))
    });
  } catch (error) {
    console.error('Chat query error:', error);
    res.status(500).json({
      message: 'Error processing message',
      error: error.message
    });
  }
});

// @route   GET /api/chat/history/:sessionId
// @desc    Get chat history
// @access  Private
router.get('/history/:sessionId', auth, async (req, res) => {
  try {
    const chat = await Chat.findOne({
      sessionId: req.params.sessionId,
      userId: req.user._id
    });

    if (!chat) {
      return res.status(404).json({ message: 'Chat session not found' });
    }

    res.json({
      messages: chat.messages.filter(msg => msg.role !== 'system')
    });
  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({ message: 'Error fetching chat history' });
  }
});

module.exports = router;