
import { useCallback } from 'react';
import { Message, Sender, ChatHistoryEntry } from '../types';
import { MessageManager } from './useMessageManager';
import { ChatSettingsManager } from './useChatSettings'; // Assuming this will be the type from useChatSettings
import { resetChatSession } from '../services/geminiService';

const HOOK_NAME = "[useChatFiles]";
const SYSTEM_INSTRUCTION_HEADER_TAG = "SYSTEM_INSTRUCTION:";

const normalizeNameForComparison = (name: string): string => {
  if (!name) return '';
  let normalized = name.replace(/[\u2018\u2019]/g, "'");
  normalized = normalized.replace(/[\u201C\u201D]/g, '"');
  return normalized.trim();
};

interface ParsedExportFileResult {
  historyEntries: ChatHistoryEntry[];
  systemInstructionFromFile: string | null;
}

export interface ChatFilesHandler {
  exportChatToFile: () => void;
  handleFileSelected: (
    event: React.ChangeEvent<HTMLInputElement>,
    currentUserName: string,
    currentAiName: string,
    currentSystemInstruction: string,
  ) => Promise<void>;
}

export function useChatFiles(
  messageManager: MessageManager,
  chatSettings: Pick<ChatSettingsManager, 'aiName' | 'userName' | 'systemInstruction' | 'DEFAULT_SYSTEM_INSTRUCTION' | 'setSystemInstructionState' | 'resetSystemInstructionState'>
): ChatFilesHandler {

  const parseChatExportFile = useCallback((
    fileContentInput: string, 
    currentUserName: string, 
    currentAiName: string
  ): ParsedExportFileResult | null => {
    console.log(`${HOOK_NAME} parseChatExportFile called. File content length: ${fileContentInput.length}`);
    if (!fileContentInput || fileContentInput.trim() === '') {
        console.warn(`${HOOK_NAME} File content is empty.`);
        return null;
    }

    const fileContent = fileContentInput.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const allLines = fileContent.split('\n');
    if (allLines.length === 0) {
        console.warn(`${HOOK_NAME} File content is empty after splitting lines.`);
        return null;
    }

    let systemInstructionFromFile: string | null = null;
    let messageStartLineIndex = 1;

    if (allLines.length > 1 && allLines[1].startsWith(SYSTEM_INSTRUCTION_HEADER_TAG)) {
        systemInstructionFromFile = allLines[1].substring(SYSTEM_INSTRUCTION_HEADER_TAG.length).trim();
        messageStartLineIndex = 2;
        console.log(`${HOOK_NAME} Found system instruction in file: "${systemInstructionFromFile}"`);
    } else {
        console.log(`${HOOK_NAME} No system instruction tag found. Assuming old format or no custom instruction.`);
    }
    
    while (messageStartLineIndex < allLines.length && (allLines[messageStartLineIndex].trim() === '' || allLines[messageStartLineIndex].trim() === '---')) {
        messageStartLineIndex++;
    }
    
    const historyEntries: ChatHistoryEntry[] = [];
    if (messageStartLineIndex >= allLines.length) {
        console.log(`${HOOK_NAME} No message content found after headers.`);
        return { historyEntries, systemInstructionFromFile };
    }

    const messageSectionContent = allLines.slice(messageStartLineIndex).join('\n');
    const blocks = messageSectionContent.split('\n\n---\n\n');
    const messageRegex = /^(.+?)\s+\((\d{2}:\d{2}\s(?:AM|PM))\):\s*\n([\s\S]+)$/;

    for (const block of blocks) {
        const trimmedBlock = block.trim();
        if (!trimmedBlock || trimmedBlock === "(No messages in this export)") continue;

        const match = trimmedBlock.match(messageRegex);
        if (match && match[1] && match[3]) {
            const rawDisplayNameFromFile = match[1];
            const text = match[3].trim();
            const normalizedDisplayNameFromFile = normalizeNameForComparison(rawDisplayNameFromFile);
            const normalizedCurrentUserName = normalizeNameForComparison(currentUserName);
            const normalizedCurrentAiName = normalizeNameForComparison(currentAiName);
            let role: 'user' | 'model' | null = null;

            if (normalizedDisplayNameFromFile === normalizedCurrentUserName) role = 'user';
            else if (normalizedDisplayNameFromFile === normalizedCurrentAiName) role = 'model';
            else {
                console.warn(`${HOOK_NAME} Skipping message: Normalized DisplayName "${normalizedDisplayNameFromFile}" (original: "${rawDisplayNameFromFile}") doesn't match current User ("${normalizedCurrentUserName}") or AI ("${normalizedCurrentAiName}").`);
                continue;
            }
            historyEntries.push({ role, parts: [{ text }] });
        } else {
            console.warn(`${HOOK_NAME} Skipping block due to regex mismatch: "${trimmedBlock.substring(0, 100)}..."`);
        }
    }
    console.log(`${HOOK_NAME} Successfully parsed ${historyEntries.length} chat entries. System instruction from file: ${systemInstructionFromFile !== null ? `"${systemInstructionFromFile}"` : 'Not present'}`);
    return { historyEntries, systemInstructionFromFile };
  }, []);


  const exportChatToFile = useCallback(() => {
    console.log(`${HOOK_NAME} exportChatToFile called. Messages: ${messageManager.messages.length}, AI: ${chatSettings.aiName}, User: ${chatSettings.userName}, SystemInstruction: "${chatSettings.systemInstruction}"`);
    if (messageManager.messages.length === 0 && (!chatSettings.systemInstruction || chatSettings.systemInstruction === chatSettings.DEFAULT_SYSTEM_INSTRUCTION)) {
      messageManager.addMessage("There are no messages or custom system instructions to export.", Sender.AI);
      return;
    }

    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = String(now.getFullYear()).slice(-2);
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedTimestamp = `${day}/${month}/${year} ${hours}:${minutes}${ampm.toLowerCase()}`;
    
    const introLine = `Chat export timestamped [${formattedTimestamp}] (Day/Month/Year HH:MMam/pm)`;
    const systemInstructionLine = `${SYSTEM_INSTRUCTION_HEADER_TAG} ${chatSettings.systemInstruction || ''}`;
    const separator = "\n\n---\n\n";
    
    const chatContent = messageManager.messages.map(msg => {
      const prefix = msg.sender === Sender.User ? (chatSettings.userName || 'User') : (chatSettings.aiName || 'AI');
      const time = msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return `${prefix} (${time}):\n${msg.text}`;
    }).join(separator);

    let fullExportContent = `${introLine}\n${systemInstructionLine}`;
    if (messageManager.messages.length > 0) {
        fullExportContent += separator + chatContent;
    } else {
        fullExportContent += "\n\n---\n\n(No messages in this export)";
    }

    const blob = new Blob([fullExportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const currentDateForFilename = new Date();
    const filename = `chat_export_${currentDateForFilename.getFullYear()}-${String(currentDateForFilename.getMonth() + 1).padStart(2, '0')}-${String(currentDateForFilename.getDate()).padStart(2, '0')}_${String(currentDateForFilename.getHours()).padStart(2, '0')}-${String(currentDateForFilename.getMinutes()).padStart(2, '0')}.txt`;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log(`${HOOK_NAME} Chat export downloaded as ${filename}.`);
    messageManager.addMessage(`Chat history (including system instruction) has been exported as ${filename}.`, Sender.AI);
  }, [messageManager, chatSettings.aiName, chatSettings.userName, chatSettings.systemInstruction, chatSettings.DEFAULT_SYSTEM_INSTRUCTION]);

  const handleFileSelected = useCallback(async (
    event: React.ChangeEvent<HTMLInputElement>,
    currentUserName: string, // Passed explicitly as settings hook might not be updated yet if names change
    currentAiName: string,   // Same as above
    currentSystemInstruction: string // Current from chatSettings
  ) => {
    console.log(`${HOOK_NAME} handleFileSelected triggered.`);
    const file = event.target.files?.[0];
    if (!file) {
      console.log(`${HOOK_NAME} No file selected.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const fileContent = e.target?.result as string;
      if (!fileContent) {
        messageManager.addMessage(`Failed to read file: ${file.name}. File appears empty.`, Sender.AI);
        return;
      }

      const parsedResult = parseChatExportFile(fileContent, currentUserName, currentAiName);

      if (parsedResult) {
        const { historyEntries, systemInstructionFromFile } = parsedResult;
        let instructionToUseForReset = currentSystemInstruction;
        let feedbackMessage = "";

        if (systemInstructionFromFile !== null) {
          if (systemInstructionFromFile === "") {
            instructionToUseForReset = chatSettings.resetSystemInstructionState();
            feedbackMessage = `System instruction reset to default based on loaded file (${file.name}). `;
          } else {
            instructionToUseForReset = systemInstructionFromFile;
            chatSettings.setSystemInstructionState(instructionToUseForReset);
            feedbackMessage = `System instruction loaded from file (${file.name}). `;
          }
        } else {
          feedbackMessage = `No system instruction found in ${file.name}. Current instruction ("${currentSystemInstruction}") retained. `;
        }

        if (historyEntries.length > 0) {
          // Clear local storage history before loading new one
          localStorage.removeItem('geminiChatHistory'); // Direct access, consider moving to messageManager
          const resetSuccess = resetChatSession(historyEntries, instructionToUseForReset);
          if (resetSuccess) {
            messageManager.setAllMessages(messageManager.chatHistoryToAppMessages(historyEntries));
            await messageManager.saveCurrentChatHistoryToLocal();
            messageManager.addMessage(feedbackMessage + `Chat history with ${historyEntries.length} messages loaded successfully.`, Sender.AI);
          } else {
            messageManager.addMessage(`Failed to reset chat session with loaded history from ${file.name}.`, Sender.AI);
          }
        } else if (systemInstructionFromFile !== null) { // Only system instruction was in file
          const resetSuccess = resetChatSession([], instructionToUseForReset);
          if (resetSuccess) {
            messageManager.setAllMessages([]); // Clear UI messages
            await messageManager.saveCurrentChatHistoryToLocal(); // Save empty history with new instruction
            messageManager.addMessage(feedbackMessage + `No messages loaded, but system instruction was applied.`, Sender.AI);
          } else {
            messageManager.addMessage(`Failed to apply system instruction from ${file.name}.`, Sender.AI);
          }
        } else {
          messageManager.addMessage(`Failed to load chat history: Invalid file format or no valid content found in ${file.name}.`, Sender.AI);
        }
      } else {
        messageManager.addMessage(`Failed to load chat history: Could not parse ${file.name}. File format might be severely corrupted.`, Sender.AI);
      }
    };
    reader.onerror = () => {
      messageManager.addMessage(`Error reading file ${file.name}.`, Sender.AI);
      console.error(`${HOOK_NAME} Error reading file:`, reader.error);
    };
    reader.readAsText(file);

    if (event.target) {
      event.target.value = ''; // Clear file input
    }
  }, [messageManager, chatSettings, parseChatExportFile]);

  return {
    exportChatToFile,
    handleFileSelected,
  };
}
