import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const targetNames = [
  'Hunter J. Francois',
  'Rick Wayne',
  'Robert Lee',
  'Sir Sidney Poitier',
  'Sanité Bélair',
  'Sir Lynden Pindling',
  'Dame Ivy Dumont',
  'Sir Stafford Sands',
  'Timothy Gibson',
  'Dr. Cleveland Eneas',
  'Milo Butler',
  'Paul Meeres',
  'Captain Matthew Lettsome',
  'Norman Saunders',
  'Queen Mathilda',
  'Rufo Wever',
  'Dame Doris Johnson',
  'Robert Rogers',
  'Ercilia Pepín',
  'Sir Roland Symonette'
];

async function check() {
  for (const name of targetNames) {
    // try exact match or ilike
    const clean = name.replace(/["']/g, '');
    const { data, error } = await supabase.from('figures').select('id, name').ilike('name', `%${clean}%`);
    if (error) {
      console.error(name, error);
    } else if (data && data.length > 0) {
      console.log(`Target: "${name}" -> DB Match: "${data[0].name}" (ID: ${data[0].id})`);
      if (data.length > 1) {
        console.log(`  WARNING: Multiple matches found: ${data.map(d => d.name).join(', ')}`);
      }
    } else {
      console.log(`Target: "${name}" -> DB Match: NOT FOUND`);
    }
  }
}
check();
