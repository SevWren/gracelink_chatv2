
# JSDoc: `hooks/useApiKeyManagement.ts`

## Overview

`useApiKeyManagement.ts` defines a custom React hook responsible for managing the Gemini API key. This includes storing the key in `localStorage`, retrieving it, clearing it, and providing the key's status and a display-friendly version to the application.

## Hook: `useApiKeyManagement`

-   **Returns:** `ApiKeyManager` object.

## `ApiKeyManager` Interface

-   **`apiKeyForDisplay: string | null`**: The current API key (potentially masked or the full key, depending on implementation details if it were to be masked). `null` if no key is set.
-   **`isApiKeySet: boolean`**: A boolean flag indicating whether an API key is currently set and considered valid by the hook.
-   **`loadStoredApiKey(): string | null`**:
    -   **Description:** Attempts to load the API key from `localStorage`. Updates the hook's internal state (`apiKeyForDisplay`, `isApiKeySet`) based on whether a key is found.
    -   **Returns:** The API key string if found and loaded, otherwise `null`.
-   **`setStoredApiKey(newKey: string): void`**:
    -   **Description:** Saves the provided `newKey` to `localStorage` and updates the hook's internal state. It will not store an empty key.
    -   **Parameters:**
        -   `newKey: string`: The API key to be stored.
-   **`clearStoredApiKey(): void`**:
    -   **Description:** Removes the API key from `localStorage` and resets the hook's internal state to indicate no key is set.

## Internal State

-   `apiKeyForDisplay: string | null`: Stores the API key string for display purposes.
-   `isApiKeySet: boolean`: Tracks whether an API key is currently active.

## Side Effects / Storage

-   Uses `localStorage` to persist the API key across sessions.
-   The key used for `localStorage` is `geminiApiKey` (defined by `API_KEY_LOCAL_STORAGE_KEY`).

## Key Functions (Internal Callbacks)

-   The functions `loadStoredApiKey`, `setStoredApiKey`, and `clearStoredApiKey` are wrapped in `useCallback` for performance optimization, ensuring they have stable identities unless their dependencies change (which are typically none for these types of setters/getters).

## Usage

This hook is typically used in the main `App.tsx` or a similar top-level component to provide API key state and management functions to the rest of the application.

```tsx
// Example in App.tsx
import { useApiKeyManagement } from './hooks/useApiKeyManagement';

function App() {
  const apiKeyManager = useApiKeyManagement();

  useEffect(() => {
    apiKeyManager.loadStoredApiKey();
  }, [apiKeyManager.loadStoredApiKey]); // Or just [] if loadStoredApiKey is stable

  // ... use apiKeyManager.isApiKeySet, apiKeyManager.apiKeyForDisplay
  // ... call apiKeyManager.setStoredApiKey(newKey) or apiKeyManager.clearStoredApiKey()
}
```
