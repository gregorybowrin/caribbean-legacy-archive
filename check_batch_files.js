import fs from 'fs';

for (let i = 1; i <= 20; i++) {
  const f = `bio_batch_${i}.json`;
  if (fs.existsSync(f)) {
    const data = JSON.parse(fs.readFileSync(f, 'utf8'));
    const names = data.map(d => d.name).join(', ');
    console.log(`Batch ${i}: ${names}`);
  }
}
