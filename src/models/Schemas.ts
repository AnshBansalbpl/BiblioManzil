import mongoose, { Schema, Document, Model } from "mongoose";

// --- TypeScript Interfaces ---

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
  instagramEmbedUrl: string;
  createdAt: Date;
}

export interface IBookmark extends Document {
  userId: string; // Firebase UID or MongoDB ObjectId
  contentType: "blog" | "summary" | "book";
  contentId: mongoose.Types.ObjectId;
  createdAt: Date;
}

// --- Mongoose Schemas ---

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

const SummarySchema = new Schema<ISummary>({
  bookTitle: { type: String, required: true },
  author: { type: String, required: true },
  coverImage: { type: String, required: true },
  summary: { type: String, required: true },
  keyLessons: [{ type: String }],
  quotes: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

const ReelSchema = new Schema<IReel>({
  title: { type: String, required: true },
  instagramEmbedUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const BookmarkSchema = new Schema<IBookmark>({
  userId: { type: String, required: true }, // Using Firebase UID for easier lookup
  contentType: { type: String, enum: ["blog", "summary", "book"], required: true },
  contentId: { type: Schema.Types.ObjectId, required: true },
  createdAt: { type: Date, default: Date.now },
});

// --- Model Exports ---

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export const Blog: Model<IBlog> = mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);
export const Book: Model<IBook> = mongoose.models.Book || mongoose.model<IBook>("Book", BookSchema);
export const Summary: Model<ISummary> = mongoose.models.Summary || mongoose.model<ISummary>("Summary", SummarySchema);
export const Reel: Model<IReel> = mongoose.models.Reel || mongoose.model<IReel>("Reel", ReelSchema);
export const Bookmark: Model<IBookmark> = mongoose.models.Bookmark || mongoose.model<IBookmark>("Bookmark", BookmarkSchema);

/**
 * --- Example Documents ---
 * 
 * User:
 * {
 *   firebaseUID: "abc123user",
 *   name: "John Doe",
 *   email: "john@example.com",
 *   profileImage: "https://example.com/profile.jpg"
 * }
 * 
 * Blog:
 * {
 *   title: "The Power of Habit",
 *   slug: "the-power-of-habit",
 *   content: "Full blog content here...",
 *   coverImage: "https://example.com/blog-cover.jpg",
 *   tags: ["motivation", "habits"]
 * }
 * 
 * Book:
 * {
 *   title: "Atomic Habits",
 *   author: "James Clear",
 *   description: "An easy and proven way to build good habits...",
 *   category: "Self-Help",
 *   coverImage: "https://example.com/book-cover.jpg",
 *   pdfUrl: "https://example.com/atomic-habits.pdf",
 *   downloads: 150
 * }
 * 
 * Summary:
 * {
 *   bookTitle: "Deep Work",
 *   author: "Cal Newport",
 *   coverImage: "https://example.com/deep-work.jpg",
 *   summary: "Rules for focused success in a distracted world...",
 *   keyLessons: ["Work deeply", "Embrace boredom", "Quit social media"],
 *   quotes: ["Focus is the new IQ."]
 * }
 * 
 * Reel:
 * {
 *   title: "Morning Routine for Success",
 *   instagramEmbedUrl: "https://www.instagram.com/reels/C_example/"
 * }
 * 
 * Bookmark:
 * {
 *   userId: "abc123user",
 *   contentType: "book",
 *   contentId: "65f1234567890abcdef12345"
 * }
 */
