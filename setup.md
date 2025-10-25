# Setup Instructions

## Quick Start

### 1. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Environment Setup

**Backend (.env):**
```bash
cd backend
cp .env.example .env
```

Fill in your environment variables:
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: A secure random string for JWT tokens
- `OPENAI_API_KEY`: Your OpenAI API key
- `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Your Cloudinary API key
- `CLOUDINARY_API_SECRET`: Your Cloudinary API secret

**Frontend (.env):**
```bash
cd frontend
cp .env.example .env
```

### 3. Run the Application

**Start Backend (Terminal 1):**
```bash
cd backend
npm run dev
```

**Start Frontend (Terminal 2):**
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Required Services

### MongoDB Atlas
1. Create account at https://cloud.mongodb.com
2. Create a new cluster
3. Get connection string and add to `.env`

### OpenAI API
1. Create account at https://platform.openai.com
2. Generate API key
3. Add to `.env`

### Cloudinary
1. Create account at https://cloudinary.com
2. Get cloud name, API key, and API secret from dashboard
3. Add to `.env`

## Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy

### Backend (Render)
1. Push code to GitHub
2. Create new Web Service on Render
3. Connect repository
4. Set environment variables
5. Deploy

## Testing the Application

1. Sign up for a new account
2. Upload a resume PDF
3. Upload a job description PDF
4. Start the interview chat
5. Answer questions and receive feedback