import { Router } from "express";
import { Book } from "../models/Schemas.js";
import upload from "../middleware/upload.js";
import { uploadImage, uploadPdf } from "../lib/cloudinary.js";

const router = Router();

// GET /api/books
router.get("/", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error });
  }
});

// GET /api/book/:id
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: "Error fetching book", error });
  }
});

// POST /api/admin/book
// Expects multipart/form-data with 'coverImage' and 'pdf' files
router.post("/admin", upload.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]), async (req, res) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    if (!files || !files.coverImage || !files.pdf) {
      return res.status(400).json({ message: "Both cover image and PDF are required" });
    }

    // Upload to Cloudinary
    const coverResult: any = await uploadImage(files.coverImage[0].buffer, "bibliomanzil/books/covers");
    const pdfResult: any = await uploadPdf(files.pdf[0].buffer, "bibliomanzil/books/pdfs");

    const bookData = {
      ...req.body,
      coverImage: coverResult.secure_url,
      pdfUrl: pdfResult.secure_url,
    };

    const newBook = new Book(bookData);
    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    console.error("Error creating book:", error);
    res.status(400).json({ message: "Error creating book", error });
  }
});

export default router;
