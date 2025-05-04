import { useEffect } from "react";
import { useJobsStore } from "../store/jobsStore";
import { useItemsStore } from "../store/itemsStore";


export function useLoaders() {
    const { fetchJobs } = useJobsStore();
    const {   fetchItems } = useItemsStore();
  useEffect(()=>{fetchJobs()}, [fetchJobs]) 
  useEffect(()=>{fetchItems()}, [fetchItems]) 
}