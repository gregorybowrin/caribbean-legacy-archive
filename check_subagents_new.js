import fs from 'fs';

const subagents = [
  { batch: 1, id: '4a982069-40aa-4f47-aaed-8a42861426bd' },
  { batch: 2, id: '01a7e95d-ed03-4e1a-8a49-a37862742e7c' },
  { batch: 3, id: 'b09bbeb4-0cc4-4444-81e5-756d3cb75213' },
  { batch: 4, id: 'acf9d961-a32c-46cc-8a79-386c3dc181cd' },
  { batch: 5, id: 'a30fe27d-2aa4-461f-86d3-b160cfc0f129' },
  { batch: 6, id: '8a783f54-ea41-423b-a70a-05010a8845ac' },
  { batch: 7, id: 'e431f21a-4ee2-45d4-8908-4f666f949afe' },
  { batch: 8, id: 'dd344a78-26d2-4d74-921b-212524b265fb' },
  { batch: 9, id: '5257979a-6236-4e47-ac88-9f73c8bf16fa' },
  { batch: 10, id: '4cb6d23e-3a00-42f8-ba79-c87d67526526' }
];

for (const sub of subagents) {
  const logPath = `/Users/gregorybowrin/.gemini/antigravity/brain/${sub.id}/.system_generated/logs/transcript_full.jsonl`;
  if (!fs.existsSync(logPath)) {
    console.log(`Batch ${sub.batch} (${sub.id}): Log file does not exist.`);
    continue;
  }
  
  const content = fs.readFileSync(logPath, 'utf8');
  const lines = content.split('\n').filter(l => l.trim() !== '');
  let found = false;
  for (const line of lines) {
    try {
      const entry = JSON.parse(line);
      if (entry.type === 'PLANNER_RESPONSE' && entry.tool_calls) {
        for (const tc of entry.tool_calls) {
          if (tc.name === 'send_message' && tc.args && tc.args.Message) {
            found = true;
          }
        }
      }
    } catch (e) {}
  }
  console.log(`Batch ${sub.batch} (${sub.id}): Found message? ${found}`);
}
