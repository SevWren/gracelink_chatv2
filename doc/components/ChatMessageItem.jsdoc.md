
# JSDoc: `components/ChatMessageItem.tsx`

## Overview

`ChatMessageItem.tsx` defines a React component responsible for rendering a single message within the chat log. It handles different styling for user messages versus AI messages, displays sender information, timestamps, and provides interactive elements like a copy button for AI messages.

## Component: `ChatMessageItem`

-   **Type:** `React.FC<ChatMessageItemProps>`
-   **Props:**
    -   `message: Message`: The message object to display (contains id, text, sender, timestamp).
    -   `aiName: string`: The display name for the AI.
    -   `userName: string`: The display name for the user.

## Features

-   **Differentiated Styling:** Applies different background colors and text styles for messages from the user versus the AI.
-   **Alignment:** Aligns user messages to the right and AI messages to the left.
-   **Message Content:** Displays the message text, formatted with `whitespace-pre-wrap` to preserve line breaks and `break-words` to prevent overflow.
-   **Sender and Timestamp:** Shows the display name of the sender (user or AI) and the formatted time of the message.
-   **Copy Functionality (for AI messages):**
    -   A copy button appears on hover for AI messages.
    -   Clicking the button copies the AI message text to the clipboard.
    -   Provides visual feedback ("Copied!") for a short duration after a successful copy.
    -   Handles potential errors during the copy process.
-   **Options Placeholder (for AI messages):**
    -   A "more options" button (three dots icon) appears on hover for AI messages.
    -   Currently, this is a placeholder and logs to the console when clicked.
-   **Accessibility:** Includes `aria-label` and `title` attributes for interactive elements.
-   **Responsive Design:** Message bubbles have a `max-w-xl` (or `lg:max-w-2xl`) to control their width.

## Internal State

-   `isCopied: boolean`: Manages the "Copied!" feedback state for the copy button.

## Key Functions

-   `handleCopy()`: Asynchronously copies the AI message text to the clipboard and manages the `isCopied` state.
-   `handleOptions()`: Placeholder function for future "more options" functionality.

## Styling

-   Uses Tailwind CSS extensively for styling message bubbles, text, buttons, and layout.
-   `group-hover` utility is used to show buttons (copy, options) only when the message item is hovered.
