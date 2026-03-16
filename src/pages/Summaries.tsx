import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Loader2, BookOpen, Bookmark, Check, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "https://bibliomanzil.onrender.com";

interface Summary {
  _id: string;
  bookTitle: string;
  author: string;
  coverImage: string;
  summary: string;
  keyLessons: string[];
  quotes: string[];
}

const Summaries: React.FC = () => {

  const { user } = useAuth();
  const navigate = useNavigate();

  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  useEffect(() => {

    const fetchData = async () => {

      try {

        const summariesRes = await fetch(`${API_URL}/api/summaries`);
        const summariesData = await summariesRes.json();
        setSummaries(summariesData);

        if (user) {

          const bookmarksRes = await fetch(`${API_URL}/api/bookmarks/${user.uid}`);
          const bookmarksData = await bookmarksRes.json();

          const ids = new Set(
            bookmarksData
              .filter((b: any) => b.contentType === "summary")
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

  const handleBookmark = async (summaryId: string) => {

    if (!user) {

      navigate("/login");
      return;

    }

    if (bookmarkedIds.has(summaryId)) return;

    try {

      const res = await fetch(`${API_URL}/api/bookmark`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: user.uid,
          contentType: "summary",
          contentId: summaryId
        })
      });

      if (res.ok) {

        setBookmarkedIds(new Set([...bookmarkedIds, summaryId]));

      }

    } catch (err) {

      console.error("Error bookmarking:", err);

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
          Book Summaries
        </h1>

        <p className="text-stone-600 text-lg max-w-2xl">
          Get the core wisdom from best-selling non-fiction books in just a few minutes of reading.
        </p>

      </header>

      <div className="space-y-12">

        {summaries.map((item) => (

          <motion.div
            key={item._id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >

            <div className="flex flex-col lg:flex-row">

              <div className="lg:w-1/3 aspect-[3/4] lg:aspect-auto overflow-hidden">

                <img
                  src={item.coverImage}
                  alt={item.bookTitle}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />

              </div>

              <div className="lg:w-2/3 p-8 lg:p-12 relative">

                <button
                  onClick={() => handleBookmark(item._id)}
                  className={`absolute top-8 right-8 p-3 rounded-full backdrop-blur shadow-sm transition-all ${
                    bookmarkedIds.has(item._id)
                      ? "bg-emerald-500 text-white"
                      : "bg-stone-50 text-stone-400 hover:bg-stone-100 hover:text-stone-900"
                  }`}
                >
                  {bookmarkedIds.has(item._id)
                    ? <Check className="w-5 h-5" />
                    : <Bookmark className="w-5 h-5" />}
                </button>

                <div className="mb-8">

                  <Link to={`/summary/${item._id}`} className="block group/title">

                    <h2 className="text-3xl font-serif font-bold text-stone-900 mb-2 group-hover/title:text-stone-600 transition-colors">
                      {item.bookTitle}
                    </h2>

                    <p className="text-stone-500 italic text-lg">
                      by {item.author}
                    </p>

                  </Link>

                </div>

                <div className="mb-10">

                  <h3 className="text-sm font-bold uppercase tracking-widest text-stone-400 mb-4 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    The Essence
                  </h3>

                  <p className="text-stone-700 leading-relaxed text-lg line-clamp-3">
                    {item.summary}
                  </p>

                </div>

                <div className="flex justify-end">

                  <Link
                    to={`/summary/${item._id}`}
                    className="text-stone-900 font-bold flex items-center gap-2 hover:gap-3 transition-all"
                  >
                    Read Full Summary
                    <ArrowRight className="w-5 h-5" />
                  </Link>

                </div>

              </div>

            </div>

          </motion.div>

        ))}

      </div>

      {summaries.length === 0 && (

        <div className="text-center py-20 bg-stone-50 rounded-3xl border border-dashed border-stone-200">

          <BookOpen className="w-12 h-12 text-stone-300 mx-auto mb-4" />

          <p className="text-stone-500">
            No book summaries available yet.
          </p>

        </div>

      )}

    </div>

  );

};

export default Summaries;
