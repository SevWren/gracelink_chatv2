
import { GoogleGenAI, GenerateContentResponse, Chat, Content } from '@google/genai';
import { ChatHistoryEntry } from '../types'; // Corrected path

let ai: GoogleGenAI | null = null;
let chat: Chat | null = null;
let currentApiKeyString: string | null = null;

const SERVICE_NAME = "[geminiService]";
const DEFAULT_SYSTEM_INSTRUCTION = 'You are a helpful and friendly AI assistant.';

/**
 * Initializes the GoogleGenAI client and a chat session.
 * @param apiKey The API key string.
 * @param initialHistory Optional initial chat history.
 * @param systemInstruction Optional system instruction for the chat session.
 * @returns True if initialization was successful, false otherwise.
 */
export function initializeGeminiClient(apiKey: string, initialHistory?: ChatHistoryEntry[], systemInstruction?: string): boolean {
  console.log(`${SERVICE_NAME} Attempting to initialize Gemini client and chat session.`);
  if (!apiKey || apiKey.trim() === '') {
    console.warn(`${SERVICE_NAME} API Key cannot be empty. Initialization aborted.`);
    ai = null;
    chat = null;
    currentApiKeyString = null;
    return false;
  }

  try {
    if (!ai || currentApiKeyString !== apiKey) {
      ai = new GoogleGenAI({ apiKey });
      currentApiKeyString = apiKey;
      console.log(`${SERVICE_NAME} GoogleGenAI client initialized/updated successfully with key (length: ${apiKey.length}).`);
    }
    
    const activeSystemInstruction = systemInstruction && systemInstruction.trim() !== '' ? systemInstruction : DEFAULT_SYSTEM_INSTRUCTION;
    
    chat = ai.chats.create({ 
        model: 'gemini-2.5-flash-preview-04-17', 
        history: initialHistory as Content[] || [],
        config: { systemInstruction: activeSystemInstruction } 
    });

    console.log(`${SERVICE_NAME} Chat session created/reset. History: ${initialHistory?.length || 0}. System Instruction: "${activeSystemInstruction}"`);
    return true;
  } catch (error) {
    console.error(`${SERVICE_NAME} Failed to initialize GoogleGenAI client or chat session:`, error);
    ai = null;
    chat = null;
    currentApiKeyString = null;
    return false;
  }
}

/**
 * Sends a message to the current chat session.
 * @param prompt The user's prompt string.
 * @returns The AI's text response or an error message.
 */
export async function sendMessageToChat(prompt: string): Promise<string> {
  console.log(`${SERVICE_NAME} sendMessageToChat called.`);
  if (!chat) {
    console.warn(`${SERVICE_NAME} Chat session not initialized. Prompt: "${prompt}"`);
    return "AI Chat session not initialized. Please ensure API Key is set.";
  }

  console.log(`${SERVICE_NAME} Sending prompt to Gemini Chat API: "${prompt}"`);
  try {
    const response: GenerateContentResponse = await chat.sendMessage({ message: prompt });
    
    console.log(`${SERVICE_NAME} Raw response from Gemini Chat API:`, JSON.parse(JSON.stringify(response)));

    const text = response.text;
    if (typeof text !== 'string') {
        console.error(`${SERVICE_NAME} Unexpected response format from Gemini API. Expected a string. Full response:`, response);
        return "AI response format is unexpected. Please try again.";
    }
    console.log(`${SERVICE_NAME} Received text response: "${text}"`);
    return text;

  } catch (error) {
    console.error(`${SERVICE_NAME} Error calling Gemini Chat API for prompt "${prompt}":`, error);
    if (error && typeof (error as any).message === 'string') {
      return `Error from AI: ${(error as any).message}`;
    }
    return 'An unexpected error occurred while contacting the AI.';
  }
}

/**
 * Retrieves the current chat history from the session.
 * @returns A promise that resolves to the chat history.
 */
export async function getCurrentChatHistory(): Promise<ChatHistoryEntry[]> {
  if (!chat) {
    console.log(`${SERVICE_NAME} No chat session, returning empty history.`);
    return [];
  }
  try {
    const history = await chat.getHistory();
    console.log(`${SERVICE_NAME} Retrieved history with ${history.length} entries.`);
    return history as ChatHistoryEntry[];
  } catch (error) {
    console.error(`${SERVICE_NAME} Error retrieving chat history:`, error);
    return [];
  }
}

/**
 * Resets the current chat session with optional new history and system instruction.
 * @param newHistory Optional history to start the new session with.
 * @param systemInstruction Optional system instruction for the new chat session.
 */
export function resetChatSession(newHistory?: ChatHistoryEntry[], systemInstruction?: string): boolean {
  console.log(`${SERVICE_NAME} Attempting to reset chat session.`);
  if (ai && currentApiKeyString) { 
    try {
      const activeSystemInstruction = systemInstruction && systemInstruction.trim() !== '' ? systemInstruction : DEFAULT_SYSTEM_INSTRUCTION;
      chat = ai.chats.create({ 
          model: 'gemini-2.5-flash-preview-04-17', 
          history: newHistory as Content[] || [],
          config: { systemInstruction: activeSystemInstruction } 
      });
      console.log(`${SERVICE_NAME} Chat session reset successfully. New history: ${newHistory?.length || 0}. System Instruction: "${activeSystemInstruction}"`);
      return true;
    } catch (error) {
      console.error(`${SERVICE_NAME} Failed to reset chat session:`, error);
      chat = null; 
      return false;
    }
  } else {
    console.log(`${SERVICE_NAME} AI client not available, clearing chat session reference.`);
    chat = null;
    return true; 
  }
}

/**
 * De-initializes the Gemini client and chat session.
 */
export function deinitializeGeminiClient(): void {
    console.log(`${SERVICE_NAME} De-initializing Gemini client and chat session.`);
    ai = null;
    chat = null;
    currentApiKeyString = null;
}
