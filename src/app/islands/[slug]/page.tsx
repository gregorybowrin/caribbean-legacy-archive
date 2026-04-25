import { getIslands, getIslandBySlug, getFigures } from '@/lib/api';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export async function generateStaticParams() {
  const islands = await getIslands();
  return islands.map((island) => ({
    slug: island.slug,
  }));
}

export default async function IslandDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const island = await getIslandBySlug(slug);

  if (!island) {
    notFound();
  }

  const figures = await getFigures();
  const islandFigures = figures.filter((f) => f.island_id === island.id);

  return (
    <div className="bg-ivory min-h-screen">
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <img 
          src={island.image_url} 
          alt={island.name} 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-navy/70 backdrop-blur-sm"></div>
        <div className="relative z-10 text-center max-w-4xl px-4">
          <h1 className="font-serif text-5xl md:text-6xl text-gold mb-6">{island.name}</h1>
          <p className="text-ivory/70 text-lg md:text-xl font-light leading-relaxed">
            {island.description}
          </p>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12 border-b border-gold/10 pb-8">
          <div>
            <h2 className="font-serif text-3xl text-navy">Figures from {island.name}</h2>
            <p className="text-navy/60 mt-2">Historically documented individuals of note.</p>
          </div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-navy/40">
            {islandFigures.length} Entries Found
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {islandFigures.map((figure) => (
            <Link 
              key={figure.id} 
              href={`/profiles/${figure.slug}`}
              className="group flex flex-col bg-white border border-navy/5 shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img 
                  src={figure.image_url} 
                  alt={figure.name} 
                  className="object-cover w-full h-full grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />
              </div>
              <div className="p-6">
                <h3 className="font-serif text-xl text-navy mb-2 group-hover:text-gold transition-colors">{figure.name}</h3>
                <p className="text-navy/60 text-xs line-clamp-3 leading-relaxed mb-4">
                  {figure.bio}
                </p>
                <span className="text-[10px] uppercase tracking-widest font-bold text-navy group-hover:text-gold transition-colors">
                  View Profile →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {islandFigures.length === 0 && (
          <div className="text-center py-24 border-2 border-dashed border-gold/20 opacity-40">
            <p className="font-serif text-2xl text-navy">No profiles yet documented for this island.</p>
            <p className="text-sm uppercase tracking-widest mt-4">Archives are being updated weekly.</p>
          </div>
        )}
      </section>
    </div>
  );
}
