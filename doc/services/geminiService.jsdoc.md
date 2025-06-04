
# JSDoc: `services/geminiService.ts`

## Overview

`geminiService.ts` encapsulates all interactions with the Google Gemini API. It provides functions to initialize the AI client, create and manage chat sessions, send messages, retrieve chat history, and handle API key changes. This service abstracts the direct usage of the `@google/genai` SDK.

## Core Responsibilities

-   Initializing the `GoogleGenAI` client with a user-provided API key.
-   Creating and managing chat sessions (`ai.chats.create`).
-   Sending user messages to the Gemini model and retrieving AI responses.
-   Retrieving the current chat history from the active session.
-   Resetting the chat session (e.g., when loading history or changing system instructions).
-   De-initializing the client (e.g., when clearing the API key).

## Key Variables (Module Scope)

-   `ai: GoogleGenAI | null`: Holds the initialized GoogleGenAI client instance.
-   `chat: Chat | null`: Holds the current active chat session object.
-   `currentApiKeyString: string | null`: Stores the API key currently used to initialize the client, for comparison.
-   `DEFAULT_SYSTEM_INSTRUCTION: string`: The default system instruction used if none is provided.

## Exported Functions

### `initializeGeminiClient(apiKey: string, initialHistory?: ChatHistoryEntry[], systemInstruction?: string): boolean`

-   **Description:** Initializes the `GoogleGenAI` client and starts a new chat session. If the client is already initialized with a different API key, it re-initializes.
-   **Parameters:**
    -   `apiKey: string`: The Google Gemini API key.
    -   `initialHistory?: ChatHistoryEntry[]`: Optional array of chat history entries to start the session with.
    -   `systemInstruction?: string`: Optional system instruction for the AI.
-   **Returns:** `boolean` - `true` if initialization was successful, `false` otherwise.

### `sendMessageToChat(prompt: string): Promise<string>`

-   **Description:** Sends a user's prompt to the current chat session and returns the AI's text response.
-   **Parameters:**
    -   `prompt: string`: The user's message.
-   **Returns:** `Promise<string>` - The AI's text response, or an error message if the call fails or the session is not initialized.

### `getCurrentChatHistory(): Promise<ChatHistoryEntry[]>`

-   **Description:** Retrieves the complete chat history from the current active chat session.
-   **Returns:** `Promise<ChatHistoryEntry[]>` - An array of chat history entries. Returns an empty array if no chat session or an error occurs.

### `resetChatSession(newHistory?: ChatHistoryEntry[], systemInstruction?: string): boolean`

-   **Description:** Resets the current chat session. This typically involves creating a new chat instance with potentially new history and/or a new system instruction.
-   **Parameters:**
    -   `newHistory?: ChatHistoryEntry[]`: Optional history to start the new session with.
    -   `systemInstruction?: string`: Optional system instruction for the new chat session.
-   **Returns:** `boolean` - `true` if the session was reset successfully, `false` otherwise (e.g., if the AI client is not initialized).

### `deinitializeGeminiClient(): void`

-   **Description:** Clears the `GoogleGenAI` client instance, the active chat session, and the stored API key string. Used when the user clears their API key.

## Error Handling

-   Functions include `try...catch` blocks to handle errors from the Gemini API or during initialization.
-   Errors are logged to the console.
-   `sendMessageToChat` returns user-friendly error messages as strings.
