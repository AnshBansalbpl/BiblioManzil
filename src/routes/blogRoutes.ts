import { Router } from "express";
import { Blog } from "../models/Schemas.js";
import upload from "../middleware/upload.js";
import { uploadImage } from "../lib/cloudinary.js";

const router = Router();

// GET /api/blogs
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blogs", error });
  }
});

// GET /api/blog/:slug
router.get("/:slug", async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blog", error });
  }
});

// POST /api/admin/blog
// Expects multipart/form-data with 'coverImage' file
router.post("/admin", upload.single('coverImage'), async (req, res) => {
  try {
    let coverImageUrl = req.body.coverImage;

    if (req.file) {
      const result: any = await uploadImage(req.file.buffer, "bibliomanzil/blogs/covers");
      coverImageUrl = result.secure_url;
    }

    const blogData = {
      ...req.body,
      coverImage: coverImageUrl,
    };

    const newBlog = new Blog(blogData);
    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(400).json({ message: "Error creating blog", error });
  }
});

// DELETE /api/admin/blog/:id
router.delete("/admin/:id", async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) return res.status(404).json({ message: "Blog not found" });
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting blog", error });
  }
});

export default router;
