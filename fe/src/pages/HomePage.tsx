import React from 'react';
import { ChevronRight, Sparkles } from 'lucide-react';
import { GeometricDesign } from '../components/GeometricDesign';
import { useNavigate } from 'react-router-dom';


export function HomePage() {
  const [prompt, setPrompt] = React.useState('');
  const navigate = useNavigate();

  const handleSubmit =  (e: React.FormEvent) => {
    e.preventDefault();
      navigate('/builder', { state: { prompt } });
  };

  return (
    
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center">
        <div className="max-w-7xl mx-auto w-full px-6 grid grid-cols-2 gap-12">
          <div className="space-y-8 py-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500/10 rounded-full text-sky-400 text-sm">
              <Sparkles className="w-4 h-4" />
              AI-Powered Website Builder
            </div> 

            <h1 className="text-6xl font-bold leading-tight">
              Create websites with
              <span className="bg-gradient-to-r from-sky-400 to-blue-500 text-transparent bg-clip-text"> artificial intelligence</span>
            </h1>

            <p className="text-gray-400 text-lg max-w-lg">
              Transform your ideas into fully functional websites in seconds using our advanced AI technology.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
              <div className="relative">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your dream website..."
                  className="w-full px-6 py-4 bg-sky-500/5 border border-sky-500/20 rounded-2xl focus:outline-none focus:border-sky-500/40 focus:bg-sky-500/10 transition-all duration-300 pr-12"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-sky-500 rounded-xl hover:bg-sky-600 transition-colors duration-300"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>

          <GeometricDesign />
        </div>
      </div>
    </div>
  );
}