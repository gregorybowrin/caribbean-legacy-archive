import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const SCRATCH = '/Users/gregorybowrin/.gemini/antigravity/brain/1be95931-7a45-4768-a65d-ba96eef46ecb/scratch';

async function ingest() {
  const all = [];
  for (const f of ['batch_s4.json', 'batch_s5.json']) {
    const data = JSON.parse(fs.readFileSync(`${SCRATCH}/${f}`, 'utf8'));
    all.push(...data);
  }
  
  let success = 0;
  for (const fig of all) {
    const updates = { bio: fig.bio };
    if (fig.contributions) updates.contributions = Array.isArray(fig.contributions) ? fig.contributions.join('\n') : fig.contributions;

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
        else console.error(`Name error "${fig.name}":`, e2?.message);
      } else console.error(`❌ No DB match: "${fig.name}"`);
    }
    if (updated) success++;
  }
  console.log(`\nDone. ${success}/${all.length} updated.`);
}
ingest();
