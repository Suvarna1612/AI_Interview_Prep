import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import FileUpload from '../components/FileUpload';

const Upload = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get('/documents/list');
      setDocuments(response.data.documents);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file, type) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      await axios.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      toast.success(`${type === 'resume' ? 'Resume' : 'Job description'} uploaded successfully!`);
      fetchDocuments(); // Refresh the list
    } catch (error) {
      const message = error.response?.data?.message || 'Upload failed';
      toast.error(message);
      throw error; // Re-throw to stop progress bar
    }
  };

  const handleDelete = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      await axios.delete(`/documents/${documentId}`);
      toast.success('Document deleted successfully');
      fetchDocuments(); // Refresh the list
    } catch (error) {
      const message = error.response?.data?.message || 'Delete failed';
      toast.error(message);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const hasResume = documents.some(doc => doc.type === 'resume');
  const hasJobDescription = documents.some(doc => doc.type === 'job_description');
  const canStartInterview = hasResume && hasJobDescription;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Upload Your Documents
          </h1>
          <p className="text-lg text-gray-600">
            Upload your resume and job description to start your AI-powered interview practice
          </p>
        </div>

        {/* Upload Status */}
        <div className="mb-8 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 ${hasResume ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${hasResume ? 'bg-green-100' : 'bg-gray-100'}`}>
                  {hasResume ? (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  )}
                </div>
                <span className="text-sm font-medium">Resume</span>
              </div>
              
              <div className={`flex items-center space-x-2 ${hasJobDescription ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${hasJobDescription ? 'bg-green-100' : 'bg-gray-100'}`}>
                  {hasJobDescription ? (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  )}
                </div>
                <span className="text-sm font-medium">Job Description</span>
              </div>
            </div>
            
            {canStartInterview && (
              <Link 
                to="/chat" 
                className="btn-primary"
              >
                Start Interview
              </Link>
            )}
          </div>
        </div>

        {/* Upload Areas */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Resume
            </h2>
            <FileUpload
              onUpload={handleUpload}
              type="resume"
            />
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Job Description
            </h2>
            <FileUpload
              onUpload={handleUpload}
              type="job_description"
            />
          </div>
        </div>

        {/* Document List */}
        {documents.length > 0 && (
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Uploaded Documents
            </h2>
            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {doc.originalName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {doc.type === 'resume' ? 'Resume' : 'Job Description'} • {formatFileSize(doc.fileSize)} • {formatDate(doc.createdAt)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete document"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        {!canStartInterview && (
          <div className="card bg-blue-50 border-blue-200">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-blue-900 mb-1">
                  Upload both documents to continue
                </h3>
                <p className="text-sm text-blue-700">
                  You need to upload both your resume and the job description before you can start the interview simulation.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;