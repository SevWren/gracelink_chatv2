
# JSDoc: `types.ts`

## Overview

This file defines shared TypeScript types and enumerations used throughout the Gemini Chatbot application. Centralizing these types ensures consistency and type safety across different components and services.

## Enumerations

### `Sender`

-   **Description:** Identifies the originator of a message in the chat interface.
-   **Values:**
    -   `User = 'user'`: Represents a message sent by the human user.
    -   `AI = 'ai'`: Represents a message sent by the AI model (corresponds to the 'model' role in the Gemini API).

## Interfaces

### `Message`

-   **Description:** Represents a single message object as displayed in the chat UI.
-   **Properties:**
    -   `id: string`: A unique identifier for the message.
    -   `text: string`: The textual content of the message.
    -   `sender: Sender`: The sender of the message (User or AI).
    -   `timestamp: Date`: The date and time when the message was created/received.

### `ChatHistoryPart`

-   **Description:** Represents a part of a message within a chat history entry, primarily for interacting with the Gemini SDK. Google's `Content` type uses an array of `Part`. For simple text, this will typically be a single part.
-   **Properties:**
    -   `text: string`: The textual content of this part.
    -   `inlineData?: { mimeType: string; data: string; }`: (Commented out - Reserved for future use, e.g., for sending images or other media types).

### `ChatHistoryEntry`

-   **Description:** Represents a single entry in the chat history, compatible with the format expected by the Google Gemini SDK's `Chat` session history.
-   **Properties:**
    -   `role: 'user' | 'model'`: The role of the entity that produced this part of the conversation. `'user'` for user messages, `'model'` for AI responses.
    -   `parts: ChatHistoryPart[]`: An array of `ChatHistoryPart` objects that make up this entry. For simple text chats, this array usually contains a single part.
