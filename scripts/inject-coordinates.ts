import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const coordinates = [
  { slug: 'barbados', lat: 13.1939, long: -59.5432 },
  { slug: 'jamaica', lat: 18.1096, long: -77.2975 },
  { slug: 'trinidad-tobago', lat: 10.6918, long: -61.2225 },
  { slug: 'grenada', lat: 12.1165, long: -61.6790 },
  { slug: 'guyana', lat: 4.8604, long: -58.9301 },
  { slug: 'st-lucia', lat: 13.9094, long: -60.9789 },
  { slug: 'bahamas', lat: 24.2500, long: -76.0000 },
  { slug: 'st-kitts-nevis', lat: 17.3578, long: -62.7830 },
  { slug: 'dominica', lat: 15.4150, long: -61.3710 },
  { slug: 'st-vincent-grenadines', lat: 13.2528, long: -61.1971 },
  { slug: 'montserrat', lat: 16.7425, long: -62.1873 },
  { slug: 'bermuda', lat: 32.3078, long: -64.7505 },
  { slug: 'belize', lat: 17.1899, long: -88.4976 },
  { slug: 'anguilla', lat: 18.2206, long: -63.0686 },
  { slug: 'cayman-islands', lat: 19.3133, long: -81.2546 },
  { slug: 'bvi', lat: 18.4207, long: -64.6400 },
  { slug: 'tci', lat: 21.6940, long: -71.7979 },
  { slug: 'usvi', lat: 18.3358, long: -64.8963 },
  { slug: 'aruba', lat: 12.5211, long: -69.9683 },
  { slug: 'haiti', lat: 18.9712, long: -72.2852 },
  { slug: 'dominican-republic', lat: 18.7357, long: -70.1627 },
  { slug: 'puerto-rico', lat: 18.2208, long: -66.5901 },
  { slug: 'cuba', lat: 21.5218, long: -77.7812 },
  { slug: 'curacao', lat: 12.1696, long: -68.9900 },
  { slug: 'st-martin', lat: 18.0708, long: -63.0501 },
  { slug: 'suriname', lat: 3.9193, long: -56.0278 },
  { slug: 'guadeloupe', lat: 16.2650, long: -61.5510 },
  { slug: 'martinique', lat: 14.6415, long: -61.0242 },
  { slug: 'bonaire', lat: 12.1784, long: -68.2385 },
  { slug: 'st-barths', lat: 17.9000, long: -62.8333 },
  { slug: 'saba', lat: 17.6355, long: -63.2327 },
  { slug: 'st-eustatius', lat: 17.4890, long: -62.9733 },
  { slug: 'spm', lat: 46.8852, long: -56.3159 },
  { slug: 'grenadines', lat: 13.0116, long: -61.2291 },
  { slug: 'tortola', lat: 18.4333, long: -64.6167 },
  { slug: 'eleuthera', lat: 25.1000, long: -76.2000 },
  { slug: 'spanish-town', lat: 17.9959, long: -76.9554 },
  { slug: 'carriacou-pm', lat: 12.4744, long: -61.4423 },
  { slug: 'navassa', lat: 18.4019, long: -75.0115 },
  { slug: 'andros', lat: 24.7000, long: -78.0000 },
  { slug: 'port-royal', lat: 17.9366, long: -76.8411 },
  { slug: 'inagua', lat: 21.0500, long: -73.3000 },
  { slug: 'barbuda', lat: 17.6333, long: -61.7500 },
  { slug: 'nevis', lat: 17.1500, long: -62.5833 },
  { slug: 'abaco', lat: 26.3833, long: -77.1667 },
  { slug: 'grand-bahama', lat: 26.6500, long: -78.5000 },
  { slug: 'exuma', lat: 23.5333, long: -75.8333 },
  { slug: 'saint-pierre', lat: 14.7431, long: -61.1762 },
  { slug: 'marie-galante', lat: 15.9333, long: -61.2667 }
];

async function inject() {
  console.log('Starting coordinate injection...');
  for (const coord of coordinates) {
    const { error } = await supabase
      .from('islands')
      .update({ latitude: coord.lat, longitude: coord.long })
      .eq('slug', coord.slug);
    
    if (error) {
      console.error(`Error updating ${coord.slug}:`, error.message);
    } else {
      console.log(`Successfully updated ${coord.slug}`);
    }
  }
  console.log('Injection complete!');
}

inject();
