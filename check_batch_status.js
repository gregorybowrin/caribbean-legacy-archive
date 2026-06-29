import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkBatches() {
  const { data: dbFigures, error } = await supabase.from('figures').select('id, name, bio');
  if (error) { console.error(error); return; }

  const dbMapByName = new Map(dbFigures.map(f => [f.name.toLowerCase().replace(/["']/g, '').trim(), f]));
  const dbMapById = new Map(dbFigures.map(f => [f.id, f]));

  for (let i = 1; i <= 20; i++) {
    const f = `bio_batch_${i}.json`;
    if (fs.existsSync(f)) {
      const data = JSON.parse(fs.readFileSync(f, 'utf8'));
      const statusList = data.map(fig => {
        let dbFig = fig.id ? dbMapById.get(fig.id) : null;
        if (!dbFig) {
          const cleanName = fig.name.toLowerCase().replace(/["']/g, '').trim();
          dbFig = dbMapByName.get(cleanName) || dbFigures.find(d => d.name.toLowerCase().includes(cleanName) || cleanName.includes(d.name.toLowerCase()));
        }
        const words = dbFig && dbFig.bio ? dbFig.bio.trim().split(/\s+/).length : 0;
        return `${fig.name}: ${words} words`;
      });
      console.log(`Batch ${i}: ${statusList.join(' | ')}`);
    }
  }
}

checkBatches();
