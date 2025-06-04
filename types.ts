
export enum Sender {
  User = 'user',
  AI = 'ai', // Represents 'model' role in Gemini
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  timestamp: Date;
}

// For storing/passing to Gemini SDK Chat history
export interface ChatHistoryPart {
    text: string;
    // inlineData?: { mimeType: string; data: string; }; // Reserved for future use (e.g. images)
}
export interface ChatHistoryEntry {
    role: 'user' | 'model';
    parts: ChatHistoryPart[];
}
