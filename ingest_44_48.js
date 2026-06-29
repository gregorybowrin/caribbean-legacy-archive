import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function ingest() {
    for (let i = 44; i <= 48; i++) {
        const file = `results_${i}.json`;
        if (fs.existsSync(file)) {
            const data = JSON.parse(fs.readFileSync(file, 'utf8'));
            for (const fig of data) {
                if (fig.image_url) {
                    await supabase.from('figures').update({ image_url: fig.image_url, image_credit: fig.image_credit }).eq('id', fig.id);
                }
            }
            console.log(`Ingested ${file}`);
        }
    }
}
ingest();
