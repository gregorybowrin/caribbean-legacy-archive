import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const msgDir = '/Users/gregorybowrin/.gemini/antigravity/brain/1be95931-7a45-4768-a65d-ba96eef46ecb/.system_generated/messages';

async function ingestV2() {
  const { data: dbFigures, error } = await supabase.from('figures').select('id, name, bio');
  if (error) { console.error(error); return; }

  const dbMapById = new Map(dbFigures.map(f => [f.id, f]));
  const dbMapByName = new Map(dbFigures.map(f => [f.name.toLowerCase().replace(/["']/g, '').trim(), f]));

  const files = fs.readdirSync(msgDir).filter(f => f.endsWith('.json'));
  let updatedCount = 0;

  for (const file of files) {
    const content = fs.readFileSync(path.join(msgDir, file), 'utf8');
    try {
      const msg = JSON.parse(content);
      const text = msg.content || '';
      
      // Try multiple regex patterns or find '[' and ']'
      const startIdx = text.indexOf('[');
      const endIdx = text.lastIndexOf(']');
      if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
        const jsonStr = text.substring(startIdx, endIdx + 1);
        try {
          const bios = JSON.parse(jsonStr);
          if (Array.isArray(bios)) {
            for (const fig of bios) {
              if (!fig.bio || typeof fig.bio !== 'string') continue;
              const wordLen = fig.bio.trim().split(/\s+/).length;
              if (wordLen < 800) continue;

              let targetDbFig = null;
              if (fig.id && dbMapById.has(fig.id)) {
                targetDbFig = dbMapById.get(fig.id);
              } else if (fig.name) {
                const cleanName = fig.name.toLowerCase().replace(/["']/g, '').trim();
                if (dbMapByName.has(cleanName)) {
                  targetDbFig = dbMapByName.get(cleanName);
                } else {
                  targetDbFig = dbFigures.find(d => d.name.toLowerCase().includes(cleanName) || cleanName.includes(d.name.toLowerCase()));
                }
              }

              if (targetDbFig) {
                const currentWords = targetDbFig.bio ? targetDbFig.bio.trim().split(/\s+/).length : 0;
                if (currentWords < 1000) {
                  console.log(`Updating "${targetDbFig.name}" (${targetDbFig.id}) from ${file} - words: ${currentWords} -> ${wordLen}`);
                  
                  const updates = { bio: fig.bio };
                  if (fig.contributions) {
                    updates.contributions = Array.isArray(fig.contributions) ? fig.contributions.join('\n') : fig.contributions;
                  }

                  const { error: updateErr } = await supabase
                    .from('figures')
                    .update(updates)
                    .eq('id', targetDbFig.id);

                  if (!updateErr) {
                    targetDbFig.bio = fig.bio;
                    updatedCount++;
                  } else {
                    console.error(`Error updating ${targetDbFig.name}:`, updateErr);
                  }
                }
              }
            }
          }
        } catch (e) {}
      }
    } catch (e) {}
  }

  console.log(`\nTotal updated in v2: ${updatedCount}`);
}

ingestV2();
