const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseKey) {
  console.error("Missing supabase credentials. Ensure .env.local exists.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const figures = [
  {"id":"b6be8ab2-9f62-4fe8-b5cd-1e34884385d4","name":"Tim Hector","island":"Antigua and Barbuda"},
  {"id":"c1d82c9e-d83e-4451-b1b1-05303e5be0c3","name":"Dame Gwendolyn Tonge","island":"Antigua and Barbuda"},
  {"id":"320b2fd1-e537-433b-981d-36f0ee6bc086","name":"Sir Kennedy Simmonds","island":"Saint Kitts and Nevis"},
  {"id":"3633302b-d52b-4fea-aada-dff4c961f03d","name":"Dame Mary Charles-George","island":"Saint Kitts and Nevis"},
  {"id":"c0b1ee34-a9de-4b86-abbb-91e761ed68ed","name":"Sir S.W. Tapley Seaton","island":"Saint Kitts and Nevis"},
  {"id":"e790f2ef-bb5d-488e-936f-e96de378e46e","name":"Thomas Manchester","island":"Saint Kitts and Nevis"},
  {"id":"3be3a686-fa48-4150-b639-28eea0c2854a","name":"Kenrick Georges","island":"Saint Kitts and Nevis"},
  {"id":"2d7655a8-be08-4cfb-b8f9-ee084830855a","name":"Dame Constance Mitcham","island":"Saint Kitts and Nevis"},
  {"id":"e42bb3f2-0144-4a75-8a7e-0f9d71f84195","name":"Bussa","island":"Barbados"},
  {"id":"db4c1fc7-ebb8-4e1d-9191-55d3871a0a31","name":"Sarah Ann Gill","island":"Barbados"}
];

async function getWikipediaImage(name) {
  let searchName = name.replace(/^(Sir|Dame)\s+/, '');
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(searchName)}|${encodeURIComponent(name)}&prop=pageimages&format=json&pithumbsize=1000`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    const pages = data.query.pages;
    for (let pageId in pages) {
      if (pages[pageId].thumbnail && pages[pageId].thumbnail.source) {
        if (!pages[pageId].thumbnail.source.endsWith('.svg') && !pages[pageId].thumbnail.source.endsWith('.pdf')) {
            return pages[pageId].thumbnail.source;
        }
      }
    }
  } catch (e) {
    console.error(`Error fetching for ${name}`, e);
  }
  return null;
}

async function run() {
  let successCount = 0;
  for (const figure of figures) {
    console.log(`Checking ${figure.name}...`);
    let imageUrl = await getWikipediaImage(figure.name);
    
    // Fallbacks for specific figures
    if (!imageUrl && figure.name === 'Sir S.W. Tapley Seaton') imageUrl = await getWikipediaImage('Tapley Seaton');
    if (!imageUrl && figure.name === 'Bussa') imageUrl = await getWikipediaImage("Bussa's rebellion");

    if (imageUrl) {
      console.log(`Found image for ${figure.name}: ${imageUrl}`);
      const { data, error } = await supabase
        .from('figures')
        .update({ image_url: imageUrl })
        .eq('id', figure.id);
        
      if (error) {
        console.error(`Error updating ${figure.name}:`, error);
      } else {
        successCount++;
        console.log(`Updated ${figure.name}`);
      }
    } else {
      console.log(`No image found for ${figure.name}`);
    }
  }
  console.log(`Successfully updated ${successCount} figures.`);
}

run();
