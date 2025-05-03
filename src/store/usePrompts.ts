import { useState } from 'react';
import { askAi } from '../utils/askAi';

export const usePrompts = () => {
  const [prompts, setPrompts] = useState<string[]>(['']);

  const getPromptByType = async (name: string) => {
    const aiResponse = await askAi('aicloth', name);
    console.log('AI Response:', aiResponse);
    setPrompts(aiResponse);
  };

  return {prompts,setPrompts, getPromptByType };
};
 