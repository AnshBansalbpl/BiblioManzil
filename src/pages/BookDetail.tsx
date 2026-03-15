import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { Loader2, ArrowLeft, Download, Book as BookIcon, User, Info } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "https://bibliomanzil.onrender.com";

interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  coverImage: string;
  pdfUrl: string;
}

const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`${API_URL}/api/book/${id}`);

        if (res.ok) {
          const data = await res.json();
          setBook(data);
        }

      } catch (err) {
        console.error("Error fetching book:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-stone-400" />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <h1 className="text-2xl font-bold text-stone-900 mb-4">
          Book not found
        </h1>

        <Link
          to="/ebooks"
          className="text-stone-600 hover:text-stone-900 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Library
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >

        <Link
          to="/ebooks"
          className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 mb-12 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Library
        </Link>

        <div className="flex flex-col md:flex-row gap-12 lg:gap-20">

          <div className="md:w-1/3">

            <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl shadow-stone-300 sticky top-32">

              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />

            </div>

          </div>

          <div className="md:w-2/3">

            <div className="mb-10">

              <span className="inline-block px-3 py-1 bg-stone-100 text-stone-500 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                {book.category}
              </span>

              <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-4 leading-tight">
                {book.title}
              </h1>

              <div className="flex items-center gap-2 text-stone-500 text-xl italic">

                <User className="w-5 h-5" />

                <span>by {book.author}</span>

              </div>

            </div>

            <div className="bg-stone-50 rounded-3xl p-8 mb-10">

              <h2 className="text-sm font-bold uppercase tracking-widest text-stone-400 mb-4 flex items-center gap-2">
                <Info className="w-4 h-4" />
                About this book
              </h2>

              <p className="text-stone-700 leading-relaxed text-lg">
                {book.description}
              </p>

            </div>

            <div className="flex flex-col sm:flex-row gap-4">

              <a
                href={book.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-stone-900 text-white py-5 rounded-2xl text-lg font-bold flex items-center justify-center gap-3 hover:bg-stone-800 transition-all shadow-lg shadow-stone-200"
              >
                <Download className="w-6 h-6" />
                Download Full PDF
              </a>

              <button className="flex-1 bg-white border border-stone-200 text-stone-900 py-5 rounded-2xl text-lg font-bold flex items-center justify-center gap-3 hover:bg-stone-50 transition-all">
                <BookIcon className="w-6 h-6" />
                Read Online
              </button>

            </div>

          </div>

        </div>

      </motion.div>

    </div>
  );
};

export default BookDetail;
