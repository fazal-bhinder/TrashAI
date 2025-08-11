import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Github, Linkedin, Twitter } from "lucide-react";
import { useState, useEffect } from "react";

export function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        // Scrolling up or at the top
        setIsVisible(true);
      } else {
        // Scrolling down
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <motion.nav 
      animate={{ 
        y: isVisible ? 0 : -100,
        opacity: isVisible ? 1 : 0
      }}
      transition={{ 
        duration: 0.3, 
        ease: "easeInOut" 
      }}
      className="fixed top-4 left-1/4 -translate-x-1/2 z-50 w-full max-w-2xl px-6 py-3 backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl shadow-sm"
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-extrabold text-black"
        >
          TrashAI
        </Link>

        {/* Social Icons */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-5 text-black"
        >
          <a
            href="https://github.com/fazal-bhinder"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-600 transition-colors"
          >
            <Github className="h-5 w-5" />
          </a>
          <a
            href="https://x.com/damnfazal"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-600 transition-colors"
          >
            <Twitter className="h-5 w-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/fazal-bhinder/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-600 transition-colors"
          >
            <Linkedin className="h-5 w-5" />
          </a>
        </motion.div>
      </div>
    </motion.nav>
  );
}
