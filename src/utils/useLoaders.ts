import { useEffect } from "react";
import { useJobsStore } from "../store/jobsStore";
import { useItemsStore } from "../store/itemsStore";
import { useJobCombineStore } from "../store/jobCombineStore";


export function useLoaders() {
  const { fetchJobs } = useJobsStore();
  const { fetchItems } = useItemsStore();
  const { fetchJobCombines } = useJobCombineStore();
  const { fetchJobCombineItems } = useJobCombineStore();

  useEffect(() => { fetchJobs() }, [fetchJobs])
  useEffect(() => { fetchItems() }, [fetchItems])
  useEffect(() => { fetchJobCombines(); }, [fetchJobCombines]);
  useEffect(() => { fetchJobCombineItems(); }, [fetchJobCombineItems]);
}