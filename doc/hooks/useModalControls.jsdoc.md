
# JSDoc: `hooks/useModalControls.ts`

## Overview

`useModalControls.ts` defines a custom React hook for managing the visibility state of various modal dialogs within the application. It centralizes the boolean flags and the functions to open and close these modals.

## Hook: `useModalControls`

-   **Returns:** `ModalControls` object.

## `ModalControls` Interface

-   **`showClearConfirmModal: boolean`**:
    -   **Description:** A boolean state indicating whether the "Confirm Clear Chat" modal should be visible.
-   **`showExportConfirmModal: boolean`**:
    -   **Description:** A boolean state indicating whether the "Export Chat History Before Clearing?" modal should be visible.
-   **`openClearConfirmModal(): void`**:
    -   **Description:** A function to set `showClearConfirmModal` to `true`, thereby opening the clear confirmation modal.
-   **`closeClearConfirmModal(): void`**:
    -   **Description:** A function to set `showClearConfirmModal` to `false`, thereby closing the clear confirmation modal.
-   **`openExportConfirmModal(): void`**:
    -   **Description:** A function to set `showExportConfirmModal` to `true`, thereby opening the export confirmation modal.
-   **`closeExportConfirmModal(): void`**:
    -   **Description:** A function to set `showExportConfirmModal` to `false`, thereby closing the export confirmation modal.

## Internal State

-   `showClearConfirmModal: boolean`: Manages the visibility of the "clear chat" confirmation modal.
-   `showExportConfirmModal: boolean`: Manages the visibility of the "export before clear" confirmation modal.

## Key Functions (Internal Callbacks)

-   The functions `openClearConfirmModal`, `closeClearConfirmModal`, `openExportConfirmModal`, and `closeExportConfirmModal` are simple state setters, wrapped in `useCallback` to ensure they have stable identities, preventing unnecessary re-renders in consuming components if passed as props.

## Usage

This hook is typically used in `App.tsx` or any component that needs to trigger and manage confirmation modals. The state values (`showClearConfirmModal`, `showExportConfirmModal`) are used to conditionally render `ConfirmationModal` components, and the open/close functions are passed as props or used in event handlers.

```tsx
// Example in App.tsx
import { useModalControls } from './hooks/useModalControls';
import ConfirmationModal from '../components/ConfirmationModal'; // Assuming path

function App() {
  const modalControls = useModalControls();

  const handleRequestClearChat = () => {
    modalControls.openClearConfirmModal();
  };

  // ...
  // In JSX:
  // {modalControls.showClearConfirmModal && (
  //   <ConfirmationModal
  //     isOpen={modalControls.showClearConfirmModal}
  //     onClose={modalControls.closeClearConfirmModal}
  //     onConfirm={() => {
  //       modalControls.closeClearConfirmModal();
  //       modalControls.openExportConfirmModal(); // Example: chaining modals
  //     }}
  //     title="Confirm Clear"
  //     message="Are you sure?"
  //   />
  // )}
  // {modalControls.showExportConfirmModal && ( /* ... another modal ... */ )}
}
```
