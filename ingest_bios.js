import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function ingest(start, end) {
    for (let i = start; i <= end; i++) {
        const file = `bio_result_${i}.json`;
        if (fs.existsSync(file)) {
            const data = JSON.parse(fs.readFileSync(file, 'utf8'));
            for (const fig of data) {
                if (fig.bio && fig.bio.trim() !== '') {
                    // Update bio and contributions (if any)
                    const updates = { bio: fig.bio };
                    if (fig.contributions) updates.contributions = Array.isArray(fig.contributions) ? fig.contributions.join('\n') : fig.contributions;
                    await supabase.from('figures').update(updates).eq('id', fig.id);
                }
            }
            console.log(`Ingested ${file}`);
        }
    }
}
const start = parseInt(process.argv[2]);
const end = parseInt(process.argv[3]);
if (!isNaN(start) && !isNaN(end)) ingest(start, end);
else console.error('Usage: node ingest_bios.js <startBatch> <endBatch>');
