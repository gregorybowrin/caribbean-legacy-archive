import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('figures').select('id, name, bio');
  if (error) console.error(error);
  else {
    let missingOrShort = [];
    let empty = 0;
    for (const fig of data) {
      if (!fig.bio || fig.bio.trim() === '') {
        empty++;
      } else if (fig.bio.length < 500) { // arbitrary threshold for "not a 1000+ word bio"
        missingOrShort.push(fig.name);
      }
    }
    console.log(`Total figures: ${data.length}`);
    console.log(`Completely empty bios: ${empty}`);
    console.log(`Short bios (< 500 chars): ${missingOrShort.length}`);
    if (missingOrShort.length > 0) {
      console.log('First 10 short bios:');
      console.log(missingOrShort.slice(0, 10));
    }
  }
}
check();
