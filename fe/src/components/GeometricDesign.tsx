import { Box, Settings2, Code2, Play } from 'lucide-react';

export function GeometricDesign() {
  return (
    <div className="relative">
      <div className="absolute inset-0 grid grid-cols-2 gap-8 p-8">
        <div className="border border-sky-500/20 rounded-3xl bg-sky-500/5 backdrop-blur-sm p-6 flex items-center justify-center">
          <Box className="w-12 h-12 text-sky-400" />
        </div>
        <div className="border border-sky-500/20 rounded-3xl bg-sky-500/5 backdrop-blur-sm p-6 flex items-center justify-center">
          <Settings2 className="w-12 h-12 text-sky-400" />
        </div>
        <div className="border border-sky-500/20 rounded-3xl bg-sky-500/5 backdrop-blur-sm p-6 flex items-center justify-center">
          <Code2 className="w-12 h-12 text-sky-400" />
        </div>
        <div className="border border-sky-500/20 rounded-3xl bg-sky-500/5 backdrop-blur-sm p-6 flex items-center justify-center">
          <Play className="w-12 h-12 text-sky-400" />
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-sky-500/20 to-transparent rounded-full blur-3xl"></div>
    </div>
  );
}