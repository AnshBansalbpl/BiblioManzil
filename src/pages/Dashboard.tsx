import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "motion/react";
import { Loader2, Bookmark, Trash2, Book, FileText, BookOpen, Download } from "lucide-react";

interface BookmarkItem {
  _id: string;
  userId: string;
  contentType: "blog" | "book" | "summary";
  contentId: string;
  contentData?: any; // Assuming backend populates or returns enough info
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/bookmarks/${user.uid}`);
      const data = await res.json();
      setBookmarks(data);
    } catch (err) {
      console.error("Error fetching bookmarks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, [user]);

  const removeBookmark = async (id: string) => {
    try {
      const res = await fetch(`/api/bookmark/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setBookmarks(bookmarks.filter((b) => b._id !== id));
      }
    } catch (err) {
      console.error("Error removing bookmark:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-stone-400" />
      </div>
    );
  }

  const blogs = bookmarks.filter((b) => b.contentType === "blog");
  const books = bookmarks.filter((b) => b.contentType === "book");
  const summaries = bookmarks.filter((b) => b.contentType === "summary");

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-serif font-bold text-stone-900 mb-2">Welcome, {user?.displayName || "Reader"}</h1>
        <p className="text-stone-600">Your personal collection of knowledge and inspiration.</p>
      </header>

      <div className="space-y-16">
        {/* Saved Blogs */}
        <section>
          <div className="flex items-center gap-2 mb-6 border-b border-stone-100 pb-4">
            <FileText className="w-5 h-5 text-stone-400" />
            <h2 className="text-2xl font-bold text-stone-800">Saved Blogs</h2>
          </div>
          {blogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogs.map((b) => (
                <div key={b._id} className="bg-white rounded-2xl border border-stone-200 overflow-hidden group">
                  <div className="aspect-video overflow-hidden relative">
                    <img
                      src={b.contentData?.coverImage || "https://picsum.photos/seed/blog/800/600"}
                      alt={b.contentData?.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <button
                      onClick={() => removeBookmark(b._id)}
                      className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur rounded-full text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-stone-900 line-clamp-1">{b.contentData?.title || "Untitled Blog"}</h3>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-stone-400 italic">No blogs saved yet.</p>
          )}
        </section>

        {/* Saved Books */}
        <section>
          <div className="flex items-center gap-2 mb-6 border-b border-stone-100 pb-4">
            <Book className="w-5 h-5 text-stone-400" />
            <h2 className="text-2xl font-bold text-stone-800">Saved Books</h2>
          </div>
          {books.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {books.map((b) => (
                <div key={b._id} className="bg-white rounded-2xl border border-stone-200 overflow-hidden flex flex-col">
                  <div className="aspect-[3/4] overflow-hidden relative">
                    <img
                      src={b.contentData?.coverImage || "https://picsum.photos/seed/book/600/800"}
                      alt={b.contentData?.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <button
                      onClick={() => removeBookmark(b._id)}
                      className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur rounded-full text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-4 flex-grow flex flex-col">
                    <h3 className="font-bold text-stone-900 line-clamp-1">{b.contentData?.title || "Untitled Book"}</h3>
                    <p className="text-stone-500 text-xs italic mb-4">by {b.contentData?.author || "Unknown"}</p>
                    <a
                      href={b.contentData?.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto w-full bg-stone-100 text-stone-700 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-stone-200 transition-colors"
                    >
                      <Download className="w-3 h-3" /> Download
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-stone-400 italic">No books saved yet.</p>
          )}
        </section>

        {/* Saved Summaries */}
        <section>
          <div className="flex items-center gap-2 mb-6 border-b border-stone-100 pb-4">
            <BookOpen className="w-5 h-5 text-stone-400" />
            <h2 className="text-2xl font-bold text-stone-800">Saved Summaries</h2>
          </div>
          {summaries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {summaries.map((b) => (
                <div key={b._id} className="bg-white p-6 rounded-2xl border border-stone-200 flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-16 bg-stone-100 rounded overflow-hidden flex-shrink-0">
                      <img src={b.contentData?.coverImage} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <h3 className="font-bold text-stone-900">{b.contentData?.bookTitle || "Untitled Summary"}</h3>
                      <p className="text-stone-500 text-sm italic">by {b.contentData?.author || "Unknown"}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeBookmark(b._id)}
                    className="p-2 text-stone-300 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-stone-400 italic">No summaries saved yet.</p>
          )}
        </section>
      </div>

      {bookmarks.length === 0 && (
        <div className="text-center py-20 bg-stone-50 rounded-3xl border border-dashed border-stone-200 mt-12">
          <Bookmark className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <p className="text-stone-500">Your bookmark list is empty. Start exploring!</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
