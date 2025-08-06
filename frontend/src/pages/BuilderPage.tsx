import { ChatInterface } from '../components/ChatInterface';
import { CodeEditor } from '../components/CodeEditor';
import { useLocation } from 'react-router-dom';
import { BACKEND_URL } from '../config';
import axios from 'axios';
import { useEffect, useState, useCallback } from 'react';
import { parseXml } from '../steps';
import { FileItem, Step, StepType } from '../types'; 
import { FileExplorer } from '../components/FileExplorer';
import { useWebContainer } from '../hooks/useWebContainer';
import { motion } from 'framer-motion';

// Extend Window interface for addAssistantMessage
declare global {
  interface Window {
    addAssistantMessage?: (content: string) => void;
  }
}

export function BuilderPage() {
  const location = useLocation();
  const { prompt: initialPrompt } = location.state || { prompt: '' };
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const webcontainer = useWebContainer();
   
  const [files, setFiles] = useState<FileItem[]>([]);
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Add back the steps state that was removed
  const [steps, setSteps] = useState<Step[]>([]);

  // Auto-complete steps after files are processed (restored from old StepsList logic)
  useEffect(() => {
    // Find any pending steps that have had their files created
    const pendingSteps = steps.filter(step => step.status === 'pending');
    
    if (pendingSteps.length > 0) {
      // Update steps state to mark them as completed
      setSteps(prevSteps => 
        prevSteps.map(step => 
          pendingSteps.find(p => p.id === step.id) 
            ? { ...step, status: 'completed' as const }
            : step
        )
      );
    }
  }, [files, steps]); // Trigger when files change

  // Process steps and update files
  const processStepsAndUpdateFiles = useCallback((newSteps: Step[]) => {
    if (newSteps.length === 0) return;
    
    // Store the steps first (like the old system did)
    setSteps(prevSteps => [...prevSteps, ...newSteps]);
    
    // Use the existing files as the base instead of creating a deep copy
    setFiles(currentFiles => {
      // Create a working copy of current files
      const updatedFiles = JSON.parse(JSON.stringify(currentFiles)) as FileItem[];
      let updateHappened = false;
      
      newSteps.filter(({status}) => status === "pending").forEach((step) => {
        if (step?.type === StepType.CreateFile) {
          updateHappened = true;
          
          // Clean the path and split it
          const cleanPath = step.path?.replace(/^\/+/, '') || ''; // Remove leading slashes
          const parsedPath = cleanPath.split("/").filter(p => p.length > 0); // Remove empty parts
          
          if (parsedPath.length === 0) {
            return;
          }
          
          // Helper function to find or create nested structure
          const findOrCreatePath = (fileStructure: FileItem[], pathParts: string[], currentPath: string = ''): FileItem[] => {
            if (pathParts.length === 0) return fileStructure;
            
            const [currentPart, ...remainingParts] = pathParts;
            const newCurrentPath = currentPath ? `${currentPath}/${currentPart}` : currentPart;
            
            if (remainingParts.length === 0) {
              // This is the final file
              const existingFileIndex = fileStructure.findIndex(item => 
                item.name === currentPart && item.type === 'file'
              );
              
              const fileItem: FileItem = {
                name: currentPart,
                type: 'file',
                path: newCurrentPath,
                content: step.code || ''
              };
              
              if (existingFileIndex >= 0) {
                // Update existing file
                fileStructure[existingFileIndex] = fileItem;
              } else {
                // Add new file
                fileStructure.push(fileItem);
              }
              
              return fileStructure;
            } else {
              // This is a folder
              let folderIndex = fileStructure.findIndex(item => 
                item.name === currentPart && item.type === 'folder'
              );
              
              if (folderIndex === -1) {
                // Create new folder
                const newFolder: FileItem = {
                  name: currentPart,
                  type: 'folder',
                  path: newCurrentPath,
                  children: []
                };
                fileStructure.push(newFolder);
                folderIndex = fileStructure.length - 1;
              }
              
              // Ensure children array exists
              if (!fileStructure[folderIndex].children) {
                fileStructure[folderIndex].children = [];
              }
              
              // Recursively process remaining path
              findOrCreatePath(fileStructure[folderIndex].children!, remainingParts, newCurrentPath);
              return fileStructure;
            }
          };
          
          findOrCreatePath(updatedFiles, parsedPath);
        }
      });
      
      // Only return updated files if something changed, otherwise return current files
      return updateHappened ? updatedFiles : currentFiles;
    });
  }, []);

  // Auto-process pending steps (like the old StepsList behavior)
  useEffect(() => {
    // This effect simulates the old automatic step completion
    if (files.length > 0) {
      // Files have been updated
    }
  }, [files]);

  // Mount files to WebContainer
  useEffect(() => {
    if (!webcontainer || files.length === 0) return;

    type MountFile = {
      file: {
        contents: string;
      };
    };

    type MountDirectory = {
      directory: {
        [key: string]: MountFile | MountDirectory;
      };
    };

    type MountStructure = {
      [key: string]: MountFile | MountDirectory;
    };

    const createMountStructure = (files: FileItem[]): MountStructure => {
      const mountStructure: MountStructure = {};
      
      const processFile = (file: FileItem, isRootFolder: boolean): MountFile | MountDirectory => {  
        if (file.type === 'folder') {
          const dir: MountDirectory = {
            directory: file.children ? 
              Object.fromEntries(
                file.children.map(child => [child.name, processFile(child, false)])
              ) 
              : {}
          };
          if (isRootFolder) {
            mountStructure[file.name] = dir;
          }
          return dir;
        } else if (file.type === 'file') {
          const fileObj: MountFile = {
            file: {
              contents: file.content || ''
            }
          };
          if (isRootFolder) {
            mountStructure[file.name] = fileObj;
          }
          return fileObj;
        }
        return {} as MountFile;
      };
  
      files.forEach(file => processFile(file, true));
      return mountStructure;
    };
  
    const mountStructure = createMountStructure(files);
    webcontainer.mount(mountStructure);
  }, [files, webcontainer]);

  // Handle new messages from chat interface
  const handleNewMessage = useCallback(async (message: string) => {
    setIsProcessing(true);
    
    try {
      const updatedHistory = [...conversationHistory, message];
      setConversationHistory(updatedHistory);

      // Determine if this is the first message or a follow-up
      const isFirstMessage = conversationHistory.length === 0;
      
      let response;
      let conversationalMessage;
      
      if (isFirstMessage) {
        // Initial project setup
        const templateResponse = await axios.post(`${BACKEND_URL}/template`, {
          prompt: message.trim()
        });
        
        const { prompts, uiPrompts } = templateResponse.data;
        
        // Parse and collect all initial steps
        let allInitialSteps: Step[] = [];
        
        // Parse UI prompts first to get initial file structure
        if (uiPrompts && uiPrompts.length > 0) {
          const initialSteps = parseXml(uiPrompts[0]).map((step: Step) => ({
            ...step,
            status: 'pending' as const,
          }));
          allInitialSteps = [...allInitialSteps, ...initialSteps];
        }
        
        // Get additional steps from chat response
        const chatResponse = await axios.post(`${BACKEND_URL}/chat`, {
          messages: [...prompts, message].map(content => ({
            role: "user",
            content
          }))
        });
        
        response = chatResponse.data.response;
        
        // Parse and collect chat response steps too
        try {
          const chatSteps = parseXml(response);
          if (chatSteps.length > 0) {
            const pendingChatSteps = chatSteps.map((step: Step) => ({
              ...step,
              status: 'pending' as const,
            }));
            allInitialSteps = [...allInitialSteps, ...pendingChatSteps];
          }
        } catch (error) {
          console.error('Error parsing chat response steps:', error);
        }
        
        // Process all initial steps at once
        if (allInitialSteps.length > 0) {
          processStepsAndUpdateFiles(allInitialSteps);
        }
        
        // For initial setup, create a conversational message
        conversationalMessage = `Great! I'm setting up your project. Let me analyze your requirements and create the initial structure. I'll be generating the necessary files and components to get you started.`;
        
        // Add conversational message to chat immediately for initial setup
        if (window.addAssistantMessage) {
          window.addAssistantMessage(conversationalMessage);
        }
        
        return; // Exit early since we've processed everything
      } else {
        // Follow-up conversation - send simplified file context
        const simplifiedFiles = files.map(file => ({
          name: file.name,
          type: file.type,
          path: file.path,
          children: file.children ? file.children.map(child => ({
            name: child.name,
            type: child.type,
            path: child.path,
            children: child.children ? child.children.map(grandchild => ({
              name: grandchild.name,
              type: grandchild.type,
              path: grandchild.path
            })) : undefined
          })) : undefined
        }));

        const conversationResponse = await axios.post(`${BACKEND_URL}/chat-conversation`, {
          messages: updatedHistory.map(content => ({
            role: "user",
            content
          })),
          currentFiles: simplifiedFiles // Send only structure, not content
        });
        
        response = conversationResponse.data.response;
        conversationalMessage = conversationResponse.data.conversationalMessage;
      }

      // Parse technical response and extract steps if any
      try {
        const steps = parseXml(response);
        
        if (steps.length > 0) {
          const pendingSteps = steps.map((step: Step) => ({
            ...step,
            status: 'pending' as const,
          }));
          processStepsAndUpdateFiles(pendingSteps);
        }
      } catch (error) {
        console.error('Error parsing steps:', error);
      }

      // Add conversational message to chat (no code included)
      if (window.addAssistantMessage) {
        window.addAssistantMessage(conversationalMessage || "I've processed your request and updated the files accordingly.");
      }

    } catch (error) {
      console.error('Error processing message:', error);
      
      // Add error message to chat
      if (window.addAssistantMessage) {
        window.addAssistantMessage(
          "I apologize, but I encountered an error processing your request. Please try again or rephrase your message."
        );
      }
    } finally {
      setIsProcessing(false);
    }
  }, [conversationHistory, files, processStepsAndUpdateFiles]);

  // Initialize conversation with initial prompt
  useEffect(() => {
    if (initialPrompt && conversationHistory.length === 0) {
      handleNewMessage(initialPrompt);
    }
  }, [initialPrompt, conversationHistory.length, handleNewMessage]);

  return (
    <div className="h-screen bg-gray-50 p-6 overflow-hidden">
      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-3rem)] max-w-7xl mx-auto min-h-0">
        {/* Chat Interface Panel */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="col-span-12 lg:col-span-4 min-h-0"
        >
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm h-full min-h-0">
            <ChatInterface
              onNewMessage={handleNewMessage}
              isLoading={isProcessing}
            />
          </div>
        </motion.div>

        {/* File Explorer Panel */}
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="col-span-12 lg:col-span-3 min-h-0"
        >
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm h-full min-h-0">
            <FileExplorer 
              files={files} 
              onFileSelect={setSelectedFile}
            />
          </div>
        </motion.div>

        {/* Code Editor Panel */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="col-span-12 lg:col-span-5 min-h-0"
        >
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm h-full min-h-0">
            <CodeEditor 
              files={selectedFile ? [selectedFile] : []} 
              webContainer={webcontainer} 
              allFiles={files} 
            />
          </div>
        </motion.div>
      </div>
    </div>
  );  
}