import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // During build, Next.js might not have these variables immediately available 
  // in all contexts if they aren't provided in the environment.
  // We'll use a placeholder for now to avoid breaking the build if they are missing,
  // but they MUST be provided for the actual data fetching.
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);
