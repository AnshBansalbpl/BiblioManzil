import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Loader2, Tag, Bookmark, Check, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

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

const Blogs: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const blogsRes = await fetch(`${API_URL}/api/blogs`);
        const blogsData = await blogsRes.json();
        setBlogs(blogsData);

        if (user) {
          const bookmarksRes = await fetch(`${API_URL}/api/bookmarks/${user.uid}`);
          const bookmarksData = await bookmarksRes.json();

          const ids = new Set(
            bookmarksData
              .filter((b: any) => b.contentType === "blog")
              .map((b: any) => b.contentId)
          );

          setBookmarkedIds(ids);
        }

      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleBookmark = async (blogId: string) => {

    if (!user) {
      navigate("/login");
      return;
    }

    const isBookmarked = bookmarkedIds.has(blogId);

    try {

      if (isBookmarked) {

        await fetch(`${API_URL}/api/bookmark`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userId: user.uid,
            contentType: "blog",
            contentId: blogId
          })
        });

        const updated = new Set(bookmarkedIds);
        updated.delete(blogId);
        setBookmarkedIds(updated);

      } else {

        const res = await fetch(`${API_URL}/api/bookmark`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userId: user.uid,
            contentType: "blog",
            contentId: blogId
          })
        });

        if (res.ok) {
          setBookmarkedIds(new Set([...bookmarkedIds, blogId]));
        }

      }

    } catch (err) {
      console.error("Bookmark error:", err);
    }

  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-stone-400" />
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">

      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-4">
          Insights & Perspectives
        </h1>
        <p className="text-stone-600 text-lg max-w-2xl">
          Explore our collection of articles on productivity, mindset, and personal growth.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

        {blogs.map((blog) => (

          <motion.article
            key={blog._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group bg-white rounded-2xl overflow-hidden border border-stone-200 hover:shadow-xl transition-all duration-300"
          >

            <div className="aspect-video overflow-hidden relative group">

              <img
                src={blog.coverImage}
                alt={blog.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />

              <button
                onClick={() => handleBookmark(blog._id)}
                className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur shadow-sm transition-all ${
                  bookmarkedIds.has(blog._id)
                    ? "bg-emerald-500 text-white"
                    : "bg-white/80 text-stone-600 hover:bg-white hover:text-stone-900"
                }`}
              >
                {bookmarkedIds.has(blog._id) ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </button>

            </div>

            <Link to={`/blog/${blog.slug}`} className="p-6 block">

              <div className="flex flex-wrap gap-2 mb-4">
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-stone-500 bg-stone-100 px-2 py-1 rounded-md"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>

              <h2 className="text-xl font-bold text-stone-900 mb-3 group-hover:text-stone-600 transition-colors">
                {blog.title}
              </h2>

              <p className="text-stone-600 text-sm line-clamp-3 mb-6">
                {blog.content}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-stone-100">

                <span className="text-xs text-stone-400">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </span>

                <span className="text-sm font-semibold text-stone-900 flex items-center gap-1 group-hover:gap-2 transition-all">
                  Read More <ArrowRight className="w-4 h-4" />
                </span>

              </div>

            </Link>

          </motion.article>

        ))}

      </div>

    </div>
  );
};

export default Blogs;
