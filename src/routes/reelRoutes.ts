import { Router } from "express";
import { Reel } from "../models/Schemas.js";

const router = Router();

// GET /api/reels
router.get("/", async (req, res) => {
  try {
    const reels = await Reel.find().sort({ createdAt: -1 });
    res.json(reels);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reels", error });
  }
});

// POST /api/admin/reel
router.post("/admin", async (req, res) => {
  try {
    const newReel = new Reel(req.body);
    const savedReel = await newReel.save();
    res.status(201).json(savedReel);
  } catch (error) {
    res.status(400).json({ message: "Error creating reel", error });
  }
});

export default router;
