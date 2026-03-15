import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import blogRoutes from "./src/routes/blogRoutes.js";
import bookRoutes from "./src/routes/bookRoutes.js";
import summaryRoutes from "./src/routes/summaryRoutes.js";
import reelRoutes from "./src/routes/reelRoutes.js";
import bookmarkRoutes from "./src/routes/bookmarkRoutes.js";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 5000;

  // Middleware
  app.use(
    cors({
      origin: process.env.VITE_APP_URL || "*",
      credentials: true,
    })
  );

  app.use(express.json());

  // Root route
  app.get("/", (req, res) => {
    res.send("BiblioManzil API is running 🚀");
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      message: "BiblioManzil API is running",
    });
  });

  // MongoDB connection
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI not defined");
  } else {
    try {
      await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
      });

      console.log("✅ Connected to MongoDB Atlas");
    } catch (err) {
      console.error("❌ MongoDB connection error", err);
    }
  }

  // API routes
  app.use("/api/blogs", blogRoutes);
  app.use("/api/blog", blogRoutes);

  app.use("/api/books", bookRoutes);
  app.use("/api/book", bookRoutes);

  app.use("/api/summaries", summaryRoutes);
  app.use("/api/summary", summaryRoutes);

  app.use("/api/reels", reelRoutes);

  app.use("/api/bookmark", bookmarkRoutes);
  app.use("/api/bookmarks", bookmarkRoutes);

  // Start server
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

startServer();
