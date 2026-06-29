import fs from 'fs';
import path from 'path';

const msgDir = '/Users/gregorybowrin/.gemini/antigravity/brain/1be95931-7a45-4768-a65d-ba96eef46ecb/.system_generated/messages';
if (fs.existsSync(msgDir)) {
  const files = fs.readdirSync(msgDir).filter(f => f.endsWith('.json'));
  files.forEach(file => {
    const content = fs.readFileSync(path.join(msgDir, file), 'utf8');
    try {
      const msg = JSON.parse(content);
      const text = msg.content || '';
      if (text.includes('```json')) {
        // Extract json between ```json and ```
        const match = text.match(/```json\s*([\s\S]*?)\s*```/);
        if (match) {
          try {
            const bios = JSON.parse(match[1]);
            if (Array.isArray(bios)) {
              console.log(`Found ${bios.length} bios in message ${file} (sender: ${msg.sender}):`);
              bios.forEach(b => {
                const words = b.bio ? b.bio.trim().split(/\s+/).length : 0;
                console.log(`  - ${b.name} (${b.id}): ${words} words`);
              });
            }
          } catch (e) {
            // json parse failed
          }
        }
      }
    } catch (e) {
      // msg parse failed
    }
  });
}
