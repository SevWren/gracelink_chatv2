
import { useState, useCallback, useEffect } from 'react';

const AI_NAME_LOCAL_STORAGE_KEY = 'chatAiName';
const USER_NAME_LOCAL_STORAGE_KEY = 'chatUserName';
const SYSTEM_INSTRUCTION_LOCAL_STORAGE_KEY = 'geminiSystemInstruction';
export const DEFAULT_SYSTEM_INSTRUCTION = `You are a helpful and friendly AI assistant. Please use Markdown formatting in your responses for clarity and structure. This interface supports:
- Headers (\`# H1\` to \`###### H6\`)
- Emphasis (\`**bold**\`, \`*italic*\`, \`~~strikethrough~~\`)
- Lists (ordered: \`1. Item\`, unordered: \`* Item\` or \`- Item\`, nested)
- Task Lists (Checklists):
    - \`* [x] Completed task\`
    - \`* [ ] Incomplete task\`
    - \`- [x] Another completed task\`
    - \`- [ ] Another pending task\`
- Links (\`[link text](URL)\`)
- Blockquotes (\`> Quoted text\`)
- Inline code (\`\` \`inline_code()\` \`\`)
- Fenced code blocks (e.g., \`\`\`python\\nprint("Hello")\\n\`\`\`). Please specify the language.
- Tables (GitHub Flavored Markdown syntax)
- Horizontal Rules (\`---\`)

When presenting code, always use fenced code blocks. For structured information, consider lists, tables, or task lists.`;
const HOOK_NAME = "[useChatSettings]";

export interface ChatSettingsManager {
  aiName: string;
  userName: string;
  systemInstruction: string;
  DEFAULT_SYSTEM_INSTRUCTION: string;
  loadStoredSettings: () => { loadedAiName: string, loadedUserName: string, loadedSystemInstruction: string };
  setAiNameState: (name: string) => void;
  setUserNameState: (name: string) => void;
  setSystemInstructionState: (instruction: string) => void;
  resetSystemInstructionState: () => string;
}


export function useChatSettings(): ChatSettingsManager {
  const [aiName, setAiNameInternal] = useState<string>('AI');
  const [userName, setUserNameInternal] = useState<string>('User');
  const [systemInstruction, setSystemInstructionInternal] = useState<string>(DEFAULT_SYSTEM_INSTRUCTION);

  const loadStoredSettings = useCallback(() => {
    console.log(`${HOOK_NAME} Attempting to load chat settings from localStorage.`);
    let loadedAiName = 'AI';
    let loadedUserName = 'User';
    let loadedSystemInstruction = DEFAULT_SYSTEM_INSTRUCTION;
    try {
      const storedAiName = localStorage.getItem(AI_NAME_LOCAL_STORAGE_KEY);
      const storedUserName = localStorage.getItem(USER_NAME_LOCAL_STORAGE_KEY);
      const storedSystemInstruction = localStorage.getItem(SYSTEM_INSTRUCTION_LOCAL_STORAGE_KEY);

      if (storedAiName) loadedAiName = storedAiName;
      if (storedUserName) loadedUserName = storedUserName;
      if (storedSystemInstruction) loadedSystemInstruction = storedSystemInstruction;
      
      setAiNameInternal(loadedAiName);
      setUserNameInternal(loadedUserName);
      setSystemInstructionInternal(loadedSystemInstruction);
      console.log(`${HOOK_NAME} Chat settings loaded. AI: "${loadedAiName}", User: "${loadedUserName}", Instruction: "${loadedSystemInstruction}"`);
    } catch (e) {
      console.error(`${HOOK_NAME} Error loading chat settings from localStorage:`, e);
      // Fallback to defaults if loading fails, which are already set.
    }
    return { loadedAiName, loadedUserName, loadedSystemInstruction };
  }, []);
  
  // Persist aiName to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(AI_NAME_LOCAL_STORAGE_KEY, aiName);
    } catch (e) {
      console.error(`${HOOK_NAME} Failed to save AI Name to localStorage:`, e);
    }
  }, [aiName]);

  // Persist userName to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(USER_NAME_LOCAL_STORAGE_KEY, userName);
    } catch (e) {
      console.error(`${HOOK_NAME} Failed to save User Name to localStorage:`, e);
    }
  }, [userName]);

  // Persist systemInstruction to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SYSTEM_INSTRUCTION_LOCAL_STORAGE_KEY, systemInstruction);
    } catch (e) {
      console.error(`${HOOK_NAME} Failed to save System Instruction to localStorage:`, e);
    }
  }, [systemInstruction]);


  const setAiNameState = useCallback((name: string) => {
    const finalName = name.trim() || 'AI';
    setAiNameInternal(finalName);
    console.log(`${HOOK_NAME} AI name updated to: "${finalName}"`);
  }, []);

  const setUserNameState = useCallback((name: string) => {
    const finalName = name.trim() || 'User';
    setUserNameInternal(finalName);
    console.log(`${HOOK_NAME} User name updated to: "${finalName}"`);
  }, []);

  const setSystemInstructionState = useCallback((instruction: string) => {
    const finalInstruction = instruction.trim() === "" ? DEFAULT_SYSTEM_INSTRUCTION : instruction.trim();
    setSystemInstructionInternal(finalInstruction);
    console.log(`${HOOK_NAME} System instruction updated to: "${finalInstruction}"`);
  }, []);

  const resetSystemInstructionState = useCallback((): string => {
    setSystemInstructionInternal(DEFAULT_SYSTEM_INSTRUCTION);
    console.log(`${HOOK_NAME} System instruction reset to default.`);
    return DEFAULT_SYSTEM_INSTRUCTION;
  }, []);

  return {
    aiName,
    userName,
    systemInstruction,
    DEFAULT_SYSTEM_INSTRUCTION, // Exporting for use in App.tsx if needed for comparison
    loadStoredSettings,
    setAiNameState,
    setUserNameState,
    setSystemInstructionState,
    resetSystemInstructionState,
  };
}
