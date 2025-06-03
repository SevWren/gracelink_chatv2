
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';

let ai: GoogleGenAI | null = null;
let currentApiKeyString: string | null = null; // To track the key used for initialization

const SERVICE_NAME = "[geminiService]";

/**
 * Initializes the GoogleGenAI client with the provided API key.
 * @param apiKey The API key string.
 * @returns True if initialization was successful, false otherwise.
 */
export function initializeGeminiClient(apiKey: string): boolean {
  console.log(`${SERVICE_NAME} Attempting to initialize Gemini client.`);
  if (!apiKey || apiKey.trim() === '') {
    console.warn(`${SERVICE_NAME} API Key cannot be empty. Initialization aborted.`);
    ai = null;
    currentApiKeyString = null;
    return false;
  }
  console.log(`${SERVICE_NAME} API Key provided (length: ${apiKey.length}).`);

  try {
    if (ai && currentApiKeyString === apiKey) {
      console.log(`${SERVICE_NAME} Gemini client already initialized with this key.`);
      return true;
    }
    ai = new GoogleGenAI({ apiKey });
    currentApiKeyString = apiKey;
    console.log(`${SERVICE_NAME} GoogleGenAI client initialized successfully.`);
    return true;
  } catch (error) {
    console.error(`${SERVICE_NAME} Failed to initialize GoogleGenAI client:`, error);
    ai = null;
    currentApiKeyString = null;
    return false;
  }
}

/**
 * Sends a prompt to the Gemini API and returns the response.
 * Requires initializeGeminiClient to have been called successfully first.
 * @param prompt The user's prompt string.
 * @returns The AI's text response or an error message.
 */
export async function getGeminiResponse(prompt: string): Promise<string> {
  console.log(`${SERVICE_NAME} getGeminiResponse called.`);
  if (!ai) {
    console.warn(`${SERVICE_NAME} AI Service not initialized. Prompt: "${prompt}"`);
    return "AI Service not initialized. Please provide a valid API Key first by sending it as a message.";
  }

  console.log(`${SERVICE_NAME} Sending prompt to Gemini API: "${prompt}"`);
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-04-17',
      contents: prompt,
    });
    
    console.log(`${SERVICE_NAME} Raw response from Gemini API:`, JSON.parse(JSON.stringify(response))); // Deep copy for logging

    const text = response.text;
    if (typeof text !== 'string') {
        console.error(`${SERVICE_NAME} Unexpected response format from Gemini API. Expected a string. Full response:`, response);
        return "AI response format is unexpected. Please try again.";
    }
    console.log(`${SERVICE_NAME} Received text response: "${text}"`);
    return text;

  } catch (error) {
    console.error(`${SERVICE_NAME} Error calling Gemini API for prompt "${prompt}":`, error);
    // Check if it's an error object with a message property
    if (error && typeof (error as any).message === 'string') {
      return `Error from AI: ${(error as any).message}`;
    }
    return 'An unexpected error occurred while contacting the AI.';
  }
}
