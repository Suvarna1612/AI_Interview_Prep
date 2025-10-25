# AI-Powered Interview Prep App

A full-stack application that simulates job interviews using AI. Users can upload their resume and job descriptions, then chat with an AI interviewer that generates relevant questions and provides feedback.

## Features

- 🔐 User authentication (signup/login)
- 📄 PDF document upload (resume + job descriptions)
- 🤖 AI-powered interview simulation
- 💬 Real-time chat interface
- 📊 Response evaluation and scoring
- 🔍 RAG-based document retrieval

## Tech Stack

### Frontend
- React 18
- Tailwind CSS
- Axios
- React Router
- React Hot Toast

### Backend
- Node.js
- Express.js
- MongoDB (Atlas)
- JWT Authentication
- Google Gemini API (FREE!)
- Cloudinary (file storage)
- bcrypt (password hashing)

## Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Google Gemini API key (FREE!)
- Cloudinary account

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Fill in your environment variables
npm run dev
```

### Frontend Setup
```bash
cd frontend-new
npm install
npm run dev
```

**Note:** Use `frontend-new/` folder - this is the working Vite-based frontend. The `frontend/` folder is deprecated.

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

**Note:** The working frontend is in `frontend-new/` folder and uses Vite (not Create React App).

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Documents
- `POST /api/documents/upload` - Upload PDF documents
- `GET /api/documents/list` - List user documents
- `DELETE /api/documents/:id` - Delete document

### Chat
- `POST /api/chat/start` - Initialize interview session
- `POST /api/chat/query` - Send message and get AI response

## Deployment

### Frontend (Vercel)
```bash
cd frontend-new
npm run build
# Deploy to Vercel
```

**Note:** Use `frontend-new/` folder for deployment.

### Backend (Render)
- Connect GitHub repository
- Set environment variables
- Deploy

## Demo Video
[Link to demo video showing signup → upload → chat flow]

## Live Demo
- Frontend: [Deployed frontend URL]
- Backend: [Deployed backend URL]