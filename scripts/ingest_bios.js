const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  const file = process.argv[2];
  if (!file) return console.error('Please provide a file path');
  
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  for (const item of data) {
    console.log('Processing:', item.name);
    
    const { data: figureData, error: figureError } = await supabase
      .from('figures')
      .update({ bio: item.bio, contributions: item.contributions })
      .eq('name', item.name)
      .select('id')
      .single();

    if (figureError) {
      console.error('Error updating figure:', figureError);
      continue;
    }
    
    const figureId = figureData.id;
    
    // Clear old sources
    await supabase.from('sources').delete().eq('figure_id', figureId);
    
    // Add new sources
    if (item.sources && item.sources.length > 0) {
      const sourcesToInsert = item.sources.map(s => ({
        figure_id: figureId,
        title: s.title,
        url: s.url
      }));
      await supabase.from('sources').insert(sourcesToInsert);
    }
    console.log('Successfully updated:', item.name);
  }
}
run();
