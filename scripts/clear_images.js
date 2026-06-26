const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function clearImages() {
  console.log('Fetching all figures to clear their image URLs...');
  
  // To clear the image_urls, we update all rows where image_url is not null.
  // Using eq with an empty string or null depending on how it's stored.
  const { data, error } = await supabase
    .from('figures')
    .update({ image_url: null })
    .neq('image_url', 'xyz123fakevalue'); // update all

  if (error) {
    console.error('Error clearing images:', error.message);
  } else {
    console.log('Successfully cleared images from the database!');
  }
}

clearImages();
