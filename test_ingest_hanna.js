import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const raw = fs.readFileSync('/Users/gregorybowrin/.gemini/antigravity/brain/1be95931-7a45-4768-a65d-ba96eef46ecb/.system_generated/messages/f3e821e7-c43c-4853-bdb0-b260dfcb0156.json', 'utf8');
const msg = JSON.parse(raw);
console.log("Sender:", msg.sender);
const content = msg.content || '';

const match = content.match(/```json\s*([\s\S]*?)\s*```/);
if (match) {
  try {
    const bios = JSON.parse(match[1]);
    console.log("Parsed bios successfully. Count:", bios.length);
    bios.forEach(async b => {
      console.log(`Bio name: ${b.name}, id: ${b.id}, words: ${b.bio ? b.bio.split(/\s+/).length : 0}`);
      if (b.id) {
        const { error } = await supabase.from('figures').update({ bio: b.bio, contributions: b.contributions }).eq('id', b.id);
        if (error) console.error("Error updating DB:", error);
        else console.log(`Updated ${b.name} in DB!`);
      }
    });
  } catch (e) {
    console.error("JSON parse error:", e.message);
  }
} else {
  console.log("No ```json match found in content.");
}
