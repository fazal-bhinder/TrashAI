export function Footer() {
  return (
    <footer className="mt-16 py-8 border-t border-white/10 text-center text-sm text-gray-500 space-y-2">
      <div className="flex justify-center gap-4 text-gray-400">
        <a href="#features" className="hover:text-sky-400 transition">Features</a>
        <a href="#testimonials" className="hover:text-sky-400 transition">Testimonials</a>
        <a href="https://github.com/fazalsingh" target="_blank" className="hover:text-sky-400 transition">GitHub</a>
      </div>
      <div className="text-gray-600 text-xs">
        ⚡️ Built with <span className="text-pink-400">AI magic ✨</span> by Fazal Singh.
      </div>
    </footer>
  );
}
