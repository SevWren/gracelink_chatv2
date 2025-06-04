
import React, { useState } from 'react';
import { Message, Sender } from '../types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import vscDarkPlus from 'react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus'; // Corrected import


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
  
  const bubbleBaseStyles = `max-w-xl lg:max-w-2xl px-4 py-3 rounded-xl shadow-md relative group`; // Increased py for better spacing with markdown
  const userBubbleStyles = `bg-slate-700 text-slate-100 ${bubbleBaseStyles} user-message`;
  const aiBubbleStyles = `bg-blue-600 text-slate-50 ${bubbleBaseStyles} ai-message`; // Removed font-mono, let markdown define for code
  
  const bubbleStyles = isUser ? userBubbleStyles : aiBubbleStyles;

  const formattedTime = message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const displayName = isUser ? (userName || 'User') : (aiName || 'AI');

  const handleCopy = async () => {
    console.log(`${COMPONENT_NAME} handleCopy called for message ID: ${message.id}`);
    // Copy raw message.text which contains the Markdown
    try {
      await navigator.clipboard.writeText(message.text); 
      setIsCopied(true);
      console.log(`${COMPONENT_NAME} Text copied to clipboard successfully.`);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error(`${COMPONENT_NAME} Failed to copy text for message ID ${message.id}:`, err);
    }
  };

  const handleOptions = () => {
    console.log(`${COMPONENT_NAME} Options clicked for message ID: ${message.id} (feature placeholder)`);
  };

  const markdownComponents = {
    // Customize heading styles if needed, or rely on global CSS
    // h1: ({node, ...props}) => <h1 className="text-2xl font-bold my-2 text-current" {...props} />,
    // p: ({node, ...props}) => <p className="mb-2 last:mb-0 text-current" {...props} />,
    a: ({node, ...props}) => <a className="text-sky-400 hover:text-sky-300 underline" target="_blank" rel="noopener noreferrer" {...props} />,
    code({node, inline, className, children, ...props}: any) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={match[1]}
          PreTag="div"
          // {...props} // Avoid passing down invalid HTML attributes from react-markdown's props to SyntaxHighlighter's div
          // customStyle={{ margin: 0, padding: '1em', borderRadius: '0.25rem' }} // Apply padding here if pre's global style is not enough
          codeTagProps={{ style: { fontFamily: "monospace" } }} // Ensure code inside uses monospace
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={`text-current ${className}`} {...props}>
          {children}
        </code>
      );
    },
    // pre: ({node, ...props}) => <pre className="bg-slate-800 p-2 rounded-md overflow-x-auto my-2" {...props} />,
  };

  return (
    <div className={`flex ${alignment} w-full`}>
      <div className={`${bubbleStyles}`}>
        <div className="text-xs text-opacity-80 mb-1"> {/* For timestamp and sender name */}
          <span className="font-semibold">{displayName}</span>
          <span className="ml-2">{formattedTime}</span>
        </div>
        <div className="markdown-content text-sm break-words">
           <ReactMarkdown
             components={markdownComponents}
             remarkPlugins={[remarkGfm]}
             rehypePlugins={[rehypeSanitize]} // Ensure this is after any plugins that might generate HTML (like rehype-raw, if used)
           >
             {message.text}
           </ReactMarkdown>
        </div>
        {/* Footer for AI messages with Copy/Options buttons */}
        {message.sender === Sender.AI && ( // Ensure this only shows for AI messages
          <div className={`flex items-center justify-end mt-2 pt-1 border-t ${isUser ? 'border-slate-600' : 'border-blue-500'} border-opacity-50`}>
            <div className="flex items-center">
              <button
                onClick={handleCopy}
                title={isCopied ? "Copied Markdown!" : "Copy Markdown"}
                aria-label={isCopied ? "Markdown source copied to clipboard" : "Copy AI message Markdown source to clipboard"}
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
