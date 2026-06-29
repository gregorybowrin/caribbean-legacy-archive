import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const file = '/Users/gregorybowrin/.gemini/antigravity/brain/1be95931-7a45-4768-a65d-ba96eef46ecb/.system_generated/messages/82a31185-e003-4dca-a4a1-8884156a7cb9.json';
if (fs.existsSync(file)) {
  const raw = fs.readFileSync(file, 'utf8');
  const msg = JSON.parse(raw);
  const content = msg.content || '';
  const match = content.match(/```json\s*([\s\S]*?)\s*```/);
  if (match) {
    try {
      const bios = JSON.parse(match[1]);
      bios.forEach(async b => {
        console.log(`Parsed ${b.name} (${b.id}) - words: ${b.bio.split(/\s+/).length}`);
        const { error } = await supabase.from('figures').update({ bio: b.bio, contributions: b.contributions }).eq('id', b.id);
        if (error) console.error("Error updating:", error);
        else console.log(`Updated ${b.name} in DB!`);
      });
    } catch (e) {
      console.error("Parse error:", e.message);
    }
  } else {
    console.log("No json block found in 82a31185.");
  }
} else {
  console.log("File 82a31185 does not exist yet.");
}
