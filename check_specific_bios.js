import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkSpecific() {
  const { data, error } = await supabase
    .from('figures')
    .select('id, name, bio')
    .or('name.ilike.%Nelson%,name.ilike.%Césaire%,name.ilike.%Cesaire%');
    
  if (error) {
    console.error(error);
    return;
  }
  
  data.forEach(f => {
    const wordLen = f.bio ? f.bio.trim().split(/\s+/).length : 0;
    console.log(`- ${f.name} (${f.id}): ${wordLen} words`);
  });
}

checkSpecific();
