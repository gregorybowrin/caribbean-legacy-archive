import Link from 'next/link';
import { getIslands } from '@/lib/api';

export default async function IslandsPage() {
  const islands = await getIslands();
  return (
    <div className="bg-ivory min-h-screen">
      <section className="bg-navy py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="font-serif text-5xl text-gold mb-6">Explore by Island</h1>
          <p className="text-ivory/60 max-w-2xl text-lg leading-relaxed font-light">
            Discover the legacy of the Caribbean, island by island. Each nation has contributed 
            uniquely to the fabric of regional and global history.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {islands.map((island) => (
              <Link 
                key={island.id} 
                href={`/islands/${island.slug}`}
                className="group relative flex flex-col bg-white border border-gold/10 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden"
              >
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={island.image_url} 
                    alt={island.name} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  />
                </div>
                <div className="p-8">
                  <h3 className="font-serif text-2xl text-navy mb-4 group-hover:text-gold transition-colors">{island.name}</h3>
                  <p className="text-navy/60 text-sm leading-relaxed mb-6 line-clamp-3">
                    {island.description}
                  </p>
                  <div className="flex items-center text-[10px] uppercase tracking-[0.2em] font-bold text-navy group-hover:text-gold transition-all">
                    View Archive Profiles <span className="ml-3 transition-transform group-hover:translate-x-2">→</span>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-navy text-gold text-[10px] font-bold px-3 py-1 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore
                </div>
              </Link>
            ))}
            
            {/* Future Placeholder */}
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gold/20 opacity-40 rounded-sm">
              <span className="font-serif text-xl text-navy mb-2">More Islands</span>
              <span className="text-[10px] uppercase tracking-widest text-navy/60">Coming Soon</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
