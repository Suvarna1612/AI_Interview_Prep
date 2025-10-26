import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Landing = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 lg:pt-32 pb-16 sm:pb-20">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Master Your Next
            <span className="text-primary-600 block">Job Interview</span>
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Practice with our AI-powered interview simulator. Upload your resume and job description, 
            then get personalized questions and real-time feedback to improve your interview skills.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link to="/upload" className="btn-primary text-lg px-8 py-4 min-h-[56px] flex items-center justify-center">
                Start Practicing
              </Link>
            ) : (
              <>
                <Link to="/signup" className="btn-primary text-lg px-8 py-4 min-h-[56px] flex items-center justify-center">
                  Get Started
                </Link>
                <Link to="/login" className="btn-secondary text-lg px-8 py-4 min-h-[56px] flex items-center justify-center">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Three simple steps to improve your interview performance
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="text-center p-4 sm:p-6">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 touch-manipulation">
              <svg className="w-7 h-7 sm:w-8 sm:h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              1. Upload Documents
            </h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Upload your resume and the job description you're applying for. Our AI will analyze both documents.
            </p>
          </div>

          <div className="text-center p-4 sm:p-6">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 touch-manipulation">
              <svg className="w-7 h-7 sm:w-8 sm:h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              2. Practice Interview
            </h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Chat with our AI interviewer who asks relevant questions based on the job requirements.
            </p>
          </div>

          <div className="text-center p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 touch-manipulation">
              <svg className="w-7 h-7 sm:w-8 sm:h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              3. Get Feedback
            </h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Receive detailed feedback and scores on your responses to improve your interview skills.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to Ace Your Interview?
          </h2>
          <p className="text-lg sm:text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of job seekers who have improved their interview skills with our AI-powered platform.
          </p>
          {!user && (
            <Link 
              to="/signup" 
              className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 sm:py-4 px-6 sm:px-8 rounded-lg text-base sm:text-lg transition-colors duration-200 min-h-[48px] inline-flex items-center justify-center touch-manipulation"
              aria-label="Sign up to start practicing interviews"
            >
              Get Started Today
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Landing;