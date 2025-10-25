# 🚀 Deployment Guide - AI Interview Prep App

## 📋 Overview

We'll deploy:
- **Frontend**: Vercel (React + Vite)
- **Backend**: Render (Node.js + Express)
- **Database**: MongoDB Atlas (already set up)
- **File Storage**: Cloudinary (already set up)

## 🎯 Deployment Steps

### 1. Prepare for Deployment

#### Update Backend for Production
First, let's update the CORS settings for production:

```javascript
// In backend/server.js, update CORS:
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-app-name.vercel.app'] // Replace with your actual domain
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
```

#### Create Production Environment Files

**Backend Production Environment:**
Create `backend/.env.production`:
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://suvarnat1612_db_user:5fgk50lA7mjKwWwe@interviewprep.xblulae.mongodb.net/interview-prep?retryWrites=true&w=majority&appName=InterviewPrep
JWT_SECRET=10b7ea10a1aedc741883e5c1c58d813717a999feda9a5beffdcac6f5a48a37172c2851cf28a488689f786de4ddcae793eb380b3f7d87ddd4975dafb03b142b2b
GEMINI_API_KEY=AIzaSyAUdMk5lwZx6jC91oSjdHUzsUwZVS9iI04
CLOUDINARY_CLOUD_NAME=dsbhw8go9
CLOUDINARY_API_KEY=388224742822335
CLOUDINARY_API_SECRET=O70e2Qwmb8OaChlI3RZ-698IRhA
```

### 2. Deploy Backend to Render

#### Step 1: Prepare Backend
1. **Create `backend/package.json` start script** (already done):
   ```json
   {
     "scripts": {
       "start": "node server.js",
       "dev": "nodemon server.js"
     }
   }
   ```

#### Step 2: Deploy to Render
1. **Go to**: [render.com](https://render.com)
2. **Sign up/Login** with GitHub
3. **Connect Repository**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

4. **Configure Service**:
   - **Name**: `interview-prep-backend`
   - **Environment**: `Node`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

5. **Add Environment Variables**:
   Click "Environment" and add:
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://suvarnat1612_db_user:5fgk50lA7mjKwWwe@interviewprep.xblulae.mongodb.net/interview-prep?retryWrites=true&w=majority&appName=InterviewPrep
   JWT_SECRET=10b7ea10a1aedc741883e5c1c58d813717a999feda9a5beffdcac6f5a48a37172c2851cf28a488689f786de4ddcae793eb380b3f7d87ddd4975dafb03b142b2b
   GEMINI_API_KEY=AIzaSyAUdMk5lwZx6jC91oSjdHUzsUwZVS9iI04
   CLOUDINARY_CLOUD_NAME=dsbhw8go9
   CLOUDINARY_API_KEY=388224742822335
   CLOUDINARY_API_SECRET=O70e2Qwmb8OaChlI3RZ-698IRhA
   ```

6. **Deploy**: Click "Create Web Service"

#### Step 3: Get Backend URL
After deployment, you'll get a URL like: `https://interview-prep-backend.onrender.com`

### 3. Deploy Frontend to Vercel

#### Step 1: Update Frontend Environment
Update `frontend-new/.env.production`:
```env
VITE_API_URL=https://interview-prep-backend.onrender.com/api
```

#### Step 2: Deploy to Vercel
1. **Go to**: [vercel.com](https://vercel.com)
2. **Sign up/Login** with GitHub
3. **Import Project**:
   - Click "New Project"
   - Import your GitHub repository
   - Select the repository

4. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend-new` (this is the working frontend)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. **Add Environment Variables**:
   - Go to Project Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://interview-prep-backend.onrender.com/api`

6. **Deploy**: Click "Deploy"

#### Step 3: Update CORS
After getting your Vercel URL (e.g., `https://interview-prep-app.vercel.app`), update backend CORS:

In Render dashboard → Your service → Environment:
Update or add:
```
FRONTEND_URL=https://interview-prep-app.vercel.app
```

Then update `backend/server.js`:
```javascript
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL] 
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
```

### 4. Test Deployment

1. **Backend Health Check**:
   Visit: `https://interview-prep-backend.onrender.com/api/health`
   Should return: `{"status":"OK","timestamp":"..."}`

2. **Frontend Access**:
   Visit: `https://interview-prep-app.vercel.app`
   Should load the landing page

3. **Full Flow Test**:
   - Sign up for new account
   - Upload documents
   - Start interview chat
   - Verify everything works

### 5. Custom Domain (Optional)

#### For Vercel (Frontend):
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

#### For Render (Backend):
1. Go to Service Settings → Custom Domains
2. Add your custom domain
3. Update CORS settings accordingly

### 6. Monitoring & Maintenance

#### Render (Backend):
- **Logs**: Available in Render dashboard
- **Metrics**: CPU, Memory usage tracking
- **Auto-deploy**: Enabled on git push

#### Vercel (Frontend):
- **Analytics**: Built-in performance monitoring
- **Logs**: Function logs available
- **Auto-deploy**: Enabled on git push

### 7. Environment Variables Summary

#### Backend (Render):
```env
NODE_ENV=production
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
FRONTEND_URL=https://your-app.vercel.app
```

#### Frontend (Vercel):
```env
VITE_API_URL=https://your-backend.onrender.com/api
```

### 8. Troubleshooting

#### Common Issues:

1. **CORS Errors**:
   - Ensure FRONTEND_URL is set correctly in backend
   - Check CORS configuration in server.js

2. **API Connection Issues**:
   - Verify VITE_API_URL in frontend environment
   - Check backend health endpoint

3. **Build Failures**:
   - Check build logs in deployment dashboard
   - Ensure all dependencies are in package.json

4. **Environment Variables**:
   - Verify all required env vars are set
   - Check for typos in variable names

### 9. Cost Breakdown

#### Free Tier Limits:
- **Render**: 750 hours/month (enough for demo)
- **Vercel**: Unlimited for personal projects
- **MongoDB Atlas**: 512MB storage (free tier)
- **Cloudinary**: 25 credits/month (free tier)
- **Google Gemini**: Free tier with rate limits

#### Estimated Monthly Cost: $0 (Free tier)

### 10. Post-Deployment Checklist

- [ ] Backend health check passes
- [ ] Frontend loads correctly
- [ ] User registration works
- [ ] Document upload functions
- [ ] AI chat generates questions
- [ ] Feedback system works
- [ ] All environment variables set
- [ ] CORS configured properly
- [ ] Custom domains configured (if applicable)

## 🎉 Your App is Live!

Once deployed, you'll have:
- **Live Demo**: Share your Vercel URL
- **Professional Portfolio**: Showcase your full-stack skills
- **Scalable Architecture**: Ready for real users
- **Modern Tech Stack**: React, Node.js, AI integration

## 📝 Demo Script

For your video demo:
1. Show landing page
2. Sign up process
3. Document upload (resume + job description)
4. AI interview simulation
5. Feedback and scoring system
6. Multiple question types

**Congratulations on building and deploying a production-ready AI application!** 🚀