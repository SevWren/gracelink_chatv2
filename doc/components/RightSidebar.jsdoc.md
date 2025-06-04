
# JSDoc: `components/RightSidebar.tsx`

## Overview

`RightSidebar.tsx` defines the React component responsible for rendering the right-hand sidebar in the chat application. This sidebar contains controls for managing the API key, customizing display names, setting system instructions, and actions like loading/clearing chat history.

## Component: `RightSidebar`

-   **Type:** `React.FC<RightSidebarProps>`
-   **Props:**
    -   `isApiKeySet: boolean`: Indicates if the API key is currently set.
    -   `apiKeyForDisplay: string | null`: The API key formatted for display (e.g., partially masked).
    -   `messagesCount: number`: The current number of messages in the chat.
    -   `currentAiName: string`: The current display name for the AI.
    -   `currentUserName: string`: The current display name for the user.
    -   `currentSystemInstruction: string`: The current system instruction for the AI.
    -   `defaultSystemInstruction: string`: The default system instruction string.
    -   `onApiKeyUpdate: (key: string) => void`: Callback to update/set the API key.
    -   `onClearApiKey: () => void`: Callback to clear the API key.
    -   `onUpdateCustomNames: (aiName: string, userName: string) => void`: Callback to update display names.
    -   `onUpdateSystemInstruction: (instruction: string) => void`: Callback to update the system instruction.
    -   `onResetSystemInstruction: () => void`: Callback to reset the system instruction to default.
    -   `onLoadHistoryClick: () => void`: Callback to trigger loading chat history from a file.
    -   `onClearChat: () => void`: Callback to initiate clearing the chat history.
    -   `addAppMessage: (sender: Sender, text: string) => void`: Callback to add an application-level message to the chat UI.

## Features

-   **API Key Management:**
    -   Displays API key status (Set/Not Set).
    -   Conditionally shows an input field to enter/set the API key if not set.
    -   If the key is set, this section is collapsible:
        -   Displays the current key (masked).
        -   Provides an input to update the key.
        -   Provides a button to clear the saved API key.
    -   Uses `isApiKeySectionExpanded` local state to manage collapsibility.
-   **Chat Information:**
    -   Displays the current count of messages.
-   **Name Customization:**
    -   Input fields for setting custom names for the AI and the user.
    -   "Save Names" button to apply changes.
-   **System Instruction Management:**
    -   A textarea to input or modify the system instruction for the AI.
    -   "Save Instruction" button to apply the custom instruction.
    -   "Reset Default" button to revert to the `defaultSystemInstruction`.
-   **Chat History Actions:**
    -   "Load History" button (disabled if API key is not set).
    -   "Clear Chat" button, prominently placed at the bottom.
-   **Local State Management:**
    -   `isApiKeySectionExpanded`: Toggles visibility of API key details.
    -   `apiKeyInput`: For the API key input field.
    -   `aiNameInput`, `userNameInput`: For name customization inputs.
    -   `systemInstructionInput`: For the system instruction textarea.
-   **Input Handling:** Local state for input fields is updated on change, and prop callbacks are called on button clicks (e.g., "Set API Key", "Save Names").
-   **UI Feedback:** Uses `addAppMessage` prop to provide feedback to the user (e.g., if trying to set an empty API key).

## Internal Logic

-   `useEffect` hooks are used to synchronize local input states (`aiNameInput`, `userNameInput`, `systemInstructionInput`) when the corresponding props (`currentAiName`, etc.) change.
-   Handler functions (e.g., `handleSetApiKey`, `handleSaveNames`) manage local input values and call the appropriate prop functions passed down from `App.tsx`.

## Styling

-   Uses Tailwind CSS extensively for layout, typography, form elements, and buttons to match the application's theme.
-   Organized into sections with headings and borders.
