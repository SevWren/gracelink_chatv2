import { useState, useCallback } from 'react';
import { Message, Sender, ChatHistoryEntry } from '../types';
import { getCurrentChatHistory as getGeminiChatHistory } from '../services/geminiService';

const HOOK_NAME = "[useMessageManager]";
const CHAT_HISTORY_LOCAL_STORAGE_KEY = 'geminiChatHistory';

export interface MessageManager {
  messages: Message[];
  addMessage: (text: string, sender: Sender, timestamp?: Date) => Message;
  setAllMessages: (newMessages: Message[]) => void;
  clearAllMessagesAndState: (initialMessageText: string) => void;
  loadMessagesFromLocal: () => { uiMessages: Message[]; geminiHistory: ChatHistoryEntry[] } | null;
  saveCurrentChatHistoryToLocal: () => Promise<void>;
  chatHistoryToAppMessages: (history: ChatHistoryEntry[]) => Message[];
}

export function useMessageManager(initialMessages: Message[] = []): MessageManager {
  const [messages, setMessagesState] = useState<Message[]>(initialMessages);

  const chatHistoryToAppMessages = useCallback((history: ChatHistoryEntry[]): Message[] => {
    return history.map((entry, index) => ({
      id: `hist-${entry.role}-${index}-${Date.now()}`,
      text: entry.parts.map(p => p.text).join('\n'), // Join parts if multiple, though typically one
      sender: entry.role === 'user' ? Sender.User : Sender.AI,
      timestamp: new Date() // Approximate timestamp, actual timestamp not stored in Gemini history
    }));
  }, []);

  const addMessage = useCallback((text: string, sender: Sender, timestamp?: Date): Message => {
    const newMessage: Message = {
      id: `${sender}-${Date.now()}`,
      text,
      sender,
      timestamp: timestamp || new Date(),
    };
    setMessagesState(prev => [...prev, newMessage]);
    return newMessage;
  }, []);

  const setAllMessages = useCallback((newMessages: Message[]) => {
    setMessagesState(newMessages);
  }, []);
  
  const saveCurrentChatHistoryToLocal = useCallback(async () => {
    try {
      const historyToSave = await getGeminiChatHistory();
      localStorage.setItem(CHAT_HISTORY_LOCAL_STORAGE_KEY, JSON.stringify(historyToSave));
      console.log(`${HOOK_NAME} Chat history saved to localStorage. Items: ${historyToSave.length}`);
    } catch (e) {
      console.error(`${HOOK_NAME} Failed to save chat history to localStorage:`, e);
    }
  }, []);

  const clearAllMessagesAndState = useCallback((initialMessageText: string) => {
    try {
      localStorage.removeItem(CHAT_HISTORY_LOCAL_STORAGE_KEY);
      console.log(`${HOOK_NAME} Chat history cleared from localStorage.`);
    } catch (e) {
      console.error(`${HOOK_NAME} Failed to clear chat history from localStorage:`, e);
    }
    // The geminiService.resetChatSession is called separately in App.tsx after this.
    setMessagesState([{ id: `ai-cleared-${Date.now()}`, text: initialMessageText, sender: Sender.AI, timestamp: new Date() }]);
    console.log(`${HOOK_NAME} Messages cleared from UI.`);
  }, []);


  const loadMessagesFromLocal = useCallback((): { uiMessages: Message[]; geminiHistory: ChatHistoryEntry[] } | null => {
    try {
      const storedChatHistoryJson = localStorage.getItem(CHAT_HISTORY_LOCAL_STORAGE_KEY);
      if (storedChatHistoryJson) {
        const geminiHistory: ChatHistoryEntry[] = JSON.parse(storedChatHistoryJson);
        if (geminiHistory && geminiHistory.length > 0) {
          const uiMessages = chatHistoryToAppMessages(geminiHistory);
          console.log(`${HOOK_NAME} Loaded ${uiMessages.length} messages from localStorage history.`);
          return { uiMessages, geminiHistory };
        }
      }
    } catch (e) {
      console.error(`${HOOK_NAME} Failed to parse chat history from localStorage:`, e);
      localStorage.removeItem(CHAT_HISTORY_LOCAL_STORAGE_KEY); // Clear corrupted data
    }
    return null;
  }, [chatHistoryToAppMessages]);

  return {
    messages,
    addMessage,
    setAllMessages,
    clearAllMessagesAndState,
    loadMessagesFromLocal,
    saveCurrentChatHistoryToLocal,
    chatHistoryToAppMessages,
  };
}
