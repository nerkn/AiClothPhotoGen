
import { JobCombine, JobCombineItem } from '../types';
export interface JobCombineState {
  jobCombines: JobCombine[];
  jobCombineItems: JobCombineItem[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchJobCombines: () => Promise<void>;
  fetchJobCombineItems: () => Promise<void>;
  addJobCombine: (jobCombine: Omit<JobCombine, 'id'>) => Promise<void>;
  updateJobCombine: (id: number, updates: Partial<JobCombine>) => Promise<void>;
  deleteJobCombine: (id: number) => Promise<void>;
  getJobCombineItemsByJobId: (jobId: number) => JobCombineItem[];
}