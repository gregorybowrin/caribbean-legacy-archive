import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const msgDir = '/Users/gregorybowrin/.gemini/antigravity/brain/1be95931-7a45-4768-a65d-ba96eef46ecb/.system_generated/messages';

async function ingestV3() {
  const { data: dbFigures, error } = await supabase.from('figures').select('id, name, bio');
  if (error) { console.error(error); return; }

  const dbMapById = new Map(dbFigures.map(f => [f.id, f]));
  const dbMapByName = new Map(dbFigures.map(f => [f.name.toLowerCase().replace(/["']/g, '').trim(), f]));

  const files = fs.readdirSync(msgDir).filter(f => f.endsWith('.json'));
  let updatedCount = 0;

  for (const file of files) {
    const raw = fs.readFileSync(path.join(msgDir, file), 'utf8');
    // We want to find any occurrences of [{"name": ... }] whether escaped or unescaped
    // Let's try parsing raw JSON first, then looking at string fields
    let textsToSearch = [raw];
    try {
      const msg = JSON.parse(raw);
      if (msg.content) textsToSearch.push(msg.content);
      if (msg.sourceMetadata && msg.sourceMetadata.tool && msg.sourceMetadata.tool.toolCall && msg.sourceMetadata.tool.toolCall.argumentsJson) {
        textsToSearch.push(msg.sourceMetadata.tool.toolCall.argumentsJson);
        try {
          const args = JSON.parse(msg.sourceMetadata.tool.toolCall.argumentsJson);
          if (args.Message) textsToSearch.push(args.Message);
        } catch (e) {}
      }
    } catch (e) {}

    for (let text of textsToSearch) {
      // If text contains escaped quotes/newlines, let's try unescaping it if it looks like json string
      if (typeof text !== 'string') continue;
      
      // Let's find ```json blocks
      const matches = text.matchAll(/```json\s*([\s\S]*?)\s*```/g);
      for (const match of matches) {
        let jsonStr = match[1];
        try {
          const bios = JSON.parse(jsonStr);
          if (Array.isArray(bios)) {
            await processBios(bios, file);
          }
        } catch (e) {
          // maybe unescape
          try {
            const unescaped = jsonStr.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
            const bios = JSON.parse(unescaped);
            if (Array.isArray(bios)) {
              await processBios(bios, file);
            }
          } catch (e2) {}
        }
      }
    }
  }

  async function processBios(bios, file) {
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

  console.log(`\nTotal updated in v3: ${updatedCount}`);
}

ingestV3();
