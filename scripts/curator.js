const readline = require('readline');
const { exec } = require('child_process');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (query) => new Promise(resolve => rl.question(query, resolve));
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchWikiMetadata(filename) {
  const metaUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(filename)}&prop=imageinfo&iiprop=extmetadata|url&format=json`;
  const options = { headers: { 'User-Agent': 'CaribbeanLegacyArchive/1.0' } };
  await sleep(500); // Prevent rate limiting
  const res = await fetch(metaUrl, options);
  if (!res.ok) {
    return null;
  }
  const data = await res.json();
  const pages = data.query?.pages || {};
  const pageId = Object.keys(pages)[0];
  
  if (pageId && pages[pageId].imageinfo && pages[pageId].imageinfo.length > 0) {
    const info = pages[pageId].imageinfo[0];
    const sourceUrl = info.descriptionurl;
    const ext = info.extmetadata;
    let creator = null;
    let license = null;
    
    if (ext) {
      if (ext.Artist) creator = ext.Artist.value.replace(/<[^>]*>?/gm, '').trim();
      if (ext.LicenseShortName) {
        license = ext.LicenseShortName.value;
        if (license.toLowerCase().includes('pd') || license.toLowerCase().includes('public domain')) {
          license = 'Public Domain';
        }
      }
    }
    return { sourceUrl, creator, license };
  }
  return null;
}

async function searchWikipedia(name) {
  const options = { headers: { 'User-Agent': 'CaribbeanLegacyArchive/1.0' } };
  const wikiSearchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(name)}&format=json`;
  let res;
  let retryCount = 0;
  while (retryCount < 3) {
    await sleep(1500); // Prevent rate limiting between figure searches
    res = await fetch(wikiSearchUrl, options);
    if (res.status === 429) {
      console.log('⚠️ Rate limited by Wikipedia. Pausing for 10 seconds...');
      await sleep(10000);
      retryCount++;
      continue;
    }
    if (!res.ok) {
      console.error('API Error:', res.status, res.statusText);
      return [];
    }
    break;
  }
  
  if (!res || !res.ok) return [];
  const data = await res.json();
  
  const results = [];
  if (data.query && data.query.search) {
    const topHits = data.query.search.slice(0, 3);
    for (const hit of topHits) {
      const title = hit.title;
      const imgUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&piprop=original|name&format=json`;
      await sleep(500); // Prevent rate limiting
      const imgRes = await fetch(imgUrl, options);
      if (!imgRes.ok) continue;
      const imgData = await imgRes.json();
      
      const pages = imgData.query?.pages || {};
      const pageId = Object.keys(pages)[0];
      
      if (pageId && pageId !== '-1' && pages[pageId].original) {
        const originalUrl = pages[pageId].original.source;
        const filename = pages[pageId].pageimage;
        
        const meta = await fetchWikiMetadata(filename);
        if (meta && meta.license) {
          results.push({
            title,
            imageUrl: originalUrl,
            sourceUrl: meta.sourceUrl || originalUrl,
            creator: meta.creator,
            license: meta.license,
            creditLine: `Image: ${title}, ${meta.license}, via Wikimedia Commons.`,
            source: 'Wikimedia Commons'
          });
        }
      }
    }
  }
  return results;
}

async function runCurator() {
  console.log('\n=======================================');
  console.log(' CARIBBEAN LEGACY ARCHIVE - CURATOR CLI');
  console.log('=======================================\n');

  const { data: missingFigures, error } = await supabase
    .from('figures')
    .select('id, name')
    .is('image_url', null)
    .order('name');

  if (error) {
    console.error('Error fetching missing figures:', error);
    process.exit(1);
  }

  console.log(`Found ${missingFigures.length} profiles missing images.\n`);

  for (let i = 0; i < missingFigures.length; i++) {
    const figure = missingFigures[i];
    console.log(`--------------------------------------------------`);
    console.log(`[${i + 1}/${missingFigures.length}] Searching for: \x1b[36m${figure.name}\x1b[0m`);
    
    const results = await searchWikipedia(figure.name);
    
    let approved = false;
    
    if (results.length > 0) {
      for (let j = 0; j < results.length; j++) {
        const res = results[j];
        console.log(`\n\x1b[33mResult #${j + 1}:\x1b[0m`);
        console.log(`Title:    ${res.title}`);
        console.log(`Image:    ${res.imageUrl}`);
        console.log(`Source:   ${res.sourceUrl}`);
        console.log(`Creator:  ${res.creator}`);
        console.log(`License:  ${res.license}`);
        console.log(`Credit:   ${res.creditLine}`);

        // Auto-open the image in the default browser
        exec(`open "${res.sourceUrl}"`);

        const answer = await askQuestion('\nApprove this image? (y = yes, n = next result, m = manual fallback, q = quit): ');
        const key = answer.toLowerCase().trim();

        if (key === 'q') {
          console.log('Exiting curator tool...');
          rl.close();
          process.exit(0);
        } else if (key === 'm') {
          break; // break out of results loop and go to manual fallback
        } else if (key === 'y') {
          console.log(`Saving image data for ${figure.name}...`);
          const { error: updateError } = await supabase
            .from('figures')
            .update({
              image_url: res.imageUrl,
              image_source_url: res.sourceUrl,
              image_creator: res.creator,
              image_license: res.license,
              image_credit: res.creditLine
            })
            .eq('id', figure.id);

          if (updateError) {
            console.error('❌ Error saving to database:', updateError.message);
          } else {
            console.log('✅ Successfully saved!');
            approved = true;
          }
          break; // break out of results loop
        }
        // if 'n', continues to next result for this figure
      }
    } else {
      console.log('❌ No Wikimedia fuzzy matches found.');
    }

    if (!approved) {
      console.log(`\n\x1b[35m--- MANUAL FALLBACK ---\x1b[0m`);
      const googleUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(figure.name)}&tbs=sur:cl`;
      const flickrUrl = `https://www.flickr.com/search/?text=${encodeURIComponent(figure.name)}&license=7%2C9%2C10`;
      
      console.log(`To find an image, hold Cmd and click these links:`);
      console.log(`1. Google (CC Filtered): \x1b[34m${googleUrl}\x1b[0m`);
      console.log(`2. Flickr Commons: \x1b[34m${flickrUrl}\x1b[0m`);
      
      const manualAnswer = await askQuestion('\nDo you want to enter manual details for this figure? (y = yes, s = skip, q = quit): ');
      const mKey = manualAnswer.toLowerCase().trim();
      
      if (mKey === 'q') {
        console.log('Exiting curator tool...');
        rl.close();
        process.exit(0);
      } else if (mKey === 'y') {
        const mImageUrl = await askQuestion('Image File URL (must end in .jpg/.png): ');
        const mSourceUrl = await askQuestion('Source Website URL: ');
        const mCreator = await askQuestion('Creator/Archive Name: ');
        const mLicense = await askQuestion('License (e.g. Public Domain): ');
        
        let mCredit = `Image: ${figure.name}`;
        if (mCreator) mCredit += ` by ${mCreator}`;
        if (mLicense) mCredit += `, ${mLicense}`;
        mCredit += `.`;
        
        const mFinalCredit = await askQuestion(`Generated Credit: "${mCredit}"\nEnter custom credit line (or hit Enter to keep generated): `);
        
        console.log(`Saving manual entry...`);
        const { error: updateError } = await supabase
          .from('figures')
          .update({
            image_url: mImageUrl.trim(),
            image_source_url: mSourceUrl.trim() || null,
            image_creator: mCreator.trim() || null,
            image_license: mLicense.trim() || null,
            image_credit: mFinalCredit.trim() || mCredit
          })
          .eq('id', figure.id);

        if (updateError) {
          console.error('❌ Error saving to database:', updateError.message);
        } else {
          console.log('✅ Successfully saved manual entry!');
        }
      } else {
        console.log('Skipping figure...');
      }
    }


  }

  console.log('\nFinished all figures!');
  rl.close();
}

runCurator();
