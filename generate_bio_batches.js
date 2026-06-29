import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('figures').select('id, name, bio');
  if (error) { console.error(error); return; }

  const shortBios = data.filter(f => !f.bio || f.bio.length < 500);
  console.log(`Remaining figures to write bios for: ${shortBios.length}`);

  let batchNum = 1;
  const batchSize = 2; // small batches to avoid token limit
  for (let i = 0; i < shortBios.length; i += batchSize) {
    const batch = shortBios.slice(i, i + batchSize).map(f => ({ id: f.id, name: f.name }));
    fs.writeFileSync(`bio_batch_${batchNum}.json`, JSON.stringify(batch, null, 2));
    batchNum++;
  }
  console.log(`Generated ${batchNum - 1} bio batch files.`);
}
run();
