
# JSDoc: `hooks/useChatProcessor.ts`

## Overview

`useChatProcessor.ts` defines a custom React hook responsible for handling the logic of processing a user's message. This includes sending the message to the AI service, managing loading and error states, and updating the chat UI with both the user's message and the AI's response.

## Hook: `useChatProcessor`

-   **Parameters:**
    -   `messageManager: Pick<MessageManager, 'addMessage' | 'saveCurrentChatHistoryToLocal'>`: A subset of the `MessageManager` interface (from `useMessageManager` hook), specifically requiring functions to add messages to the UI and save chat history.
-   **Returns:** `ChatProcessor` object.

## `ChatProcessor` Interface

-   **`isLoading: boolean`**: A boolean flag indicating whether a message is currently being processed (i.e., waiting for a response from the AI).
-   **`error: string | null`**: Stores an error message string if an error occurred during message processing, otherwise `null`.
-   **`processUserMessage(text: string, isApiKeySet: boolean): Promise<void>`**:
    -   **Description:** The main function to handle a new user message.
    -   **Parameters:**
        -   `text: string`: The text of the user's message.
        -   `isApiKeySet: boolean`: A flag indicating if the API key is currently set.
    -   **Process:**
        1.  Clears any previous error state.
        2.  Checks if the API key is set. If not, adds a message to the UI prompting the user to set it and returns.
        3.  Adds the user's message to the UI via `messageManager.addMessage()`.
        4.  Sets `isLoading` to `true`.
        5.  Calls `sendGeminiMessage()` (from `geminiService.ts`) with the user's text.
        6.  Upon receiving the AI's response, adds it to the UI via `messageManager.addMessage()`.
        7.  Saves the updated chat history to local storage via `messageManager.saveCurrentChatHistoryToLocal()`.
        8.  Handles any errors during the process, setting the `error` state and adding an error message to the UI.
        9.  Sets `isLoading` to `false` in a `finally` block.

## Internal State

-   `isLoading: boolean`: Manages the loading state during AI interaction.
-   `error: string | null`: Stores error messages related to message processing.

## Dependencies

-   Relies on `geminiService.ts` (specifically `sendGeminiMessage`) for communication with the AI.
-   Relies on `useMessageManager` (via the `messageManager` prop) for updating the chat UI and persisting history.

## Usage

This hook is typically used in `App.tsx` to manage the chat interaction flow. The `processUserMessage` function would be called when the user submits a message through the `ChatInput` component.

```tsx
// Example in App.tsx
import { useChatProcessor } from './hooks/useChatProcessor';
import { useMessageManager } from './hooks/useMessageManager';
// ...

function App() {
  const messageManager = useMessageManager();
  const chatProcessor = useChatProcessor(messageManager);
  // ...

  const handleSendMessage = (text: string) => {
    chatProcessor.processUserMessage(text, isApiKeyCurrentlySet);
  };

  // ... pass handleSendMessage to ChatInput
  // ... use chatProcessor.isLoading and chatProcessor.error for UI updates
}
```
