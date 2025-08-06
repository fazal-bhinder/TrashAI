"use client";
import { useState } from "react";
import { ChevronRight, Sparkles, Star, Zap, Code, Globe, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "../components/Navbar";

const testimonials = [
  {
    name: "Spidor-Mon",
    role: "Founder, TechStart",
    content: "TrashAI built our entire MVP in 30 minutes. What would have taken weeks is now done instantly.",
    href: "https://images.unsplash.com/photo-1529335764857-3f1164d1cb24?q=80&w=2592&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    name: "DOOMs Day",
    role: "CTO, DevFlow",
    content: "The code quality is surprisingly good. It's like having a senior developer on demand.",
    href: "https://images.unsplash.com/photo-1620336655055-088d06e36bf0?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    name: "HULK",
    role: "Product Manager, InnovateLab",
    content: "From idea to deployment in minutes. This is the future of software development.",
    href: "https://images.unsplash.com/photo-1606663889134-b1dedb5ed8b7?q=80&w=3072&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  }
];

const features = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Lightning Fast",
    description: "Generate full applications in minutes, not months"
  },
  {
    icon: <Code className="w-6 h-6" />,
    title: "Production Ready",
    description: "Clean, maintainable code that follows best practices"
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Any Framework",
    description: "React, Node.js, and more. We support what you need"
  }
];

export function HomePage() {
  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      navigate("/builder", { state: { prompt } });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-white text-black overflow-hidden">
      <Navbar />
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 pt-16 sm:pt-20">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-4 sm:left-10 w-2 h-2 bg-black rounded-full opacity-20"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-40 right-4 sm:right-20 w-3 h-3 bg-gray-400 rounded-full opacity-30"
          animate={{ y: [0, 30, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute bottom-40 left-4 sm:left-20 w-1 h-1 bg-black rounded-full opacity-40"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-black text-white rounded-full text-xs sm:text-sm font-medium"
          >
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
            AI-Powered Development Platform
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-6xl md:text-8xl font-bold leading-tight tracking-tight px-2"
          >
            Build apps with
            <br />
            <span className="relative">
              AI magic
              <motion.div
                className="absolute -bottom-1 sm:-bottom-2 left-0 right-0 h-0.5 sm:h-1 bg-black"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
              />
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4"
          >
            Transform your ideas into production-ready applications instantly. 
            No coding experience required.
          </motion.p>

          {/* CTA Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="max-w-2xl mx-auto mt-8 sm:mt-12 px-4"
          >
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your dream app or website..."
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:border-black focus:outline-none transition-all bg-white shadow-sm"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-black text-white rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-60 min-w-[140px] sm:min-w-auto"
              >
                {isSubmitting ? "Generating..." : "Build Now"}
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </form>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 mt-12 sm:mt-16 text-xs sm:text-sm text-gray-500 px-4"
          >
            <div className="flex items-center gap-2">
              <Users className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>10,000+ developers</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full" />
            <div className="flex items-center gap-2">
              <Code className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>50,000+ apps built</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full" />
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-black text-black" />
              ))}
              <span className="ml-1">4.9/5 rating</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16 lg:mb-20"
          >
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 px-4">
              Why developers love us
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Experience the fastest way to go from idea to production
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center group px-4"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-black text-white rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">{feature.title}</h3>
                <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-xs mx-auto">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16 lg:mb-20"
          >
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 px-4">
              Trusted by innovators
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 px-4">
              See what builders are saying about TrashAI
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white border border-gray-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:shadow-lg transition-shadow"
              >
                <div className="flex mb-3 sm:mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-black text-black" />
                  ))}
                </div>
                <p className="text-gray-800 text-base sm:text-lg mb-4 sm:mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3 sm:gap-4">
                  <img
                    src={testimonial.href}
                    alt={testimonial.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="font-semibold text-black text-sm sm:text-base truncate">{testimonial.name}</div>
                    <div className="text-gray-500 text-xs sm:text-sm truncate">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6 sm:space-y-8"
          >
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold px-4">
              Ready to build something amazing?
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto px-4">
              Join thousands of developers who are already building the future with AI
            </p>
            <div className="pt-4 sm:pt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="px-8 sm:px-12 py-3 sm:py-4 bg-white text-black rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg hover:bg-gray-100 transition-all shadow-lg"
              >
                Start Building Now
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 px-4 sm:px-6 bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center items-center gap-2 mb-3 sm:mb-4">
            <img src="/code-solid.svg" alt="TrashAI" className="w-5 h-5 sm:w-6 sm:h-6 opacity-60" />
            <span className="font-bold text-lg sm:text-xl">TrashAI</span>
          </div>
          <p className="text-gray-600 text-sm sm:text-base">
            Built with <span className="text-red-500">♥</span> by Fazal Singh
          </p>
        </div>
      </footer>

      {/* Loading Animation */}
      <AnimatePresence>
        {isSubmitting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
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
              className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center max-w-sm w-full"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4 sm:mb-6"></div>
              <div className="text-black text-lg sm:text-xl font-bold">
                Creating your app...
              </div>
              <div className="text-gray-600 mt-2 text-sm sm:text-base">
                This might take a moment
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}