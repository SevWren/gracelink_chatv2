# Coding Conventions and Architectural Practices

This document outlines the key coding conventions, architectural patterns, and best practices followed in the Gemini Chatbot project. Adhering to these guidelines helps maintain code quality, readability, and consistency.

## 1. Modularity and Single Responsibility Principle (SRP)

-   **Component Granularity:** Large React components (like the initial `App.tsx`) have been broken down into smaller, focused components (e.g., `ChatMessageItem`, `ChatInput`, `RightSidebar`). Each component should ideally manage a specific piece of UI and its related interactions.
-   **Custom Hooks for Logic:** Specific pieces of logic, state management, and side effects are extracted into custom React Hooks (e.g., `useApiKeyManagement`, `useChatSettings`, `useMessageManager`). Each hook encapsulates a distinct concern.
-   **Service Layer:** Interactions with external services (like the Gemini API) are isolated in dedicated service files (e.g., `services/geminiService.ts`).

## 2. State Management

-   **Local State:** `useState` is preferred for managing state that is local to a single component and doesn't need to be shared.
-   **Custom Hooks for Shared/Complex State:** For state that needs to be shared across multiple components or involves complex update logic (including `localStorage` interactions), custom hooks are the primary mechanism.
-   **Centralized API State:** State related to API calls (loading status, error messages, responses) is typically managed within the hook responsible for that API interaction (e.g., `useChatProcessor` for message sending).

## 3. Component-Based Architecture (React)

-   **Functional Components:** The project exclusively uses functional components with React Hooks.
-   **Props and Type Definitions:**
    -   Props are clearly defined using TypeScript interfaces for strong typing and explicitness.
    -   Descriptive prop names are used.
-   **Callbacks for Interactivity:** Parent components or hooks pass callback functions as props to child components to handle events and state updates. `useCallback` is used to memoize these callbacks where appropriate to prevent unnecessary re-renders.

## 4. TypeScript for Type Safety

-   **Strong Typing:** TypeScript is used throughout the project to ensure type safety.
-   **Interface and Type Definitions:**
    -   Shared types and interfaces are defined in `types.ts`.
    -   Component-specific prop types are defined within the component file or imported.
-   **Enums:** Enumerations (e.g., `Sender`) are used for predefined sets of values to improve clarity and prevent errors.

## 5. Readability and Maintainability

-   **Naming Conventions:**
    -   Components: PascalCase (e.g., `ChatMessageItem`).
    -   Hooks: camelCase with `use` prefix (e.g., `useApiKeyManagement`).
    -   Functions and Variables: camelCase.
    -   Constants: UPPER_SNAKE_CASE (e.g., `API_KEY_LOCAL_STORAGE_KEY`) or PascalCase for exported constants if they represent a specific entity. Module-scoped constants like `HOOK_NAME` or `COMPONENT_NAME` are used for logging.
-   **Descriptive Naming:** Variable, function, component, and hook names should be descriptive of their purpose.
-   **Constants for Magic Strings/Numbers:** Frequently used string literals (like `localStorage` keys) or numbers are defined as constants.
-   **`useCallback` and `useEffect`:**
    -   `useCallback` is used for functions passed as props or included in `useEffect` dependency arrays to maintain stable references.
    -   `useEffect` dependency arrays are carefully managed to control when effects re-run.
-   **Comments:** Code is commented where the logic is complex or non-obvious. JSDoc-style comments are used for documenting modules, functions, hooks, and components (see `doc/` directory).

## 6. Clear Separation of Concerns

-   **UI Rendering:** Handled by React components (`.tsx` files in `components/`).
-   **Business Logic & Stateful Operations:** Encapsulated within custom Hooks (`.ts` files in `hooks/`).
-   **API Calls & External Services:** Managed by service modules (`.ts` files in `services/`).
-   **Type Definitions:** Centralized in `types.ts` or defined locally where appropriate.

## 7. Error Handling and User Feedback

-   **`try...catch` Blocks:** Asynchronous operations and API calls are wrapped in `try...catch` blocks to handle potential errors gracefully.
-   **Error State:** Hooks that perform operations prone to failure (e.g., `useChatProcessor`) maintain an `error` state.
-   **User Feedback:**
    -   Error messages are displayed to the user in the UI.
    -   Informational messages (e.g., "API Key Set") are provided using the `addAppFeedbackMessage` mechanism in `App.tsx` (which uses `messageManager.addMessage`).

## 8. Code Reusability

-   **Reusable Components:** Generic UI elements like `LoadingSpinner` and `ConfirmationModal` are designed for reuse.
-   **Custom Hooks:** Custom hooks are inherently reusable pieces of stateful logic.

## 9. Styling

-   **Tailwind CSS:** The project uses Tailwind CSS for styling, adhering to utility-first principles.
-   **Consistency:** Styling should be consistent with the established dark theme and overall application aesthetic.
-   **Inline Styles:** Avoided in favor of Tailwind classes. If absolutely necessary for dynamic styles that Tailwind can't easily handle, they should be minimal.

## 10. Logging for Debugging

-   **Contextual Logging:** `console.log`, `console.warn`, and `console.error` are used for debugging.
-   Logs include a prefix indicating the component or hook name (e.g., `[App.tsx] Message...`, `[useApiKeyManagement] API Key loaded...`) to make debugging easier.

## 11. File and Directory Structure

-   Organized by feature/type (e.g., `components/`, `hooks/`, `services/`, `doc/`).
-   File names are descriptive and follow the naming conventions.

---

By following these conventions, we aim to create a codebase that is robust, easy to understand, and maintainable over time.
