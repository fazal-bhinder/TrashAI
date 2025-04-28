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
const openai_1 = __importDefault(require("openai"));
require("dotenv/config");
const prompts_1 = require("./prompts");
const express_1 = __importDefault(require("express"));
const react_1 = require("./defaults/react");
const node_1 = require("./defaults/node");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const token = process.env["OPENAI_API_KEY"];
const endpoint = "https://models.inference.ai.azure.com";
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post("/template", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const prompt = req.body.prompt;
    const client = new openai_1.default({
        baseURL: endpoint,
        apiKey: token
    });
    const response = yield client.chat.completions.create({
        messages: [
            { role: "system", content: "Only answer with one word: 'react' or 'node' based on the following project description.Do not return anything extra" },
            { role: "user", content: prompt },
        ],
        model: "gpt-4.1-mini",
        temperature: 1,
        max_tokens: 100,
        top_p: 1,
    });
    const answer = (_c = (_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.trim();
    if (answer === "react") {
        res.json({
            prompts: [prompts_1.BASE_PROMPT, `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${react_1.reactbasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
            uiPrompts: [react_1.reactbasePrompt]
        });
        return;
    }
    if (answer === "node") {
        res.json({
            prompts: [`Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${node_1.nodebasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
            uiPrompts: [node_1.nodebasePrompt]
        });
        return;
    }
    res.status(403).json({
        msg: "Error in the server"
    });
    return;
}));
// chat route
app.post("/chat", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const messages = req.body.messages;
    const client = new openai_1.default({
        baseURL: endpoint,
        apiKey: token
    });
    try {
        const response = yield client.chat.completions.create({
            messages: [
                { role: "system", content: (0, prompts_1.getSystemPrompt)() },
                ...messages,
            ],
            model: "gpt-4.1-mini",
            temperature: 0.8,
            max_tokens: 2048,
            top_p: 0.1
        });
        const answer = (_c = (_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.trim();
        res.json({
            response: answer,
        });
        return;
    }
    catch (error) {
        console.error("Error in /chat:", error);
        res.status(500).json({
            msg: "Internal Server Error"
        });
        return;
    }
}));
// Start server
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
