import { supabase } from './supabase';

export async function getFigurePreview(slug: string) {
  const { data, error } = await supabase
    .from('figures')
    .select('name, image_url, bio')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    return null;
  }

  // Basic markdown strip for snippet
  let snippet = data.bio || '';
  snippet = snippet.replace(/#+\s/g, ''); // remove headers
  snippet = snippet.replace(/[*_~`]/g, ''); // remove bold/italic/code
  snippet = snippet.replace(/\[(.*?)\]\(.*?\)/g, '$1'); // replace links with text
  snippet = snippet.trim();

  if (snippet.length > 150) {
    snippet = snippet.substring(0, 147).trim() + '...';
  }

  return {
    name: data.name,
    image_url: data.image_url,
    snippet
  };
}
