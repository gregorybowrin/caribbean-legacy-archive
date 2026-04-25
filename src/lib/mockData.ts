import { Figure, Island, Area } from '@/types/database';

export const mockIslands: Island[] = [
  {
    id: '1',
    name: 'Saint Kitts and Nevis',
    slug: 'st-kitts-nevis',
    description: 'A twin-island nation in the West Indies.',
    image_url: 'https://images.unsplash.com/photo-1589412225893-bc4746765982?q=80&w=1000&auto=format&fit=crop'
  }
];

export const mockAreas: Area[] = [
  { id: '1', name: 'Politics', slug: 'politics' },
  { id: '2', name: 'Civil Rights', slug: 'civil-rights' },
  { id: '3', name: 'Labor Reform', slug: 'labor-reform' }
];

export const mockFigures: Figure[] = [
  {
    id: '1',
    name: 'Robert Llewellyn Bradshaw',
    slug: 'robert-llewellyn-bradshaw',
    island_id: '1',
    bio: 'The first Premier of Saint Kitts and Nevis and a key figure in the Caribbean labor movement.',
    contributions: 'Spearheaded the movement for independence and social justice in the Caribbean.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Robert_Llewellyn_Bradshaw.jpg',
    birth_date: '1916-09-16',
    death_date: '1978-05-23',
    islands: mockIslands[0],
    figure_areas: [{ areas: mockAreas[0] }, { areas: mockAreas[2] }],
    sources: [
      { id: '1', figure_id: '1', title: 'Robert Bradshaw - Wikipedia', url: 'https://en.wikipedia.org/wiki/Robert_Llewellyn_Bradshaw' }
    ]
  },
  {
    id: '2',
    name: 'C. A. Paul Southwell',
    slug: 'c-a-paul-southwell',
    island_id: '1',
    bio: 'The second Premier of Saint Kitts and Nevis and a prominent trade unionist.',
    contributions: 'Played a significant role in the constitutional development of the islands.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Paul_Southwell.jpg/220px-Paul_Southwell.jpg',
    birth_date: '1913-07-18',
    death_date: '1979-05-18',
    islands: mockIslands[0],
    figure_areas: [{ areas: mockAreas[0] }],
    sources: []
  },
  {
    id: '3',
    name: 'Joseph N. France',
    slug: 'joseph-n-france',
    island_id: '1',
    bio: 'A trade unionist and politician who served in various government capacities.',
    contributions: 'A key member of the Saint Kitts-Nevis Labour Party.',
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz9vL-X9z9-X9z9-X9z9-X9z9-X9z9-X9z9&s',
    birth_date: '1907-09-16',
    death_date: '1997-05-21',
    islands: mockIslands[0],
    figure_areas: [{ areas: mockAreas[0] }],
    sources: []
  },
  {
    id: '4',
    name: 'Sir Simeon Daniel',
    slug: 'sir-simeon-daniel',
    island_id: '1',
    bio: 'The first Premier of Nevis and a founding member of the Nevis Reformation Party.',
    contributions: 'Instrumental in the modernization of Nevis and its financial sector.',
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz9vL-X9z9-X9z9-X9z9-X9z9-X9z9-X9z9-X9z9&s',
    birth_date: '1934-08-22',
    death_date: '2012-05-27',
    islands: mockIslands[0],
    figure_areas: [{ areas: mockAreas[0] }],
    sources: []
  }
];
