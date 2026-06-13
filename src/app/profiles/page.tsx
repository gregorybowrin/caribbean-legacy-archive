import ProfileExplorer from '@/components/profiles/ProfileExplorer';
import { Suspense } from 'react';
import { getFigures, getIslands, getAreas } from '@/lib/api';

export default async function ProfilesPage() {
  const [figures, islands, areas] = await Promise.all([
    getFigures(),
    getIslands(),
    getAreas()
  ]);

  return (
    <div className="bg-ivory min-h-screen">
      {/* Header */}
      <section className="bg-navy py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl text-gold mb-4">Profiles Directory</h1>
          <p className="text-ivory/60 max-w-2xl font-light">
            Explore the lives and contributions of documented Caribbean figures. 
            Filter by island or area of influence to narrow your search.
          </p>
        </div>
      </section>

      {/* Profile Explorer (Search & Filter Logic) */}
      <Suspense fallback={<div className="h-20 bg-sand/30 animate-pulse" />}>
        <ProfileExplorer 
          initialFigures={figures} 
          islands={islands} 
          areas={areas} 
        />
      </Suspense>
    </div>
  );
}
