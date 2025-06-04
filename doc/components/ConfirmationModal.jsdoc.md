
# JSDoc: `components/ConfirmationModal.tsx`

## Overview

`ConfirmationModal.tsx` provides a reusable, custom modal dialog component. It is used to prompt users for confirmation before performing potentially destructive actions, such as clearing the chat history. This component replaces the native `window.confirm()` to offer better styling and control.

## Component: `ConfirmationModal`

-   **Type:** `React.FC<ConfirmationModalProps>`
-   **Props:**
    -   `isOpen: boolean`: Controls the visibility of the modal. If `false`, the modal is not rendered.
    -   `onClose: () => void`: Callback function triggered when the user dismisses the modal (e.g., clicks the cancel button or the backdrop).
    -   `onConfirm: () => void`: Callback function triggered when the user clicks the confirm button.
    -   `title: string`: The title displayed at the top of the modal.
    -   `message: string`: The main message/question displayed in the modal.
    -   `confirmText?: string`: Optional text for the confirm button (defaults to "Confirm").
    -   `cancelText?: string`: Optional text for the cancel button (defaults to "Cancel").

## Features

-   **Custom Styling:** Styled with Tailwind CSS to match the application's dark theme.
-   **Controlled Visibility:** Visibility is controlled by the `isOpen` prop.
-   **Accessible:**
    -   Uses `role="dialog"` and `aria-modal="true"`.
    -   Uses `aria-labelledby` to link the modal's title to the dialog.
    -   Buttons have `aria-label` attributes.
-   **Backdrop Click to Close:** Clicking on the semi-transparent backdrop (outside the modal content) triggers the `onClose` callback.
-   **Action Buttons:** Provides "Confirm" and "Cancel" buttons with customizable text.
-   **Whitespace Preservation:** The `message` prop supports `whitespace-pre-line` for displaying multi-line messages correctly.

## Usage

The modal is typically rendered conditionally in the parent component's JSX:

```tsx
import ConfirmationModal from './ConfirmationModal';
// ...
const [isModalOpen, setIsModalOpen] = useState(false);

const handleAction = () => {
  // ... perform action
  setIsModalOpen(false);
};

// ... in JSX
{isModalOpen && (
  <ConfirmationModal
    isOpen={isModalOpen}
    onClose={() => setIsModalOpen(false)}
    onConfirm={handleAction}
    title="Confirm Action"
    message="Are you sure you want to proceed?"
    confirmText="Yes, Proceed"
    cancelText="No, Cancel"
  />
)}
```

## Styling

-   Uses a fixed position to overlay the entire screen.
-   The modal content itself is centered.
-   `e.stopPropagation()` is used on the modal's content `div` to prevent clicks inside the modal from triggering the backdrop's `onClose` handler.
