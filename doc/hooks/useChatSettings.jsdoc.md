
# JSDoc: `hooks/useChatSettings.ts`

## Overview

`useChatSettings.ts` defines a custom React hook for managing chat personalization settings. This includes the display names for the AI and the user, and the system instruction provided to the AI. It handles loading these settings from `localStorage`, updating them, and persisting changes.

## Hook: `useChatSettings`

-   **Returns:** `ChatSettingsManager` object.

## `ChatSettingsManager` Interface

-   **`aiName: string`**: The current display name for the AI.
-   **`userName: string`**: The current display name for the user.
-   **`systemInstruction: string`**: The current system instruction for the AI.
-   **`DEFAULT_SYSTEM_INSTRUCTION: string`**: Exports the default system instruction string, useful for comparison or reset.
-   **`loadStoredSettings(): { loadedAiName: string, loadedUserName: string, loadedSystemInstruction: string }`**:
    -   **Description:** Loads AI name, user name, and system instruction from `localStorage`. Updates the hook's internal state with these values. If values are not found in `localStorage`, defaults are used.
    -   **Returns:** An object containing the `loadedAiName`, `loadedUserName`, and `loadedSystemInstruction`.
-   **`setAiNameState(name: string): void`**:
    -   **Description:** Updates the AI's display name. Trims input and defaults to 'AI' if empty.
    -   **Parameters:**
        -   `name: string`: The new AI name.
-   **`setUserNameState(name: string): void`**:
    -   **Description:** Updates the user's display name. Trims input and defaults to 'User' if empty.
    -   **Parameters:**
        -   `name: string`: The new user name.
-   **`setSystemInstructionState(instruction: string): void`**:
    -   **Description:** Updates the system instruction for the AI. Trims input and defaults to `DEFAULT_SYSTEM_INSTRUCTION` if empty.
    -   **Parameters:**
        -   `instruction: string`: The new system instruction.
-   **`resetSystemInstructionState(): string`**:
    -   **Description:** Resets the system instruction to `DEFAULT_SYSTEM_INSTRUCTION` and updates the internal state.
    -   **Returns:** The `DEFAULT_SYSTEM_INSTRUCTION` string.

## Internal State

-   `aiName: string`: Stores the AI's display name.
-   `userName: string`: Stores the user's display name.
-   `systemInstruction: string`: Stores the system instruction.

## Side Effects / Storage

-   Uses `localStorage` to persist the settings across sessions.
-   Dedicated `localStorage` keys are used for each setting:
    -   `chatAiName` (`AI_NAME_LOCAL_STORAGE_KEY`)
    -   `chatUserName` (`USER_NAME_LOCAL_STORAGE_KEY`)
    -   `geminiSystemInstruction` (`SYSTEM_INSTRUCTION_LOCAL_STORAGE_KEY`)
-   `useEffect` hooks are used to automatically save `aiName`, `userName`, and `systemInstruction` to `localStorage` whenever their state values change.

## Constants

-   `DEFAULT_SYSTEM_INSTRUCTION`: The default instruction string.

## Key Functions (Internal Callbacks)

-   `loadStoredSettings`, `setAiNameState`, `setUserNameState`, `setSystemInstructionState`, and `resetSystemInstructionState` are wrapped in `useCallback` for stable function identities.

## Usage

This hook is typically initialized in `App.tsx` to provide and manage chat settings throughout the application, often passing the values and setters to components like the `RightSidebar`.

```tsx
// Example in App.tsx
import { useChatSettings } from './hooks/useChatSettings';

function App() {
  const chatSettingsManager = useChatSettings();

  useEffect(() => {
    chatSettingsManager.loadStoredSettings();
  }, [chatSettingsManager.loadStoredSettings]); // Or [] if stable

  // ... use chatSettingsManager.aiName, chatSettingsManager.userName, etc.
  // ... call chatSettingsManager.setAiNameState("New AI") for updates.
}
```
