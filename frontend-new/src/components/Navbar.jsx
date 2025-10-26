import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center touch-manipulation">
                <span className="text-white font-bold text-lg">AI</span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-gray-900">Interview Prep</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/upload"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors touch-manipulation ${
                    isActive('/upload')
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Upload Documents
                </Link>
                <Link
                  to="/chat"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors touch-manipulation ${
                    isActive('/chat')
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Interview Chat
                </Link>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600 hidden lg:inline">
                    Welcome, {user.name}
                  </span>
                  <button
                    onClick={logout}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors px-3 py-2 rounded-md touch-manipulation"
                    aria-label="Logout"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors touch-manipulation"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="btn-primary text-sm touch-manipulation"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-600 hover:text-gray-900 p-2 rounded-md touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-3">
            <div className="space-y-1">
              {user ? (
                <>
                  <div className="px-3 py-2 text-sm text-gray-600 border-b border-gray-100 mb-2">
                    Welcome, {user.name}
                  </div>
                  <Link
                    to="/upload"
                    onClick={closeMobileMenu}
                    className={`block px-3 py-3 rounded-md text-base font-medium transition-colors touch-manipulation ${
                      isActive('/upload')
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    Upload Documents
                  </Link>
                  <Link
                    to="/chat"
                    onClick={closeMobileMenu}
                    className={`block px-3 py-3 rounded-md text-base font-medium transition-colors touch-manipulation ${
                      isActive('/chat')
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    Interview Chat
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      closeMobileMenu();
                    }}
                    className="block w-full text-left px-3 py-3 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors touch-manipulation"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="block px-3 py-3 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors touch-manipulation"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={closeMobileMenu}
                    className="block mx-3 my-2 btn-primary text-center text-base touch-manipulation"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;