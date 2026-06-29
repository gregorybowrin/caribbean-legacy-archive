import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const COMBINED_FILE = '/Users/gregorybowrin/.gemini/antigravity/brain/1be95931-7a45-4768-a65d-ba96eef46ecb/scratch/combined_new_bios.json';

async function ingest() {
  const data = JSON.parse(fs.readFileSync(COMBINED_FILE, 'utf8'));
  let successCount = 0;

  for (const fig of data) {
    if (!fig.bio || fig.bio.trim() === '') {
      console.warn(`Empty bio for "${fig.name}"`);
      continue;
    }

    const updates = { bio: fig.bio };
    if (fig.major_contributions) {
      updates.contributions = Array.isArray(fig.major_contributions)
        ? fig.major_contributions.join('\n')
        : fig.major_contributions;
    } else if (fig.contributions) {
      updates.contributions = Array.isArray(fig.contributions)
        ? fig.contributions.join('\n')
        : fig.contributions;
    }
    let updated = false;

    // 1. Try updating by ID first
    if (fig.id) {
      const { data: updateRes, error } = await supabase
        .from('figures')
        .update(updates)
        .eq('id', fig.id)
        .select();
      if (!error && updateRes && updateRes.length > 0) {
        console.log(`✅ Ingested "${fig.name}" via ID match.`);
        updated = true;
      } else if (error) {
        console.error(`ID update error for "${fig.name}":`, error.message);
      }
    }

    // 2. Fall back to name matching
    if (!updated) {
      const cleanName = fig.name.replace(/["']/g, '');
      const { data: dbFig, error: selectError } = await supabase
        .from('figures')
        .select('id, name')
        .ilike('name', `%${cleanName}%`);

      if (selectError) {
        console.error(`Select error for "${fig.name}":`, selectError.message);
        continue;
      }

      if (dbFig && dbFig.length > 0) {
        const targetId = dbFig[0].id;
        const { data: updateRes, error: updateError } = await supabase
          .from('figures')
          .update(updates)
          .eq('id', targetId)
          .select();
        if (!updateError && updateRes && updateRes.length > 0) {
          console.log(`✅ Ingested "${fig.name}" via Name match ("${dbFig[0].name}").`);
          updated = true;
        } else {
          console.error(`Update error for "${fig.name}" via Name match:`, updateError?.message);
        }
      } else {
        console.error(`❌ No match found in DB for: "${fig.name}"`);
      }
    }

    if (updated) successCount++;
  }

  console.log(`\nIngestion complete. Updated: ${successCount}/${data.length}`);
}

ingest();
