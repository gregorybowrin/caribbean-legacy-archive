import fs from 'fs';

const subagents = [];

for (let i = 1; i <= 10; i++) {
  const file = `bio_batch_${i}.json`;
  if (fs.existsSync(file)) {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    const fig1 = data[0];
    const fig2 = data[1];
    
    let prompt = `Follow the profile_writer skill exactly to write 1000+ word markdown bios, contributions, and sources for these 2 figures. Return the result as a JSON array exactly matching the schema. `;
    prompt += `Figure 1: ${fig1.name} (ID: ${fig1.id}). `;
    if (fig2) {
      prompt += `Figure 2: ${fig2.name} (ID: ${fig2.id}).`;
    }
    
    subagents.push({
      TypeName: 'bio_writer',
      Role: `Writer Batch ${i}`,
      Prompt: prompt,
      Workspace: 'inherit'
    });
  }
}

console.log(JSON.stringify(subagents, null, 2));
