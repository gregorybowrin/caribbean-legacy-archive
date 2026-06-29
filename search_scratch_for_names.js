import fs from 'fs';
import path from 'path';

const scratchDir = '/Users/gregorybowrin/.gemini/antigravity/brain/1be95931-7a45-4768-a65d-ba96eef46ecb/scratch';
const files = fs.readdirSync(scratchDir).filter(f => f.endsWith('.json'));

files.forEach(file => {
  const content = fs.readFileSync(path.join(scratchDir, file), 'utf8');
  if (content.includes('Nelson') || content.includes('Césaire') || content.includes('Cesaire')) {
    console.log(`Found match in ${file}`);
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        parsed.forEach(p => {
          if (p.name && (p.name.includes('Nelson') || p.name.includes('Césaire') || p.name.includes('Cesaire'))) {
            console.log(`  - Figure: ${p.name}, bio words: ${p.bio ? p.bio.split(' ').length : 0}`);
          }
        });
      }
    } catch (e) {
      console.log(`  (Could not parse as JSON array)`);
    }
  }
});
