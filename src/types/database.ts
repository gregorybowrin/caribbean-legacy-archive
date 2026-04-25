export interface Island {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
}

export interface Area {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}

export interface Figure {
  id: string;
  name: string;
  slug: string;
  island_id: string;
  bio: string;
  contributions: string;
  image_url: string;
  birth_date?: string;
  death_date?: string;
  islands?: Island;
  figure_areas?: {
    areas: Area;
  }[];
  sources?: Source[];
}

export interface Source {
  id: string;
  figure_id: string;
  title: string;
  url: string;
}

export interface Tag {
  id: string;
  name: string;
}
