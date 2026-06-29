import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const subagentIds = [
  '9a2c4964-7b15-4483-a5d0-d1bffb0d22db', // Batch 11
  'f1722a94-7ae3-4b7e-a467-83adcb486d66', // Batch 12
  '0e4f7f00-c493-4bb1-b323-18b9863c3da4', // Batch 13
  '185bab26-538f-4445-9e2d-c63cb6547bb3', // Batch 14
  'f5edeb2b-b8a2-45de-8f90-e2833797a6ea', // Batch 15
  '4bece59d-74d2-4d78-b623-edffe7ab3487', // Batch 16
  '290725f9-a53d-490d-a083-97fce1087c55', // Batch 17
  'abc89be1-ce67-4fef-935e-0ca5ce2ecf17', // Batch 18
  '60a6190c-1a94-41eb-8f78-001437a4a31a', // Batch 19
  '5604c27d-637f-4e05-97c1-3803277df229', // Batch 20
  '229fcd67-2f46-4b13-8e4c-9eed8cb0d8a6', // Batch 21
  '45cfda95-c7b0-44a1-b478-b8deebead910', // Batch 22
  '9e55b58e-7cf0-416d-8e79-88bd7b4fdc34', // Batch 23
  '7137a280-119e-4867-bcc6-0421f2932350', // Batch 24
  'c1845987-745d-4fac-9233-a0b8e862aaf8', // Batch 25
  '941b5c76-1331-4166-98c3-b9606f92736f', // Batch 26
  '704bf802-515f-4693-9a3b-0a5069cd0be9', // Batch 27
  'c4d6a036-2711-4c88-ba20-a278f8541aaf', // Batch 28
  '6901f1ad-ed45-47ed-8508-12d600d05391', // Batch 29
  '747cc30b-cd11-41af-ace9-c5c68067552a', // Batch 30
];

const nameMap = {
  "James Alexander George Smith McCartney": 'James Alexander George Smith "J.A.G.S." McCartney',
  "Clement Ernest Howell": "Clement Howell",
  "Sir Eric Matthew Gairy": "Sir Eric Gairy"
};

let totalIngested = 0;
let ingestedNames = new Set();

async function processSubagents() {
  for (const id of subagentIds) {
    const logPath = `/Users/gregorybowrin/.gemini/antigravity/brain/${id}/.system_generated/logs/transcript_full.jsonl`;
    if (!fs.existsSync(logPath)) {
      console.log(`Log path not found for subagent ${id}`);
      continue;
    }
    
    const content = fs.readFileSync(logPath, 'utf8');
    const lines = content.split('\n').filter(l => l.trim() !== '');
    
    for (const line of lines) {
      try {
        const entry = JSON.parse(line);
        if (entry.type === 'PLANNER_RESPONSE' && entry.tool_calls) {
          for (const tc of entry.tool_calls) {
            if (tc.name === 'send_message' && tc.args && tc.args.Message) {
              let jsonRaw = tc.args.Message.trim();
              
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
                      if (fig.contributions) {
                        updates.contributions = Array.isArray(fig.contributions) ? fig.contributions.join('\n') : fig.contributions;
                      }
                      
                      const targetName = nameMap[fig.name] || fig.name;
                      
                      // Check name match in DB
                      const { data: dbFig } = await supabase.from('figures').select('id, name').ilike('name', `%${targetName.replace(/["']/g, '')}%`);
                      if (dbFig && dbFig.length > 0) {
                        await supabase.from('figures').update(updates).eq('id', dbFig[0].id);
                        console.log(`Ingested: ${dbFig[0].name} (matched from "${fig.name}")`);
                        totalIngested++;
                        ingestedNames.add(fig.name);
                      } else {
                        // Try exact match
                        const { data: exactFig } = await supabase.from('figures').update(updates).eq('name', targetName).select();
                        if (exactFig && exactFig.length > 0) {
                          console.log(`Ingested: ${fig.name} (exact match)`);
                          totalIngested++;
                          ingestedNames.add(fig.name);
                        } else {
                          console.log(`No figure found in DB for generated name: "${fig.name}" (target: "${targetName}")`);
                        }
                      }
                    }
                  }
                }
              } catch (e) {
                console.log(`Failed to parse JSON for subagent ${id}:`, e.message);
              }
            }
          }
        }
      } catch (e) {}
    }
  }
  
  console.log(`Total unique ingested from subagent transcripts: ${totalIngested}`);
}

processSubagents();
