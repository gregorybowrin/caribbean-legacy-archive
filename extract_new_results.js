import fs from 'fs';
import path from 'path';

const subagents = [
  { batch: 1, id: 'e302f057-1cd8-4253-865b-fb2cb484163a' },
  { batch: 2, id: 'fe2a50b0-7e20-49c0-9a53-b632af030662' },
  { batch: 3, id: 'e994a8ff-8a9d-4f51-99ca-9cfb19e70f09' },
  { batch: 4, id: '97f2a5c1-68c3-4cb2-9135-25b67ea43107' },
  { batch: 5, id: '62af759d-9ba7-4146-b451-77edc6652659' },
  { batch: 6, id: 'e5d4444d-59a1-4db8-a603-baca9ae02b0d' },
  { batch: 7, id: '32f72489-e2a8-4533-9437-404b89588177' },
  { batch: 8, id: '6901e5fc-2bc2-4760-be31-4332a8897515' },
  { batch: 9, id: '98dcb5ab-e862-41a5-8bf7-100ee898d544' },
  { batch: 10, id: 'debdbeda-11c8-4866-8fe8-cc16647365af' }
];

function cleanJsonString(raw) {
  let cleaned = raw.trim();
  // Remove markdown wrap if any
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  cleaned = cleaned.trim();
  
  // Extract strictly what is within the first [ and last ]
  const firstBrace = cleaned.indexOf('[');
  const lastBrace = cleaned.lastIndexOf(']');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }
  return cleaned;
}

for (const sub of subagents) {
  const logPath = `/Users/gregorybowrin/.gemini/antigravity/brain/${sub.id}/.system_generated/logs/transcript_full.jsonl`;
  if (!fs.existsSync(logPath)) {
    console.error(`Batch ${sub.batch} (${sub.id}): Log file not found.`);
    continue;
  }
  
  const content = fs.readFileSync(logPath, 'utf8');
  const lines = content.split('\n').filter(l => l.trim() !== '');
  let payloadStr = null;
  
  for (const line of lines) {
    try {
      const entry = JSON.parse(line);
      if (entry.type === 'PLANNER_RESPONSE' && entry.tool_calls) {
        for (const tc of entry.tool_calls) {
          if (tc.name === 'send_message' && tc.args && tc.args.Message) {
            payloadStr = tc.args.Message;
          }
        }
      }
    } catch (e) {}
  }
  
  if (!payloadStr) {
    console.error(`Batch ${sub.batch} (${sub.id}): No send_message payload found.`);
    continue;
  }
  
  const cleaned = cleanJsonString(payloadStr);
  try {
    const data = JSON.parse(cleaned);
    fs.writeFileSync(`bio_result_${sub.batch}.json`, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Successfully extracted and saved bio_result_${sub.batch}.json`);
  } catch (e) {
    console.error(`Batch ${sub.batch} (${sub.id}): Failed to parse JSON. Error: ${e.message}`);
    // Try to write the raw cleaned payload to a debug file to inspect
    fs.writeFileSync(`bio_result_${sub.batch}_error_raw.txt`, cleaned, 'utf8');
  }
}
