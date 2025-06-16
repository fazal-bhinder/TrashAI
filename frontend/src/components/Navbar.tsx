import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Github, Linkedin, Twitter } from "lucide-react";

export function Navbar() {
  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl px-6 py-3 backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl shadow-sm">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-extrabold bg-gradient-to-r from-sky-400 to-blue-500 text-transparent bg-clip-text"
        >
          TrashAI
        </Link>

        {/* Social Icons */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-5 text-gray-400"
        >
          <a
            href="https://github.com/fazal-bhinder"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-sky-400 transition-colors"
          >
            <Github className="h-5 w-5" />
          </a>
          <a
            href="https://x.com/bhinder__fazal"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-sky-400 transition-colors"
          >
            <Twitter className="h-5 w-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/fazal-bhinder/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-sky-400 transition-colors"
          >
            <Linkedin className="h-5 w-5" />
          </a>
        </motion.div>
      </div>
    </nav>
  );
}
