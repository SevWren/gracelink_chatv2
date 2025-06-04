
# JSDoc: `components/LoadingSpinner.tsx`

## Overview

`LoadingSpinner.tsx` defines a simple, reusable React functional component that displays an animated SVG spinner. This component is used to indicate loading states within the application, such as when waiting for an AI response.

## Component: `LoadingSpinner`

-   **Type:** `React.FC` (Functional Component)
-   **Props:** None.
-   **Description:** Renders an SVG-based circular loading animation.
-   **Styling:** Uses Tailwind CSS classes for animation (`animate-spin`), size (`h-5 w-5`), and color (`text-blue-500`).
-   **Structure:**
    -   An `<svg>` element with appropriate `xmlns`, `fill`, and `viewBox` attributes.
    -   A `<circle>` element representing the track of the spinner, with reduced opacity.
    -   A `<path>` element representing the moving part of the spinner, with higher opacity.

## Usage

This component can be imported and used directly in JSX wherever a visual loading indicator is needed:

```tsx
import LoadingSpinner from './LoadingSpinner';

// Example usage:
// {isLoading && <LoadingSpinner />}
```
