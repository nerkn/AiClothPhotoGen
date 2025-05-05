import { create } from 'zustand';
import { Job, JobType } from '../types';
import { supabase } from '../utils/supabase';
 
interface JobsState {
  jobs: Job[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchJobs: () => Promise<void>;
  addJob: (job: Omit<Job, 'id' | 'createDate'>) => Promise<void>;
  updateJob: (id: number, updates: Partial<Job>) => Promise<void>;
  deleteJob: (id: number) => Promise<void>;
  getJobsByItemId: (itemId: number) => Job[];
  getJobsByType: (type: JobType) => Job[];
  getJobsByItemIdAndType: (itemId: number, type: JobType) => Job[];
}

export const useJobsStore = create<JobsState>((set, get) => ({
  jobs: [],
  isLoading: false,
  error: null,
  
  fetchJobs: async () => {
    console.log('Fetching jobs...', get().jobs);
    if (get().jobs.length) {
      return;
    }
    
    set({ isLoading: true, error: null });
    try { 
      supabase.from('jobs').select().then(({data}) => {
        console.log('Fetched jobs:', data);
        set({ jobs: data, isLoading: false });
      })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch jobs', 
        isLoading: false 
      });
    }
  },
  
  addJob: async (job) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const newJob: Job = {
        ...job,
        id: new Date().getTime(),
        createDate: new Date().toISOString()
      };
      
      set(state => ({ 
        jobs: [...state.jobs, newJob],
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add job', 
        isLoading: false 
      });
    }
  },
  
  updateJob: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        jobs: state.jobs.map(job => 
          job.id === id ? { ...job, ...updates } : job
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update job', 
        isLoading: false 
      });
    }
  },
  
  deleteJob: async (id) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        jobs: state.jobs.filter(job => job.id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete job', 
        isLoading: false 
      });
    }
  },
  
  getJobsByItemId: (itemId) => {
    return get().jobs.filter(job => job.itemId === itemId);
  },
  
  getJobsByType: (type) => {
    return get().jobs.filter(job => job.type === type);
  },
  
  getJobsByItemIdAndType: (itemId, type) => {
    console.log('getJobsByItemIdAndType', itemId, type, get().jobs);
    return get().jobs.filter(job => job.itemId === itemId && job.type === type);
  }
}));