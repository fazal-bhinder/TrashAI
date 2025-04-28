import { Files, File as FileIcon, Folder as FolderIcon } from 'lucide-react';
import { useState } from 'react';
import { FileItem } from '../types';

interface FileExplorerProps {
  files: FileItem[];
  onFileSelect: (file: FileItem | null) => void;
}

interface FileNodeProps {
  item: FileItem;
  depth: number;
  onFileClick: (file: FileItem) => void;
}

function FileNode({ item, depth, onFileClick }: FileNodeProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    if (item.type === 'folder') {
      setIsExpanded((prev) => !prev);
    } else {
      onFileClick(item);
    }
  };

  return (
    <div style={{ paddingLeft: `${depth * 1.25}rem` }}>
      <div
        onClick={handleClick}
        className="flex items-center gap-2 p-2 text-gray-400 text-sm cursor-pointer hover:text-sky-400"
      >
        {item.type === 'folder' ? (
          <FolderIcon className="w-4 h-4 text-sky-400" />
        ) : (
          <FileIcon className="w-4 h-4 text-sky-400" />
        )}
        <span>{item.name}</span>
      </div>

      {item.type === 'folder' && isExpanded && item.children && (
        <div>
          {item.children.map((child, index) => (
            <FileNode
              key={`${child.path}-${index}`}
              item={child}
              depth={depth + 1}
              onFileClick={onFileClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileExplorer({ files, onFileSelect }: FileExplorerProps) {
  return (
    <div className="w-64 h-full bg-zinc-900 flex flex-col border-r border-zinc-900">
      <div className="flex items-center gap-2 p-4">
        <Files className="w-5 h-5 text-sky-400" />
        <h2 className="font-semibold text-gray-100 text-base">File Explorer</h2>
      </div>

      {/* Scrollable section */}
      <div className="flex-1 overflow-y-scroll pr-2">
        {files.map((file, index) => (
          <FileNode
            key={`${file.path}-${index}`}
            item={file}
            depth={0}
            onFileClick={onFileSelect}
          />
        ))}
      </div>
    </div>
  );
}
