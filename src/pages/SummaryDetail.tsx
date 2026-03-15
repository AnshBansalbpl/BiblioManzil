import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { Loader2, ArrowLeft, BookOpen, Lightbulb, Quote, User } from "lucide-react";

interface Summary {
  _id: string;
  bookTitle: string;
  author: string;
  slug: string;
  coverImage: string;
  summary: string;
  keyLessons: string[];
  quotes: string[];
}

const SummaryDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch(`/api/summary/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setSummary(data);
        }
      } catch (err) {
        console.error("Error fetching summary:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-stone-400" />
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <h1 className="text-2xl font-bold text-stone-900 mb-4">Summary not found</h1>
        <Link to="/summaries" className="text-stone-600 hover:text-stone-900 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Summaries
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link to="/summaries" className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 mb-12 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to all summaries
        </Link>

        <div className="flex flex-col lg:flex-row gap-12 mb-20">
          <div className="lg:w-1/3">
            <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl shadow-stone-300">
              <img
                src={summary.coverImage}
                alt={summary.bookTitle}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <div className="lg:w-2/3">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-stone-900 mb-4 leading-tight">
              {summary.bookTitle}
            </h1>
            <div className="flex items-center gap-2 text-stone-500 text-2xl italic mb-10">
              <User className="w-6 h-6" />
              <span>by {summary.author}</span>
            </div>

            <div className="prose prose-stone prose-xl max-w-none">
              <h2 className="text-sm font-bold uppercase tracking-widest text-stone-400 mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5" /> The Core Essence
              </h2>
              <p className="text-stone-700 leading-relaxed italic border-l-4 border-stone-200 pl-6">
                {summary.summary}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-stone-400 mb-8 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" /> Key Lessons & Takeaways
            </h2>
            <div className="space-y-6">
              {summary.keyLessons.map((lesson, idx) => (
                <div key={idx} className="flex gap-4 group">
                  <span className="flex-shrink-0 w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 font-serif font-bold group-hover:bg-stone-900 group-hover:text-white transition-colors">
                    {idx + 1}
                  </span>
                  <p className="text-stone-700 leading-relaxed pt-2">
                    {lesson}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-stone-400 mb-8 flex items-center gap-2">
              <Quote className="w-5 h-5 text-stone-300" /> Memorable Quotes
            </h2>
            <div className="space-y-8">
              {summary.quotes.map((quote, idx) => (
                <blockquote key={idx} className="relative">
                  <Quote className="absolute -top-4 -left-4 w-8 h-8 text-stone-100 -z-10" />
                  <p className="text-stone-600 italic text-lg leading-relaxed">
                    "{quote}"
                  </p>
                </blockquote>
              ))}
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default SummaryDetail;
