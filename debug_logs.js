import fs from 'fs';

const logPath = '/Users/gregorybowrin/.gemini/antigravity/brain/1be95931-7a45-4768-a65d-ba96eef46ecb/.system_generated/logs/transcript_full.jsonl';
const content = fs.readFileSync(logPath, 'utf8');
const lines = content.split('\n').filter(l => l.trim() !== '');

for (const line of lines.slice(-200)) {
    try {
        const entry = JSON.parse(line);
        if (entry.type === 'MESSAGE' && entry.source === 'SYSTEM') {
             console.log("----");
             console.log(entry.content.substring(0, 100) + "...");
        }
    } catch (e) {}
}
