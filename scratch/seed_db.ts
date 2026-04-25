import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seed() {
  console.log('Seeding data...');

  // 1. Seed Island
  const { data: island, error: islandError } = await supabase
    .from('islands')
    .insert([
      {
        name: 'Saint Kitts and Nevis',
        slug: 'st-kitts-nevis',
        description: 'A twin-island nation in the West Indies.',
        image_url: 'https://images.unsplash.com/photo-1589412225893-bc4746765982?q=80&w=1000&auto=format&fit=crop'
      }
    ])
    .select()
    .single();

  if (islandError) {
    console.error('Error seeding island:', islandError.message);
    return;
  }
  console.log('Island seeded:', island.name);

  // 2. Seed Areas
  const { data: areas, error: areasError } = await supabase
    .from('areas')
    .insert([
      { name: 'Politics', slug: 'politics' },
      { name: 'Civil Rights', slug: 'civil-rights' },
      { name: 'Labor Reform', slug: 'labor-reform' }
    ])
    .select();

  if (areasError) {
    console.error('Error seeding areas:', areasError.message);
    return;
  }
  console.log('Areas seeded:', areas.length);

  // 3. Seed Figures
  const figuresToSeed = [
    {
      name: 'Robert Llewellyn Bradshaw',
      slug: 'robert-llewellyn-bradshaw',
      island_id: island.id,
      bio: 'The first Premier of Saint Kitts and Nevis and a key figure in the Caribbean labor movement.',
      contributions: 'Spearheaded the movement for independence and social justice in the Caribbean.',
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Robert_Llewellyn_Bradshaw.jpg',
      birth_date: '1916-09-16',
      death_date: '1978-05-23'
    },
    {
      name: 'C. A. Paul Southwell',
      slug: 'c-a-paul-southwell',
      island_id: island.id,
      bio: 'The second Premier of Saint Kitts and Nevis and a prominent trade unionist.',
      contributions: 'Played a significant role in the constitutional development of the islands.',
      image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Paul_Southwell.jpg/220px-Paul_Southwell.jpg',
      birth_date: '1913-07-18',
      death_date: '1979-05-18'
    },
    {
      name: 'Joseph N. France',
      slug: 'joseph-n-france',
      island_id: island.id,
      bio: 'A trade unionist and politician who served in various government capacities.',
      contributions: 'A key member of the Saint Kitts-Nevis Labour Party.',
      image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz9vL-X9z9-X9z9-X9z9-X9z9-X9z9-X9z9&s',
      birth_date: '1907-09-16',
      death_date: '1997-05-21'
    },
    {
      name: 'Sir Simeon Daniel',
      slug: 'sir-simeon-daniel',
      island_id: island.id,
      bio: 'The first Premier of Nevis and a founding member of the Nevis Reformation Party.',
      contributions: 'Instrumental in the modernization of Nevis and its financial sector.',
      image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz9vL-X9z9-X9z9-X9z9-X9z9-X9z9-X9z9-X9z9&s',
      birth_date: '1934-08-22',
      death_date: '2012-05-27'
    }
  ];

  const { data: figures, error: figuresError } = await supabase
    .from('figures')
    .insert(figuresToSeed)
    .select();

  if (figuresError) {
    console.error('Error seeding figures:', figuresError.message);
    return;
  }
  console.log('Figures seeded:', figures.length);

  // 4. Link Figures to Areas (Figure Areas)
  // For simplicity, just link Bradshaw to Politics and Labor Reform
  const bradshaw = figures.find(f => f.slug === 'robert-llewellyn-bradshaw');
  const politics = areas.find(a => a.slug === 'politics');
  const labor = areas.find(a => a.slug === 'labor-reform');

  if (bradshaw && politics && labor) {
    const { error: linkError } = await supabase
      .from('figure_areas')
      .insert([
        { figure_id: bradshaw.id, area_id: politics.id },
        { figure_id: bradshaw.id, area_id: labor.id }
      ]);
    
    if (linkError) {
      console.error('Error linking Bradshaw to areas:', linkError.message);
    } else {
      console.log('Bradshaw linked to areas.');
    }
  }

  console.log('Seeding completed!');
}

seed();
