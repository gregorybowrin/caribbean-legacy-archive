import { supabase } from './supabase';
import { Figure, Island, Area } from '@/types/database';

export async function getIslands(): Promise<Island[]> {
  const { data, error } = await supabase
    .from('islands')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching islands:', error);
    return [];
  }
  return data || [];
}

export async function getAreas(): Promise<Area[]> {
  const { data, error } = await supabase
    .from('areas')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching areas:', error);
    return [];
  }
  return data || [];
}

export async function getFigures(): Promise<Figure[]> {
  const { data, error } = await supabase
    .from('figures')
    .select(`
      *,
      islands (*),
      figure_areas (
        areas (*)
      ),
      sources (*)
    `)
    .order('name');
  
  if (error) {
    console.error('Error fetching figures:', error);
    return [];
  }
  return data || [];
}

export async function getFigureBySlug(slug: string): Promise<Figure | null> {
  const { data, error } = await supabase
    .from('figures')
    .select(`
      *,
      islands (*),
      figure_areas (
        areas (*)
      ),
      sources (*)
    `)
    .eq('slug', slug)
    .single();
  
  if (error) {
    console.error(`Error fetching figure with slug ${slug}:`, error);
    return null;
  }
  return data;
}

export async function getIslandBySlug(slug: string): Promise<Island | null> {
  const { data, error } = await supabase
    .from('islands')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error) {
    console.error(`Error fetching island with slug ${slug}:`, error);
    return null;
  }
  return data;
}

export async function getAreaBySlug(slug: string): Promise<Area | null> {
  const { data, error } = await supabase
    .from('areas')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error) {
    console.error(`Error fetching area with slug ${slug}:`, error);
    return null;
  }
  return data;
}
