import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

export function useCategories() {
  const [cats, catsSet] = useState([]);
  useEffect(() => {
    supabase.from('categories').select('*')
      .then(({ data, error }) => {
        if (error) {
          console.error('Error loading categories:', error);
          return;
        }
        catsSet(data || []);
      })
  }, []);
  function getPromptsByType(name: string) {
    let fcat = cats.find((cat: any) => cat.name === name)?.prompts || []
    if (!fcat)
      return []
    try {
      return JSON.parse(fcat.prompts);
    } catch (error) {
      return []
    }
  }

  return { cats, getPromptsByType };
}
