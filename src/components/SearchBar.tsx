import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Book, FileText, BookOpen, Loader2 } from "lucide-react";

interface SearchResult {
  _id: string;
  type: "blog" | "book" | "summary";
  title: string;
  author?: string;
  coverImage: string;
  slug?: string;
}

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{
    blogs: SearchResult[];
    books: SearchResult[];
    summaries: SearchResult[];
  }>({ blogs: [], books: [], summaries: [] });

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResults({ blogs: [], books: [], summaries: [] });
      setIsOpen(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/search?q=${encodeURIComponent(query)}`
        );

        const data = await res.json();

        const blogs = data.blogs.map((b: any) => ({
          _id: b._id,
          type: "blog",
          title: b.title,
          coverImage: b.coverImage,
          slug: b.slug,
        }));

        const books = data.books.map((b: any) => ({
          _id: b._id,
          type: "book",
          title: b.title,
          author: b.author,
          coverImage: b.coverImage,
        }));

        const summaries = data.summaries.map((s: any) => ({
          _id: s._id,
          type: "summary",
          title: s.bookTitle,
          author: s.author,
          coverImage: s.coverImage,
        }));

        setResults({
          blogs,
          books,
          summaries,
        });

        setIsOpen(true);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSelect = (result: SearchResult) => {
    setQuery("");
    setIsOpen(false);

    if (result.type === "blog") navigate(`/blog/${result.slug}`);
    if (result.type === "book") navigate(`/book/${result._id}`);
    if (result.type === "summary") navigate(`/summary/${result._id}`);
  };

  const hasResults =
    results.blogs.length > 0 ||
    results.books.length > 0 ||
    results.summaries.length > 0;

  return (
    <div className="relative w-full max-w-md" ref={searchRef}>
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-stone-900 transition-colors" />

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder="Search blogs, books, summaries..."
          className="w-full bg-stone-100 border-none rounded-full py-2 pl-10 pr-10 text-sm focus:ring-2 focus:ring-stone-200 transition-all outline-none"
        />

        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-900"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-stone-200 shadow-2xl overflow-hidden z-50 max-h-[80vh] overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center">
              <Loader2 className="w-6 h-6 animate-spin text-stone-400 mx-auto mb-2" />
              <p className="text-xs text-stone-500">Searching BiblioManzil...</p>
            </div>
          ) : hasResults ? (
            <div className="p-2">
              {results.blogs.length > 0 && (
                <div className="mb-4">
                  <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-stone-400 flex items-center gap-2">
                    <FileText className="w-3 h-3" /> Blogs
                  </div>

                  {results.blogs.map((b) => (
                    <button
                      key={b._id}
                      onClick={() => handleSelect(b)}
                      className="w-full flex items-center gap-3 p-2 hover:bg-stone-50 rounded-xl transition-colors text-left"
                    >
                      <img
                        src={b.coverImage}
                        className="w-10 h-10 rounded-lg object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="text-sm font-medium text-stone-900 line-clamp-1">
                        {b.title}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {results.books.length > 0 && (
                <div className="mb-4">
                  <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-stone-400 flex items-center gap-2">
                    <Book className="w-3 h-3" /> Books
                  </div>

                  {results.books.map((b) => (
                    <button
                      key={b._id}
                      onClick={() => handleSelect(b)}
                      className="w-full flex items-center gap-3 p-2 hover:bg-stone-50 rounded-xl transition-colors text-left"
                    >
                      <img
                        src={b.coverImage}
                        className="w-10 h-14 rounded-md object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <p className="text-sm font-medium text-stone-900 line-clamp-1">
                          {b.title}
                        </p>
                        <p className="text-[10px] text-stone-500 italic">
                          by {b.author}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {results.summaries.length > 0 && (
                <div className="mb-2">
                  <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-stone-400 flex items-center gap-2">
                    <BookOpen className="w-3 h-3" /> Summaries
                  </div>

                  {results.summaries.map((s) => (
                    <button
                      key={s._id}
                      onClick={() => handleSelect(s)}
                      className="w-full flex items-center gap-3 p-2 hover:bg-stone-50 rounded-xl transition-colors text-left"
                    >
                      <img
                        src={s.coverImage}
                        className="w-10 h-14 rounded-md object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <p className="text-sm font-medium text-stone-900 line-clamp-1">
                          {s.title}
                        </p>
                        <p className="text-[10px] text-stone-500 italic">
                          by {s.author}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : !loading && query.length >= 2 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-stone-500">
                No results found for "{query}"
              </p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
