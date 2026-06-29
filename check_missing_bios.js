import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkLengths() {
  const { data, error } = await supabase
    .from('figures')
    .select('id, name, bio');
    
  if (error) {
    console.error(error);
    return;
  }
  
  let under500Chars = 0;
  let under1000Words = 0;
  let over1000Words = 0;
  
  const shortList = [];

  data.forEach(f => {
    if (!f.bio) {
      under500Chars++;
      under1000Words++;
      shortList.push({ id: f.id, name: f.name, words: 0 });
    } else {
      const charLen = f.bio.length;
      const wordLen = f.bio.trim().split(/\s+/).length;
      if (charLen < 500) under500Chars++;
      if (wordLen < 1000) {
        under1000Words++;
        shortList.push({ id: f.id, name: f.name, words: wordLen });
      } else {
        over1000Words++;
      }
    }
  });

  console.log(`Total figures: ${data.length}`);
  console.log(`Under 500 chars: ${under500Chars}`);
  console.log(`Under 1000 words: ${under1000Words}`);
  console.log(`1000+ words: ${over1000Words}`);
  
  // Sort shortList by words ascending
  shortList.sort((a, b) => a.words - b.words);
  console.log('Sample under 1000 words (first 20):');
  shortList.slice(0, 20).forEach(s => console.log(`- ${s.name}: ${s.words} words (${s.id})`));
}

checkLengths();
