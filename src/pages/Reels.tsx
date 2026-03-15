import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Loader2, Video, ExternalLink, Play } from "lucide-react";

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

          {reels.map((reel) => {

            const embedUrl = getEmbedUrl(reel.instagramUrl);

            return (
              <motion.div
                key={reel._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className="group bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-lg transition"
              >

                {/* Reel Container */}
                <div className="relative aspect-[9/16] bg-black">

                  <iframe
                    src={embedUrl}
                    className="w-full h-full border-0"
                    allow="encrypted-media"
                    title={reel.title}
                  ></iframe>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 transition pointer-events-none">
                    <Play className="w-12 h-12 text-white drop-shadow-lg" />
                  </div>

                </div>

                {/* Reel Info */}
                <div className="p-5 flex items-center justify-between">

                  <h2 className="font-semibold text-stone-900 line-clamp-1">
                    {reel.title}
                  </h2>

                  <a
                    href={reel.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-stone-100 hover:bg-stone-200 transition"
                  >
                    <ExternalLink className="w-4 h-4 text-stone-600" />
                  </a>

                </div>

              </motion.div>
            );
          })}

        </div>

      )}
    </div>
  );
};

export default Reels;
