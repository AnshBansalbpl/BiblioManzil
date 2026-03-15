import { Router } from "express";
import { Summary } from "../models/Schemas.js";

const router = Router();

// GET /api/summaries
router.get("/", async (req, res) => {
  try {
    const summaries = await Summary.find().sort({ createdAt: -1 });
    res.json(summaries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching summaries", error });
  }
});

// GET /api/summary/:slug
// Note: Summary model doesn't have a slug in the current schema, using bookTitle as identifier or adding slug logic
// For now, using bookTitle or ID. Let's assume user might want slug or just ID.
// The request said /api/summary/:slug, so I'll use bookTitle as a simple slug for now or ID.
router.get("/:slug", async (req, res) => {
  try {
    // Assuming slug might be bookTitle or similar. 
    // If slug is not in schema, we might need to find by ID or add slug to schema.
    const summary = await Summary.findOne({ bookTitle: req.params.slug }); 
    if (!summary) return res.status(404).json({ message: "Summary not found" });
    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: "Error fetching summary", error });
  }
});

// POST /api/admin/summary
router.post("/admin", async (req, res) => {
  try {
    const newSummary = new Summary(req.body);
    const savedSummary = await newSummary.save();
    res.status(201).json(savedSummary);
  } catch (error) {
    res.status(400).json({ message: "Error creating summary", error });
  }
});

export default router;
