# Gemini Chatbot 🚀

A modern, interactive, and dark-themed AI chatbot application powered by Google's Gemini API. Built with React 19, TypeScript, Vite, and Tailwind CSS, this application provides a seamless user experience for real-time conversations with an advanced AI model.

<!-- Optional: Add a screenshot or GIF of the application here -->
<!-- ![Gemini Chatbot Screenshot](link_to_your_screenshot.png) -->

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

## Overview

This Gemini Chatbot offers a user-friendly interface for interacting with Google's cutting-edge Gemini large language models. Users can provide their own Gemini API key to initiate conversations. The application features a responsive, multi-column layout with a focus on aesthetics and usability, including a dark theme, dynamic UI elements, and easy message management.

The project is built with Vite for a fast development experience and optimized production builds.

## Features

✨ **Real-time AI Interaction:** Engage in dynamic conversations with the Gemini API.
🔑 **User-Provided API Key:** Securely use your own Gemini API key, prompted at the start.
🎨 **Modern Dark Theme UI:** Sleek, multi-column interface with a sophisticated dark aesthetic.
    -   Thin (5px) left branding strip.
    -   20px tall top accent bar.
    -   Central chat interaction area.
    -   Toggleable right sidebar for chat details.
📱 **Responsive Design:** Adapts to various screen sizes (inherent from Tailwind CSS usage).
💬 **Interactive Chat Elements:**
    -   AI responses styled like code blocks (monospace font).
    -   Copy button for AI messages with visual feedback.
    -   "More options" placeholder on AI messages.
    -   Timestamp on each message.
    -   Dynamic send button that changes to an 'X' (clear) icon when the input is empty.
🔄 **Loading & Error States:** Visual feedback for loading responses and clear error messages.
🧹 **Clear Chat Functionality:** Easily clear the current conversation.
📊 **Chat Details Sidebar:** View message count and API key status.
📜 **Scrollable Chat History:** Smooth scrolling for longer conversations.
🚀 **Optimized Build:** Vite provides fast development and optimized production bundles.

## Tech Stack

*   **Frontend Library:** [React 19](https://react.dev/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) (via CDN)
*   **AI Integration:** [Google Gemini API (`@google/genai`)](https://ai.google.dev/docs) (using model `gemini-2.5-flash-preview-04-17`)
*   **Deployment:** [gh-pages](https://www.npmjs.com/package/gh-pages) for GitHub Pages

## Project Structure

```
.
├── public/                   # Static assets (e.g., favicon) - Vite serves this
├── src/
│   ├── components/
│   │   ├── ChatInput.tsx
│   │   ├── ChatMessageItem.tsx
│   │   └── LoadingSpinner.tsx
│   ├── services/
│   │   └── geminiService.ts
│   ├── App.tsx
│   ├── index.tsx             # React entry point
│   └── types.ts
├── .gitignore
├── index.html                # Main HTML entry point for Vite
├── package.json
├── package-lock.json
├── README.md                 # This file
├── tsconfig.json
├── vite.config.ts            # Vite configuration
└── metadata.json             # Application metadata
```

## Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18.x or later recommended) and npm/yarn.
*   A Google Gemini API Key. You can obtain one from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/gracelink_chat.git
    cd gracelink_chat
    ```
    (Replace `your-username/gracelink_chat` with your actual repository URL)

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    ```

### Environment Variables

The API key is currently entered by the user in the UI. If you were to integrate it via environment variables for a backend or a more secure setup (not covered in this version for direct browser use), you would typically create a `.env` file. This project does not use a `.env` file for the API key as it's user-provided.

### Running the Development Server

To start the Vite development server:

```bash
npm run dev
# or
# yarn dev
```

This will usually start the application on `http://localhost:5173` (Vite's default port, but it might vary). The browser will open automatically if configured, or you can navigate to the URL shown in your terminal. You'll benefit from Hot Module Replacement (HMR) for a fast development cycle.

### Building for Production

To create an optimized production build:

```bash
npm run build
# or
# yarn build
```

This command will:
1.  Run `tsc` to perform TypeScript type checking.
2.  Run `vite build` to bundle your application.
The output files will be placed in the `dist/` directory.

To preview the production build locally:
```bash
npm run preview
# or
# yarn preview
```

## How to Use

1.  **Launch the App:** Start the development server (`npm run dev`) or open the deployed URL.
2.  **Enter API Key:** Upon launching, the chatbot will prompt you to "Enter your Gemini API Key here...".
    *   Paste your Google Gemini API key into the input field.
    *   Press Enter or click the Send button.
3.  **Confirmation:**
    *   If the API key is valid and the client initializes successfully, you'll receive a confirmation message.
    *   If there's an issue, an error message will be displayed.
4.  **Chat with Gemini:** Once the API key is set, type your messages and interact with the AI.
5.  **Features:**
    *   **Copy AI Messages:** Hover over an AI's message to reveal a copy icon.
    *   **Clear Chat:** Use the "Clear Chat" button in the right sidebar.
    *   **Toggle Sidebar:** Click the chevron icon to show/hide the chat details sidebar.

## API Key Configuration

The Google Gemini API key is handled client-side:

*   **User Input:** The user provides the API key directly in the chat interface.
*   **Initialization:** The `initializeGeminiClient` function in `src/services/geminiService.ts` sets up the `@google/genai` client.
*   **Storage:** The API key is held in the React component's state (`App.tsx`) for the current session. It is **not** persisted across page reloads by default.

**Security Note:** For production applications handling sensitive API keys, consider a backend proxy to avoid exposing the key directly in the client-side code or user input if the key is not meant to be user-specific.

## Deployment

### GitHub Pages

This project is configured for easy deployment to GitHub Pages.

1.  **Configure `vite.config.ts`:**
    Open `vite.config.ts` and ensure the `base` property is set correctly to your repository name:
    ```typescript
    // vite.config.ts
    export default defineConfig({
      // ... other config
      base: '/YOUR_REPOSITORY_NAME/', // e.g., '/gracelink_chat/'
    });
    ```
    Replace `YOUR_REPOSITORY_NAME` with the actual name of your GitHub repository.

2.  **Deploy:**
    Run the deploy script:
    ```bash
    npm run deploy
    # or
    # yarn deploy
    ```
    This script will first build your project and then use `gh-pages` to push the contents of the `dist` folder to the `gh-pages` branch of your repository, making it live.

3.  **GitHub Repository Settings:**
    Ensure GitHub Pages is configured in your repository settings to serve from the `gh-pages` branch.

## Customization (For Developers)

*   **Changing AI Model:** The Gemini model is specified in `src/services/geminiService.ts` (currently `'gemini-2.5-flash-preview-04-17'`).
*   **Styling:** Modify Tailwind CSS classes in `.tsx` components or `index.html`.
*   **Adding Features:** Extend components in `src/components/` or add new ones. Modify state and logic in `src/App.tsx` and `src/services/geminiService.ts`.

## Contributing

Contributions are welcome! Please follow these steps:
1.  Fork the repository.
2.  Create a new branch.
3.  Make your changes.
4.  Commit and push to your branch.
5.  Open a Pull Request.

## License

This project is currently unlicensed. (Consider adding an MIT License if desired).

## Acknowledgements

*   [Google Gemini API](https://ai.google.dev/)
*   [React](https://react.dev/)
*   [Vite](https://vitejs.dev/)
*   [Tailwind CSS](https://tailwindcss.com/)
*   [TypeScript](https://www.typescriptlang.org/)

---

Happy Chatting! 🎉
```