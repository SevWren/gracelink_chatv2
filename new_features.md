# New Features Log

This document tracks the implementation details of significant new features added to the Gemini Chatbot application.

## 1. Horizontally Resizable Right Sidebar

**Date Implemented:** June 3 2025

**Goal:** Allow users to dynamically resize the width of the Right Sidebar (Chat Details Sidebar) by clicking and dragging its edge, with the chosen width persisted across sessions.

**Implementation Details (primarily in `App.tsx`):**

### 1. State Management & Constants:

-   **State Variables:**
    -   `sidebarWidth: number`: Stores the current width of the sidebar in pixels. Initialized to `DEFAULT_SIDEBAR_WIDTH`.
    -   `isResizingSidebar: boolean`: A flag indicating if a drag-resize operation is currently in progress.
    -   `initialMouseXRef: React.MutableRefObject<number>`: Stores the initial X-coordinate of the mouse when a resize operation begins.
    -   `initialSidebarWidthRef: React.MutableRefObject<number>`: Stores the sidebar's width at the moment a resize operation begins.
-   **Constants:**
    -   `MIN_SIDEBAR_WIDTH = 200`: Minimum allowable width for the sidebar (px).
    -   `MAX_SIDEBAR_WIDTH = 600`: Maximum allowable width for the sidebar (px).
    -   `DEFAULT_SIDEBAR_WIDTH = 288`: Default width for the sidebar (px), equivalent to Tailwind's `w-72`.
    -   `SIDEBAR_WIDTH_STORAGE_KEY = 'geminiChatSidebarWidth'`: Key used for `localStorage`.

### 2. Persistence (localStorage):

-   **Loading Width:**
    -   An `useEffect` hook runs on component mount (`App.tsx`).
    -   It attempts to retrieve `SIDEBAR_WIDTH_STORAGE_KEY` from `localStorage`.
    -   If a valid stored width is found (parsed as an integer and within `MIN_SIDEBAR_WIDTH` and `MAX_SIDEBAR_WIDTH`), `setSidebarWidth` is called to apply it.
-   **Saving Width:**
    -   Another `useEffect` hook listens for changes to `sidebarWidth`, `isResizingSidebar`, and `isRightSidebarVisible`.
    -   If `isResizingSidebar` is `false` (i.e., drag has ended), `isRightSidebarVisible` is `true`, and `sidebarWidth` is greater than 0, the current `sidebarWidth` is saved to `localStorage` under `SIDEBAR_WIDTH_STORAGE_KEY`. This ensures width is saved only after a resize is complete and the sidebar is open.

### 3. Resizer Handle Element:

-   A dedicated `div` element is rendered to the immediate left of the Right Sidebar container *only if `isRightSidebarVisible` is true*.
    -   **Styling:**
        -   Fixed width (e.g., `6px`).
        -   `cursor-col-resize` to indicate resizability.
        -   Background color changes on hover and during active resize (`isResizingSidebar`).
        -   Visual cues (e.g., three small dots) are added to suggest a draggable area.
    -   **Event Handling:**
        -   `onMouseDown={handleMouseDownOnResize}`: Attaches the mousedown event handler to this `div`.

### 4. Resizing Logic:

-   **`handleMouseDownOnResize(e: React.MouseEvent<HTMLDivElement>)`:**
    -   Called when the user presses the mouse button down on the resizer handle.
    -   `e.preventDefault()` to prevent default browser actions (like text selection).
    -   Sets `isResizingSidebar(true)`.
    -   Records `e.clientX` into `initialMouseXRef.current`.
    -   Records the current `sidebarWidth` into `initialSidebarWidthRef.current`.
-   **Global Mouse Event Listeners (`useEffect`):**
    -   An `useEffect` hook is set up to manage global mouse event listeners on the `window` object when `isResizingSidebar` is `true`.
    -   **`handleMouseMove(e: MouseEvent)`:**
        -   Calculates `deltaX = e.clientX - initialMouseXRef.current`.
        -   Calculates `newWidth = initialSidebarWidthRef.current - deltaX` (subtract because dragging left should increase width, and the handle is on the left edge of the sidebar).
        -   Clamps `newWidth` between `MIN_SIDEBAR_WIDTH` and `MAX_SIDEBAR_WIDTH`.
        -   Calls `setSidebarWidth(newWidth)` to update the sidebar's width.
    -   **`handleMouseUp()`:**
        -   Sets `isResizingSidebar(false)` to indicate the end of the resize operation.
    -   **Cleanup:** The `useEffect` hook removes these global event listeners when `isResizingSidebar` becomes `false` or when the component unmounts.
    -   **Body Styling During Resize:** While `isResizingSidebar` is true:
        -   `document.body.style.userSelect = 'none'` to prevent text selection during drag.
        -   `document.body.style.cursor = 'col-resize'` to maintain the resize cursor globally.
        -   These styles are reset when resizing stops.

### 5. Applying Width and Transitions to Sidebar:

-   The main Right Sidebar container `div` (with `id="right-sidebar-container"`) has its width controlled via an inline style:
    ```jsx
    style={{
      width: isRightSidebarVisible ? `${sidebarWidth}px` : '0px',
      // ... other styles for padding, overflow ...
      transition: isResizingSidebar ? 'none' : 'width 0.3s ease-in-out, padding 0.3s ease-in-out',
    }}
    ```
-   **Dynamic Width:** If `isRightSidebarVisible` is true, its width is set to the current `sidebarWidth` state. If hidden, width is `0px`.
-   **Transition Control:**
    -   CSS transitions for `width` (and `padding`) are applied by default for smooth open/close animations.
    -   During an active resize (`isResizingSidebar === true`), `transition` is set to `'none'`. This ensures direct, responsive feedback while dragging, preventing lag or jitter caused by the transition trying to animate during rapid width changes. Once dragging stops, the normal transition is re-applied.

### 6. Conditional Rendering of Sidebar Content:

-   The actual `<RightSidebar />` component (which contains all the forms, buttons, etc.) is only rendered within its container if `isRightSidebarVisible` is true AND the `sidebarWidth` is greater than a minimum threshold (e.g., `sidebarWidth > Math.max(50, MIN_SIDEBAR_WIDTH / 3)`).
-   This prevents the content from being rendered and potentially causing layout issues or attempting to render in a very small or zero-width space, especially during the close animation or if the sidebar is made extremely narrow.

### 7. Interaction with Sidebar Toggle:

-   When the main toggle button for the Right Sidebar is clicked:
    -   If closing: The sidebar width animates to `0px` due to the `isRightSidebarVisible` state changing and the CSS transition on the `width` style.
    -   If opening: The sidebar animates to its current `sidebarWidth` value (which could be the default, a user-resized width, or a width loaded from `localStorage`). The resizer handle also becomes visible.

This approach provides a smooth, persistent, and user-friendly way to manage the Right Sidebar's width.
