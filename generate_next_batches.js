import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('figures').select('id, name, image_url');
  if (error) { console.error(error); return; }

  let searched = [];
  if (fs.existsSync('searched_figures.json')) {
    searched = JSON.parse(fs.readFileSync('searched_figures.json'));
  }

  // Also include anything from image_batch_*.json that we just did
  for (let i=1; i<=5; i++) {
    if (fs.existsSync(`image_batch_${i}.json`)) {
      const batch = JSON.parse(fs.readFileSync(`image_batch_${i}.json`));
      batch.forEach(b => searched.push(b.id));
    }
  }

  const searchedSet = new Set(searched);
  
  // Find missing images that haven't been searched yet
  const missing = data.filter(d => (!d.image_url || d.image_url.trim() === '') && !searchedSet.has(d.id));

  console.log(`Remaining missing to search: ${missing.length}`);

  // Create next 5 batches (39 to 43)
  for (let i = 0; i < 5; i++) {
    const batch = missing.slice(i*10, (i+1)*10);
    if (batch.length > 0) {
      fs.writeFileSync(`image_batch_${i+6}.json`, JSON.stringify(batch, null, 2));
      console.log(`Created image_batch_${i+6}.json with ${batch.length} figures`);
      batch.forEach(b => searchedSet.add(b.id));
    }
  }

  // Save the updated searched list
  fs.writeFileSync('searched_figures.json', JSON.stringify(Array.from(searchedSet), null, 2));
}

run();
