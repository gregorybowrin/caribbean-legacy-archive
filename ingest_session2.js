import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const COMBINED_FILE = '/Users/gregorybowrin/.gemini/antigravity/brain/1be95931-7a45-4768-a65d-ba96eef46ecb/scratch/combined_session2.json';

async function ingest() {
  const data = JSON.parse(fs.readFileSync(COMBINED_FILE, 'utf8'));
  let successCount = 0;
  for (const fig of data) {
    if (!fig.bio || fig.bio.trim() === '') { console.warn(`Empty bio for "${fig.name}"`); continue; }
    const updates = { bio: fig.bio };
    if (fig.major_contributions) updates.contributions = Array.isArray(fig.major_contributions) ? fig.major_contributions.join('\n') : fig.major_contributions;
    else if (fig.contributions) updates.contributions = Array.isArray(fig.contributions) ? fig.contributions.join('\n') : fig.contributions;
    
    let updated = false;
    if (fig.id) {
      const { data: r, error } = await supabase.from('figures').update(updates).eq('id', fig.id).select();
      if (!error && r && r.length > 0) { console.log(`✅ "${fig.name}" via ID`); updated = true; }
      else if (error) console.error(`ID error for "${fig.name}":`, error.message);
    }
    if (!updated) {
      const clean = fig.name.replace(/["']/g, '');
      const { data: db } = await supabase.from('figures').select('id,name').ilike('name', `%${clean}%`);
      if (db && db.length > 0) {
        const { data: r2, error: e2 } = await supabase.from('figures').update(updates).eq('id', db[0].id).select();
        if (!e2 && r2 && r2.length > 0) { console.log(`✅ "${fig.name}" via name match`); updated = true; }
        else console.error(`Name update error "${fig.name}":`, e2?.message);
      } else console.error(`❌ No match: "${fig.name}"`);
    }
    if (updated) successCount++;
  }
  console.log(`\nDone. Updated: ${successCount}/${data.length}`);
}
ingest();
