import { Router } from "express";
import { Bookmark } from "../models/Schemas.js";

const router = Router();


// POST /api/bookmark
// Create bookmark (or return existing)
router.post("/", async (req, res) => {

  try {

    const { userId, contentType, contentId } = req.body;

    // Check if already bookmarked
    const existing = await Bookmark.findOne({
      userId,
      contentType,
      contentId
    });

    // If exists, return it instead of throwing error
    if (existing) {
      return res.status(200).json(existing);
    }

    const newBookmark = new Bookmark({
      userId,
      contentType,
      contentId
    });

    const savedBookmark = await newBookmark.save();

    res.status(201).json(savedBookmark);

  } catch (error) {

    console.error("Error creating bookmark:", error);

    res.status(400).json({
      message: "Error creating bookmark"
    });

  }

});


// GET /api/bookmarks/:userId
// Fetch all bookmarks for a user
router.get("/:userId", async (req, res) => {

  try {

    const bookmarks = await Bookmark.find({
      userId: req.params.userId
    }).sort({ createdAt: -1 });

    res.json(bookmarks);

  } catch (error) {

    console.error("Error fetching bookmarks:", error);

    res.status(500).json({
      message: "Error fetching bookmarks"
    });

  }

});


// DELETE /api/bookmark
// Remove bookmark (used for toggle)
router.delete("/", async (req, res) => {

  try {

    const { userId, contentType, contentId } = req.body;

    const deleted = await Bookmark.findOneAndDelete({
      userId,
      contentType,
      contentId
    });

    if (!deleted) {
      return res.status(404).json({
        message: "Bookmark not found"
      });
    }

    res.json({
      message: "Bookmark removed successfully"
    });

  } catch (error) {

    console.error("Error deleting bookmark:", error);

    res.status(500).json({
      message: "Error deleting bookmark"
    });

  }

});


export default router;
