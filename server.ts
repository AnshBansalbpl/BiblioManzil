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
  const PORT = process.env.PORT || 5000;

  // Middleware
  app.use(
    cors({
      origin: process.env.VITE_APP_URL || "*",
      credentials: true,
    })
  );

  app.use(express.json());

  // Root route (important for Render)
  app.get("/", (req, res) => {
    res.send("BiblioManzil API is running 🚀");
  });

  // Health check route
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      message: "BiblioManzil API is running",
    });
  });

  // MongoDB Connection
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.error("❌ ERROR: MONGODB_URI not found in environment variables.");
  } else {
    try {
      await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log("✅ Connected to MongoDB Atlas");
    } catch (err) {
      console.error("❌ MongoDB connection failed");
      console.error(err);
    }
  }

  // API Routes
  app.use("/api/blogs", blogRoutes);
  app.use("/api/blog", blogRoutes);

  app.use("/api/books", bookRoutes);
  app.use("/api/book", bookRoutes);

  app.use("/api/summaries", summaryRoutes);
  app.use("/api/summary", summaryRoutes);

  app.use("/api/reels", reelRoutes);

  app.use("/api/bookmark", bookmarkRoutes);
  app.use("/api/bookmarks", bookmarkRoutes);

  // Development mode with Vite
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });

    app.use(vite.middlewares);
  } else {
    // Production build
    const distPath = path.join(process.cwd(), "dist");

    app.use(express.static(distPath));

    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Start server
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

startServer();
