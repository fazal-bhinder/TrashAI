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
    try {
        const answer = await callGemini([
            { role: "system", content: (0, prompts_1.getSystemPrompt)() },
            ...messages,
        ]);
        res.json({ response: answer });
    }
    catch (error) {
        console.error("Error in /chat:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});
// Start server
app.listen(port, () => {
    console.log("Server running on port", port);
});
