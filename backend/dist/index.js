"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const prompts_1 = require("./prompts");
const react_1 = require("./defaults/react");
const node_1 = require("./defaults/node");
const app = (0, express_1.default)();
const apiKey = process.env["OPENROUTER_API_KEY"] || "";
const model = "deepseek/deepseek-r1-0528";
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Helper to make OpenRouter requests
function callOpenRouter(messages) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        const response = yield fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: model,
                messages: messages,
                max_tokens: 8000
            }),
        });
        if (!response.ok) {
            const errorBody = yield response.text();
            throw new Error(`OpenRouter API error: ${response.status} ${errorBody}`);
        }
        const data = yield response.json();
        return (_c = (_b = (_a = data.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.trim();
    });
}
// POST /template
app.post("/template", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prompt = req.body.prompt;
    try {
        const answer = yield callOpenRouter([
            {
                role: "system",
                content: "Only answer with one word: 'react' or 'node' based on the following project description. Do not return anything extra.",
            },
            { role: "user", content: prompt },
        ]);
        console.log("Answer from OpenRouter:", answer);
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
        res.status(403).json({ msg: "Unexpected response format" });
    }
    catch (error) {
        console.error("Error in /template:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
}));
// POST /chat
app.post("/chat", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const messages = req.body.messages;
    try {
        const answer = yield callOpenRouter([
            { role: "system", content: (0, prompts_1.getSystemPrompt)() },
            ...messages,
        ]);
        res.json({ response: answer });
    }
    catch (error) {
        console.error("Error in /chat:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
}));
// Start server
app.listen(3001, () => {
    console.log("Server running on port 3001");
});
