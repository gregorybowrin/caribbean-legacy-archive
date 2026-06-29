import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
   const names = ["Theodolph Faulkner", "Nanny of the Maroons", "Paul Bogle"];
   for (const n of names) {
       const {data} = await supabase.from('figures').select('name, bio').eq('name', n);
       console.log(n, data && data[0] && data[0].bio ? "Has Bio" : "No Bio");
   }
}
check();
