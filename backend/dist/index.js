"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const generative_ai_1 = require("@google/generative-ai");
const prompts_1 = require("./prompts");
const react_1 = require("./defaults/react");
const node_1 = require("./defaults/node");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Google GenAI client setup
const apiKey = process.env["GEMINI_API_KEY"] || "";
const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
app.use((0, cors_1.default)());
app.use(express_1.default.json());
async function callGemini(messages) {
    // Combine messages into a single string
    const content = messages.map(m => `${m.role === "user" ? "User" : "System"}: ${m.content}`).join("\n");
    const result = await model.generateContent(content);
    const response = await result.response;
    const text = response.text();
    return text.trim();
}
// POST /template
app.post("/template", async (req, res) => {
    const prompt = req.body.prompt;
    try {
        const answer = await callGemini([
            {
                role: "system",
                content: "Only answer with one word: 'react' or 'node' based on the following project description. Do not return anything extra.",
            },
            { role: "user", content: prompt },
        ]);
        console.log("Answer from Gemini:", answer);
        if (answer === "react") {
            res.json({
                prompts: [
                    prompts_1.BASE_PROMPT,
                    `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${react_1.reactbasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
                ],
                uiPrompts: [react_1.reactbasePrompt],
            });
            return;
        }
        if (answer === "node") {
            res.json({
                prompts: [
                    `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${node_1.nodebasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
                ],
                uiPrompts: [node_1.nodebasePrompt],
            });
            return;
        }
        res.status(403).json({ msg: "Unexpected response format: " + answer });
    }
    catch (error) {
        console.error("Error in /template:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});
// POST /chat
app.post("/chat", async (req, res) => {
    const messages = req.body.messages;
    const isFollowUp = req.body.isFollowUp || false;
    try {
        let systemPrompt = (0, prompts_1.getSystemPrompt)(); // Always use the full system prompt
        if (isFollowUp) {
            systemPrompt += "\n\nIMPORTANT: This is a follow-up request to modify or improve the existing project. " +
                "The user wants to make changes to the current codebase. Please:\n" +
                "1. Analyze the current state of the project\n" +
                "2. Understand what the user wants to change/improve\n" +
                "3. Generate the necessary steps to implement these changes\n" +
                "4. Update existing files or create new ones as needed\n" +
                "5. Maintain the existing project structure where possible\n\n" +
                "Generate steps that build upon the existing codebase rather than starting from scratch.";
        }
        const answer = await callGemini([
            { role: "system", content: systemPrompt },
            ...messages,
        ]);
        res.json({ response: answer });
    }
    catch (error) {
        console.error("Error in /chat:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});
// POST /chat-conversation - New conversational endpoint
app.post("/chat-conversation", async (req, res) => {
    const messages = req.body.messages;
    const currentFiles = req.body.currentFiles || [];
    try {
        let fileContext = "";
        if (currentFiles.length > 0) {
            fileContext = "\n\nEXISTING FILES:\n";
            const listFiles = (files, prefix = "") => {
                files.forEach(file => {
                    if (file.type === 'file') {
                        fileContext += `${prefix}📄 ${file.name}\n`;
                    }
                    else if (file.type === 'folder' && file.children) {
                        fileContext += `${prefix}📁 ${file.name}/\n`;
                        listFiles(file.children, prefix + "  ");
                    }
                });
            };
            listFiles(currentFiles);
        }
        // Use the full system prompt for consistency
        const fullSystemPrompt = (0, prompts_1.getSystemPrompt)() + `

CRITICAL: This is a follow-up conversation. The user wants to modify the existing project.

User request: "${messages[messages.length - 1].content}"
${fileContext}

YOU MUST FOLLOW THIS EXACT FORMAT:

1. Start with a brief conversational response (1-2 sentences)
2. THEN provide complete code using the <boltArtifact> format

MANDATORY FORMAT:
Brief explanation here.

<boltArtifact id="unique-id" title="Descriptive Title">
<boltAction type="file" filePath="path/to/file.ext">
COMPLETE file content here - never use placeholders
</boltAction>
</boltArtifact>

CRITICAL RULES:
- ALWAYS use <boltArtifact> wrapper for ANY code changes
- ALWAYS provide COMPLETE file contents, never truncate
- Use relative file paths (no leading slashes)
- Include ALL imports, exports, and functionality
- Make the code production-ready and fully functional

EXAMPLE RESPONSE:
I'm adding a delete button to each todo item with confirmation.

<boltArtifact id="todo-delete" title="Add Delete Functionality">
<boltAction type="file" filePath="src/components/TodoItem.tsx">
import React, { useState } from 'react';

interface TodoItemProps {
  id: string;
  text: string;
  completed: boolean;
  onToggle: () => void;
  onDelete: () => void;
}

export function TodoItem({ id, text, completed, onToggle, onDelete }: TodoItemProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    if (showConfirm) {
      onDelete();
    } else {
      setShowConfirm(true);
    }
  };

  return (
    <div className="flex items-center gap-3 p-3 border rounded">
      <input
        type="checkbox"
        checked={completed}
        onChange={onToggle}
      />
      <span className={completed ? 'line-through' : ''}>{text}</span>
      <button
        onClick={handleDelete}
        className={showConfirm ? 'bg-red-500 text-white' : 'bg-gray-200'}
      >
        {showConfirm ? 'Confirm Delete' : 'Delete'}
      </button>
      {showConfirm && (
        <button onClick={() => setShowConfirm(false)}>Cancel</button>
      )}
    </div>
  );
}
</boltAction>
</boltArtifact>`;
        const response = await callGemini([
            { role: "system", content: fullSystemPrompt },
            { role: "user", content: messages[messages.length - 1].content }
        ]);
        // Parse the response to separate conversational and technical parts
        const artifactMatch = response.match(/<boltArtifact[\s\S]*<\/boltArtifact>/);
        let conversationalMessage = response;
        let technicalResponse = response; // Default to full response
        if (artifactMatch) {
            // Split the response
            conversationalMessage = response.replace(/<boltArtifact[\s\S]*<\/boltArtifact>/, '').trim();
            technicalResponse = response; // Keep the full response for technical processing
        }
        else {
            // If no artifact found, try to force one by re-prompting
            console.log('❌ No artifact found, forcing proper format...');
            const forcePrompt = `The user requested: "${messages[messages.length - 1].content}"

You MUST respond with this EXACT format:

Brief explanation.

<boltArtifact id="change-id" title="Change Title">
<boltAction type="file" filePath="src/components/ComponentName.tsx">
// Complete file content here
</boltAction>
</boltArtifact>

Generate the complete code files needed for this request.`;
            const forcedResponse = await callGemini([
                { role: "system", content: forcePrompt },
                { role: "user", content: messages[messages.length - 1].content }
            ]);
            technicalResponse = forcedResponse;
            conversationalMessage = "I've implemented your requested changes.";
        }
        // If no conversational part, create a simple one
        if (!conversationalMessage || conversationalMessage.length < 10) {
            conversationalMessage = "I've updated your project with the requested changes!";
        }
        res.json({
            response: technicalResponse,
            conversationalMessage: conversationalMessage
        });
    }
    catch (error) {
        console.error("Error in /chat-conversation:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});
// Start server
app.listen(port, () => {
    console.log("Server running on port", port);
});
