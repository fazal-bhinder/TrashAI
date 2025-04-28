import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <nav className="p-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-semibold">TrashAI</Link>
        <div className="flex gap-6 text-gray-400">
          <Link to="/" className="hover:text-white transition-colors">Export</Link>
          <Link to="/" className="hover:text-white transition-colors">Deploy</Link>
          <Link to="/" className="hover:text-white transition-colors">About</Link>
        </div>
      </div>
    </nav>
  );
}