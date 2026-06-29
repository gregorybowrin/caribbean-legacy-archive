import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const raw = fs.readFileSync('/Users/gregorybowrin/.gemini/antigravity/brain/1be95931-7a45-4768-a65d-ba96eef46ecb/.system_generated/messages/f3e821e7-c43c-4853-bdb0-b260dfcb0156.json', 'utf8');
const msg = JSON.parse(raw);
const content = msg.content || '';

const match = content.match(/```json\s*([\s\S]*?)\s*```/);
if (match) {
  let jsonStr = match[1];
  // Find where Alicia Alonso begins
  const alonsoIdx = jsonStr.indexOf('"name": "Alicia Alonso"');
  if (alonsoIdx !== -1) {
    const alonsoChunk = "{" + jsonStr.substring(alonsoIdx);
    // Find matching end brace or cut at last }
    const endIdx = alonsoChunk.lastIndexOf('}');
    const cleanChunk = alonsoChunk.substring(0, endIdx + 1);
    try {
      // Use eval or Function to parse flexible json
      const fig = new Function('return ' + cleanChunk)();
      console.log(`Extracted Alicia Alonso (${fig.id}) - words: ${fig.bio.split(/\s+/).length}`);
      const { error } = await supabase.from('figures').update({ bio: fig.bio, contributions: fig.contributions }).eq('id', fig.id);
      if (error) console.error("Update error:", error);
      else console.log("Successfully updated Alicia Alonso in Supabase!");
    } catch (e) {
      console.error("Function parse error:", e.message);
    }
  }
}
