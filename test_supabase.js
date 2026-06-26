const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function test() {
  const { data: islandsData, error } = await supabase
    .from('islands')
    .select(`
      *,
      figures:figures(count)
    `);

  if (error) {
    console.error('Supabase Error:', error);
  } else {
    console.log('Islands count:', islandsData ? islandsData.length : 0);
    if (islandsData && islandsData.length > 0) {
      console.log('Sample island:', islandsData[0]);
    }
  }
}

test();
