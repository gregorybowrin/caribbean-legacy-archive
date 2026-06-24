import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { figureId, metadata } = await request.json();

    if (!figureId || !metadata || !metadata.imageUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const updateData = {
      image_url: metadata.imageUrl,
      image_source_url: metadata.sourceUrl,
      image_creator: metadata.creator,
      image_license: metadata.license,
      image_credit: metadata.creditLine
    };

    const { error } = await supabaseAdmin
      .from('figures')
      .update(updateData)
      .eq('id', figureId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Approve error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
