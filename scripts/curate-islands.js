const readline = require('readline');
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

const askQuestion = (query) => new Promise((resolve) => rl.question(query, resolve));

async function run() {
  console.log('\n=========================================================');
  console.log('    CARIBBEAN LEGACY ARCHIVE - ISLAND IMAGE CURATOR');
  console.log('=========================================================\n');

  // Fetch islands with the default placeholder image or null
  const { data: islands, error } = await supabase
    .from('islands')
    .select('id, name, image_url')
    .or('image_url.is.null,image_url.ilike.%unsplash%');

  if (error) {
    console.error('Error fetching islands:', error);
    process.exit(1);
  }

  if (islands.length === 0) {
    console.log('All islands have custom images! You are good to go.');
    process.exit(0);
  }

  console.log(`Found ${islands.length} islands needing images.\n`);

  for (let i = 0; i < islands.length; i++) {
    const island = islands[i];
    console.log(`\n---------------------------------------------------------`);
    console.log(`[${i + 1}/${islands.length}] Island: \x1b[36m${island.name}\x1b[0m`);

    const q = encodeURIComponent(island.name + " landscape");
    const flickrUrl = `https://www.flickr.com/search/?text=${q}&license=2%2C3%2C4%2C5%2C6%2C9`;
    const wikimediaUrl = `https://commons.wikimedia.org/w/index.php?search=${encodeURIComponent(island.name + " landscape")}&title=Special:MediaSearch&go=Go&type=image`;

    console.log(`\n\x1b[33mSearch Links (Cmd+Click to open):\x1b[0m`);
    console.log(`1. Wikimedia Commons: \x1b[34m\x1b[4m${wikimediaUrl}\x1b[0m`);
    console.log(`2. Flickr (Creative Commons): \x1b[34m\x1b[4m${flickrUrl}\x1b[0m`);

    const action = await askQuestion('\nAction (m = enter image data manually, s = skip, q = quit): ');

    if (action.toLowerCase() === 'q') {
      console.log('Exiting curator...');
      break;
    } else if (action.toLowerCase() === 's') {
      console.log('Skipping island...');
      continue;
    } else if (action.toLowerCase() === 'm') {
      const imgUrl = await askQuestion('Enter Image URL: ');
      if (!imgUrl) {
        console.log('Skipped.');
        continue;
      }
      
      const { error: updateError } = await supabase
        .from('islands')
        .update({
          image_url: imgUrl,
        })
        .eq('id', island.id);

      if (updateError) {
        console.error('\x1b[31mError saving to Supabase:\x1b[0m', updateError);
      } else {
        console.log(`\x1b[32mSuccessfully updated ${island.name}!\x1b[0m`);
      }
    } else {
      console.log('Invalid input. Skipped.');
    }
  }

  rl.close();
}

run();
