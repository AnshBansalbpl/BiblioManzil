import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "motion/react";
import { Loader2, Bookmark, Trash2, Book, FileText, BookOpen, Download } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "https://bibliomanzil.onrender.com";

interface BookmarkItem {
  _id: string;
  userId: string;
  contentType: "blog" | "book" | "summary";
  contentId: string;
}

interface Summary {
  _id: string;
  bookTitle: string;
  author: string;
  coverImage: string;
}

interface Blog {
  _id: string;
  title: string;
  coverImage: string;
}

interface BookItem {
  _id: string;
  title: string;
  author: string;
  coverImage: string;
  pdfUrl: string;
}

const Dashboard: React.FC = () => {

  const { user } = useAuth();

  const [loading, setLoading] = useState(true);

  const [savedSummaries, setSavedSummaries] = useState<Summary[]>([]);
  const [savedBlogs, setSavedBlogs] = useState<Blog[]>([]);
  const [savedBooks, setSavedBooks] = useState<BookItem[]>([]);

  const fetchBookmarks = async () => {

    if (!user) return;

    try {

      const res = await fetch(`${API_URL}/api/bookmarks/${user.uid}`);
      const bookmarks: BookmarkItem[] = await res.json();

      const summaryIds = bookmarks
        .filter(b => b.contentType === "summary")
        .map(b => b.contentId);

      const blogIds = bookmarks
        .filter(b => b.contentType === "blog")
        .map(b => b.contentId);

      const bookIds = bookmarks
        .filter(b => b.contentType === "book")
        .map(b => b.contentId);

      const summariesRes = await fetch(`${API_URL}/api/summaries`);
      const summaries = await summariesRes.json();

      const blogsRes = await fetch(`${API_URL}/api/blogs`);
      const blogs = await blogsRes.json();

      const booksRes = await fetch(`${API_URL}/api/books`);
      const books = await booksRes.json();

      setSavedSummaries(
        summaries.filter((s: Summary) => summaryIds.includes(s._id))
      );

      setSavedBlogs(
        blogs.filter((b: Blog) => blogIds.includes(b._id))
      );

      setSavedBooks(
        books.filter((b: BookItem) => bookIds.includes(b._id))
      );

    } catch (err) {

      console.error("Error loading dashboard:", err);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {
    fetchBookmarks();
  }, [user]);

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
        <h1 className="text-4xl font-serif font-bold text-stone-900 mb-2">
          Welcome, {user?.displayName || "Reader"}
        </h1>
        <p className="text-stone-600">
          Your personal collection of knowledge and inspiration.
        </p>
      </header>

      <div className="space-y-16">

        {/* BLOGS */}

        <section>

          <div className="flex items-center gap-2 mb-6 border-b border-stone-100 pb-4">
            <FileText className="w-5 h-5 text-stone-400" />
            <h2 className="text-2xl font-bold text-stone-800">
              Saved Blogs
            </h2>
          </div>

          {savedBlogs.length > 0 ? (

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {savedBlogs.map(blog => (

                <div key={blog._id} className="bg-white rounded-2xl border border-stone-200 overflow-hidden">

                  <div className="aspect-video overflow-hidden">

                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                    />

                  </div>

                  <div className="p-4">

                    <h3 className="font-bold text-stone-900">
                      {blog.title}
                    </h3>

                  </div>

                </div>

              ))}

            </div>

          ) : (
            <p className="text-stone-400 italic">No blogs saved yet.</p>
          )}

        </section>


        {/* BOOKS */}

        <section>

          <div className="flex items-center gap-2 mb-6 border-b border-stone-100 pb-4">
            <Book className="w-5 h-5 text-stone-400" />
            <h2 className="text-2xl font-bold text-stone-800">
              Saved Books
            </h2>
          </div>

          {savedBooks.length > 0 ? (

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

              {savedBooks.map(book => (

                <div key={book._id} className="bg-white rounded-2xl border border-stone-200 overflow-hidden flex flex-col">

                  <div className="aspect-[3/4] overflow-hidden">

                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />

                  </div>

                  <div className="p-4">

                    <h3 className="font-bold text-stone-900">
                      {book.title}
                    </h3>

                    <p className="text-stone-500 text-xs italic mb-4">
                      by {book.author}
                    </p>

                    <a
                      href={book.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-stone-100 text-stone-700 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-stone-200"
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


        {/* SUMMARIES */}

        <section>

          <div className="flex items-center gap-2 mb-6 border-b border-stone-100 pb-4">
            <BookOpen className="w-5 h-5 text-stone-400" />
            <h2 className="text-2xl font-bold text-stone-800">
              Saved Summaries
            </h2>
          </div>

          {savedSummaries.length > 0 ? (

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {savedSummaries.map(summary => (

                <div key={summary._id} className="bg-white p-6 rounded-2xl border border-stone-200 flex items-center gap-4">

                  <div className="w-12 h-16 overflow-hidden rounded">

                    <img
                      src={summary.coverImage}
                      className="w-full h-full object-cover"
                    />

                  </div>

                  <div>

                    <h3 className="font-bold text-stone-900">
                      {summary.bookTitle}
                    </h3>

                    <p className="text-stone-500 text-sm italic">
                      by {summary.author}
                    </p>

                  </div>

                </div>

              ))}

            </div>

          ) : (
            <p className="text-stone-400 italic">No summaries saved yet.</p>
          )}

        </section>

      </div>

      {savedBlogs.length === 0 &&
        savedBooks.length === 0 &&
        savedSummaries.length === 0 && (

          <div className="text-center py-20 bg-stone-50 rounded-3xl border border-dashed border-stone-200 mt-12">

            <Bookmark className="w-12 h-12 text-stone-300 mx-auto mb-4" />

            <p className="text-stone-500">
              Your bookmark list is empty. Start exploring!
            </p>

          </div>

        )}

    </div>
  );

};

export default Dashboard;
