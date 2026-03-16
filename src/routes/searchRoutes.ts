import express from "express";
import { Blog, Book, Summary } from "../models/Schemas.js";

const router = express.Router();

/*
GET /api/search?q=keyword
Search across blogs, books, and summaries
*/

router.get("/", async (req, res) => {
  try {
    const q = req.query.q as string;

    if (!q) {
      return res.status(400).json({
        message: "Search query is required",
      });
    }

    const blogs = await Blog.find(
      { $text: { $search: q } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(5);

    const books = await Book.find(
      { $text: { $search: q } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(5);

    const summaries = await Summary.find(
      { $text: { $search: q } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(5);

    res.json({
      blogs,
      books,
      summaries,
    });
  } catch (error) {
    console.error("Search error:", error);

    res.status(500).json({
      message: "Search failed",
    });
  }
});

export default router;