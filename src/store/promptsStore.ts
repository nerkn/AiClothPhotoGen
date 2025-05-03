import { create } from 'zustand';
import { ItemType, ItemTypePrompt } from '../types';
import { supabase } from '../utils/supabase';
import { Tables } from '../types/supabaseTypes';

// Sample initial data
const initialPrompts: ItemTypePrompt[] = [
  {
    type: 'shirt',
    prompt: 'A high-quality shirt with perfect folds, studio lighting, minimalist background, fashion photography'
  },
  {
    type: 'trousers',
    prompt: 'Stylish trousers on a mannequin, professional lighting, clean background, fashion catalog style'
  },
  {
    type: 'shoes',
    prompt: 'Modern shoes displayed on white surface, soft shadows, professional product photography'
  },
  {
    type: 'hat',
    prompt: 'Elegant hat on a stand, soft studio lighting, neutral background, high-end fashion look'
  },
  {
    type: 'scarf',
    prompt: 'Luxurious scarf with soft draping, gentle lighting, clean background, premium fashion photography'
  }
];

interface PromptsState {
  prompts: ItemTypePrompt[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchPrompts: () => Promise<void>;
  addPrompt: (prompt: ItemTypePrompt) => Promise<void>;
  updatePrompt: (type: ItemType, newPrompt: string) => Promise<void>;
  getPromptByType: (type: ItemType) => string;
}

export const usePromptsStore = create<PromptsState>((set, get) => ({
  prompts: initialPrompts,
  isLoading: false,
  error: null,
  
  fetchPrompts: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API fetch
      
      const { data , status } = await supabase 
        .from('categories')
        .select('prompts')
      if(data) 
        set({ prompts: data.map(d=>d.prompts) as ItemTypePrompt[], isLoading: false });
      else
        set({ prompts: initialPrompts, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch prompts', 
        isLoading: false 
      });
    }
  },
  
  addPrompt: async (prompt) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      set(state => {
        // If the prompt for this type already exists, don't add it again
        if (state.prompts.some(p => p.type === prompt.type)) {
          return state;
        }
        
        return { 
          prompts: [...state.prompts, prompt],
          isLoading: false
        };
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add prompt', 
        isLoading: false 
      });
    }
  },
  
  updatePrompt: async (type, newPrompt) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      set(state => ({
        prompts: state.prompts.map(prompt => 
          prompt.type === type ? { ...prompt, prompt: newPrompt } : prompt
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update prompt', 
        isLoading: false 
      });
    }
  },
  
  getPromptByType: (type) => {
    const prompt = get().prompts.find(p => p.type === type);
    return prompt ? prompt.prompt : '';
  }
}));