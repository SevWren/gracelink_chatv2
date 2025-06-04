
import { useState, useCallback } from 'react';

const API_KEY_LOCAL_STORAGE_KEY = 'geminiApiKey';
const HOOK_NAME = "[useApiKeyManagement]";

export interface ApiKeyManager {
  apiKeyForDisplay: string | null;
  isApiKeySet: boolean;
  loadStoredApiKey: () => string | null;
  setStoredApiKey: (newKey: string) => void;
  clearStoredApiKey: () => void;
}

export function useApiKeyManagement(): ApiKeyManager {
  const [apiKeyForDisplay, setApiKeyForDisplayState] = useState<string | null>(null);
  const [isApiKeySet, setIsApiKeySetState] = useState<boolean>(false);

  const loadStoredApiKey = useCallback((): string | null => {
    console.log(`${HOOK_NAME} Attempting to load API key from localStorage.`);
    try {
      const storedKey = localStorage.getItem(API_KEY_LOCAL_STORAGE_KEY);
      if (storedKey) {
        setApiKeyForDisplayState(storedKey);
        setIsApiKeySetState(true);
        console.log(`${HOOK_NAME} API Key loaded from localStorage.`);
        return storedKey;
      }
      console.log(`${HOOK_NAME} No API Key found in localStorage.`);
      setApiKeyForDisplayState(null);
      setIsApiKeySetState(false);
      return null;
    } catch (e) {
      console.error(`${HOOK_NAME} Error loading API Key from localStorage:`, e);
      setApiKeyForDisplayState(null);
      setIsApiKeySetState(false);
      return null;
    }
  }, []);

  const setStoredApiKey = useCallback((newKey: string) => {
    console.log(`${HOOK_NAME} Setting new API key (length: ${newKey.length}).`);
    if (!newKey || newKey.trim() === '') {
        console.warn(`${HOOK_NAME} Attempted to set an empty API key. Aborting.`);
        // Optionally, could throw an error or handle it based on requirements
        return; 
    }
    try {
      localStorage.setItem(API_KEY_LOCAL_STORAGE_KEY, newKey);
      setApiKeyForDisplayState(newKey);
      setIsApiKeySetState(true);
      console.log(`${HOOK_NAME} API Key saved to localStorage and state updated.`);
    } catch (e) {
      console.error(`${HOOK_NAME} Error saving API Key to localStorage:`, e);
      // Potentially revert state or handle error appropriately
    }
  }, []);

  const clearStoredApiKey = useCallback(() => {
    console.log(`${HOOK_NAME} Clearing API key.`);
    try {
      localStorage.removeItem(API_KEY_LOCAL_STORAGE_KEY);
      setApiKeyForDisplayState(null);
      setIsApiKeySetState(false);
      console.log(`${HOOK_NAME} API Key cleared from localStorage and state updated.`);
    } catch (e) {
      console.error(`${HOOK_NAME} Error clearing API Key from localStorage:`, e);
    }
  }, []);

  return {
    apiKeyForDisplay,
    isApiKeySet,
    loadStoredApiKey,
    setStoredApiKey,
    clearStoredApiKey,
  };
}
