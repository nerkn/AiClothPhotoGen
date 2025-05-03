import { createClient, User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Database } from "../types/supabaseTypes";


  console.error("Dumping all environment variables:", import.meta.env);
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_KEY) {
  console.error("Supabase URL or Key is missing in environment variables.");
  throw new Error("Build process aborted due to missing Supabase configuration.");
}
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
export const supabase = createClient<Database>(supabaseUrl, supabaseKey);


export const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
};

export const getCurrentUser = () => {
  return supabase.auth.getUser();
};

export const useCurrentUser = () => {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    supabase.auth.getUser().then(({ data, error }) => {
      if (error) {
        setError(error.message);
      } else {
        setUser(data.user);
      }
    }).catch((err) => { setError(err.message);
    }).finally(() => setLoading(false))
  }, []);
  return { user, loading, error };
};

export const requireLogin = async (callback: () => Promise<any>) => {
  const { data: user } = await getCurrentUser();
  if (!user) {
    throw new Error('User is not logged in');
  }
  return callback();
};