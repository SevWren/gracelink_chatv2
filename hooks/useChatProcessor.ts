
import { useState, useCallback } from 'react';
import { Sender } from '../types';
import { sendMessageToChat as sendGeminiMessage } from '../services/geminiService';
import { MessageManager } from './useMessageManager';

const HOOK_NAME = "[useChatProcessor]";

export interface ChatProcessor {
  isLoading: boolean;
  error: string | null;
  processUserMessage: (
    text: string, 
    isApiKeySet: boolean,
  ) => Promise<void>;
}

export function useChatProcessor(
    messageManager: Pick<MessageManager, 'addMessage' | 'saveCurrentChatHistoryToLocal'>,
): ChatProcessor {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const processUserMessage = useCallback(async (
    text: string,
    isApiKeySet: boolean,
  ): Promise<void> => {
    console.log(`${HOOK_NAME} processUserMessage called with text: "${text}"`);
    setError(null);

    if (!isApiKeySet) {
      messageManager.addMessage("Please set your API Key in the 'Chat Details' sidebar on the right before sending messages.", Sender.AI);
      return;
    }

    messageManager.addMessage(text, Sender.User);
    setIsLoading(true);

    try {
      const aiResponseText = await sendGeminiMessage(text);
      messageManager.addMessage(aiResponseText, Sender.AI);
      await messageManager.saveCurrentChatHistoryToLocal();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      console.error(`${HOOK_NAME} Error in processUserMessage: ${errorMessage}`, err);
      setError(`Failed to process message: ${errorMessage}`);
      messageManager.addMessage(`Sorry, an application error occurred: ${errorMessage}`, Sender.AI);
    } finally {
      setIsLoading(false);
    }
  }, [messageManager]);

  return {
    isLoading,
    error,
    processUserMessage,
  };
}
