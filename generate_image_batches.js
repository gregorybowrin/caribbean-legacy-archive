import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('figures').select('id, name, image_url');
  if (error) console.error(error);
  else {
    const missing = data.filter(d => !d.image_url || d.image_url.trim() === '');
    for (let i = 0; i < 5; i++) {
        const batch = missing.slice(i*10, (i+1)*10);
        fs.writeFileSync(`image_batch_${i+1}.json`, JSON.stringify(batch, null, 2));
    }
  }
}
check();
