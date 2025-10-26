# 🚀 Interview Prep App - Setup Guide

## ✅ Installation Complete!

Your application is now installed and ready to configure. Here's what you need to do:

## 🔧 Required Services Setup

### 1. MongoDB Atlas (Database) - FREE TIER
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free account
3. Create a new cluster (free tier is fine)
4. Get your connection string:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password
5. Update `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/interview-prep
   ```

### 2. Google Gemini API (AI Features) - FREE! 🎉
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key" 
4. Copy your free API key (no billing required!)
5. Update `backend/.env`:
   ```
   GEMINI_API_KEY=your-gemini-api-key-here
   ```

**Why Gemini?**
- ✅ Completely FREE (no billing required)
- ✅ High rate limits
- ✅ Excellent performance for chat and embeddings
- ✅ Easy to set up

### 3. Cloudinary (File Storage) - FREE TIER
1. Go to [Cloudinary](https://cloudinary.com)
2. Create a free account
3. Get your credentials from the dashboard
4. Update `backend/.env`:
   ```
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

### 4. JWT Secret (Security)
Generate a secure random string for JWT tokens. Here are several ways:

**Option 1: Using Node.js (Recommended)**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Option 2: Using PowerShell (Windows)**
```powershell
[System.Web.Security.Membership]::GeneratePassword(64, 10)
```

**Option 3: Online Generator**
- Go to https://generate-secret.vercel.app/64
- Copy the generated string

**Option 4: Simple Random String**
```
JWT_SECRET=myapp_super_secret_key_2024_interview_prep_app_secure_token_12345
```

Then update your `backend/.env`:
```
JWT_SECRET=your-generated-secret-here
```

**Example:**
```
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

## 🏃‍♂️ Running the Application

### Option 1: Run Both Services Together
```bash
npm run dev
```

### Option 2: Run Separately
**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm start
```

## 🌐 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🧪 Testing the Application

1. **Sign Up**: Create a new account
2. **Upload Documents**: 
   - Upload a resume PDF
   - Upload a job description PDF
3. **Start Interview**: Click "Start Interview" 
4. **Chat**: Answer AI-generated questions and receive feedback

## 🚀 Deployment Ready

The application is production-ready and can be deployed to:
- **Frontend**: Vercel, Netlify
- **Backend**: Render, Railway, Heroku

