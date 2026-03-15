import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { Loader2, ArrowLeft, Tag, Calendar } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "https://bibliomanzil.onrender.com";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  tags: string[];
  content: string;
  coverImage: string;
  createdAt: string;
}

const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`${API_URL}/api/blog/${slug}`);

        if (res.ok) {
          const data = await res.json();
          setBlog(data);
        }

      } catch (err) {
        console.error("Error fetching blog:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-stone-400" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <h1 className="text-2xl font-bold text-stone-900 mb-4">
          Blog post not found
        </h1>

        <Link
          to="/blogs"
          className="text-stone-600 hover:text-stone-900 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >

        <Link
          to="/blogs"
          className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all insights
        </Link>

        <header className="mb-12">

          <div className="flex flex-wrap gap-2 mb-6">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-stone-500 bg-stone-100 px-3 py-1 rounded-full"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-4xl md:text-6xl font-serif font-bold text-stone-900 mb-6 leading-tight">
            {blog.title}
          </h1>

          <div className="flex items-center gap-4 text-stone-400 text-sm">

            <span className="flex items-center gap-1">

              <Calendar className="w-4 h-4" />

              {new Date(blog.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}

            </span>

          </div>

        </header>

        <div className="aspect-[21/9] rounded-3xl overflow-hidden mb-12 shadow-xl shadow-stone-200">

          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />

        </div>

        <div className="prose prose-stone prose-lg max-w-none">

          {blog.content.split("\n").map((paragraph, idx) =>
            paragraph.trim()
              ? (
                <p key={idx} className="text-stone-700 leading-relaxed mb-6">
                  {paragraph}
                </p>
              )
              : <br key={idx} />
          )}

        </div>

      </motion.div>

    </div>
  );
};

export default BlogDetail;
