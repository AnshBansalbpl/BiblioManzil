import { Router } from "express";
import { Summary } from "../models/Schemas.js";

const router = Router();


// GET /api/summaries
// Fetch all summaries
router.get("/", async (req, res) => {
  try {
    const summaries = await Summary.find().sort({ createdAt: -1 });
    res.json(summaries);
  } catch (error) {
    console.error("Error fetching summaries:", error);
    res.status(500).json({ message: "Error fetching summaries", error });
  }
});


// GET /api/summary/:id
// Fetch single summary by MongoDB ID
router.get("/:id", async (req, res) => {
  try {
    const summary = await Summary.findById(req.params.id);

    if (!summary) {
      return res.status(404).json({ message: "Summary not found" });
    }

    res.json(summary);

  } catch (error) {
    console.error("Error fetching summary:", error);
    res.status(500).json({ message: "Error fetching summary", error });
  }
});


// POST /api/summary/admin
// Create a new summary
router.post("/admin", async (req, res) => {
  try {
    const newSummary = new Summary(req.body);
    const savedSummary = await newSummary.save();

    res.status(201).json(savedSummary);

  } catch (error) {
    console.error("Error creating summary:", error);
    res.status(400).json({ message: "Error creating summary", error });
  }
});


export default router;
