
import React, { useState, useEffect, useRef } from 'react';
import { Message, Sender } from './types';
import ChatMessageItem from './components/ChatMessageItem';
import ChatInput from './components/ChatInput';
import { getGeminiResponse, initializeGeminiClient } from './services/geminiService';

const APP_NAME = "[App.tsx]";

const App: React.FC = () => {
  const initialAiMessageText = "Welcome! To get started, please enter your Gemini API Key in the `Update API Key:` field in the right column.";
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [_apiKey, setApiKey] = useState<string | null>(null);
  const [isApiKeySet, setIsApiKeySet] = useState<boolean>(false);
  const [isRightSidebarVisible, setIsRightSidebarVisible] = useState<boolean>(true); 

  const [aiName, setAiName] = useState<string>('AI');
  const [userName, setUserName] = useState<string>('User');
  const [sidebarAiNameInput, setSidebarAiNameInput] = useState<string>('AI');
  const [sidebarUserNameInput, setSidebarUserNameInput] = useState<string>('User');


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    console.log(`${APP_NAME} Initial effect running for API key, AI name, and User name check.`);
    const storedApiKey = localStorage.getItem('geminiApiKey');
    const storedAiName = localStorage.getItem('chatAiName');
    const storedUserName = localStorage.getItem('chatUserName');

    if (storedAiName) {
      console.log(`${APP_NAME} Found stored AI Name: "${storedAiName}".`);
      setAiName(storedAiName);
      setSidebarAiNameInput(storedAiName);
    } else {
      setSidebarAiNameInput(aiName); // Initialize with default if nothing stored
    }

    if (storedUserName) {
      console.log(`${APP_NAME} Found stored User Name: "${storedUserName}".`);
      setUserName(storedUserName);
      setSidebarUserNameInput(storedUserName);
    } else {
      setSidebarUserNameInput(userName); // Initialize with default if nothing stored
    }

    if (storedApiKey) {
      console.log(`${APP_NAME} Found stored API Key (length: ${storedApiKey.length}). Attempting to initialize client.`);
      const initialized = initializeGeminiClient(storedApiKey);
      if (initialized) {
        setApiKey(storedApiKey);
        setIsApiKeySet(true);
        console.log(`${APP_NAME} Gemini client initialized successfully with stored key.`);
        const welcomeBackMsg = {
            id: 'initial-ai-welcome-back',
            text: "Welcome back! Your API Key is loaded. How can I help you?",
            sender: Sender.AI,
            timestamp: new Date(),
          };
        setMessages([welcomeBackMsg]);
        console.log(`${APP_NAME} Added welcome back message:`, welcomeBackMsg);
      } else {
        console.warn(`${APP_NAME} Failed to initialize Gemini client with stored key. Clearing stored key.`);
        localStorage.removeItem('geminiApiKey');
        const keyErrorMsg = {
            id: 'initial-ai-prompt-key-error-load',
            text: "There was an issue with your saved API Key. " + initialAiMessageText,
            sender: Sender.AI,
            timestamp: new Date(),
          };
        setMessages([keyErrorMsg]);
        console.log(`${APP_NAME} Added key error message:`, keyErrorMsg);
      }
    } else {
      console.log(`${APP_NAME} No stored API Key found. Prompting user for key.`);
      const promptKeyMsg = {
          id: 'initial-ai-prompt-key',
          text: initialAiMessageText,
          sender: Sender.AI,
          timestamp: new Date(),
        };
      setMessages([promptKeyMsg]);
      console.log(`${APP_NAME} Added initial prompt for API key message:`, promptKeyMsg);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chatAiName', aiName);
    console.log(`${APP_NAME} AI Name updated in localStorage: "${aiName}"`);
  }, [aiName]);

  useEffect(() => {
    localStorage.setItem('chatUserName', userName);
    console.log(`${APP_NAME} User Name updated in localStorage: "${userName}"`);
  }, [userName]);


  useEffect(() => {
    console.log(`${APP_NAME} isLoading state changed to: ${isLoading}`);
  }, [isLoading]);

  useEffect(() => {
    if (error) {
      console.error(`${APP_NAME} Error state updated: ${error}`);
    } else {
      console.log(`${APP_NAME} Error state cleared.`);
    }
  }, [error]);


  const handleClearChat = () => {
    console.log(`${APP_NAME} handleClearChat called.`);
    setError(null);
    let clearMessageText = "Chat cleared.";
    if (isApiKeySet) {
      clearMessageText += " How can I help you now?";
    } else {
      // If API key is not set, the initial message already guides to set the key.
      clearMessageText = initialAiMessageText; 
    }
    const clearedMsg = {
        id: `ai-cleared-${Date.now()}`,
        text: clearMessageText,
        sender: Sender.AI,
        timestamp: new Date(),
      };
    setMessages([clearedMsg]);
    console.log(`${APP_NAME} Chat cleared. Added message:`, clearedMsg);
  };

  const handleSendMessage = async (text: string) => {
    console.log(`${APP_NAME} handleSendMessage called with text: "${text}"`);
    setError(null); // Clear previous errors

    if (!isApiKeySet) {
        console.log(`${APP_NAME} API Key not set. User tried to send message: "${text}". Prompting to set key.`);
        const promptToSetKeyMsg: Message = {
            id: `ai-prompt-set-key-${Date.now()}`,
            text: `Please set your API Key in the 'Chat Details' sidebar on the right before sending messages.`,
            sender: Sender.AI,
            timestamp: new Date(),
        };
        setMessages(prevMessages => [...prevMessages, promptToSetKeyMsg]);
        setIsLoading(false);
        return; 
    }
    
    // If API key is set, proceed with sending message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text,
      sender: Sender.User,
      timestamp: new Date(),
    };
    console.log(`${APP_NAME} Adding user message:`, userMessage);
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsLoading(true);
    
    console.log(`${APP_NAME} API Key is set. Sending prompt to Gemini.`);
    try {
      const aiResponseText = await getGeminiResponse(text);
      console.log(`${APP_NAME} Received AI response text: "${aiResponseText}"`);
      const newAiMessage: Message = {
        id: `ai-response-${Date.now()}`,
        text: aiResponseText,
        sender: Sender.AI,
        timestamp: new Date(),
      };
      console.log(`${APP_NAME} Adding AI response message:`, newAiMessage);
      setMessages(prevMessages => [...prevMessages, newAiMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      console.error(`${APP_NAME} Error getting response from AI: ${errorMessage}`, err);
      setError(`Failed to get response from AI: ${errorMessage}`);
      const errorAiMessage: Message = {
        id: `error-ai-response-${Date.now()}`,
        text: `Sorry, I encountered an error: ${errorMessage}`,
        sender: Sender.AI,
        timestamp: new Date(),
      };
      console.log(`${APP_NAME} Adding AI error message:`, errorAiMessage);
      setMessages(prevMessages => [...prevMessages, errorAiMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleApiKeyUpdate = (newKeyInput: string) => {
    const newKey = newKeyInput.trim();
    console.log(`${APP_NAME} handleApiKeyUpdate called with new key (length: ${newKey.length}).`);
    if (!newKey) {
        console.warn(`${APP_NAME} API Key update attempt with empty key ignored.`);
         const emptyKeyMsg = {
            id: `ai-key-update-empty-${Date.now()}`,
            text: "API Key cannot be empty. Please enter a valid API Key.",
            sender: Sender.AI,
            timestamp: new Date(),
          };
        setMessages(prev => [...prev, emptyKeyMsg]);
        return;
    }

    const initialized = initializeGeminiClient(newKey);
    let feedbackMessage: string;
    if (initialized) {
      setApiKey(newKey);
      setIsApiKeySet(true);
      localStorage.setItem('geminiApiKey', newKey);
      feedbackMessage = "API Key set successfully! How can I help you today?";
      console.log(`${APP_NAME} API Key updated and saved.`);
    } else {
      feedbackMessage = "Failed to initialize with the provided API Key. Please check the key and try again. Ensure it's a valid Gemini API Key.";
      // Keep previous API key state if initialization fails, don't clear it.
      // If _apiKey was null and this fails, it remains null.
      // If _apiKey was valid and this fails, user might want to retry or clear.
      console.warn(`${APP_NAME} Failed to update/initialize API Key with new key.`);
    }
    const updateFeedbackMsg = {
        id: `ai-key-update-feedback-${Date.now()}`,
        text: feedbackMessage,
        sender: Sender.AI,
        timestamp: new Date(),
      };
     setMessages(prev => [...prev, updateFeedbackMsg]);
     console.log(`${APP_NAME} Added API key update feedback message:`, updateFeedbackMsg);
  };
  
  const handleClearApiKey = () => {
    console.log(`${APP_NAME} handleClearApiKey called.`);
    localStorage.removeItem('geminiApiKey');
    setApiKey(null);
    setIsApiKeySet(false);
    initializeGeminiClient(''); // Effectively de-initializes
    console.log(`${APP_NAME} API Key cleared from localStorage and state. Gemini client de-initialized.`);
    
    const clearedKeyMsg = {
      id: `ai-key-cleared-feedback-${Date.now()}`,
      text: "API Key has been cleared. " + initialAiMessageText,
      sender: Sender.AI,
      timestamp: new Date(),
    };
    // Clear existing messages and add the prompt.
    setMessages([clearedKeyMsg]);
    console.log(`${APP_NAME} Added API key cleared feedback message:`, clearedKeyMsg);
  };

  const handleUpdateCustomNames = () => {
    const newAiName = sidebarAiNameInput.trim() || 'AI'; // Default to 'AI' if empty
    const newUserName = sidebarUserNameInput.trim() || 'User'; // Default to 'User' if empty

    console.log(`${APP_NAME} handleUpdateCustomNames called. Setting AI: "${newAiName}", User: "${newUserName}"`);

    setAiName(newAiName); 
    setUserName(newUserName); 

    // Update sidebar input fields to reflect trimmed or defaulted values
    setSidebarAiNameInput(newAiName);
    setSidebarUserNameInput(newUserName);

    const feedbackMsg = {
      id: `ai-names-updated-${Date.now()}`,
      text: `Display names updated! AI is now "${newAiName}", and you are "${newUserName}". These names will be used in chat displays and exports.`,
      sender: Sender.AI, 
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, feedbackMsg]);
    console.log(`${APP_NAME} Custom names updated. Feedback message added to chat.`);
  };


  return (
    <div className="flex flex-col h-screen">
      <div style={{ backgroundColor: '#1C2333', height: '20px' }} className="w-full shrink-0"></div>
      
      <div className="flex flex-grow overflow-hidden bg-slate-900 text-slate-100">
        <div className="w-[0px] bg-[#1C2333] p-0 shadow-lg shrink-0"></div>

        <div className="flex-grow flex flex-col overflow-hidden relative">
          <button
            onClick={() => {
              console.log(`${APP_NAME} Toggling right sidebar. Current visibility: ${isRightSidebarVisible}`);
              setIsRightSidebarVisible(!isRightSidebarVisible);
            }}
            className="absolute top-3 right-3 z-20 p-2 bg-slate-700 hover:bg-slate-600 rounded-full text-slate-300 hover:text-slate-100 transition-colors"
            aria-label={isRightSidebarVisible ? "Hide chat details" : "Show chat details"}
            title={isRightSidebarVisible ? "Hide chat details" : "Show chat details"}
          >
            {isRightSidebarVisible ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
              </svg>
            )}
          </button>

          {error && (
            <div className="p-3 bg-red-700 text-red-100 border-b border-red-600 text-sm" role="alert">
              <strong>Error:</strong> {error}
            </div>
          )}

          <main className="flex-grow p-6 overflow-y-auto space-y-6 bg-slate-900">
            {messages.map(msg => (
              <ChatMessageItem 
                key={msg.id} 
                message={msg} 
                aiName={aiName}
                userName={userName}
              />
            ))}
            <div ref={messagesEndRef} />
          </main>

          <div className="bg-slate-800 px-2 pt-2 pb-1 border-t border-slate-700">
            <ChatInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              messages={messages}
              aiName={aiName}
              userName={userName} 
              placeholder={
                isApiKeySet
                  ? "Type your message to Gemini..."
                  : "Set API Key in the sidebar to chat ->" 
              }
            />
          </div>
        </div>

        <div 
          className={`bg-slate-800 flex flex-col shadow-lg border-l border-slate-700 transition-all duration-300 ease-in-out overflow-y-auto shrink-0 ${
            isRightSidebarVisible ? 'w-72 pt-6 pb-6 px-[5px]' : 'w-0 p-0'
          }`}
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#334155 #1e293b' }} // For Firefox scrollbar
        >
          {isRightSidebarVisible && (
            <>
              <h2 className="text-xl font-semibold text-blue-400 mb-4 whitespace-nowrap">Chat Details</h2>
              <div className="space-y-3 text-sm text-slate-300 mb-6 whitespace-nowrap">
                <p>Messages: <span className="font-medium text-slate-100">{messages.length}</span></p>
                <p>API Key Status: {isApiKeySet ? 
                  <span className="text-green-400 font-medium">Set</span> : 
                  <span className="text-yellow-400 font-medium">Not Set</span>}
                </p>
                 {isApiKeySet && _apiKey && (
                  <div className="mt-2 text-xs">
                    <p className="text-slate-400">Current Key: <span className="text-slate-500 font-mono">{_apiKey.substring(0,4)}...{_apiKey.substring(_apiKey.length - 4)}</span></p>
                  </div>
                )}
              </div>
              
              {/* API Key Management Section - Always visible if sidebar is open */}
              <div className="mb-4">
                <label htmlFor="apiKeyInputSidebar" className="block text-xs font-medium text-slate-400 mb-1">Update API Key:</label>
                <input
                  id="apiKeyInputSidebar"
                  type="password" 
                  placeholder="Enter API key"
                  // Use defaultValue if you want to show current key (masked), or just leave it blank for new entries.
                  // For security, better to not pre-fill password fields.
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                       e.preventDefault(); // Prevent any default form submission
                       const target = e.target as HTMLInputElement;
                      if (target.value.trim()) {
                        console.log(`${APP_NAME} API Key update submitted from sidebar input via Enter key.`);
                        handleApiKeyUpdate(target.value.trim());
                        target.value = ''; 
                      }
                    }
                  }}
                  className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-sm placeholder-slate-500 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={() => {
                      const input = document.getElementById('apiKeyInputSidebar') as HTMLInputElement;
                      if (input && input.value.trim()) {
                        console.log(`${APP_NAME} API Key update submitted from sidebar button.`);
                        handleApiKeyUpdate(input.value.trim());
                        input.value = ''; 
                      } else {
                        console.log(`${APP_NAME} API Key update button clicked, but input was empty.`);
                         const inputEmptyMsg = {
                            id: `ai-key-update-input-empty-${Date.now()}`,
                            text: "Please enter an API Key in the field above before clicking 'Update Key'.",
                            sender: Sender.AI,
                            timestamp: new Date(),
                          };
                        setMessages(prev => [...prev, inputEmptyMsg]);
                      }
                  }}
                  className="mt-2 w-full px-3 py-1.5 bg-sky-600 text-white rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 text-xs"
                >
                  Update Key
                </button>
                {isApiKeySet && (
                    <button
                        onClick={handleClearApiKey}
                        className="mt-2 w-full px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 text-xs"
                    >
                        Clear Saved API Key
                    </button>
                )}
              </div>

              {/* Customize Export Names Section - Always visible if sidebar is open */}
              <div className="mt-4 pt-4 border-t border-slate-700">
                <h3 className="text-sm font-semibold text-slate-300 mb-2 whitespace-nowrap">Customize Export Names</h3>
                <div className="mb-2">
                  <label htmlFor="aiNameInputSidebar" className="block text-xs font-medium text-slate-400 mb-1">AI Name:</label>
                  <input
                    id="aiNameInputSidebar"
                    type="text"
                    placeholder="e.g., Assistant"
                    value={sidebarAiNameInput}
                    onChange={(e) => setSidebarAiNameInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        console.log(`${APP_NAME} AI Name update submitted via Enter key.`);
                        handleUpdateCustomNames();
                      }
                    }}
                    className="w-full p-1.5 bg-slate-700 border border-slate-600 rounded-md text-sm placeholder-slate-500 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="userNameInputSidebar" className="block text-xs font-medium text-slate-400 mb-1">Your Name:</label>
                  <input
                    id="userNameInputSidebar"
                    type="text"
                    placeholder="e.g., Explorer"
                    value={sidebarUserNameInput}
                    onChange={(e) => setSidebarUserNameInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        console.log(`${APP_NAME} User Name update submitted via Enter key.`);
                        handleUpdateCustomNames();
                      }
                    }}
                    className="w-full p-1.5 bg-slate-700 border border-slate-600 rounded-md text-sm placeholder-slate-500 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={handleUpdateCustomNames}
                  className="w-full px-3 py-1.5 bg-sky-600 text-white rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 text-xs"
                >
                  Save Names
                </button>
              </div>


              <button
                onClick={handleClearChat}
                aria-label="Clear current chat messages"
                className="mt-auto mx-auto max-w-[80%] px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors duration-150 ease-in-out flex items-center justify-center text-sm font-medium whitespace-nowrap"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="50px" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75L14.25 12m0 0L12 14.25m2.25-2.25L14.25 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Clear Chat
              </button>
              <div className="mt-4 text-xs text-slate-500 text-center whitespace-nowrap">
                Chat history is local to this session.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;