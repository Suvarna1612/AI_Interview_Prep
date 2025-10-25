# 📁 Project Folder Structure

## Current Structure
```
interview-prep-app/
├── backend/           # ✅ Node.js API server (WORKING)
├── frontend-new/      # ✅ React + Vite frontend (WORKING)
├── frontend/          # ❌ Old Create React App (DEPRECATED - DO NOT USE)
├── README.md
├── DEPLOYMENT_GUIDE.md
└── package.json
```

## ⚠️ Important Note

**Use `frontend-new/` for all development and deployment!**

- **`frontend-new/`** - This is the working Vite-based React app
- **`frontend/`** - This is the old broken Create React App version (ignore this)

## For Development

**Start Backend:**
```bash
cd backend
npm run dev
```

**Start Frontend:**
```bash
cd frontend-new
npm run dev
```

## For Deployment

**Backend Root Directory:** `backend`
**Frontend Root Directory:** `frontend-new`

## Why Two Folders?

During development, we encountered issues with Create React App dependencies, so we created a new Vite-based frontend (`frontend-new/`) which works perfectly. The old folder (`frontend/`) can be ignored.

## Cleanup (Optional)

If you want to clean up the old folder later:
1. Stop all development servers
2. Close VS Code/IDE
3. Delete the `frontend/` folder
4. Rename `frontend-new/` to `frontend/`

But for now, just use `frontend-new/` - it works perfectly! 🚀