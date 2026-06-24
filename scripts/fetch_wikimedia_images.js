const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const DRY_RUN = process.argv.includes('--execute') ? false : true;

async function fetchWikimediaImageAndMetadata(name) {
  try {
    const options = { headers: { 'User-Agent': 'CaribbeanLegacyArchive/1.0 (contact@caribbeanlegacyarchive.com)' } };
    
    // Step 1: Find the original image file associated with the article
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(name)}&prop=pageimages&piprop=original|name&format=json`;
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (!data.query || !data.query.pages) return null;
    
    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];
    
    if (pageId === '-1' || !pages[pageId].original) return null;
    
    const originalUrl = pages[pageId].original.source;
    const filename = pages[pageId].pageimage;
    
    if (!filename) {
      return { imageUrl: originalUrl };
    }

    // Step 2: Fetch the license metadata for that file
    const fileInfoUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(filename)}&prop=imageinfo&iiprop=extmetadata|url&format=json`;
    const fileResponse = await fetch(fileInfoUrl, options);
    const fileData = await fileResponse.json();
    
    let creator = null;
    let license = null;
    let sourceUrl = null;
    let creditLine = null;

    if (fileData.query && fileData.query.pages) {
      const fPages = fileData.query.pages;
      const fPageId = Object.keys(fPages)[0];
      
      if (fPages[fPageId] && fPages[fPageId].imageinfo && fPages[fPageId].imageinfo.length > 0) {
        const info = fPages[fPageId].imageinfo[0];
        sourceUrl = info.descriptionurl;
        
        const ext = info.extmetadata;
        if (ext) {
          if (ext.Artist) {
            // Remove HTML tags from Artist
            creator = ext.Artist.value.replace(/<[^>]*>?/gm, '').trim();
          }
          if (ext.LicenseShortName) {
            license = ext.LicenseShortName.value;
            // Normalize "public domain" or similar
            if (license.toLowerCase().includes('pd') || license.toLowerCase().includes('public domain')) {
              license = 'Public Domain';
            }
          }
        }
      }
    }

    // Generate credit line
    if (license) {
      creditLine = `Image: ${name}, ${license}, via Wikimedia Commons.`;
    }

    return {
      imageUrl: originalUrl,
      sourceUrl,
      creator,
      license,
      creditLine
    };
    
  } catch (error) {
    console.error(`Error fetching for ${name}:`, error.message);
    return null;
  }
}

async function run() {
  console.log(`Starting Wikimedia Image Fetch Script in ${DRY_RUN ? 'DRY RUN' : 'PRODUCTION'} mode...`);

  // We fetch figures that either have no image_url, OR have no image_credit (so we can backfill metadata for the 115 we already matched)
  const { data: figures, error } = await supabase
    .from('figures')
    .select('id, name, image_url, image_credit')
    .or('image_url.is.null,image_credit.is.null');

  if (error) {
    console.error('Error fetching figures:', error);
    return;
  }

  console.log(`Found ${figures.length} figures needing an image or metadata.`);
  
  let matchCount = 0;

  for (const figure of figures) {
    await new Promise(r => setTimeout(r, 500));

    console.log(`\nSearching for: ${figure.name}...`);
    const result = await fetchWikimediaImageAndMetadata(figure.name);

    if (result && result.imageUrl) {
      matchCount++;
      console.log(`✅ FOUND IMAGE: ${result.imageUrl}`);
      if (result.creditLine) {
        console.log(`📝 CREDIT: ${result.creditLine}`);
      }
      
      if (!DRY_RUN) {
        const updateData = {
          image_url: result.imageUrl,
          image_source_url: result.sourceUrl,
          image_creator: result.creator,
          image_license: result.license,
          image_credit: result.creditLine
        };

        const { error: updateError } = await supabase
          .from('figures')
          .update(updateData)
          .eq('id', figure.id);
          
        if (updateError) {
          console.error(`❌ Failed to update Supabase for ${figure.name}:`, updateError.message);
        } else {
          console.log(`✅ Updated ${figure.name} in database.`);
        }
      }
    } else {
      console.log(`❌ No image/metadata found.`);
    }
  }

  console.log(`\n=== SUMMARY ===`);
  console.log(`Processed ${figures.length} figures.`);
  console.log(`Found images/metadata for ${matchCount} figures.`);
  if (DRY_RUN) {
    console.log('This was a DRY RUN. No database updates were made. Run with --execute to apply changes.');
  }
}

run();
