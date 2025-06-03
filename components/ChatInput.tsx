
import React, { useState, useRef, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { Message, Sender } from '../types'; 

const COMPONENT_NAME = "[ChatInput.tsx]";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  messages: Message[];
  aiName: string;
  userName: string;
  placeholder?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, messages, aiName, userName, placeholder }) => {
  const [input, setInput] = useState('');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto'; 
      const scrollHeight = textAreaRef.current.scrollHeight;
      const maxHeight = 128; 
      textAreaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    const trimmedInput = input.trim();
    console.log(`${COMPONENT_NAME} handleSubmit called. Input: "${trimmedInput}", isLoading: ${isLoading}`);
    if (trimmedInput && !isLoading) {
      onSendMessage(trimmedInput);
      setInput('');
      if (textAreaRef.current) {
         textAreaRef.current.style.height = 'auto';
      }
      console.log(`${COMPONENT_NAME} Message sent, input cleared.`);
    } else {
      console.log(`${COMPONENT_NAME} Message not sent (input empty or loading).`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      console.log(`${COMPONENT_NAME} Enter key pressed (without Shift). Triggering submit.`);
      handleSubmit();
    }
  };

  const handleExportChat = () => {
    console.log(`${COMPONENT_NAME} handleExportChat called. Number of messages: ${messages.length}. AI Name: "${aiName}", User Name: "${userName}"`);
    if (messages.length === 0) {
      console.log(`${COMPONENT_NAME} No messages to export.`);
      return;
    }

    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1; // JavaScript months are 0-indexed.
    const year = String(now.getFullYear()).slice(-2); // Get last two digits of the year

    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    
    // Format: Day/Month/Year HH:MMam/pm, e.g., 6/2/25 5:20pm
    const formattedTimestamp = `${day}/${month}/${year} ${hours}:${minutes}${ampm.toLowerCase()}`;

    const introLine = `This is an export of the AI conversation timestamped [${formattedTimestamp}] using the format \`Day:Month:Year hour:minute: am/pm\` i.e. 6/2/25 5:20pm`;
    const separator = "\n\n---\n\n";

    const chatContent = messages.map(msg => {
      const prefix = msg.sender === Sender.User ? (userName || 'User') : (aiName || 'AI');
      const time = msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return `${prefix} (${time}):\n${msg.text}\n`;
    }).join('\n---\n\n'); 

    const fullExportContent = introLine + separator + chatContent;

    const blob = new Blob([fullExportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    const currentDateForFilename = new Date();
    const filename = `chat_export_${currentDateForFilename.getFullYear()}-${String(currentDateForFilename.getMonth() + 1).padStart(2, '0')}-${String(currentDateForFilename.getDate()).padStart(2, '0')}_${String(currentDateForFilename.getHours()).padStart(2, '0')}-${String(currentDateForFilename.getMinutes()).padStart(2, '0')}.txt`;
    a.download = filename;
    console.log(`${COMPONENT_NAME} Preparing to download chat export as: ${filename}`);
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log(`${COMPONENT_NAME} Chat export download initiated and resources cleaned up.`);
  };

  const showSendIcon = input.trim() !== '';

  return (
    <form onSubmit={handleSubmit} className="px-4 py-3 bg-slate-800 flex items-end space-x-3">
      <button type="button" className="p-2 text-slate-400 hover:text-blue-400 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors" aria-label="Attach file (feature coming soon)" title="Attach file (feature coming soon)" onClick={() => console.log(`${COMPONENT_NAME} Attachment button clicked (feature coming soon).`)}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.122 2.122l7.81-7.81" />
        </svg>
      </button>
      <button type="button" className="p-2 text-slate-400 hover:text-blue-400 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors" aria-label="Use microphone (feature coming soon)" title="Use microphone (feature coming soon)" onClick={() => console.log(`${COMPONENT_NAME} Microphone button clicked (feature coming soon).`)}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5h0M6.375 12.375A6.375 6.375 0 1112.75 12.375m0-8.25V5.625M12 12.375v3.75m0-3.75A3.375 3.375 0 0115.375 9V5.625A6.375 6.375 0 006.375 9v3.375c0 .621.504 1.125 1.125 1.125H9.75" />
        </svg>
      </button>
      <button 
        type="button" 
        onClick={handleExportChat}
        className="p-2 text-slate-400 hover:text-blue-400 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors" 
        aria-label="Export chat history" 
        title="Export chat history"
        disabled={messages.length === 0} 
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
      </button>

      <textarea
        ref={textAreaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || "Type your message..."}
        aria-label={placeholder || "Chat input"}
        className="flex-grow p-3 bg-slate-700 text-slate-100 border border-slate-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-150 ease-in-out min-h-[48px] max-h-32 overflow-y-auto placeholder-slate-400"
        rows={1}
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading || !input.trim()}
        aria-label={isLoading ? "Sending message" : (showSendIcon ? "Send message" : "Input is empty")}
        className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors duration-150 ease-in-out flex items-center justify-center h-[48px] w-[48px]"
      >
        {isLoading ? <LoadingSpinner /> : (
          showSendIcon ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 transform rotate-0">
              <path d="M3.105 3.105a1.5 1.5 0 012.122-.001l11.503 7.481a1.5 1.5 0 010 2.83L5.227 16.9a1.5 1.5 0 01-2.122-2.121L12.26 10 3.105 5.227a1.5 1.5 0 010-2.122z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          )
        )}
      </button>
    </form>
  );
};

export default ChatInput;
