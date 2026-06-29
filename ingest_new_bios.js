import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function ingest() {
  let successCount = 0;
  for (let i = 1; i <= 10; i++) {
    const file = `bio_result_${i}.json`;
    if (!fs.existsSync(file)) {
      console.warn(`File not found: ${file}`);
      continue;
    }
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    for (const fig of data) {
      if (!fig.bio || fig.bio.trim() === '') {
        console.warn(`Empty bio for "${fig.name}" in ${file}`);
        continue;
      }
      
      const updates = { bio: fig.bio };
      if (fig.contributions) {
        updates.contributions = Array.isArray(fig.contributions) 
          ? fig.contributions.join('\n') 
          : fig.contributions;
      }
      
      let updated = false;
      // 1. Try updating by ID first if ID is present
      if (fig.id) {
        const { data: updateRes, error } = await supabase
          .from('figures')
          .update(updates)
          .eq('id', fig.id)
          .select();
        if (!error && updateRes && updateRes.length > 0) {
          console.log(`Successfully ingested "${fig.name}" via ID match.`);
          updated = true;
        }
      }
      
      // 2. If not updated by ID, fall back to name matching
      if (!updated) {
        const cleanName = fig.name.replace(/["']/g, '');
        const { data: dbFig, error: selectError } = await supabase
          .from('figures')
          .select('id, name')
          .ilike('name', `%${cleanName}%`);
          
        if (selectError) {
          console.error(`Select error for "${fig.name}":`, selectError);
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
            console.log(`Successfully ingested "${fig.name}" via Name match ("${dbFig[0].name}").`);
            updated = true;
          } else {
            console.error(`Update error for "${fig.name}" via Name match:`, updateError);
          }
        } else {
          console.error(`No match found in DB for name: "${fig.name}"`);
        }
      }
      
      if (updated) {
        successCount++;
      }
    }
    console.log(`Finished processing ${file}`);
  }
  console.log(`Ingestion completed. Total successfully updated figures: ${successCount}/20`);
}

ingest();
