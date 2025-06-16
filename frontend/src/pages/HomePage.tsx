"use client";
import { useState } from "react";
import { ChevronRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuroraBackground } from "../components/ui/aurora-background";
 // adjust path if needed

export function HomePage() {
  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      navigate("/builder", { state: { prompt } });
    }, 800);
  };

  return (
    <AuroraBackground>
      {/* Centered Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8 max-w-2xl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500/10 rounded-full text-sky-400 text-sm backdrop-blur-md border border-sky-400/20 shadow-lg"
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
            AI-Powered{" "}
            <span className="font-semibold">
              Trash
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                AI
              </span>
            </span>{" "}
            Builder
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight bg-gradient-to-r from-sky-400 via-blue-500 to-purple-400 text-transparent bg-clip-text animate-text-glow">
            What do you want to build?
          </h1>

          <p className="text-gray-400 text-lg animate-fade-in">
            Instantly turn your ideas into functional, live apps & websites with
            AI magic.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="relative w-full max-w-2xl mx-auto"
            >
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your dream app or website..."
                className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 text-lg focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:bg-white/10 transition-all duration-300 pr-16 shadow-xl"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-4 bg-gradient-to-r from-sky-500 to-purple-500 hover:opacity-90 rounded-xl transition shadow-lg"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          </form>
        </motion.div>
      </div>
      {/* Footer */}
      <motion.div
        className="absolute bottom-6 inset-x-0 text-center text-sm text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        ⚡️ Built with <span className="text-pink-400">AI magic ✨</span>
      </motion.div>

      {/* Loading Animation */}
      <AnimatePresence>
        {isSubmitting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                repeat: Infinity,
                repeatType: "reverse",
                duration: 0.8,
                ease: "easeInOut",
              }}
              className="text-white text-xl font-bold tracking-wider animate-pulse"
            >
              Generating Magic...
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AuroraBackground>
  );
}
