import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import blogRoutes from "./src/routes/blogRoutes.js";
import bookRoutes from "./src/routes/bookRoutes.js";
import summaryRoutes from "./src/routes/summaryRoutes.js";
import reelRoutes from "./src/routes/reelRoutes.js";
import bookmarkRoutes from "./src/routes/bookmarkRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  // Use 5000 for deployment, but 3000 is required for AI Studio preview
  const PORT = process.env.PORT || 5000;

  // Middleware
  app.use(cors({
    origin: process.env.VITE_APP_URL || "*",
    credentials: true
  }));
  app.use(express.json());

  // MongoDB Connection
  const MONGODB_URI = process.env.MONGODB_URI;
  
  if (!MONGODB_URI) {
    console.error("❌ ERROR: MONGODB_URI is not defined in environment variables.");
    console.log("Please add MONGODB_URI to your Secrets in AI Studio.");
  } else {
    mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    })
      .then(() => console.log("✅ Connected to MongoDB Atlas"))
      .catch((err) => {
        console.error("❌ MongoDB connection error:");
        if (err.name === 'MongooseServerSelectionError') {
          console.error("👉 This is likely an IP Whitelisting issue. Ensure '0.0.0.0/0' is added to your Atlas Network Access.");
        }
        console.error(err.message);
      });
  }

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "BiblioManzil API is running" });
  });

  // Entity Routes
  app.use("/api/blogs", blogRoutes);
  app.use("/api/blog", blogRoutes); // Support both plural and singular if needed for slug
  app.use("/api/books", bookRoutes);
  app.use("/api/book", bookRoutes);
  app.use("/api/summaries", summaryRoutes);
  app.use("/api/summary", summaryRoutes);
  app.use("/api/reels", reelRoutes);
  app.use("/api/bookmark", bookmarkRoutes);
  app.use("/api/bookmarks", bookmarkRoutes);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
