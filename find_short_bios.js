import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function findShort() {
  const { data, error } = await supabase
    .from('figures')
    .select('id, name, bio');
    
  if (error) {
    console.error(error);
    return;
  }
  
  const shortBios = data.filter(f => !f.bio || f.bio.trim().split(/\s+/).length < 1000);
  console.log(`Total short bios (<1000 words): ${shortBios.length}`);
  
  // Print all of them so we can see what needs expansion or ingestion
  shortBios.slice(0, 30).forEach(f => {
    const wordLen = f.bio ? f.bio.trim().split(/\s+/).length : 0;
    console.log(`${f.name} (${f.id}): ${wordLen} words`);
  });
}

findShort();
