# TrashAI

[Live Demo](https://trashai.vercel.app)

AI-powered app and website builder that turns your ideas into functional, live projects with the help of generative AI.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Frontend](#frontend)
  - [Features](#frontend-features)
  - [Setup & Usage](#frontend-setup--usage)
  - [Dependencies](#frontend-dependencies)
- [Backend](#backend)
  - [Features](#backend-features)
  - [Setup & Usage](#backend-setup--usage)
  - [Dependencies](#backend-dependencies)
  - [Environment Variables](#backend-environment-variables)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**TrashAI** is a full-stack application that allows users to describe an app or website they want to build. Using generative AI, TrashAI generates a step-by-step plan, file structure, and code, and provides a live, interactive builder experience in the browser.

---

## Features

- AI-powered project builder: Describe your idea, and TrashAI generates a working project.
- Step-by-step project plan and file explorer.
- Live code editing and preview in the browser (WebContainer-based runtime).
- Supports both React (frontend) and Node.js (backend) project generation.
- Modern, responsive UI with Tailwind CSS and Framer Motion.

---

## Project Structure

```
TrashAI/
  backend/    # Express.js backend with AI integration
  frontend/   # React + Vite frontend (user interface)
```

---

## Frontend

### Frontend Features

- Landing page to describe your app/website idea.
- AI-powered builder page with:
  - Step-by-step project plan
  - File explorer and code editor
  - Live preview (via WebContainer)
- Modern UI with Tailwind CSS, Framer Motion, and Lucide icons.

### Frontend Setup & Usage

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```
2. **Start the development server:**
   ```bash
   npm run dev
   ```
3. **Open** [http://localhost:5173](http://localhost:5173) in your browser.

> **Note:** The frontend expects the backend to be running and accessible. The backend URL is set in `src/config.ts` (default: `https://trashai-backend.onrender.com`). Change this if running the backend locally.

### Frontend Dependencies

- React
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React
- @monaco-editor/react
- @webcontainer/api
- axios
- react-router-dom

---

## Backend

### Backend Features

- Express.js server with CORS and JSON body parsing.
- Integrates with Google Generative AI (Gemini) to:
  - Classify project type (React or Node)
  - Generate project plans, file structures, and code
- `/template` endpoint: Classifies prompt and returns base prompts for project generation.
- `/chat` endpoint: Handles step-by-step AI-driven project building.

### Backend Setup & Usage

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```
2. **Set up environment variables:**
   - Create a `.env` file in the `backend` folder with the following:
     ```env
     GEMINI_API_KEY=your_google_gemini_api_key
     ```
3. **Start the backend server:**
   ```bash
   npm run dev
   ```
   The backend will run on [http://localhost:3000](http://localhost:3000) by default.

### Backend Dependencies

- express
- cors
- dotenv
- axios
- @google/generative-ai
- @azure-rest/ai-inference
- openai
- node-fetch
- typescript

### Backend Environment Variables

- `GEMINI_API_KEY`: Your Google Gemini API key for generative AI.

---

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Create a Pull Request

---

## License

[MIT](LICENSE)
