import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function check() {
  const names = [
    'Maurice Bishop',
    'Juan Pablo Duarte',
    'Sir Arthur Lewis',
    'Sesenne Descartes',
    'Hunter J. Francois',
    'Dame Ivy Dumont'
  ];
  for (const name of names) {
    const { data, error } = await supabase.from('figures').select('name, bio').ilike('name', `%${name}%`);
    if (error) {
      console.error(name, error);
    } else if (data && data.length > 0) {
      console.log(`${name}: bio length = ${data[0].bio ? data[0].bio.length : 0}`);
    } else {
      console.log(`${name}: not found`);
    }
  }
}
check();
