const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// We define DRY_RUN as true initially so it only logs out what it would do.
const DRY_RUN = process.argv.includes('--execute') ? false : true;

async function fetchWikimediaImage(name) {
  try {
    // We use the Wikipedia API to search for the page and get its primary image (thumbnail)
    // The query format searches for the exact page name and requests pageimages.
    const options = { headers: { 'User-Agent': 'CaribbeanLegacyArchive/1.0 (contact@caribbeanlegacyarchive.com)' } };
    
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(name)}&prop=pageimages&piprop=original&format=json`;
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (data.query && data.query.pages) {
      const pages = data.query.pages;
      const pageId = Object.keys(pages)[0];
      
      if (pageId !== '-1' && pages[pageId].original) {
        return pages[pageId].original.source;
      }
    }

    return null;
  } catch (error) {
    console.error(`Error fetching for ${name}:`, error.message);
    return null;
  }
}

async function run() {
  console.log(`Starting Wikimedia Image Fetch Script in ${DRY_RUN ? 'DRY RUN' : 'PRODUCTION'} mode...`);

  // 1. Fetch figures without images
  const { data: figures, error } = await supabase
    .from('figures')
    .select('id, name')
    .is('image_url', null);

  if (error) {
    console.error('Error fetching figures:', error);
    return;
  }

  console.log(`Found ${figures.length} figures without an image_url.`);
  
  let matchCount = 0;

  for (const figure of figures) {
    // Sleep briefly to avoid hitting rate limits
    await new Promise(r => setTimeout(r, 500));

    console.log(`\nSearching for: ${figure.name}...`);
    const imageUrl = await fetchWikimediaImage(figure.name);

    if (imageUrl) {
      matchCount++;
      console.log(`✅ FOUND IMAGE: ${imageUrl}`);
      
      if (!DRY_RUN) {
        const { error: updateError } = await supabase
          .from('figures')
          .update({ image_url: imageUrl })
          .eq('id', figure.id);
          
        if (updateError) {
          console.error(`❌ Failed to update Supabase for ${figure.name}:`, updateError.message);
        } else {
          console.log(`✅ Updated ${figure.name} in database.`);
        }
      }
    } else {
      console.log(`❌ No image found.`);
    }
  }

  console.log(`\n=== SUMMARY ===`);
  console.log(`Processed ${figures.length} figures.`);
  console.log(`Found images for ${matchCount} figures.`);
  if (DRY_RUN) {
    console.log('This was a DRY RUN. No database updates were made. Run with --execute to apply changes.');
  }
}

run();
