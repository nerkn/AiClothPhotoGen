import { useEffect } from "react";
import { useJobsStore } from "../store/jobsStore";


export function useLoaders() {
    const { fetchJobs } = useJobsStore();
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]) 
}