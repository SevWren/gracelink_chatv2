
# Gemini Chatbot 🚀

A modern, interactive, and dark-themed AI chatbot application powered by Google's Gemini API. Built with React, TypeScript, Vite, and Tailwind CSS, this application provides a seamless user experience for chatting with Google's large language models.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Development Server](#running-the-development-server)
  - [Building for Production](#building-for-production)
- [How to Use](#how-to-use)
- [API Key Configuration](#api-key-configuration)
- [Deployment](#deployment)
  - [GitHub Pages](#github-pages)
- [Customization (For Developers)](#customization-for-developers)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

---

## Overview

This Gemini Chatbot offers a user-friendly interface for interacting with Google's Gemini large language models. Users can provide their own Gemini API key to initiate conversations. The project is built with Vite for a fast development experience and optimized production builds.

---

## Features

✨ **Real-time AI Interaction:** Dynamic conversations with Gemini API  
🔐 **User-Provided API Key:** Securely use your own Gemini API key, prompted at the start  
🎨 **Modern Dark Theme UI:** Sleek, multi-column interface  
📱 **Responsive Design:** Tailwind CSS for seamless adaptation to any screen  
💬 **Interactive Chat Elements:**  
- Styled code block responses  
- Copy button for AI messages  
- Message timestamps  
- Clear Chat and toggleable sidebar  
🔄 **Loading & Error States:** Visual feedback for responses and errors  
📊 **Chat Details Sidebar:** Message count and API key status  
📝 **Optimized Build:** Vite for fast builds

---

## Tech Stack

- **Frontend:** React 18+
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **AI Integration:** Google Gemini API (`@google/genai`)
- **Deployment:** gh-pages (for GitHub Pages)

---

## Project Structure

```
.
├── components/         # React components
├── services/           # API integration and helpers
├── App.tsx             # Main app logic
├── index.html          # Entry HTML for Vite
├── index.tsx           # React entry point
├── types.ts            # TypeScript types
├── package.json        # Project metadata
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript config
├── metadata.json       # App metadata
└── README.md
```
> For more files, see the full repo: [gracelink_chatv2 contents](https://github.com/SevWren/gracelink_chatv2/tree/main)

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.x or later)
- A Google Gemini API Key ([Get yours here](https://aistudio.google.com/app/apikey))

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SevWren/gracelink_chatv2.git
   cd gracelink_chatv2
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

### Environment Variables

Set your Gemini API key for local development:
- Create a `.env.local` file with:
  ```
  GEMINI_API_KEY=your_api_key_here
  ```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
```
App will launch on http://localhost:5173 (default Vite port).

### Building for Production

```bash
npm run build
# or
yarn build
```
To preview the production build locally:
```bash
npm run preview
# or
yarn preview
```

---

## How to Use

1. **Launch the App:** Start the dev server or open the deployed URL.
2. **Enter API Key:** When prompted, paste your Gemini API key in the input field.
3. **Chat:** Once authenticated, interact with the AI as you like!
4. **Features:**  
   - Copy AI messages  
   - Clear chat  
   - Toggle sidebar for chat details

---

## API Key Configuration

- The Gemini API key is entered by the user in the chat UI.
- For enhanced security in production, consider handling sensitive keys server-side.

---

## Deployment

### GitHub Pages

1. Ensure `vite.config.ts` has the correct `base` property:
   ```ts
   // vite.config.ts
   export default defineConfig({
     base: '/gracelink_chatv2/',
     // ...other config
   });
   ```
2. Deploy:
   ```bash
   npm run deploy
   # or
   yarn deploy
   ```
3. Make sure GitHub Pages is set to serve from the `gh-pages` branch in your repo settings.

---

## Customization (For Developers)

- **Change AI Model:** Edit `services/geminiService.ts`
- **Styling:** Tailwind classes in `.tsx` or `index.html`
- **Add Features:** Extend components in `components/`, update logic in `App.tsx`, etc.

---

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Commit and push your branch
5. Open a Pull Request

---

## License

This project is currently unlicensed. (Consider adding an MIT License if desired.)

---

## Acknowledgements

- [Google Gemini API](https://ai.google.dev/)
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)



# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`