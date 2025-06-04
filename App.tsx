
import React, { useEffect, useRef, useCallback, useState } from 'react';
import { Sender } from './types';
import ChatMessageItem from './components/ChatMessageItem';
import ChatInput from './components/ChatInput';
import ConfirmationModal from './components/ConfirmationModal';
import RightSidebar from './components/RightSidebar';

import { useApiKeyManagement } from './hooks/useApiKeyManagement';
import { useChatSettings } from './hooks/useChatSettings';
import { useMessageManager } from './hooks/useMessageManager';
import { useChatProcessor } from './hooks/useChatProcessor';
import { useChatFiles } from './hooks/useChatFiles';
import { useModalControls } from './hooks/useModalControls';
import { useAppInitializer } from './hooks/useAppInitializer';

import { 
  initializeGeminiClient, 
  resetChatSession,
  deinitializeGeminiClient,
  getCurrentChatHistory,
} from './services/geminiService';

const APP_NAME = "[App.tsx]";
const initialWelcomeMessage = "Hello! To get started, please enter LLM Gemini API Key in `Update API Key:` in the right column.";

const MIN_SIDEBAR_WIDTH = 200; // px
const MAX_SIDEBAR_WIDTH = 600; // px
const DEFAULT_SIDEBAR_WIDTH = 288; // px (tailwind w-72)
const SIDEBAR_WIDTH_STORAGE_KEY = 'geminiChatSidebarWidth';

const App: React.FC = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isRightSidebarVisible, setIsRightSidebarVisible] = React.useState<boolean>(true);

  const [sidebarWidth, setSidebarWidth] = useState<number>(DEFAULT_SIDEBAR_WIDTH);
  const [isResizingSidebar, setIsResizingSidebar] = useState<boolean>(false);
  const initialMouseXRef = useRef<number>(0);
  const initialSidebarWidthRef = useRef<number>(0);

  const apiKeyManager = useApiKeyManagement();
  const chatSettingsManager = useChatSettings();
  
  const messageManager = useMessageManager();
  const chatProcessor = useChatProcessor(messageManager);
  const chatFilesHandler = useChatFiles(messageManager, chatSettingsManager);
  const modalControls = useModalControls();

  useAppInitializer(apiKeyManager, chatSettingsManager, messageManager);

  // Load sidebar width from localStorage on mount
  useEffect(() => {
    const storedWidth = localStorage.getItem(SIDEBAR_WIDTH_STORAGE_KEY);
    if (storedWidth) {
      const numWidth = parseInt(storedWidth, 10);
      if (!isNaN(numWidth) && numWidth >= MIN_SIDEBAR_WIDTH && numWidth <= MAX_SIDEBAR_WIDTH) {
        setSidebarWidth(numWidth);
      }
    }
  }, []);

  // Save sidebar width to localStorage when it changes (and not resizing/hidden)
  useEffect(() => {
    if (!isResizingSidebar && isRightSidebarVisible && sidebarWidth > 0) {
      localStorage.setItem(SIDEBAR_WIDTH_STORAGE_KEY, String(sidebarWidth));
    }
  }, [sidebarWidth, isResizingSidebar, isRightSidebarVisible]);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messageManager.messages]);

  const addAppFeedbackMessage = useCallback((text: string, sender: Sender = Sender.AI) => {
    messageManager.addMessage(text, sender);
  }, [messageManager]);


  const handleApiKeyUpdate = useCallback((newKey: string) => {
    console.log(`${APP_NAME} handleApiKeyUpdate called.`);
    if (!newKey || newKey.trim() === '') {
      addAppFeedbackMessage("API Key cannot be empty. Please enter a valid API Key.");
      return;
    }
    localStorage.removeItem('geminiChatHistory'); 
    
    const initialized = initializeGeminiClient(newKey, [], chatSettingsManager.systemInstruction);
    if (initialized) {
      apiKeyManager.setStoredApiKey(newKey);
      messageManager.setAllMessages([]); 
      addAppFeedbackMessage("API Key set successfully! A new chat session has started. How can I help you today?");
    } else {
      apiKeyManager.clearStoredApiKey(); 
      deinitializeGeminiClient();
      addAppFeedbackMessage("Failed to initialize with the provided API Key. Please check the key and try again.");
    }
  }, [apiKeyManager, chatSettingsManager.systemInstruction, messageManager, addAppFeedbackMessage]);

  const handleClearApiKey = useCallback(() => {
    console.log(`${APP_NAME} handleClearApiKey called.`);
    localStorage.removeItem('geminiChatHistory');
    apiKeyManager.clearStoredApiKey();
    deinitializeGeminiClient();
    messageManager.setAllMessages([]); 
    addAppFeedbackMessage("API Key has been cleared. " + initialWelcomeMessage);
  }, [apiKeyManager, messageManager, addAppFeedbackMessage]);

  const handleUpdateCustomNames = useCallback((newAiName: string, newUserName: string) => {
    chatSettingsManager.setAiNameState(newAiName);
    chatSettingsManager.setUserNameState(newUserName);
    addAppFeedbackMessage(`Display names updated! AI is "${newAiName}", you are "${newUserName}".`);
  }, [chatSettingsManager, addAppFeedbackMessage]);

  const handleUpdateSystemInstruction = useCallback(async (newInstruction: string) => {
    const effectiveInstruction = newInstruction.trim() === "" ? chatSettingsManager.DEFAULT_SYSTEM_INSTRUCTION : newInstruction.trim();
    chatSettingsManager.setSystemInstructionState(effectiveInstruction);

    if (apiKeyManager.isApiKeySet) {
      try {
        const currentHistory = await getCurrentChatHistory();
        resetChatSession(currentHistory, effectiveInstruction);
        const feedbackMsgText = effectiveInstruction === chatSettingsManager.DEFAULT_SYSTEM_INSTRUCTION
          ? "System instruction reset to default."
          : "System instruction updated.";
        addAppFeedbackMessage(feedbackMsgText + " The new instruction will apply to the ongoing conversation.");
      } catch (error) {
        console.error(`${APP_NAME} Error updating system instruction:`, error);
        addAppFeedbackMessage("An error occurred while updating system instruction.");
      }
    } else {
      addAppFeedbackMessage("System instruction preference saved. It will be applied when an API key is set.");
    }
  }, [apiKeyManager.isApiKeySet, chatSettingsManager, addAppFeedbackMessage]);

  const handleResetSystemInstruction = useCallback(async () => {
    const instructionToApply = chatSettingsManager.resetSystemInstructionState();
    if (apiKeyManager.isApiKeySet) {
      try {
        const currentHistory = await getCurrentChatHistory();
        resetChatSession(currentHistory, instructionToApply);
        addAppFeedbackMessage("System instruction has been reset to default.");
      } catch (error) {
        console.error(`${APP_NAME} Error resetting system instruction:`, error);
        addAppFeedbackMessage("An error occurred while resetting system instruction.");
      }
    } else {
      addAppFeedbackMessage("System instruction preference reset to default. It will be applied when an API key is set.");
    }
  }, [apiKeyManager.isApiKeySet, chatSettingsManager, addAppFeedbackMessage]);
  
  const proceedWithClearChat = useCallback((exported: boolean) => {
    resetChatSession([], chatSettingsManager.systemInstruction);
    let feedback = `Chat history cleared${exported ? ' after export' : ''}.`;
    if (apiKeyManager.isApiKeySet) {
        feedback += " I'm ready to continue.";
    } else {
        feedback = initialWelcomeMessage; 
    }
    messageManager.clearAllMessagesAndState(feedback); 
  }, [chatSettingsManager.systemInstruction, apiKeyManager.isApiKeySet, messageManager]);


  const handleClearChatRequest = useCallback(() => {
    console.log(`${APP_NAME} handleClearChatRequest called.`);
    if (messageManager.messages.length === 0) {
      addAppFeedbackMessage("Already empty.");
      return;
    }
    modalControls.openClearConfirmModal();
  }, [messageManager.messages, addAppFeedbackMessage, modalControls]);

  const onConfirmClear = useCallback(() => {
    modalControls.closeClearConfirmModal();
    modalControls.openExportConfirmModal();
  }, [modalControls]);

  const onCancelClear = useCallback(() => {
    modalControls.closeClearConfirmModal();
  }, [modalControls]);

  const onConfirmExportAndClear = useCallback(() => {
    modalControls.closeExportConfirmModal();
    chatFilesHandler.exportChatToFile();
    proceedWithClearChat(true);
  }, [modalControls, chatFilesHandler, proceedWithClearChat]);

  const onSkipExportAndClear = useCallback(() => {
    modalControls.closeExportConfirmModal();
    proceedWithClearChat(false);
  }, [modalControls, proceedWithClearChat]);

  const handleLoadHistoryClick = useCallback(() => {
    if (!apiKeyManager.isApiKeySet) {
        addAppFeedbackMessage("Please set API Key before loading history.");
        return;
    }
    fileInputRef.current?.click();
  }, [apiKeyManager.isApiKeySet, addAppFeedbackMessage]);
  
  const onFileSelected = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      chatFilesHandler.handleFileSelected(
        event,
        chatSettingsManager.userName,
        chatSettingsManager.aiName,
        chatSettingsManager.systemInstruction
      );
    },
    [chatFilesHandler, chatSettingsManager.userName, chatSettingsManager.aiName, chatSettingsManager.systemInstruction]
  );

  const handleMouseDownOnResize = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsResizingSidebar(true);
    initialMouseXRef.current = e.clientX;
    initialSidebarWidthRef.current = sidebarWidth;
  }, [sidebarWidth]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingSidebar) return;
      const deltaX = e.clientX - initialMouseXRef.current;
      let newWidth = initialSidebarWidthRef.current - deltaX;

      if (newWidth < MIN_SIDEBAR_WIDTH) newWidth = MIN_SIDEBAR_WIDTH;
      if (newWidth > MAX_SIDEBAR_WIDTH) newWidth = MAX_SIDEBAR_WIDTH;
      
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizingSidebar(false);
    };

    if (isResizingSidebar) {
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'col-resize';
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    }

    return () => {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingSidebar]);


  return (
    <div className="flex flex-col h-screen">
      <div style={{ backgroundColor: '#1C2333', height: '0px' }} className="w-full shrink-0"></div>
      
      <div className="flex flex-grow overflow-hidden bg-slate-900 text-slate-100">
        <div className="w-[0px] bg-[#1C2333] p-0 shadow-lg shrink-0"></div>

        <div className="flex-grow flex flex-col overflow-hidden relative">
          <button
            onClick={() => setIsRightSidebarVisible(!isRightSidebarVisible)}
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

          {chatProcessor.error && (
            <div className="p-3 bg-red-700 text-red-100 border-b border-red-600 text-sm" role="alert">
              <strong>Error:</strong> {chatProcessor.error}
            </div>
          )}

          <main className="flex-grow p-6 overflow-y-auto space-y-6 bg-slate-900">
            {messageManager.messages.map(msg => (
              <ChatMessageItem key={msg.id} message={msg} aiName={chatSettingsManager.aiName} userName={chatSettingsManager.userName} />
            ))}
            <div ref={messagesEndRef} />
          </main>

          <div className="bg-slate-800 px-0 pt-2 pb-0 border-t border-slate-700">
            <ChatInput
              onSendMessage={(text) => chatProcessor.processUserMessage(text, apiKeyManager.isApiKeySet)}
              isLoading={chatProcessor.isLoading}
              onExportChat={chatFilesHandler.exportChatToFile} 
              exportDisabled={messageManager.messages.length === 0 && (!chatSettingsManager.systemInstruction || chatSettingsManager.systemInstruction === chatSettingsManager.DEFAULT_SYSTEM_INSTRUCTION)}
              placeholder={
                apiKeyManager.isApiKeySet
                  ? "Type your message here..."
                  : "First, please set API Key in the sidebar to chat ->" 
              }
            />
          </div>
        </div>
        
        <input
            type="file"
            ref={fileInputRef}
            onChange={onFileSelected}
            accept=".txt"
            className="hidden"
            aria-hidden="true"
        />
        
        {isRightSidebarVisible && (
          <div
            onMouseDown={handleMouseDownOnResize}
            className={`shrink-0 cursor-col-resize group transition-colors duration-150 ease-in-out ${isResizingSidebar ? 'bg-blue-500' : 'bg-slate-700 hover:bg-slate-600'}`}
            style={{ width: '2px' }} // This is the resizer handle thickness from user's provided file
            title="Resize sidebar"
            role="separator"
            aria-orientation="vertical"
            aria-controls="right-sidebar-container"
          >
            <div className="flex flex-col items-center justify-center h-full">
              {[...Array(3)].map((_, i) => (
                <div key={i} className={`h-1 w-1 rounded-full my-0.5 ${isResizingSidebar ? 'bg-white' : 'bg-slate-500 group-hover:bg-slate-400'}`} />
              ))}
            </div>
          </div>
        )}

        <div
          id="right-sidebar-container" 
          className="bg-slate-800 flex flex-col shadow-lg border-l border-slate-700 shrink-0"
          style={{
            width: isRightSidebarVisible ? `${sidebarWidth}px` : '0px',
            paddingTop: isRightSidebarVisible && sidebarWidth > 20 ? '1.5rem' : '0px',
            paddingBottom: isRightSidebarVisible && sidebarWidth > 20 ? '1.5rem' : '0px',
            paddingLeft: isRightSidebarVisible && sidebarWidth > 20 ? '5px' : '0px',
            paddingRight: isRightSidebarVisible && sidebarWidth > 20 ? '5px' : '0px',
            transition: isResizingSidebar ? 'none' : 'width 0.3s ease-in-out, padding 0.3s ease-in-out',
            overflowY: (isRightSidebarVisible && sidebarWidth > 0) ? 'auto' : 'hidden',
            scrollbarWidth: 'thin', 
            scrollbarColor: '#334155 #1e293b'
          }}
        >
          {isRightSidebarVisible && 
            (sidebarWidth > Math.max(50, MIN_SIDEBAR_WIDTH / 3)) && ( 
            <RightSidebar
              isApiKeySet={apiKeyManager.isApiKeySet}
              apiKeyForDisplay={apiKeyManager.apiKeyForDisplay}
              messagesCount={messageManager.messages.length}
              currentAiName={chatSettingsManager.aiName}
              currentUserName={chatSettingsManager.userName}
              currentSystemInstruction={chatSettingsManager.systemInstruction}
              defaultSystemInstruction={chatSettingsManager.DEFAULT_SYSTEM_INSTRUCTION}
              onApiKeyUpdate={handleApiKeyUpdate}
              onClearApiKey={handleClearApiKey}
              onUpdateCustomNames={handleUpdateCustomNames}
              onUpdateSystemInstruction={handleUpdateSystemInstruction}
              onResetSystemInstruction={handleResetSystemInstruction}
              onLoadHistoryClick={handleLoadHistoryClick}
              onClearChat={handleClearChatRequest}
              addAppMessage={(text, sender) => addAppFeedbackMessage(text, sender as Sender)} 
            />
          )}
        </div>
      </div>
      
      {modalControls.showClearConfirmModal && (
        <ConfirmationModal
          isOpen={modalControls.showClearConfirmModal}
          onClose={onCancelClear}
          onConfirm={onConfirmClear}
          title="Confirm Clear Chat"
          message="Are you sure you want to clear the entire chat history? This cannot be undone."
          confirmText="Yes, Clear It"
          cancelText="No, Keep It"
        />
      )}
      {modalControls.showExportConfirmModal && (
        <ConfirmationModal
          isOpen={modalControls.showExportConfirmModal}
          onClose={onSkipExportAndClear} 
          onConfirm={onConfirmExportAndClear} 
          title="Export Chat History?"
          message="Do you want to export your chat history as a text file before clearing it?"
          confirmText="Yes, Export & Clear"
          cancelText="No, Just Clear"
        />
      )}
    </div>
  );
};

export default App;
