
# JSDoc: `App.tsx`

## Overview

`App.tsx` is the root React component of the Gemini Chatbot application. It orchestrates the overall layout, state management (primarily through custom hooks), and interactions between different parts of the application like the chat interface, message display, and settings sidebar.

## Core Responsibilities

-   **Layout Management:** Defines the main structure of the application, including the chat message area, chat input, and the right sidebar.
-   **State Orchestration:** Initializes and utilizes various custom hooks to manage:
    -   API Key (`useApiKeyManagement`)
    -   Chat Settings (AI/User names, System Instruction - `useChatSettings`)
    -   Chat Messages (`useMessageManager`)
    -   Chat Processing Logic (`useChatProcessor`)
    -   Chat File Operations (Import/Export - `useChatFiles`)
    -   Modal Dialog Visibility (`useModalControls`)
    -   Application Initialization (`useAppInitializer`)
-   **Event Handling:** Manages top-level user interactions and dispatches actions to the appropriate services or hooks. This includes sending messages, updating API keys, managing chat history, and handling UI controls.
-   **Component Composition:** Renders core UI components like `ChatMessageItem`, `ChatInput`, `RightSidebar`, and `ConfirmationModal`, passing them necessary props and callbacks.
-   **Service Integration:** Interacts with `geminiService` for API calls, client initialization, and chat session management.

## Key Functions and Callbacks

-   `addAppFeedbackMessage(text: string, sender: Sender)`: Adds a non-AI generated message to the chat UI (e.g., for system notifications).
-   `handleApiKeyUpdate(newKey: string)`: Handles logic for setting or updating the Gemini API key.
-   `handleClearApiKey()`: Handles logic for clearing the stored API key.
-   `handleUpdateCustomNames(newAiName: string, newUserName: string)`: Updates the display names for the AI and user.
-   `handleUpdateSystemInstruction(newInstruction: string)`: Updates the system instruction for the AI.
-   `handleResetSystemInstruction()`: Resets the system instruction to its default.
-   `handleClearChatRequest()`: Initiates the process for clearing the chat, potentially involving confirmation modals.
-   `onConfirmClear()`, `onCancelClear()`, `onConfirmExportAndClear()`, `onSkipExportAndClear()`: Handlers for the confirmation modal dialogs.
-   `handleLoadHistoryClick()`: Triggers the file input for loading chat history.
-   `onFileSelected(event: React.ChangeEvent<HTMLInputElement>)`: Handles the chat history file upload.

## Refs

-   `messagesEndRef`: Used to scroll the chat view to the latest message.
-   `fileInputRef`: A reference to the hidden file input element for chat history import.

## UI Features Managed

-   Displaying chat messages.
-   Handling user input for new messages.
-   Displaying loading and error states.
-   Managing the visibility and content of the right sidebar.
-   Toggling the right sidebar visibility.
-   Showing confirmation modals for actions like clearing chat.
