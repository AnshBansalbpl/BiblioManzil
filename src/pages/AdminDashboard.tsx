import React, { useState } from "react";
import { motion } from "motion/react";
import { Upload, Book, FileText, Video, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, endpoint: string, sectionId: string) => {
    e.preventDefault();
    setLoading(sectionId);
    setMessage(null);

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      setMessage({ type: "success", text: `${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)} uploaded successfully!` });
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(null);
    }
  };

  const handleJsonSubmit = async (e: React.FormEvent<HTMLFormElement>, endpoint: string, sectionId: string) => {
    e.preventDefault();
    setLoading(sectionId);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const data: any = {};
    formData.forEach((value, key) => {
      if (key === "keyLessons" || key === "quotes") {
        data[key] = (value as string).split(",").map(s => s.trim()).filter(s => s !== "");
      } else {
        data[key] = value;
      }
    });

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      setMessage({ type: "success", text: `${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)} added successfully!` });
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-serif font-bold text-stone-900 mb-2">Admin Dashboard</h1>
          <p className="text-stone-600 italic">Manage BiblioManzil Content</p>
        </header>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-8 p-4 rounded-xl flex items-center gap-3 ${
              message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"
            }`}
          >
            {message.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <p className="font-medium">{message.text}</p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Upload Blog Section */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-6 h-6 text-stone-700" />
              <h2 className="text-2xl font-serif font-semibold text-stone-900">Upload Blog</h2>
            </div>
            <form onSubmit={(e) => handleSubmit(e, "/api/admin/blog", "blog")} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Title</label>
                <input name="title" required className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-stone-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Slug</label>
                <input name="slug" required className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-stone-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Tags (comma separated)</label>
                <input name="tags" className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-stone-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Content</label>
                <textarea name="content" required rows={4} className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-stone-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Cover Image</label>
                <input type="file" name="coverImage" accept="image/*" required className="w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-stone-100 file:text-stone-700 hover:file:bg-stone-200" />
              </div>
              <button disabled={loading === "blog"} className="w-full bg-stone-900 text-white py-3 rounded-xl font-medium hover:bg-stone-800 transition-colors flex items-center justify-center gap-2">
                {loading === "blog" ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                Upload Blog
              </button>
            </form>
          </section>

          {/* Upload Book Section */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200">
            <div className="flex items-center gap-3 mb-6">
              <Book className="w-6 h-6 text-stone-700" />
              <h2 className="text-2xl font-serif font-semibold text-stone-900">Upload Book</h2>
            </div>
            <form onSubmit={(e) => handleSubmit(e, "/api/admin/book", "book")} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Title</label>
                <input name="title" required className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-stone-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Author</label>
                <input name="author" required className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-stone-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
                <textarea name="description" required rows={3} className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-stone-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Category</label>
                <input name="category" required className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-stone-500 outline-none transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Cover Image</label>
                  <input type="file" name="coverImage" accept="image/*" required className="w-full text-xs text-stone-500 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:bg-stone-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">PDF File</label>
                  <input type="file" name="pdf" accept=".pdf" required className="w-full text-xs text-stone-500 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:bg-stone-100" />
                </div>
              </div>
              <button disabled={loading === "book"} className="w-full bg-stone-900 text-white py-3 rounded-xl font-medium hover:bg-stone-800 transition-colors flex items-center justify-center gap-2">
                {loading === "book" ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                Upload Book
              </button>
            </form>
          </section>

          {/* Upload Summary Section */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-6 h-6 text-stone-700" />
              <h2 className="text-2xl font-serif font-semibold text-stone-900">Upload Summary</h2>
            </div>
            <form onSubmit={(e) => handleJsonSubmit(e, "/api/admin/summary", "summary")} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Book Title</label>
                <input name="bookTitle" required className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-stone-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Author</label>
                <input name="author" required className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-stone-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Cover Image URL</label>
                <input name="coverImage" required className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-stone-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Summary</label>
                <textarea name="summary" required rows={3} className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-stone-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Key Lessons (comma separated)</label>
                <input name="keyLessons" className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-stone-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Quotes (comma separated)</label>
                <input name="quotes" className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-stone-500 outline-none transition-all" />
              </div>
              <button disabled={loading === "summary"} className="w-full bg-stone-900 text-white py-3 rounded-xl font-medium hover:bg-stone-800 transition-colors flex items-center justify-center gap-2">
                {loading === "summary" ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                Upload Summary
              </button>
            </form>
          </section>

          {/* Add Reel Section */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200">
          <div className="flex items-center gap-3 mb-6">
            <Video className="w-6 h-6 text-stone-700" />
            <h2 className="text-2xl font-serif font-semibold text-stone-900">Add Reel</h2>
          </div>
          
          <form onSubmit={(e) => handleJsonSubmit(e, "/api/reels/admin", "reel")} className="space-y-4">
          
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Title
              </label>
              <input
                name="title"
                required
                className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-stone-500 outline-none"
              />
            </div>
          
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Instagram Reel URL
              </label>
              <input
                name="instagramUrl"
                required
                placeholder="https://www.instagram.com/reel/..."
                className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-stone-500 outline-none"
              />
            </div>
          
            <button
              disabled={loading === "reel"}
              className="w-full bg-stone-900 text-white py-3 rounded-xl font-medium hover:bg-stone-800 transition-colors flex items-center justify-center gap-2"
            >
              {loading === "reel"
                ? <Loader2 className="w-5 h-5 animate-spin" />
                : <Video className="w-5 h-5" />}
              Add Reel
            </button>
          
          </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
