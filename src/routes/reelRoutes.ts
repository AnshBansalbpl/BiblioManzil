import { Router } from "express";
import { Reel } from "../models/Schemas.js";

const router = Router();

/* GET reels */
router.get("/", async (req, res) => {
  try {
    const reels = await Reel.find().sort({ createdAt: -1 });
    res.json(reels);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reels", error });
  }
});

/* CREATE reel */
router.post("/admin", async (req, res) => {
  try {

    const { title, instagramUrl } = req.body;

    if (!title || !instagramUrl) {
      return res.status(400).json({
        message: "Title and Instagram URL are required"
      });
    }

    const newReel = new Reel({
      title,
      instagramUrl
    });

    const savedReel = await newReel.save();

    res.status(201).json(savedReel);

  } catch (error) {
    console.error("Reel creation error:", error);
    res.status(500).json({
      message: "Error creating reel",
      error: error.message
    });
  }
});

export default router;
