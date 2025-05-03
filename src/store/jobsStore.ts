import { create } from 'zustand';
import { Job, JobType } from '../types';

// Sample initial jobs for testing
const initialJobs: Job[] = [
  {
    id: 1,
    type: 'photo',
    itemId: 1,
    originalImage: 'https://images.pexels.com/photos/6347548/pexels-photo-6347548.jpeg?auto=compress&cs=tinysrgb&w=500',
    submitDate: new Date(Date.now() - 3600000).toISOString(),
    createDate: new Date(Date.now() - 3600000).toISOString(),
    url: 'https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg?auto=compress&cs=tinysrgb&w=500',
    prompt: 'White shirt on mannequin, studio lighting, minimalist background',
    submitee: 'user1',
    meta: { status: 'completed' }
  },
  {
    id: 2,
    type: 'video',
    itemId: 2,
    submitDate: new Date(Date.now() - 7200000).toISOString(),
    createDate: new Date(Date.now() - 7200000).toISOString(),
    url: 'https://example.com/videos/shirt1.mp4',
    prompt: 'Rotating view of white shirt, professional lighting',
    submitee: 'user1',
    meta: { status: 'processing' }
  }
];

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
  jobs: initialJobs,
  isLoading: false,
  error: null,
  
  fetchJobs: async () => {
    if (get().jobs.length) {
      return;
    }
    
    set({ isLoading: true, error: null });
    try {
      // Simulate API fetch
      await new Promise(resolve => setTimeout(resolve, 800));
      set({ jobs: initialJobs, isLoading: false });
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
      await new Promise(resolve => setTimeout(resolve, 600));
      
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
    return get().jobs.filter(job => job.itemId === itemId && job.type === type);
  }
}));