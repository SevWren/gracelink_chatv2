import React, { useState, useEffect } from 'react';
import { Sender } from '../types'; // Assuming Sender is needed for addAppMessage

interface RightSidebarProps {
  isApiKeySet: boolean;
  apiKeyForDisplay: string | null;
  messagesCount: number;
  currentAiName: string;
  currentUserName: string;
  currentSystemInstruction: string;
  defaultSystemInstruction: string;
  onApiKeyUpdate: (key: string) => void;
  onClearApiKey: () => void;
  onUpdateCustomNames: (aiName: string, userName: string) => void;
  onUpdateSystemInstruction: (instruction: string) => void;
  onResetSystemInstruction: () => void;
  onLoadHistoryClick: () => void;
  onClearChat: () => void;
  addAppMessage: (sender: Sender, text: string) => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({
  isApiKeySet,
  apiKeyForDisplay,
  messagesCount,
  currentAiName,
  currentUserName,
  currentSystemInstruction,
  defaultSystemInstruction,
  onApiKeyUpdate,
  onClearApiKey,
  onUpdateCustomNames,
  onUpdateSystemInstruction,
  onResetSystemInstruction,
  onLoadHistoryClick,
  onClearChat,
  addAppMessage,
}) => {
  const [isApiKeySectionExpanded, setIsApiKeySectionExpanded] = useState<boolean>(true);
  const [apiKeyInput, setApiKeyInput] = useState<string>('');
  const [aiNameInput, setAiNameInput] = useState<string>(currentAiName);
  const [userNameInput, setUserNameInput] = useState<string>(currentUserName);
  const [systemInstructionInput, setSystemInstructionInput] = useState<string>(currentSystemInstruction);

  useEffect(() => {
    setAiNameInput(currentAiName);
  }, [currentAiName]);

  useEffect(() => {
    setUserNameInput(currentUserName);
  }, [currentUserName]);

  useEffect(() => {
    setSystemInstructionInput(currentSystemInstruction);
  }, [currentSystemInstruction]);

  const handleSetApiKey = () => {
    const keyToSet = apiKeyInput.trim();
    if (keyToSet) {
      onApiKeyUpdate(keyToSet);
      setApiKeyInput(''); // Clear input after attempting to set
    } else {
      addAppMessage(Sender.AI, "Please enter an API Key before clicking 'Set API Key'.");
    }
  };
  
  const handleUpdateApiKey = () => {
    const keyToUpdate = apiKeyInput.trim();
    if (keyToUpdate) {
      onApiKeyUpdate(keyToUpdate);
      setApiKeyInput(''); // Clear input after attempting to update
    } else {
      addAppMessage(Sender.AI, "Please enter an API Key before clicking 'Update Key'.");
    }
  };

  const handleSaveNames = () => {
    const newAiName = aiNameInput.trim() || 'AI';
    const newUserName = userNameInput.trim() || 'User';
    onUpdateCustomNames(newAiName, newUserName);
    // Inputs are updated via useEffect from currentAiName/currentUserName props
  };

  const handleSaveInstruction = () => {
    const newInstruction = systemInstructionInput.trim() === "" ? defaultSystemInstruction : systemInstructionInput.trim();
    onUpdateSystemInstruction(newInstruction);
     // Input is updated via useEffect from currentSystemInstruction prop
  };
  
  const handleLocalResetSystemInstruction = () => {
    setSystemInstructionInput(defaultSystemInstruction); // Visually update textarea immediately
    onResetSystemInstruction(); // Propagate to App.tsx
  };


  return (
    <>
      <h2 className="text-xl font-semibold text-blue-400 mb-4 whitespace-nowrap">Chat Details</h2>
      
      {/* API Key Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
            <p className="text-sm text-slate-300">API Key Status: {isApiKeySet ? 
                <span className="text-green-400 font-medium">Set</span> : 
                <span className="text-yellow-400 font-medium">Not Set</span>}
            </p>
            {isApiKeySet && (
                <button 
                    onClick={() => setIsApiKeySectionExpanded(!isApiKeySectionExpanded)}
                    className="p-1 rounded-full text-slate-400 hover:text-slate-200 hover:bg-slate-700 focus:outline-none"
                    aria-controls="apiKeyDetailsSection"
                    aria-expanded={isApiKeySectionExpanded}
                    title={isApiKeySectionExpanded ? "Collapse API Key details" : "Expand API Key details"}
                >
                    {isApiKeySectionExpanded ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    )}
                </button>
            )}
        </div>

        {!isApiKeySet && (
            <div className="mt-2 space-y-2 text-sm">
                <label htmlFor="apiKeyInputSidebarInitial" className="block text-xs font-medium text-slate-400 mb-1">Enter API Key:</label>
                <input
                  id="apiKeyInputSidebarInitial" type="password" placeholder="Enter your Gemini API key"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                       e.preventDefault();
                       handleSetApiKey();
                    }
                  }}
                  className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-sm placeholder-slate-500 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={handleSetApiKey}
                  className="mt-2 w-full px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-xs"
                > Set API Key </button>
            </div>
        )}

        {isApiKeySet && isApiKeySectionExpanded && (
            <div id="apiKeyDetailsSection" className="mt-2 space-y-2 text-sm text-slate-300">
                {apiKeyForDisplay && (
                    <div className="text-xs">
                        <p className="text-slate-400">Current Key: <span className="text-slate-500 font-mono">{apiKeyForDisplay.substring(0,4)}...{apiKeyForDisplay.substring(apiKeyForDisplay.length - 4)}</span></p>
                    </div>
                )}
                <div>
                    <label htmlFor="apiKeyInputSidebarUpdate" className="block text-xs font-medium text-slate-400 mb-1">Update API Key:</label>
                    <input
                      id="apiKeyInputSidebarUpdate" type="password" placeholder="Enter new API key"
                      value={apiKeyInput}
                      onChange={(e) => setApiKeyInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                           e.preventDefault();
                           handleUpdateApiKey();
                        }
                      }}
                      className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-sm placeholder-slate-500 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      onClick={handleUpdateApiKey}
                      className="mt-2 w-full px-3 py-1.5 bg-sky-600 text-white rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 text-xs"
                    > Update Key </button>
                    <button onClick={onClearApiKey}
                        className="mt-2 w-full px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 text-xs"
                    > Clear Saved API Key </button>
                </div>
            </div>
        )}
        <div className={`text-sm text-slate-300 ${(!isApiKeySet || (isApiKeySet && isApiKeySectionExpanded)) ? 'mt-3' : 'mt-1'}`}>
            <p>Messages: <span className="font-medium text-slate-100">{messagesCount}</span></p>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-slate-700">
        <h3 className="text-sm font-semibold text-slate-300 mb-2 whitespace-nowrap">Customize Names</h3>
        <div className="mb-2">
          <label htmlFor="aiNameInputSidebar" className="block text-xs font-medium text-slate-400 mb-1">AI Name:</label>
          <input id="aiNameInputSidebar" type="text" placeholder="e.g., Assistant" value={aiNameInput}
            onChange={(e) => setAiNameInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSaveNames(); }}}
            className="w-full p-1.5 bg-slate-700 border border-slate-600 rounded-md text-sm placeholder-slate-500 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="userNameInputSidebar" className="block text-xs font-medium text-slate-400 mb-1">Your Name:</label>
          <input id="userNameInputSidebar" type="text" placeholder="e.g., Explorer" value={userNameInput}
            onChange={(e) => setUserNameInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSaveNames(); }}}
            className="w-full p-1.5 bg-slate-700 border border-slate-600 rounded-md text-sm placeholder-slate-500 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button onClick={handleSaveNames}
          className="w-full px-3 py-1.5 bg-sky-600 text-white rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 text-xs"
        > Save Names </button>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-700">
        <h3 className="text-sm font-semibold text-slate-300 mb-2 whitespace-nowrap">System Instruction</h3>
        <textarea
          id="systemInstructionInputSidebar"
          placeholder="e.g., You are a pirate captain."
          value={systemInstructionInput}
          onChange={(e) => setSystemInstructionInput(e.target.value)}
          className="w-full p-1.5 bg-slate-700 border border-slate-600 rounded-md text-sm placeholder-slate-500 focus:ring-blue-500 focus:border-blue-500 min-h-[80px] max-h-[200px] resize-y"
          rows={3}
          aria-label="Custom system instruction for the AI"
        />
        <div className="mt-2 flex space-x-2">
            <button 
                onClick={handleSaveInstruction}
                className="flex-1 px-3 py-1.5 bg-sky-600 text-white rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 text-xs"
            >
                Save Instruction
            </button>
            <button 
                onClick={handleLocalResetSystemInstruction}
                className="flex-1 px-3 py-1.5 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50 text-xs"
                title="Reset to default instruction"
            >
                Reset Default
            </button>
        </div>
      </div>
      
      <button
        onClick={onLoadHistoryClick}
        disabled={!isApiKeySet}
        className="mt-4 mb-4 w-full px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 text-xs flex items-center justify-center whitespace-nowrap disabled:bg-slate-600 disabled:hover:bg-slate-600 disabled:cursor-not-allowed"
        aria-label="Load chat history from file"
        title="Load chat history from file"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 mr-2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l-3 3m3-3l3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.338 0 4.5 4.5 0 01-1.41 8.775H6.75z" />
        </svg>
        Load History
      </button>

      <div className="mt-auto pt-4 flex flex-col items-center">
        <button onClick={onClearChat} aria-label="Clear current chat messages"
          className="mx-auto max-w-[80%] px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors duration-150 ease-in-out flex items-center justify-center text-sm font-medium whitespace-nowrap"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="50px" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75L14.25 12m0 0L12 14.25m2.25-2.25L14.25 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Clear Chat
        </button>
        <div className="mt-2 text-xs text-slate-500 text-center whitespace-nowrap">
          Chat history stored locally.
        </div>
      </div>
    </>
  );
};

export default RightSidebar;
