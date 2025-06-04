
# JSDoc: `hooks/useChatFiles.ts`

## Overview

`useChatFiles.ts` defines a custom React hook responsible for managing file-related operations for the chat history. This includes exporting the current chat to a text file and importing chat history from a previously exported file.

## Hook: `useChatFiles`

-   **Parameters:**
    -   `messageManager: MessageManager`: An instance of the message manager (from `useMessageManager` hook), providing access to messages and history manipulation functions.
    -   `chatSettings: Pick<ChatSettingsManager, 'aiName' | 'userName' | 'systemInstruction' | 'DEFAULT_SYSTEM_INSTRUCTION' | 'setSystemInstructionState' | 'resetSystemInstructionState'>`: Relevant parts of the chat settings manager, used for names and system instructions during export/import.
-   **Returns:** `ChatFilesHandler` object.

## `ChatFilesHandler` Interface

-   **`exportChatToFile(): void`**:
    -   **Description:** Generates a text file containing the current chat messages and system instruction, then prompts the user to download it.
-   **`handleFileSelected(event: React.ChangeEvent<HTMLInputElement>, currentUserName: string, currentAiName: string, currentSystemInstruction: string): Promise<void>`**:
    -   **Description:** Handles the event when a user selects a chat history file for import. It reads the file, parses its content, updates the chat session, messages, and system instruction accordingly.
    -   **Parameters:**
        -   `event`: The file input change event.
        -   `currentUserName`, `currentAiName`: Current display names, used for matching roles during parsing.
        -   `currentSystemInstruction`: The active system instruction before import.

## Key Functions and Logic

### `parseChatExportFile(fileContentInput: string, currentUserName: string, currentAiName: string): ParsedExportFileResult | null` (Internal `useCallback`)

-   **Description:** Parses the content of an exported chat file.
-   **Input:** Raw string content of the file, current user name, current AI name.
-   **Output:** An object containing `historyEntries: ChatHistoryEntry[]` and `systemInstructionFromFile: string | null`, or `null` if parsing fails.
-   **Process:**
    1.  Normalizes line endings.
    2.  Identifies and extracts an optional system instruction header (`SYSTEM_INSTRUCTION_HEADER_TAG`).
    3.  Skips initial empty or separator lines.
    4.  Splits the message section into blocks based on a `\n\n---\n\n` separator.
    5.  Uses a regex (`messageRegex`) to parse each block into display name, timestamp (ignored for history reconstruction), and message text.
    6.  Normalizes display names from the file and compares them against `currentUserName` and `currentAiName` (case-insensitively and with some punctuation normalization) to determine the role (`user` or `model`).
    7.  Constructs `ChatHistoryEntry` objects.

### `exportChatToFile()` (`useCallback`)

-   **Description:** Prepares and triggers the download of the chat history.
-   **Process:**
    1.  Checks if there's anything to export (messages or custom system instruction).
    2.  Formats a timestamp header for the file.
    3.  Includes the current system instruction using `SYSTEM_INSTRUCTION_HEADER_TAG`.
    4.  Formats each message with sender (AI/User name), timestamp, and text.
    5.  Joins messages with a `\n\n---\n\n` separator.
    6.  Creates a `Blob`, generates an object URL, and uses a temporary `<a>` element to trigger the download.
    7.  Provides feedback to the user via `messageManager.addMessage`.

### `handleFileSelected()` (`useCallback`)

-   **Description:** Manages the file import process.
-   **Process:**
    1.  Reads the selected file as text.
    2.  Calls `parseChatExportFile` to process the content.
    3.  If parsing is successful:
        -   Determines the system instruction to apply (from file, reset to default, or keep current).
        -   Updates system instruction via `chatSettings.setSystemInstructionState` or `chatSettings.resetSystemInstructionState`.
        -   If history entries are parsed:
            -   Clears existing `localStorage` chat history.
            -   Resets the Gemini chat session using `resetChatSession` with the new history and system instruction.
            -   Updates UI messages using `messageManager.setAllMessages` and `messageManager.chatHistoryToAppMessages`.
            -   Saves the new history to `localStorage` via `messageManager.saveCurrentChatHistoryToLocal`.
        -   Provides detailed feedback messages to the user via `messageManager.addMessage`.
    4.  Handles file read errors or parsing failures with appropriate feedback.
    5.  Clears the file input value after processing.

## Constants

-   `SYSTEM_INSTRUCTION_HEADER_TAG`: Used to mark and parse the system instruction in exported files.

## Helper Functions

-   `normalizeNameForComparison(name: string): string`: A utility to normalize display names for more robust matching during import.
