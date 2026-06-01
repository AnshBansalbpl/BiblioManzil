# 📚 BiblioManzil

BiblioManzil is a full-stack reading and learning platform built for readers who enjoy motivational content, curated knowledge, and accessible learning resources.

The platform enables users to explore blogs, read structured book summaries, download free ebooks, watch motivational reels, and save content for later.

Built with a modern full-stack architecture using React, Express, MongoDB Atlas, Cloudinary, Firebase Authentication, and deployed using Vercel + Render.

---

# 🚀 Current Status

Current Stable Release
**v1.0.0 — Public Launch & SEO Foundation**

Implemented:

* Motivational blogs
* Curated ebook library
* Book summaries
* Search functionality
* Bookmark system
* Admin dashboard
* Sitemap integration
* Structured Data (JSON-LD SEO)

Planned:

* Rich text blog editor
* AI powered recommendations
* Reading progress tracking
* Advanced filtering

---

# 🌐 Live Demo

Frontend
https://biblio-manzil.vercel.app

Backend API
https://bibliomanzil.onrender.com

---

# ✨ Features

### 📚 E-Book Library

Browse and download curated motivational and self-development books.

### 📝 Blogs

Read motivational blogs related to:

* Productivity
* Mindset
* Personal growth
* Learning

### 📖 Book Summaries

Quick and structured summaries of popular books including:

* Key lessons
* Core ideas
* Memorable quotes

### 🎥 Motivation Reels

Watch embedded motivational reels for quick inspiration.

### 🔖 Bookmark System

Users can bookmark:

* Blogs
* Books
* Summaries

Saved items appear inside the personal dashboard.

### 👤 Authentication

Secure user authentication using Firebase:

* Email & Password login
* Google Sign-In

### 🛠 Admin Dashboard

Admins can manage content by:

* Uploading blogs
* Adding ebooks
* Publishing summaries
* Embedding reels

### 🔍 Search & Discoverability

Implemented for better content exploration:

* Unified search experience
* Sitemap integration
* Structured Data (WebSite / Article / Book)
* SEO optimized metadata

---

# 🖼 Screenshots

## Homepage

![Homepage](screenshots/homepage.png)

## Book Library

![Library](screenshots/library.png)

## Book Summary Page

![Summary](screenshots/summary.png)

## User Dashboard

![Dashboard](screenshots/dashboard.png)

## Admin Dashboard

![Admin](screenshots/admin.png)

---

# 🏗 System Architecture

Frontend (React + Vite)

↓

Backend API (Node.js + Express)

↓

Database (MongoDB Atlas)

↓

Storage (Cloudinary)

↓

Authentication (Firebase)

↓

Deployment (Vercel + Render)

---

# 🧰 Tech Stack

## Frontend

* React 19
* Vite
* TypeScript
* React Router
* Tailwind CSS

## Backend

* Node.js
* Express.js
* REST API Architecture

## Database

* MongoDB Atlas
* Mongoose

## Cloud Services

* Firebase Authentication
* Cloudinary (File Storage)

## Deployment

* Vercel (Frontend Hosting)
* Render (Backend Hosting)

---

# 📂 Project Structure

```text
bibliomanzil
│
├── src
│   ├── components
│   ├── pages
│   ├── context
│   ├── routes
│
├── server.ts
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

---

# ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
MONGODB_URI=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

VITE_API_URL=
```

---

# 🚀 Running the Project Locally

### 1️⃣ Clone repository

```bash
git clone https://github.com/AnshBansalbpl/BiblioManzil.git
```

### 2️⃣ Navigate into project

```bash
cd BiblioManzil
```

### 3️⃣ Install dependencies

```bash
npm install
```

### 4️⃣ Start development server

```bash
npm run dev
```

---

# 📦 Releases

Stable project milestones are maintained using GitHub Releases.

Latest Release:

**v1.0.0 — Public Launch & SEO Foundation**

Only the latest version is deployed publicly.

---

# 📌 Roadmap

Upcoming improvements:

* Rich text blog editor
* Personalized recommendations
* Reading progress tracking
* Advanced search and filtering
* Community reading features
* Analytics and engagement insights

---

# 📜 License

This project is open source and available under the MIT License.

---

# 👨‍💻 Author

Built and maintained by **Ansh Bansal**

GitHub
https://github.com/AnshBansalbpl
