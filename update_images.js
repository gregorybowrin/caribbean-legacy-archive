require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const wikiTitles = {
  "4abe2c46-3824-4cf1-9399-0bcfba1d4d6f": "Grantley_Herbert_Adams",
  "483baf1b-bc27-4547-a892-0b746a113474": "Hugh_Springer",
  "50a442b5-fbc2-45c5-88c6-7c568554b403": "Edward_Richards",
  "23e013eb-8059-47d7-8b9b-d13ab165ea9c": "Gladys_Morrell"
};

async function main() {
  let updatedCount = 0;
  for (const [id, title] of Object.entries(wikiTitles)) {
    try {
      const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${title}`);
      const data = await res.json();
      
      if (data.thumbnail && data.thumbnail.source) {
        // use original image instead of thumbnail if possible, or just the thumbnail but make it bigger
        let imageUrl = data.thumbnail.source;
        // e.g. https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Sir_Grantley_Adams_statue%2C_Barbados.jpg/320px-...
        // replace thumb and remove the trailing size
        const thumbIndex = imageUrl.indexOf('/thumb/');
        if (thumbIndex !== -1) {
            const parts = imageUrl.split('/');
            parts.pop(); // remove the trailing width part
            imageUrl = parts.join('/').replace('/thumb/', '/');
        }

        console.log(`Found image for ${title}: ${imageUrl}`);
        
        const { error } = await supabase
          .from('figures')
          .update({ image_url: imageUrl })
          .eq('id', id);
          
        if (error) {
          console.error(`Error updating ${title}:`, error);
        } else {
          updatedCount++;
          console.log(`Successfully updated ${title}`);
        }
      } else {
        console.log(`No image found for ${title}`);
      }
    } catch (e) {
      console.error(`Fetch error for ${title}:`, e);
    }
  }
  
  // Hardcoded updates for some
  const manualUpdates = [
    {
      id: "71e9d363-a24f-4faa-85a7-976ad6144b07", // Dr. E.F. Gordon
      title: "Dr. E.F. Gordon",
      // Let's skip ones we couldn't confidently find a free direct JPG/PNG URL for
    }
  ];
  
  for (const item of manualUpdates) {
    if (item.url) {
      const { error } = await supabase.from('figures').update({ image_url: item.url }).eq('id', item.id);
      if (!error) updatedCount++;
    }
  }
  
  console.log(`Total figures updated: ${updatedCount}`);
}

main();
