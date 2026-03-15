import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Loader2, Download, Book as BookIcon, Bookmark, Check, Info } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  coverImage: string;
  pdfUrl: string;
}

const Library: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const booksRes = await fetch("/api/books");
        const booksData = await booksRes.json();
        setBooks(booksData);

        if (user) {
          const bookmarksRes = await fetch(`/api/bookmarks/${user.uid}`);
          const bookmarksData = await bookmarksRes.json();
          const ids = new Set(bookmarksData.filter((b: any) => b.contentType === "book").map((b: any) => b.contentId));
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

  const handleBookmark = async (bookId: string) => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (bookmarkedIds.has(bookId)) return;

    try {
      const res = await fetch("/api/bookmark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          contentType: "book",
          contentId: bookId,
        }),
      });
      if (res.ok) {
        setBookmarkedIds(new Set([...bookmarkedIds, bookId]));
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
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-4">Digital Library</h1>
        <p className="text-stone-600 text-lg max-w-2xl">Download free e-books curated to help you master your mindset and achieve your goals.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {books.map((book) => (
          <motion.div
            key={book._id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="group bg-white rounded-2xl overflow-hidden border border-stone-200 flex flex-col"
          >
            <div className="aspect-[3/4] overflow-hidden relative">
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest text-stone-900">
                {book.category}
              </div>
              <button
                onClick={() => handleBookmark(book._id)}
                className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur shadow-sm transition-all ${
                  bookmarkedIds.has(book._id)
                    ? "bg-emerald-500 text-white"
                    : "bg-white/80 text-stone-600 hover:bg-white hover:text-stone-900"
                }`}
              >
                {bookmarkedIds.has(book._id) ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              </button>
            </div>
            <div className="p-5 flex-grow flex flex-col">
              <Link to={`/book/${book._id}`} className="block group/title">
                <h2 className="text-lg font-bold text-stone-900 mb-1 line-clamp-1 group-hover/title:text-stone-600 transition-colors">{book.title}</h2>
                <p className="text-stone-500 text-sm mb-4 italic">by {book.author}</p>
              </Link>
              <p className="text-stone-600 text-xs line-clamp-2 mb-6 flex-grow">{book.description}</p>
              <div className="grid grid-cols-5 gap-2">
                <a
                  href={book.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="col-span-4 bg-stone-900 text-white py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-stone-800 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </a>
                <Link
                  to={`/book/${book._id}`}
                  className="col-span-1 bg-stone-100 text-stone-600 rounded-xl flex items-center justify-center hover:bg-stone-200 transition-colors"
                  title="View Details"
                >
                  <Info className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {books.length === 0 && (
        <div className="text-center py-20 bg-stone-50 rounded-3xl border border-dashed border-stone-200">
          <BookIcon className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <p className="text-stone-500">No books available in the library yet.</p>
        </div>
      )}
    </div>
  );
};

export default Library;
