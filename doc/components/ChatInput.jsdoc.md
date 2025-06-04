
# JSDoc: `components/ChatInput.tsx`

## Overview

`ChatInput.tsx` defines a React component that provides the user interface for typing and sending messages in the chat application. It includes a textarea for input, a send button, and placeholder buttons for potential future features like file attachment and microphone input. It also includes an export chat button.

## Component: `ChatInput`

-   **Type:** `React.FC<ChatInputProps>`
-   **Props:**
    -   `onSendMessage: (message: string) => void`: Callback function triggered when the user submits a message.
    -   `isLoading: boolean`: Indicates if a message is currently being processed (e.g., waiting for AI response), used to disable the input and send button.
    -   `onExportChat: () => void`: Callback function to trigger chat export functionality.
    -   `exportDisabled: boolean`: Controls whether the export chat button is disabled.
    -   `placeholder?: string`: Optional placeholder text for the textarea.

## Features

-   **Text Input:** A multi-line `textarea` for users to type their messages.
    -   Dynamically adjusts its height based on content, up to a maximum height.
    -   Supports submitting messages by pressing "Enter" (without Shift).
-   **Send Button:**
    -   Submits the current message.
    -   Disabled if `isLoading` is true or if the input is empty.
    -   Displays a loading spinner if `isLoading` is true.
    -   Displays a send icon (paper airplane) if input is present and not loading.
    -   Displays an 'X' icon if input is empty and not loading (visual cue, but button is disabled).
-   **Export Chat Button:**
    -   Triggers the `onExportChat` callback.
    -   Can be disabled via the `exportDisabled` prop.
-   **Placeholder Buttons:**
    -   "Attach file" button (currently logs to console).
    -   "Use microphone" button (currently logs to console).
-   **Loading State:** Disables input and changes send button appearance when `isLoading` is true.
-   **Responsive Design:** Input area and buttons adapt to available space.

## Internal State

-   `input: string`: Stores the current text in the textarea.

## Refs

-   `textAreaRef: React.RefObject<HTMLTextAreaElement>`: Used to manage the textarea's height dynamically.

## Key Functions

-   `handleSubmit(e?: React.FormEvent<HTMLFormElement>)`: Prevents default form submission, trims the input, calls `onSendMessage` if input is valid and not loading, and clears the input.
-   `handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>)`: Detects "Enter" key press (without Shift) to trigger message submission.
-   `handleExportButtonClick()`: Calls the `onExportChat` prop.

## Styling

-   Uses Tailwind CSS for styling the form, textarea, buttons, and icons.
-   Includes focus states and transition effects for better UX.
