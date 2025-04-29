import { useEffect, useState } from "react";
import { WebContainer } from '@webcontainer/api';
import Editor from '@monaco-editor/react';
import { FileItem } from '../types';
import { Eye, Code2 } from 'lucide-react'; 

interface CodeEditorProps {
  files: FileItem[];
  webContainer: WebContainer | undefined;  // Correctly typed WebContainer
}

export function CodeEditor({ files, webContainer }: CodeEditorProps) {
  const [mode, setMode] = useState<'code' | 'preview'>('code');
  const [url, setUrl] = useState<string>("");

  async function startServer() {
    if (!webContainer) {
      console.error('WebContainer not ready');
      return;
    }

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
        console.log(port);
      });

    } catch (error) {
      console.error('Failed to start server:', error);
    }
  }

  useEffect(() => {
    if (mode === 'preview' && webContainer && !url) {
      startServer();
    }
  }, [mode, webContainer, url]);

  if (!files.length) {
    return (
      <div className="h-full w-full bg-zinc-900 rounded-xl border border-sky-500/20 p-4 flex items-center justify-center text-gray-400">
        Code will be displayed here.
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-zinc-900 rounded-xl border border-sky-500/20 p-4 flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setMode('code')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${mode === 'code' ? 'border-sky-500 bg-sky-500/10' : 'border-sky-500/20'} text-gray-100 text-sm hover:bg-sky-500/10 transition`}
        >
          <Code2 className="w-5 h-5 text-sky-400" />
          <span>Code</span>
        </button>

        <button
          onClick={() => setMode('preview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${mode === 'preview' ? 'border-sky-500 bg-sky-500/10' : 'border-sky-500/20'} text-gray-100 text-sm hover:bg-sky-500/10 transition`}
        >
          <Eye className="w-5 h-5 text-sky-400" />
          <span>Preview</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1">
        {mode === 'code' ? (
          <Editor
            height="100%"
            defaultLanguage="typescript"
            theme="vs-dark"
            value={files[0]?.content || ''}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: 'on',
              scrollBeyondLastLine: false,
            }}
          />
        ) : (
          <Preview url={url} />
        )}
      </div>
    </div>
  );
}

interface PreviewProps {
  url: string;
}

export function Preview({ url }: PreviewProps) {
  return (
    <div className="h-full w-full bg-zinc-900 rounded-xl border border-sky-500/20 p-4 flex flex-col">
      <div className="flex-1 overflow-hidden rounded-xl">
        {url ? (
          <iframe
            src={url}
            className="h-full w-full rounded-xl border-0"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-400 text-sm">
            Starting the server...
          </div>
        )}
      </div>
    </div>
  );
}

