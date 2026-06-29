import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkA() {
  const { data, error } = await supabase.from('figures').select('id, name, bio');
  if (error) { console.error(error); return; }

  const shortBios = data.filter(f => !f.bio || f.bio.trim().split(/\s+/).length < 1000);
  shortBios.sort((a, b) => a.name.localeCompare(b.name));

  console.log("First 40 short bios alphabetically:");
  shortBios.slice(0, 40).forEach(f => {
    console.log(`${f.name} (${f.id}): ${f.bio ? f.bio.trim().split(/\s+/).length : 0} words`);
  });
}

checkA();
