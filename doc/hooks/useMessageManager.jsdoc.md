
# JSDoc: `hooks/useMessageManager.ts`

## Overview

`useMessageManager.ts` defines a custom React hook responsible for managing the array of chat messages. This includes adding new messages, setting all messages (e.g., when loading from history), clearing messages, and handling the persistence of chat history to/from `localStorage`. It also includes utilities for converting between the UI's `Message` format and the `ChatHistoryEntry` format used by the Gemini service.

## Hook: `useMessageManager`

-   **Parameters:**
    -   `initialMessages: Message[] = []`: Optional array of initial messages to populate the state.
-   **Returns:** `MessageManager` object.

## `MessageManager` Interface

-   **`messages: Message[]`**: The current array of `Message` objects displayed in the chat.
-   **`addMessage(text: string, sender: Sender, timestamp?: Date): Message`**:
    -   **Description:** Adds a new message to the `messages` array.
    -   **Parameters:**
        -   `text: string`: The content of the message.
        -   `sender: Sender`: The sender of the message (User or AI).
        -   `timestamp?: Date`: Optional timestamp; defaults to `new Date()`.
    -   **Returns:** The newly created `Message` object.
-   **`setAllMessages(newMessages: Message[]): void`**:
    -   **Description:** Replaces the entire `messages` array with a new set of messages.
    -   **Parameters:**
        -   `newMessages: Message[]`: The new array of messages.
-   **`clearAllMessagesAndState(initialMessageText: string): void`**:
    -   **Description:** Clears all messages from the UI, removes the chat history from `localStorage`, and sets an initial message in the UI (e.g., "Chat cleared").
    -   **Parameters:**
        -   `initialMessageText: string`: Text for the initial message after clearing.
-   **`loadMessagesFromLocal(): { uiMessages: Message[]; geminiHistory: ChatHistoryEntry[] } | null`**:
    -   **Description:** Attempts to load chat history (`ChatHistoryEntry[]`) from `localStorage`. If successful, converts it to `Message[]` for UI display.
    -   **Returns:** An object containing `uiMessages` (for display) and `geminiHistory` (for `geminiService`), or `null` if no history is found or parsing fails.
-   **`saveCurrentChatHistoryToLocal(): Promise<void>`**:
    -   **Description:** Retrieves the current chat history from `geminiService` (using `getCurrentChatHistory()`) and saves it to `localStorage`.
-   **`chatHistoryToAppMessages(history: ChatHistoryEntry[]): Message[]`**:
    -   **Description:** Converts an array of `ChatHistoryEntry` (from Gemini service) into an array of `Message` (for UI display).

## Internal State

-   `messages: Message[]`: Stores the array of chat messages.

## Side Effects / Storage

-   Uses `localStorage` to persist chat history.
-   The key used for `localStorage` is `geminiChatHistory` (defined by `CHAT_HISTORY_LOCAL_STORAGE_KEY`).
-   Interacts with `geminiService.ts` (specifically `getCurrentChatHistory`) to get the canonical history for saving.

## Key Functions (Internal Callbacks)

-   Most functions (`addMessage`, `setAllMessages`, `clearAllMessagesAndState`, `loadMessagesFromLocal`, `saveCurrentChatHistoryToLocal`, `chatHistoryToAppMessages`) are wrapped in `useCallback` for stability and performance optimization.

## Usage

This hook is central to managing chat data in `App.tsx`. It provides the `messages` array for rendering and functions to update this array and synchronize with `localStorage` and the `geminiService`.

```tsx
// Example in App.tsx
import { useMessageManager } from './hooks/useMessageManager';

function App() {
  const messageManager = useMessageManager();

  // To add a message:
  // messageManager.addMessage("Hello!", Sender.User);

  // To load history on init (simplified example):
  // useEffect(() => {
  //   const loaded = messageManager.loadMessagesFromLocal();
  //   if (loaded) {
  //     messageManager.setAllMessages(loaded.uiMessages);
  //     // also pass loaded.geminiHistory to geminiService for initialization
  //   }
  // }, [messageManager]);


  // ... render messageManager.messages
}
```
