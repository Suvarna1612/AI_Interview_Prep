import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';

const FileUpload = ({ onUpload, type, accept = '.pdf', maxSize = 2097152 }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors.some(e => e.code === 'file-too-large')) {
        toast.error('File size must be less than 2MB');
      } else if (rejection.errors.some(e => e.code === 'file-invalid-type')) {
        toast.error('Only PDF files are allowed');
      } else {
        toast.error('File upload failed');
      }
      return;
    }

    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setUploading(true);
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      await onUpload(file, type);
      setProgress(100);
      setTimeout(() => {
        setProgress(0);
        setUploading(false);
      }, 500);
    } catch (error) {
      clearInterval(progressInterval);
      setProgress(0);
      setUploading(false);
    }
  }, [onUpload, type]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxSize,
    multiple: false,
    disabled: uploading
  });

  const getTypeLabel = () => {
    switch (type) {
      case 'resume':
        return 'Resume';
      case 'job_description':
        return 'Job Description';
      default:
        return 'Document';
    }
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
          ${isDragActive 
            ? 'border-primary-400 bg-primary-50' 
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          }
          ${uploading ? 'cursor-not-allowed opacity-50' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-4">
          <div className="mx-auto w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-900">
              {isDragActive ? `Drop your ${getTypeLabel().toLowerCase()} here` : `Upload ${getTypeLabel()}`}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Drag and drop your PDF file here, or click to browse
            </p>
            <p className="text-xs text-gray-400 mt-2">
              PDF files only, max 2MB
            </p>
          </div>
        </div>
      </div>

      {uploading && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Uploading {getTypeLabel().toLowerCase()}...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;