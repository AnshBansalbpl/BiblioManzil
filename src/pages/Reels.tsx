import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Loader2, Video, ExternalLink } from "lucide-react";

interface Reel {
  _id: string;
  title: string;
  instagramEmbedUrl: string;
}

const Reels: React.FC = () => {
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reels")
      .then((res) => res.json())
      .then((data) => {
        setReels(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching reels:", err);
        setLoading(false);
      });
  }, []);

  // Helper to convert Instagram URL to embed URL if needed
  const getEmbedUrl = (url: string) => {
    if (url.includes("/reels/") || url.includes("/p/")) {
      const baseUrl = url.split("?")[0];
      return `${baseUrl.endsWith("/") ? baseUrl : baseUrl + "/"}embed`;
    }
    return url;
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
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-4">Daily Motivation</h1>
        <p className="text-stone-600 text-lg max-w-2xl mx-auto">Quick bursts of wisdom and inspiration through our curated Instagram reels.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {reels.map((reel) => (
          <motion.div
            key={reel._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm flex flex-col"
          >
            <div className="aspect-[9/16] bg-stone-100 relative group">
              <iframe
                src={getEmbedUrl(reel.instagramEmbedUrl)}
                className="w-full h-full border-0"
                allowTransparency
                allow="encrypted-media"
                title={reel.title}
              ></iframe>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 pointer-events-none transition-colors"></div>
            </div>
            <div className="p-6 flex items-center justify-between">
              <h2 className="font-bold text-stone-900 line-clamp-1">{reel.title}</h2>
              <a
                href={reel.instagramEmbedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-stone-50 rounded-full text-stone-400 hover:text-stone-900 transition-colors"
                title="View on Instagram"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        ))}
      </div>

      {reels.length === 0 && (
        <div className="text-center py-20 bg-stone-50 rounded-3xl border border-dashed border-stone-200">
          <Video className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <p className="text-stone-500">No reels added yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
};

export default Reels;
