# 🚀 Quick Deployment Checklist

## Pre-Deployment
- [ ] All features working locally
- [ ] Environment variables documented
- [ ] Git repository up to date
- [ ] Remove sensitive data from code

## Backend Deployment (Render)
1. [ ] Go to [render.com](https://render.com)
2. [ ] Connect GitHub repository
3. [ ] Create Web Service
4. [ ] Configure:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. [ ] Add all environment variables
6. [ ] Deploy and test health endpoint

## Frontend Deployment (Vercel)
1. [ ] Go to [vercel.com](https://vercel.com)
2. [ ] Import GitHub repository
3. [ ] Configure:
   - Framework: Vite
   - Root Directory: `frontend-new`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. [ ] Add environment variable: `VITE_API_URL`
5. [ ] Deploy and test

## Post-Deployment
- [ ] Update backend CORS with frontend URL
- [ ] Test full user flow
- [ ] Verify all API endpoints work
- [ ] Check error handling
- [ ] Test on mobile devices

## Demo Preparation
- [ ] Create demo account
- [ ] Prepare sample resume PDF
- [ ] Prepare sample job description PDF
- [ ] Practice demo flow
- [ ] Record 3-5 minute video

## URLs to Share
- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-backend.onrender.com
- **GitHub**: https://github.com/yourusername/interview-prep-app
- **Demo Video**: [Your video link]

## 🎯 Success Criteria
- [ ] App loads without errors
- [ ] User can sign up/login
- [ ] Document upload works
- [ ] AI generates questions
- [ ] Feedback system functional
- [ ] Mobile responsive
- [ ] Fast loading times