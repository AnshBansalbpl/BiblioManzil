import { Router } from "express";
import { Bookmark } from "../models/Schemas.js";

const router = Router();

// POST /api/bookmark
router.post("/", async (req, res) => {
  try {
    const { userId, contentType, contentId } = req.body;
    // Check if already bookmarked
    const existing = await Bookmark.findOne({ userId, contentType, contentId });
    if (existing) return res.status(400).json({ message: "Already bookmarked" });

    const newBookmark = new Bookmark({ userId, contentType, contentId });
    const savedBookmark = await newBookmark.save();
    res.status(201).json(savedBookmark);
  } catch (error) {
    res.status(400).json({ message: "Error creating bookmark", error });
  }
});

// GET /api/bookmarks/:userId
router.get("/:userId", async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(bookmarks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookmarks", error });
  }
});

// DELETE /api/bookmark/:id
router.delete("/:id", async (req, res) => {
  try {
    const deletedBookmark = await Bookmark.findByIdAndDelete(req.params.id);
    if (!deletedBookmark) return res.status(404).json({ message: "Bookmark not found" });
    res.json({ message: "Bookmark removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting bookmark", error });
  }
});

export default router;
