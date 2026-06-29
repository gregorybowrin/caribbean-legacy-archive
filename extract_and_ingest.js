import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const logPath = '/Users/gregorybowrin/.gemini/antigravity/brain/1be95931-7a45-4768-a65d-ba96eef46ecb/.system_generated/logs/transcript_full.jsonl';
const content = fs.readFileSync(logPath, 'utf8');
const lines = content.split('\n').filter(l => l.trim() !== '');

let totalIngested = 0;
let ingestedNames = new Set();

for (const line of lines) {
    try {
        const entry = JSON.parse(line);
        if (entry.content && entry.content.includes('[Message] timestamp=')) {
            // Find "content=" and take everything after
            let contentStr = entry.content;
            let idx = contentStr.indexOf('content=');
            if (idx !== -1) {
                let jsonRaw = contentStr.substring(idx + 8).trim();
                if (jsonRaw.endsWith('</SYSTEM_MESSAGE>')) {
                    jsonRaw = jsonRaw.substring(0, jsonRaw.length - 17).trim();
                }
                
                // Remove Markdown code blocks if any
                if (jsonRaw.startsWith('```json')) {
                    jsonRaw = jsonRaw.substring(7);
                    if (jsonRaw.endsWith('```')) {
                        jsonRaw = jsonRaw.substring(0, jsonRaw.length - 3);
                    }
                } else if (jsonRaw.startsWith('```')) {
                     jsonRaw = jsonRaw.substring(3);
                     if (jsonRaw.endsWith('```')) {
                         jsonRaw = jsonRaw.substring(0, jsonRaw.length - 3);
                     }
                }
                
                // If it ends with extra text (like subagent 10's note), strip it
                // We'll just look for the first [ and the last ]
                const firstBrace = jsonRaw.indexOf('[');
                const lastBrace = jsonRaw.lastIndexOf(']');
                if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
                    jsonRaw = jsonRaw.substring(firstBrace, lastBrace + 1);
                }

                try {
                    const data = JSON.parse(jsonRaw);
                    if (Array.isArray(data)) {
                        for (const fig of data) {
                            if (fig.name && fig.bio && !ingestedNames.has(fig.name)) {
                                const updates = { bio: fig.bio };
                                if (fig.contributions) updates.contributions = Array.isArray(fig.contributions) ? fig.contributions.join('\n') : fig.contributions;
                                await supabase.from('figures').update(updates).eq('name', fig.name);
                                console.log(`Ingested: ${fig.name}`);
                                totalIngested++;
                                ingestedNames.add(fig.name);
                            }
                        }
                    }
                } catch (e) {
                   // console.log("Failed to parse", e.message);
                }
            }
        }
    } catch (e) {}
}

console.log(`Total unique ingested from transcript: ${totalIngested}`);
