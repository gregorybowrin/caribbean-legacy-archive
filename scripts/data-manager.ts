import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

/**
 * Caribbean Legacy Archive - Data Manager
 * This script allows Antigravity to manage museum records directly.
 */

export async function addFigure(figure: any, areaSlugs: string[]) {
  console.log(`Adding figure: ${figure.name}...`);
  
  // 1. Insert/Get Figure
  const { data: newFigure, error: figureError } = await supabase
    .from('figures')
    .upsert(figure, { onConflict: 'slug' })
    .select()
    .single();

  if (figureError) {
    console.error('Error adding figure:', figureError.message);
    return;
  }

  // 2. Link to Areas
  if (areaSlugs.length > 0) {
    const { data: areas } = await supabase
      .from('areas')
      .select('id, slug')
      .in('slug', areaSlugs);

    if (areas) {
      const links = areas.map(a => ({
        figure_id: newFigure.id,
        area_id: a.id
      }));

      const { error: linkError } = await supabase
        .from('figure_areas')
        .upsert(links, { onConflict: 'figure_id,area_id' });

      if (linkError) console.error('Error linking areas:', linkError.message);
    }
  }

  console.log(`Successfully added/updated: ${newFigure.name}`);
}

export async function addIsland(island: any) {
  const { data, error } = await supabase
    .from('islands')
    .upsert(island, { onConflict: 'slug' })
    .select()
    .single();

  if (error) {
    console.error('Error adding island:', error.message);
  } else {
    console.log(`Successfully added island: ${data.name}`);
  }
}

// Example usage when called via CLI
if (require.main === module) {
  const action = process.argv[2];
  const payload = JSON.parse(process.argv[3] || '{}');

  if (action === 'add-figure') {
    addFigure(payload.figure, payload.areas || []);
  } else if (action === 'add-island') {
    addIsland(payload.island);
  }
}
