
# JSDoc: `hooks/useAppInitializer.ts`

## Overview

`useAppInitializer.ts` defines a custom React hook responsible for handling the initial setup logic when the application first loads. This consolidates tasks like loading settings from `localStorage`, initializing the Gemini API client, and setting up the initial chat state.

## Hook: `useAppInitializer`

-   **Parameters:**
    -   `apiKeyManager: ApiKeyManager`: An instance of the API key manager (from `useApiKeyManagement` hook).
    -   `chatSettingsManager: Pick<ChatSettingsManager, 'loadStoredSettings' | 'systemInstruction'>`: Relevant parts of the chat settings manager (from `useChatSettings` hook).
    -   `messageManager: Pick<MessageManager, 'addMessage' | 'loadMessagesFromLocal' | 'setAllMessages' | 'chatHistoryToAppMessages'>`: Relevant parts of the message manager (from `useMessageManager` hook).
-   **Returns:** `void` (This hook is purely for side effects on mount).

## Core Responsibilities (Executed in `useEffect` with an empty dependency array)

1.  **Load API Key:** Calls `apiKeyManager.loadStoredApiKey()` to retrieve any saved API key from `localStorage`.
2.  **Load Chat Settings:** Calls `chatSettingsManager.loadStoredSettings()` to retrieve user preferences like AI/User names and system instructions from `localStorage`.
3.  **Load Chat History:** Calls `messageManager.loadMessagesFromLocal()` to get any saved chat history.
4.  **Initialize Gemini Client:**
    -   **If a stored API key exists:**
        -   Calls `initializeGeminiClient()` from `geminiService.ts`, passing the stored API key, loaded chat history (if any), and the current system instruction.
        -   **If initialization is successful:**
            -   If chat history was loaded, it's set in the UI using `messageManager.setAllMessages()`.
            -   Otherwise, a "Welcome back!" message is added via `messageManager.addMessage()`.
        -   **If initialization fails:**
            -   The stored API key is cleared using `apiKeyManager.clearStoredApiKey()`.
            -   `localStorage` for chat history is also cleared.
            -   The Gemini client is de-initialized.
            -   An error message is displayed to the user.
    -   **If no stored API key exists:**
        -   The Gemini client is de-initialized.
        -   A welcome message prompting for an API key is added via `messageManager.addMessage()`.

## `useEffect` Hook

-   The core logic is wrapped in a `useEffect` hook with an empty dependency array (`[]`). This ensures the initialization logic runs only once when the component (and thus the hook) mounts, similar to `componentDidMount` in class components.
-   **Dependency Management Note:** The comment in the code correctly notes that if functions passed from other hooks are not stable (i.e., not wrapped in `useCallback`), they might need to be included in the dependency array. However, for this initializer, the intent is "run once".

## Constants

-   `initialAiMessageText`: A default welcome message used when no API key is set.

## Usage

This hook is typically called once in the main `App.tsx` component.

```tsx
// Example in App.tsx
import { useAppInitializer } from './hooks/useAppInitializer';
// ... other hooks ...

function App() {
  const apiKeyManager = useApiKeyManagement();
  const chatSettingsManager = useChatSettings();
  const messageManager = useMessageManager();
  // ... other hook initializations

  useAppInitializer(apiKeyManager, chatSettingsManager, messageManager);

  // ... rest of App component
}
```
