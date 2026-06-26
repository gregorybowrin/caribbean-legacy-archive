import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const updates = [
  {
    id: 'fe188d47-4dc9-442c-82bc-9dabd59e9cf5',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Wilfred_Jacobs%2C_Governor_of_Antigua.jpg',
    name: 'Sir Wilfred Jacobs'
  },
  {
    id: '6f6801ef-2868-4b67-abe4-2f011bb4b8b3',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Dr._the_Hon_Simeon_Daniel%2C_first_Premier_of_Nevis.jpg',
    name: 'Sir Simeon Daniel'
  },
  {
    id: '8dc3bddf-9e7e-4974-bc0c-27cafc048f05',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/7/77/Vere_Bird_1986_%28cropped%29.jpg',
    name: 'Sir Vere Cornwall Bird'
  },
  {
    id: '526b9df4-901f-4935-abd4-9c22c1248656',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Viv_Richards.jpg',
    name: 'Sir Vivian Richards'
  }
];

async function updateFigures() {
  let successCount = 0;
  for (const figure of updates) {
    const { error } = await supabase
      .from('figures')
      .update({ image_url: figure.image_url })
      .eq('id', figure.id);
      
    if (error) {
      console.error(`Failed to update ${figure.name}:`, error.message);
    } else {
      console.log(`Successfully updated ${figure.name}`);
      successCount++;
    }
  }
  console.log(`Finished updating ${successCount} figures.`);
}

updateFigures();
