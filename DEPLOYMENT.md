# BiblioManzil Deployment Guide

This project is a full-stack application with an Express backend and a React (Vite) frontend.

## 1. Environment Variables
Ensure you have the following variables set in your deployment platforms:

### Backend (Render / Heroku)
- `MONGODB_URI`: Your MongoDB Atlas connection string.
- `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name.
- `CLOUDINARY_API_KEY`: Your Cloudinary API key.
- `CLOUDINARY_API_SECRET`: Your Cloudinary API secret.
- `VITE_APP_URL`: The URL of your frontend (e.g., `https://bibliomanzil.vercel.app`).
- `PORT`: Set to `5000` (or leave blank for Render's default).

### Frontend (Vercel / Netlify)
- `VITE_FIREBASE_API_KEY`: Your Firebase API Key.
- `VITE_FIREBASE_AUTH_DOMAIN`: Your Firebase Auth Domain.
- `VITE_FIREBASE_PROJECT_ID`: Your Firebase Project ID.
- `VITE_APP_URL`: The URL of your frontend.
- `VITE_API_URL`: The URL of your backend (e.g., `https://bibliomanzil-api.onrender.com`).

---

## 2. Frontend Deployment (Vercel)
1. Connect your GitHub repository to Vercel.
2. Set the **Framework Preset** to `Vite`.
3. Set the **Build Command** to `npm run build`.
4. Set the **Output Directory** to `dist`.
5. Add the `VITE_` environment variables listed above.
6. Deploy!

---

## 3. Backend Deployment (Render)
1. Create a new **Web Service** on Render.
2. Connect your GitHub repository.
3. Set the **Environment** to `Node`.
4. Set the **Build Command** to `npm install`.
5. Set the **Start Command** to `node server.ts`.
6. Add the backend environment variables listed above.
7. Deploy!

---

## 4. Important Notes
- **CORS**: The backend is configured to allow requests from `VITE_APP_URL`. Ensure this matches your Vercel URL exactly.
- **API Prefix**: All backend routes are prefixed with `/api`. Ensure your frontend calls use this prefix.
- **MongoDB IP Whitelist**: In MongoDB Atlas, ensure you have whitelisted the IP addresses of your Render service (or use `0.0.0.0/0` for testing).
