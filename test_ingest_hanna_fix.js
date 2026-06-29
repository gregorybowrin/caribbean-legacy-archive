import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const raw = fs.readFileSync('/Users/gregorybowrin/.gemini/antigravity/brain/1be95931-7a45-4768-a65d-ba96eef46ecb/.system_generated/messages/f3e821e7-c43c-4853-bdb0-b260dfcb0156.json', 'utf8');
const msg = JSON.parse(raw);
const content = msg.content || '';

// Let's print around index 5658 of the json match
const match = content.match(/```json\s*([\s\S]*?)\s*```/);
if (match) {
  const jsonStr = match[1];
  console.log("Around 5658:", jsonStr.substring(5600, 5700));
  
  // Let's use regex or eval to parse if JSON.parse fails due to unescaped quotes or control chars
  // Actually let's try replacing unescaped tabs or linebreaks
  // Or let's extract each object manually
  const blocks = jsonStr.split(/\{\s*"name":\s*"/);
  for (let i = 1; i < blocks.length; i++) {
    const block = '"name": "' + blocks[i];
    const nameMatch = block.match(/"name":\s*"([^"]+)"/);
    const idMatch = block.match(/"id":\s*"([^"]+)"/);
    const bioMatch = block.match(/"bio":\s*"([\s\S]*?)",\s*"contributions":/);
    const contribMatch = block.match(/"contributions":\s*"([\s\S]*?)",\s*"sources":/);
    
    if (nameMatch && idMatch && bioMatch) {
      const name = nameMatch[1];
      const id = idMatch[1];
      // Unescape json string escapes
      try {
        const bio = JSON.parse('"' + bioMatch[1].replace(/"/g, '\\"') + '"');
        const contrib = contribMatch ? JSON.parse('"' + contribMatch[1].replace(/"/g, '\\"') + '"') : '';
        console.log(`Extracted ${name} (${id}) - words: ${bio.split(/\s+/).length}`);
        
        const { error } = await supabase.from('figures').update({ bio, contributions: contrib }).eq('id', id);
        if (error) console.error("Update error:", error);
        else console.log(`Successfully updated ${name} in Supabase!`);
      } catch (e) {
        console.error(`Error parsing fields for ${name}:`, e.message);
      }
    }
  }
}
