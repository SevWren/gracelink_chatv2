import { useEffect } from 'react';
import { Sender } from '../types';
import { initializeGeminiClient, deinitializeGeminiClient } from '../services/geminiService';
import { ApiKeyManager } from './useApiKeyManagement'; // Assuming type from useApiKeyManagement
import { ChatSettingsManager } from './useChatSettings'; // Assuming type from useChatSettings
import { MessageManager } from './useMessageManager';

const HOOK_NAME = "[useAppInitializer]";
const initialAiMessageText = "Welcome! To get started, please enter your Gemini API Key in the `Update API Key:` field in the right column.";


export function useAppInitializer(
  apiKeyManager: ApiKeyManager,
  chatSettingsManager: Pick<ChatSettingsManager, 'loadStoredSettings' | 'systemInstruction'>,
  messageManager: Pick<MessageManager, 'addMessage' | 'loadMessagesFromLocal' | 'setAllMessages' | 'chatHistoryToAppMessages'>
): void {
  useEffect(() => {
    console.log(`${HOOK_NAME} Initial app load effect running.`);
    
    const storedApiKey = apiKeyManager.loadStoredApiKey();
    chatSettingsManager.loadStoredSettings();
    // Use loadedSystemInstruction or chatSettingsManager.systemInstruction which should be updated by loadStoredSettings
    const currentSystemInstruction = chatSettingsManager.systemInstruction;


    const loadedHistoryData = messageManager.loadMessagesFromLocal();

    if (storedApiKey) {
      console.log(`${HOOK_NAME} Found stored API Key. Initializing client.`);
      const initialized = initializeGeminiClient(
        storedApiKey, 
        loadedHistoryData?.geminiHistory, 
        currentSystemInstruction
      );

      if (initialized) {
        if (loadedHistoryData?.uiMessages.length) {
          messageManager.setAllMessages(loadedHistoryData.uiMessages);
          console.log(`${HOOK_NAME} Chat history loaded into UI from local storage.`);
        } else {
          messageManager.addMessage("Welcome back! Your API Key is loaded. How can I help you?", Sender.AI);
        }
      } else {
        console.warn(`${HOOK_NAME} Failed to initialize with stored API Key. Clearing key.`);
        apiKeyManager.clearStoredApiKey();
        localStorage.removeItem('geminiChatHistory'); // Ensure this is cleared if init fails
        deinitializeGeminiClient();
        messageManager.addMessage("Issue with saved API Key. " + initialAiMessageText, Sender.AI);
      }
    } else {
      console.log(`${HOOK_NAME} No stored API Key found. Prompting for key.`);
      deinitializeGeminiClient();
      messageManager.addMessage(initialAiMessageText, Sender.AI);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // IMPORTANT: Dependencies need to be carefully managed.
  // For a true "run once" effect like componentDidMount, the deps array should be empty.
  // However, if functions from hooks are used, they might need to be listed if they aren't stable (e.g. not wrapped in useCallback).
  // For this refactor, assuming these init functions from hooks are stable.
}
