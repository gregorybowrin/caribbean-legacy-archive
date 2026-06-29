import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('figures').select('id, name, image_url');
  if (error) console.error(error);
  else {
    const missing = data.filter(d => !d.image_url || d.image_url.trim() === '');
    console.log(`Total figures: ${data.length}`);
    console.log(`Missing images: ${missing.length}`);
    if (missing.length > 0) {
      console.log('First few missing:');
      console.log(missing.slice(0, 5).map(m => m.name));
    }
  }
}
check();
