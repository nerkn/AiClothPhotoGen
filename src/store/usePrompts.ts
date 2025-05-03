import { useState } from 'react';
import { supabase } from '../utils/supabase';

export const usePrompts = () => {
  const [prompts, setPrompts] = useState<string[]>(['']);
  const getPromptByType = async (name: string) => { 
    const { data:categories } = await supabase
      .from('categories')
      .select('prompts, name')

    if (categories)
      setPrompts(categories.filter(c=>c.name==name).map(d => {
        try {
          return JSON.parse(d.prompts || '');
        } catch (error) {
          return []
        }
      }).flat() || [] );

  }
  return { prompts, setPrompts, getPromptByType };
};
