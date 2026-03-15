import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, BookOpen, Sparkles, Download, Play, Loader2, Quote, Users, Bookmark } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  const [latestBlogs, setLatestBlogs] = useState<any[]>([]);
  const [featuredBooks, setFeaturedBooks] = useState<any[]>([]);
  const [popularSummaries, setPopularSummaries] = useState<any[]>([]);
  const [latestReels, setLatestReels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogsRes, booksRes, summariesRes, reelsRes] = await Promise.all([
          fetch("/api/blogs"),
          fetch("/api/books"),
          fetch("/api/summaries"),
          fetch("/api/reels")
        ]);
        
        const blogs = await blogsRes.json();
        const books = await booksRes.json();
        const summaries = await summariesRes.json();
        const reels = await reelsRes.json();

        setLatestBlogs(blogs.slice(0, 3));
        
        // Randomize books for "Featured" feel
        const shuffledBooks = [...books].sort(() => 0.5 - Math.random());
        setFeaturedBooks(shuffledBooks.slice(0, 4));
        
        setPopularSummaries(summaries.slice(0, 3));
        setLatestReels(reels.slice(0, 3));
      } catch (err) {
        console.error("Error fetching home data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="px-6 py-20 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
            Level up your mind
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
            Your Journey to <br />
            <span className="text-neutral-400 italic font-serif">Knowledge</span> Starts Here.
          </h1>
          <p className="text-neutral-500 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Access a curated collection of motivational blogs, insightful book summaries, 
            and free e-books designed to accelerate your personal growth.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/ebooks" className="w-full sm:w-auto bg-black text-white px-8 py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-neutral-800 transition-all">
              Explore Library <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/blogs" className="w-full sm:w-auto bg-white border border-neutral-200 text-black px-8 py-4 rounded-2xl font-semibold hover:bg-neutral-50 transition-all text-center">
              Read Blogs
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="px-6 py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard 
            icon={<Sparkles className="text-amber-500" />}
            title="Book Summaries"
            description="Get the key takeaways from world-class non-fiction in 15 minutes."
          />
          <FeatureCard 
            icon={<BookOpen className="text-blue-500" />}
            title="Insightful Blogs"
            description="Deep dives into productivity, mindset, and success strategies."
          />
          <FeatureCard 
            icon={<Download className="text-emerald-500" />}
            title="Free E-Books"
            description="Download high-quality motivational e-books at zero cost."
          />
          <FeatureCard 
            icon={<Play className="text-rose-500" />}
            title="Daily Reels"
            description="Quick bursts of motivation through curated Instagram reels."
          />
        </div>
      </section>

      {/* Featured Books */}
      <section className="px-6 py-24 bg-stone-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-500/5 blur-[120px] -z-10" />
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-emerald-400 text-xs font-bold uppercase tracking-[0.2em] mb-4 block">Curated Collection</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold">Featured E-Books</h2>
            </div>
            <Link to="/ebooks" className="text-stone-400 hover:text-white flex items-center gap-2 font-medium transition-colors group">
              Browse Library <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-stone-700" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {featuredBooks.map((book, idx) => (
                <motion.div 
                  key={book._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group"
                >
                  <Link to={`/book/${book._id}`} className="block">
                    <div className="aspect-[3/4] rounded-2xl overflow-hidden mb-6 shadow-2xl shadow-black/50 relative">
                      <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-white text-black px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">View Details</span>
                      </div>
                    </div>
                    <h3 className="font-bold text-lg mb-1 line-clamp-1 group-hover:text-emerald-400 transition-colors">{book.title}</h3>
                    <p className="text-stone-400 text-sm italic">by {book.author}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trending Blogs */}
      <section className="px-6 py-24 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-stone-400 text-xs font-bold uppercase tracking-[0.2em] mb-4 block">Latest Insights</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold">Trending Blogs</h2>
          </div>
          <Link to="/blogs" className="text-stone-500 hover:text-black flex items-center gap-2 font-medium transition-colors group">
            View all insights <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-stone-300" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {latestBlogs.map((blog, idx) => (
              <motion.article 
                key={blog._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group"
              >
                <Link to={`/blog/${blog.slug}`} className="block">
                  <div className="aspect-[16/10] rounded-3xl overflow-hidden mb-6 relative">
                    <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-stone-900">
                        {blog.tags[0]}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-stone-600 transition-colors leading-tight">{blog.title}</h3>
                  <p className="text-stone-500 text-sm line-clamp-2 mb-4 leading-relaxed">{blog.content}</p>
                  <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                    Read Story <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}
      </section>

      {/* Popular Summaries */}
      <section className="px-6 py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-stone-400 text-xs font-bold uppercase tracking-[0.2em] mb-4 block">Wisdom in Minutes</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold">Popular Summaries</h2>
            </div>
            <Link to="/summaries" className="text-stone-500 hover:text-black flex items-center gap-2 font-medium transition-colors group">
              Explore all summaries <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {popularSummaries.map((summary, idx) => (
              <motion.div
                key={summary._id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-[2rem] border border-stone-200 shadow-sm hover:shadow-xl transition-all group"
              >
                <Link to={`/summary/${summary.slug}`} className="block">
                  <div className="flex gap-6 mb-8">
                    <div className="w-24 h-32 rounded-xl overflow-hidden shadow-lg flex-shrink-0">
                      <img src={summary.coverImage} alt={summary.bookTitle} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-stone-900 mb-1 line-clamp-2 group-hover:text-stone-600 transition-colors">{summary.bookTitle}</h3>
                      <p className="text-stone-500 text-sm italic">by {summary.author}</p>
                    </div>
                  </div>
                  <div className="relative">
                    <Quote className="absolute -top-2 -left-2 w-8 h-8 text-stone-50 -z-0" />
                    <p className="text-stone-600 text-sm line-clamp-3 italic leading-relaxed relative z-10">
                      {summary.summary}
                    </p>
                  </div>
                  <div className="mt-8 pt-6 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">15 min read</span>
                    <span className="text-stone-900 text-sm font-bold flex items-center gap-1">
                      Read Summary <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Reels */}
      <section className="px-6 py-24 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-stone-400 text-xs font-bold uppercase tracking-[0.2em] mb-4 block">Visual Motivation</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold">Latest Reels</h2>
          </div>
          <Link to="/reels" className="text-stone-500 hover:text-black flex items-center gap-2 font-medium transition-colors group">
            Watch more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestReels.map((reel, idx) => (
            <motion.div
              key={reel._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="aspect-[9/16] rounded-[2.5rem] overflow-hidden relative group shadow-2xl shadow-stone-200"
            >
              <img src={reel.thumbnail} alt={reel.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8">
                <h3 className="text-white font-bold text-xl mb-4 line-clamp-2">{reel.title}</h3>
                <Link to="/reels" className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 text-black fill-current" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Community Section */}
      <section className="px-6 py-24">
        <div className="max-w-5xl mx-auto bg-stone-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_70%)]" />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <Users className="w-16 h-16 text-emerald-500 mx-auto mb-8" />
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-8 leading-tight">
              Join the BiblioManzil <br /> Community Today.
            </h2>
            <p className="text-stone-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
              Create an account to save your favorite books, track your reading progress, 
              and get personalized recommendations for your growth journey.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/signup" className="w-full sm:w-auto bg-emerald-500 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20">
                Get Started for Free
              </Link>
              <Link to="/login" className="w-full sm:w-auto bg-white/10 text-white border border-white/20 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all">
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm hover:shadow-md transition-all"
    >
      <div className="w-12 h-12 bg-neutral-50 rounded-2xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-neutral-500 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}
