import { create } from 'zustand';
import { supabase } from '../utils/supabase';
import { JobCombineState } from './jobCombineStore.type';


export const useJobCombineStore = create<JobCombineState>((set, get) => ({
  jobCombines: [],
  jobCombineItems: [],
  isLoading: false,
  error: null,

  fetchJobCombines: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.from('jobCombine').select();
      if (error) throw error;
      set({ jobCombines: data || [], isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch job combines', 
        isLoading: false 
      });
    }
  },

  fetchJobCombineItems: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.from('jobCombineItems').select();
      if (error) throw error;
      set({ jobCombineItems: data || [], isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch job combine items', 
        isLoading: false 
      });
    }
  },

  addJobCombine: async (jobCombine) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.from('jobCombine').insert(jobCombine).single();
      if (error) throw error;
      set((state) => ({ 
        jobCombines: [...state.jobCombines, data],
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add job combine', 
        isLoading: false 
      });
    }
  },

  updateJobCombine: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.from('jobCombine').update(updates).eq('id', id);
      if (error) throw error;
      set((state) => ({
        jobCombines: state.jobCombines.map((jobCombine) => 
          jobCombine.id === id ? { ...jobCombine, ...updates } : jobCombine
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update job combine', 
        isLoading: false 
      });
    }
  },

  deleteJobCombine: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.from('jobCombine').delete().eq('id', id);
      if (error) throw error;
      set((state) => ({
        jobCombines: state.jobCombines.filter((jobCombine) => jobCombine.id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete job combine', 
        isLoading: false 
      });
    }
  },

  getJobCombineItemsByJobId: (jobId) => {
    return get().jobCombineItems.filter((item) => item.jobId === jobId);
  },
}));