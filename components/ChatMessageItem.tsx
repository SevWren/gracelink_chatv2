
import React, { useState } from 'react';
import { Message, Sender } from '../types';

const COMPONENT_NAME = "[ChatMessageItem.tsx]";

interface ChatMessageItemProps {
  message: Message;
  aiName: string;
  userName: string;
}

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message, aiName, userName }) => {
  const [isCopied, setIsCopied] = useState(false);
  const isUser = message.sender === Sender.User;

  const alignment = isUser ? 'justify-end' : 'justify-start';
  
  // py-2 was part of the previous adjustment for compactness
  const bubbleBaseStyles = `max-w-xl lg:max-w-2xl px-4 py-2 rounded-xl shadow-md relative group`;
  const userBubbleStyles = `bg-slate-700 text-slate-100 ${bubbleBaseStyles}`;
  const aiBubbleStyles = `bg-blue-600 text-slate-50 font-mono ${bubbleBaseStyles}`; 
  
  const bubbleStyles = isUser ? userBubbleStyles : aiBubbleStyles;

  const formattedTime = message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const displayName = isUser ? (userName || 'User') : (aiName || 'AI');

  const handleCopy = async () => {
    console.log(`${COMPONENT_NAME} handleCopy called for message ID: ${message.id}`);
    if (message.sender === Sender.AI) {
      try {
        await navigator.clipboard.writeText(message.text); 
        setIsCopied(true);
        console.log(`${COMPONENT_NAME} Text copied to clipboard successfully.`);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error(`${COMPONENT_NAME} Failed to copy text for message ID ${message.id}:`, err);
      }
    } else {
      console.log(`${COMPONENT_NAME} Copy action ignored for user message.`);
    }
  };

  const handleOptions = () => {
    console.log(`${COMPONENT_NAME} Options clicked for message ID: ${message.id} (feature placeholder)`);
  };

  return (
    <div className={`flex ${alignment} w-full`}>
      <div className={`${bubbleStyles}`}>
        <p className="text-sm whitespace-pre-wrap break-words">
          <span className="font-semibold">{`[${displayName}: ${formattedTime}]`}</span>
          {` - ${message.text}`}
        </p>
        {/* Footer for AI messages with Copy/Options buttons */}
        {!isUser && (
          <div className={`flex items-center justify-end mt-1 pt-1 border-t border-opacity-25 border-blue-400`}>
            <div className="flex items-center"> {/* Removed ml-2 from here */}
              <button
                onClick={handleCopy}
                title={isCopied ? "Copied!" : "Copy text"}
                aria-label={isCopied ? "Text copied to clipboard" : "Copy AI message to clipboard"}
                className={`p-1 rounded-full ${
                  isCopied 
                    ? 'text-green-400' 
                    : 'text-blue-200 hover:text-blue-100 focus:text-blue-100'
                } opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-150`}
              >
                {isCopied ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 4.625v2.625m0 0H19.5m-2.25-2.625h-1.125c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125h1.125c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125z" />
                  </svg>
                )}
              </button>
              <button
                onClick={handleOptions}
                title="More options"
                aria-label="More options for this message"
                className="p-1 rounded-full text-blue-200 hover:text-blue-100 focus:text-blue-100 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-150 ml-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessageItem;
