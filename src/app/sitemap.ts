import { MetadataRoute } from 'next';
import { getFigures, getIslands, getAreas } from '@/lib/api';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Replace this fallback with your actual production URL via environment variable
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://caribbeanlegacyarchive.com';

  // Fetch all dynamic content
  const [figures, islands, areas] = await Promise.all([
    getFigures(),
    getIslands(),
    getAreas()
  ]);

  const figureUrls = figures.map((figure) => ({
    url: `${baseUrl}/profiles/${figure.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const islandUrls = islands.map((island) => ({
    url: `${baseUrl}/islands/${island.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const areaUrls = areas.map((area) => ({
    url: `${baseUrl}/areas/${area.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const staticUrls = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/profiles`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/islands`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/areas`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/map`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/credits`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    }
  ];

  return [...staticUrls, ...islandUrls, ...areaUrls, ...figureUrls];
}
