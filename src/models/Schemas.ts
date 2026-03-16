import mongoose, { Schema, Document, Model } from "mongoose";

/* =========================
   TypeScript Interfaces
========================= */

export interface IUser extends Document {
  firebaseUID: string;
  name: string;
  email: string;
  profileImage?: string;
  createdAt: Date;
}

export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string;
  coverImage: string;
  tags: string[];
  createdAt: Date;
}

export interface IBook extends Document {
  title: string;
  author: string;
  description: string;
  category: string;
  coverImage: string;
  pdfUrl: string;
  downloads: number;
  createdAt: Date;
}

export interface ISummary extends Document {
  bookTitle: string;
  author: string;
  coverImage: string;
  summary: string;
  keyLessons: string[];
  quotes: string[];
  createdAt: Date;
}

export interface IReel extends Document {
  title: string;
  instagramUrl: string;
  createdAt: Date;
}

export interface IBookmark extends Document {
  userId: string;
  contentType: "blog" | "summary" | "book";
  contentId: string;
  createdAt: Date;
}

/* =========================
   Schemas
========================= */

const UserSchema = new Schema<IUser>({
  firebaseUID: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profileImage: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const BlogSchema = new Schema<IBlog>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  coverImage: { type: String, required: true },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

/* ===== SEARCH INDEX ===== */
BlogSchema.index({
  title: "text",
  content: "text",
  tags: "text",
});

const BookSchema = new Schema<IBook>({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  coverImage: { type: String, required: true },
  pdfUrl: { type: String, required: true },
  downloads: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

/* ===== SEARCH INDEX ===== */
BookSchema.index({
  title: "text",
  author: "text",
  description: "text",
});

const SummarySchema = new Schema<ISummary>({
  bookTitle: { type: String, required: true },
  author: { type: String, required: true },
  coverImage: { type: String, required: true },
  summary: { type: String, required: true },
  keyLessons: [{ type: String }],
  quotes: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

/* ===== SEARCH INDEX ===== */
SummarySchema.index({
  bookTitle: "text",
  author: "text",
  summary: "text",
  keyLessons: "text",
});

const ReelSchema = new Schema<IReel>({
  title: { type: String, required: true },
  instagramUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

/* =========================
   FIXED BOOKMARK SCHEMA
========================= */

const BookmarkSchema = new Schema<IBookmark>({
  userId: { type: String, required: true },

  contentType: {
    type: String,
    enum: ["blog", "summary", "book"],
    required: true,
  },

  contentId: { type: String, required: true },

  createdAt: { type: Date, default: Date.now },
});

/* =========================
   Model Exports
========================= */

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export const Blog: Model<IBlog> =
  mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);

export const Book: Model<IBook> =
  mongoose.models.Book || mongoose.model<IBook>("Book", BookSchema);

export const Summary: Model<ISummary> =
  mongoose.models.Summary || mongoose.model<ISummary>("Summary", SummarySchema);

export const Reel: Model<IReel> =
  mongoose.models.Reel || mongoose.model<IReel>("Reel", ReelSchema);

export const Bookmark: Model<IBookmark> =
  mongoose.models.Bookmark ||
  mongoose.model<IBookmark>("Bookmark", BookmarkSchema);