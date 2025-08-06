import { useEffect, useState } from "react";
import { WebContainer } from '@webcontainer/api';
import Editor from '@monaco-editor/react';
import { FileItem } from '../types';
import { Eye, Code2, Play, Loader, Download } from 'lucide-react'; 
import { motion } from 'framer-motion';

interface CodeEditorProps {
  files: FileItem[];
  webContainer: WebContainer | undefined;
  allFiles?: FileItem[];
}

export function CodeEditor({ files, webContainer, allFiles = [] }: CodeEditorProps) {
  const [mode, setMode] = useState<'code' | 'preview'>('code');
  const [url, setUrl] = useState<string>("");
  const [isServerStarting, setIsServerStarting] = useState(false);

  const downloadAllFiles = () => {
    // Create a text file with all code content
    let content = "Generated Project Files\n";
    content += `Generated on: ${new Date().toLocaleString()}\n`;
    content += "=".repeat(50) + "\n\n";

    // Recursive function to process all files
    const processFiles = (fileItems: FileItem[], prefix: string = '') => {
      fileItems.forEach(file => {
        if (file.type === 'file' && file.content) {
          const filePath = prefix + file.name;
          content += `\n=== ${filePath} ===\n`;
          content += file.content;
          content += "\n\n" + "-".repeat(30) + "\n";
        } else if (file.type === 'folder' && file.children) {
          processFiles(file.children, prefix + file.name + '/');
        }
      });
    };

    processFiles(allFiles);

    // Create and download the file
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'project-files.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  async function startServer() {
    if (!webContainer) {
      console.error('WebContainer not ready');
      return;
    }

    setIsServerStarting(true);

    try {
      // Install dependencies
      const installProcess = await webContainer.spawn('npm', ['install']);
      installProcess.output.pipeTo(new WritableStream({
        write(data) {
          console.log('Install output:', data);
        }
      }));

      await installProcess.exit;

      // Run dev server
      const runProcess = await webContainer.spawn('npm', ['run', 'dev']);
      runProcess.output.pipeTo(new WritableStream({
        write(data) {
          console.log('Dev server output:', data);
        }
      }));

      // Listen for server ready event
      webContainer.on('server-ready', (port, url) => {
        console.log('Server ready at:', url);
        setUrl(url);
        setIsServerStarting(false);
        console.log(port);
      });

    } catch (error) {
      console.error('Failed to start server:', error);
      setIsServerStarting(false);
    }
  }

  useEffect(() => {
    if (mode === 'preview' && webContainer && !url && !isServerStarting) {
      startServer();
    }
  }, [mode, webContainer, url, isServerStarting]);

  if (!files.length) {
    return (
      <div className="h-full w-full flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-black rounded-xl">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-black text-lg">Code Editor</h2>
              <p className="text-gray-500 text-sm">Select a file to view code</p>
            </div>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Code2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No file selected</h3>
            <p className="text-gray-500 text-sm">
              Choose a file from the explorer to view its code
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-black rounded-xl">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-black text-lg">{files[0]?.name}</h2>
              <p className="text-gray-500 text-sm">
                {mode === 'code' ? 'Viewing source code' : 'Live preview'}
              </p>
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
            <motion.button
              onClick={() => setMode('code')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === 'code' 
                  ? 'bg-white text-black shadow-sm' 
                  : 'text-gray-600 hover:text-black'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Code2 className="w-4 h-4" />
              Code
            </motion.button>

            <motion.button
              onClick={() => setMode('preview')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === 'preview' 
                  ? 'bg-white text-black shadow-sm' 
                  : 'text-gray-600 hover:text-black'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Eye className="w-4 h-4" />
              Preview
            </motion.button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {mode === 'code' ? (
          <div className="h-full border border-gray-200 bg-white">
            <Editor
              height="100%"
              defaultLanguage="typescript"
              theme="light"
              value={files[0]?.content || ''}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                scrollBeyondLastLine: false,
                padding: { top: 20, bottom: 20 },
                lineNumbers: 'on',
                renderLineHighlight: 'none',
                scrollbar: {
                  vertical: 'auto',
                  horizontal: 'auto',
                },
              }}
            />
          </div>
        ) : (
          <Preview url={url} isLoading={isServerStarting} onDownload={downloadAllFiles} />
        )}
      </div>
    </div>
  );
}

interface PreviewProps {
  url: string;
  isLoading: boolean;
  onDownload: () => void;
}

export function Preview({ url, isLoading, onDownload }: PreviewProps) {
  return (
    <div className="h-full w-full flex flex-col bg-white border border-gray-200">
      {/* Preview Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
        </div>
        <div className="flex-1 mx-4">
          <div className="bg-white border border-gray-200 rounded-lg px-3 py-1 text-sm text-gray-600 text-center">
            {url || 'localhost:3000'}
          </div>
        </div>
        <motion.button
          onClick={onDownload}
          className="flex items-center gap-2 px-3 py-1 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Download className="w-4 h-4" />
          <span className="text-sm">Download</span>
        </motion.button>
      </div>

      {/* Preview Content */}
      <div className="flex-1 relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white">
            <div className="text-center">
              <Loader className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-3" />
              <p className="text-gray-600 text-sm">Starting development server...</p>
              <p className="text-gray-400 text-xs mt-1">This may take a moment</p>
            </div>
          </div>
        ) : url ? (
          <iframe
            src={url}
            className="w-full h-full border-0"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-white">
            <div className="text-center">
              <Play className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-sm">Preparing preview...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

