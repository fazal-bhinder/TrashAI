import { Files, File as FileIcon, Folder as FolderIcon, ChevronRight, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { FileItem } from '../types';
import { motion } from 'framer-motion';

interface FileExplorerProps {
  files: FileItem[];
  onFileSelect: (file: FileItem | null) => void;
}

interface FileNodeProps {
  item: FileItem;
  depth: number;
  onFileClick: (file: FileItem) => void;
  index: number;
}

function FileNode({ item, depth, onFileClick, index }: FileNodeProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    if (item.type === 'folder') {
      setIsExpanded((prev) => !prev);
    } else {
      onFileClick(item);
    }
  };

  const getFileIcon = () => {
    if (item.type === 'folder') {
      return (
        <div className="flex items-center gap-1">
          {isExpanded ? (
            <ChevronDown className="w-3 h-3 text-gray-400" />
          ) : (
            <ChevronRight className="w-3 h-3 text-gray-400" />
          )}
          <FolderIcon className="w-4 h-4 text-blue-500" />
        </div>
      );
    }
    return <FileIcon className="w-4 h-4 text-gray-600" />;
  };

  return (
    <div style={{ paddingLeft: `${depth * 1.5}rem` }} className="flex-shrink-0">
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, delay: index * 0.05 }}
        onClick={handleClick}
        className="flex items-center gap-2 p-2 text-sm cursor-pointer hover:bg-gray-50 rounded-lg transition-colors group"
      >
        {getFileIcon()}
        <span className="flex-1 text-black group-hover:text-black transition-colors">
          {item.name}
        </span>
      </motion.div>

      {item.type === 'folder' && isExpanded && item.children && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          {item.children.map((child, childIndex) => (
            <FileNode
              key={`${child.path}-${childIndex}`}
              item={child}
              depth={depth + 1}
              onFileClick={onFileClick}
              index={childIndex}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}

export function FileExplorer({ files, onFileSelect }: FileExplorerProps) {
  const totalFiles = files.reduce((count, file) => {
    if (file.type === 'file') return count + 1;
    if (file.children) {
      return count + file.children.filter(child => child.type === 'file').length;
    }
    return count;
  }, 0);

  return (
    <div className="h-full flex flex-col max-h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-black rounded-xl">
            <Files className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-black text-lg">File Explorer</h2>
            <p className="text-gray-500 text-sm">
              {totalFiles} files generated
            </p>
          </div>
        </div>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-6">
          <div className="space-y-1">
            {files.length > 0 ? (
              files.map((file, index) => (
                <FileNode
                  key={`${file.path}-${index}`}
                  item={file}
                  depth={0}
                  onFileClick={onFileSelect}
                  index={index}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <Files className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-sm">
                  Files will appear here as they're generated
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

