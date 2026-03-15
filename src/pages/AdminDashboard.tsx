import React, { useState } from "react";
import { motion } from "motion/react";
import { Upload, Book, FileText, Video, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "https://bibliomanzil.onrender.com";

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    endpoint: string,
    sectionId: string
  ) => {
    e.preventDefault();
    setLoading(sectionId);
    setMessage(null);

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      setMessage({
        type: "success",
        text: `${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)} uploaded successfully!`,
      });

      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(null);
    }
  };

  const handleJsonSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    endpoint: string,
    sectionId: string
  ) => {
    e.preventDefault();
    setLoading(sectionId);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const data: any = {};

    formData.forEach((value, key) => {
      if (key === "keyLessons" || key === "quotes") {
        data[key] = (value as string)
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s !== "");
      } else {
        data[key] = value;
      }
    });

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      setMessage({
        type: "success",
        text: `${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)} added successfully!`,
      });

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
          <h1 className="text-4xl font-serif font-bold text-stone-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-stone-600 italic">
            Manage BiblioManzil Content
          </p>
        </header>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-8 p-4 rounded-xl flex items-center gap-3 ${
              message.type === "success"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-rose-50 text-rose-700 border border-rose-200"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <p className="font-medium">{message.text}</p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Upload Blog */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200">
            <h2 className="text-2xl font-serif font-semibold mb-6">Upload Blog</h2>

            <form
              onSubmit={(e) => handleSubmit(e, "/api/admin/blog", "blog")}
              className="space-y-4"
            >

              <input name="title" placeholder="Title" required className="w-full border p-2 rounded" />
              <input name="slug" placeholder="Slug" required className="w-full border p-2 rounded" />
              <input name="tags" placeholder="Tags" className="w-full border p-2 rounded" />
              <textarea name="content" placeholder="Content" required className="w-full border p-2 rounded" />
              <input type="file" name="coverImage" accept="image/*" required />

              <button className="w-full bg-stone-900 text-white py-2 rounded">
                Upload Blog
              </button>

            </form>
          </section>

          {/* Add Reel */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200">

            <div className="flex items-center gap-3 mb-6">
              <Video className="w-6 h-6 text-stone-700" />
              <h2 className="text-2xl font-serif font-semibold text-stone-900">
                Add Reel
              </h2>
            </div>

            <form
              onSubmit={(e) =>
                handleJsonSubmit(e, "/api/reels/admin", "reel")
              }
              className="space-y-4"
            >

              <input
                name="title"
                placeholder="Title"
                required
                className="w-full px-4 py-2 rounded-lg border border-stone-200"
              />

              <input
                name="instagramUrl"
                placeholder="https://www.instagram.com/reel/..."
                required
                className="w-full px-4 py-2 rounded-lg border border-stone-200"
              />

              <button
                disabled={loading === "reel"}
                className="w-full bg-stone-900 text-white py-3 rounded-xl flex items-center justify-center gap-2"
              >
                {loading === "reel" ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Video className="w-5 h-5" />
                )}
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
