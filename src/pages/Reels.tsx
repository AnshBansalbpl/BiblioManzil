import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Loader2, Video, ExternalLink } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "https://bibliomanzil.onrender.com";

interface Reel {
  _id: string;
  title: string;
  instagramUrl: string;
}

const Reels: React.FC = () => {
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/reels`)
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

  // Convert Instagram reel URL to embed URL
  const getEmbedUrl = (url: string) => {
    const reelId = url.split("/reel/")[1]?.split("/")[0];
    return `https://www.instagram.com/reel/${reelId}/embed`;
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
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-4">
          Daily Motivation
        </h1>
        <p className="text-stone-600 text-lg max-w-2xl mx-auto">
          Quick bursts of wisdom and inspiration through our curated Instagram reels.
        </p>
      </header>

      {reels.length === 0 ? (
        <div className="text-center py-20 bg-stone-50 rounded-3xl border border-dashed border-stone-200">
          <Video className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <p className="text-stone-500">No reels added yet. Check back soon!</p>
        </div>
      ) : (
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
                  src={getEmbedUrl(reel.instagramUrl)}
                  className="w-full h-full border-0"
                  allow="encrypted-media"
                  title={reel.title}
                ></iframe>
              </div>

              <div className="p-6 flex items-center justify-between">
                <h2 className="font-bold text-stone-900 line-clamp-1">
                  {reel.title}
                </h2>

                <a
                  href={reel.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-stone-50 rounded-full text-stone-400 hover:text-stone-900 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reels;
