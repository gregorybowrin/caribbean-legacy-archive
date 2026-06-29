import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const batch70 = JSON.parse(fs.readFileSync('/Users/gregorybowrin/.gemini/antigravity/brain/1be95931-7a45-4768-a65d-ba96eef46ecb/scratch/batch70.json', 'utf8'));
const batch71 = JSON.parse(fs.readFileSync('/Users/gregorybowrin/.gemini/antigravity/brain/1be95931-7a45-4768-a65d-ba96eef46ecb/scratch/batch71.json', 'utf8'));

async function run() {
  for (const b of [...batch70, ...batch71]) {
    console.log(`Updating ${b.name} (${b.id}) - words: ${b.bio.split(/\s+/).length}`);
    const { error } = await supabase.from('figures').update({ bio: b.bio, contributions: b.contributions }).eq('id', b.id);
    if (error) console.error("Error updating:", error);
    else console.log(`Successfully updated ${b.name} in DB!`);
  }
}

run();
