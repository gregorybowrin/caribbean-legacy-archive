import Link from 'next/link';
import { Search, Landmark, Globe } from 'lucide-react';
import { getFigures, getIslands, getAreas } from '@/lib/api';
import HomeSearch from '@/components/home/HomeSearch';

export default async function Home() {
  const [figures, islands, areas] = await Promise.all([
    getFigures(),
    getIslands(),
    getAreas()
  ]);

  const featuredFigures = figures.slice(0, 8);
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-navy overflow-hidden">
        {/* Background Texture/Overlay */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-navy/50 via-navy to-navy"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <div className="inline-block px-3 py-1 border border-gold/30 rounded-full mb-6">
            <span className="text-gold text-[10px] uppercase tracking-[0.3em] font-medium">Authoritative Caribbean History</span>
          </div>
          <h1 className="font-serif text-5xl md:text-7xl text-ivory mb-6 leading-tight">
            Preserving the Legacy of <br />
            <span className="text-gold italic">Caribbean Figures</span>
          </h1>
          <p className="text-ivory/70 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            A comprehensive digital archive dedicated to the historically documented men and women 
            who shaped the Caribbean's political, social, and cultural landscape.
          </p>
          
          <HomeSearch />
        </div>
      </section>

      {/* Featured Profiles */}
      <section className="py-24 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-serif text-3xl text-navy mb-2">Featured Profiles</h2>
              <p className="text-navy/60">Significant figures from our collection.</p>
            </div>
            <Link href="/profiles" className="text-navy font-semibold text-sm uppercase tracking-widest hover:text-gold transition-colors flex items-center">
              View All <span className="ml-2">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredFigures.map((figure) => (
              <Link 
                key={figure.id} 
                href={`/profiles/${figure.slug}`}
                className="group flex flex-col bg-white border border-navy/5 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img 
                    src={figure.image_url} 
                    alt={figure.name} 
                    className="object-cover w-full h-full grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-navy/20 group-hover:bg-transparent transition-all"></div>
                </div>
                <div className="p-6 border-t border-gold/10">
                  <span className="text-[10px] uppercase tracking-widest text-tropical-green font-bold mb-2 block">
                    {figure.islands?.name}
                  </span>
                  <h3 className="font-serif text-xl text-navy mb-2 group-hover:text-gold transition-colors">{figure.name}</h3>
                  <p className="text-navy/60 text-xs line-clamp-2 leading-relaxed">
                    {figure.bio}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Browse By Category */}
      <section className="py-24 bg-sand/30 border-y border-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Islands */}
            <div>
              <div className="flex items-center mb-8">
                <Globe className="h-6 w-6 text-tropical-green mr-4" />
                <h2 className="font-serif text-3xl text-navy">Browse by Island</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {islands.map((island) => (
                  <Link 
                    key={island.id} 
                    href={`/islands/${island.slug}`}
                    className="p-6 bg-white border border-gold/20 hover:border-gold hover:bg-gold/5 transition-all group"
                  >
                    <h3 className="font-serif text-lg text-navy group-hover:text-gold transition-colors">{island.name}</h3>
                    <span className="text-[10px] text-navy/40 uppercase tracking-widest">Explore Profiles</span>
                  </Link>
                ))}
                <div className="p-6 border border-dashed border-gold/30 flex items-center justify-center opacity-50">
                  <span className="text-xs uppercase tracking-widest">More Islands Soon</span>
                </div>
              </div>
            </div>

            {/* Areas */}
            <div>
              <div className="flex items-center mb-8">
                <Landmark className="h-6 w-6 text-gold mr-4" />
                <h2 className="font-serif text-3xl text-navy">Areas of Influence</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {areas.map((area) => (
                  <Link 
                    key={area.id} 
                    href={`/areas/${area.slug}`}
                    className="p-6 bg-white border border-gold/20 hover:border-gold hover:bg-gold/5 transition-all group"
                  >
                    <h3 className="font-serif text-lg text-navy group-hover:text-gold transition-colors">{area.name}</h3>
                    <span className="text-[10px] text-navy/40 uppercase tracking-widest">View Figures</span>
                  </Link>
                ))}
                <div className="p-6 border border-dashed border-gold/30 flex items-center justify-center opacity-50">
                  <span className="text-xs uppercase tracking-widest">More Categories</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-24 bg-ivory overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-navy/5 -skew-x-12 transform translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <h2 className="font-serif text-4xl text-navy mb-8">A Living Record of Excellence</h2>
            <div className="space-y-6 text-navy/70 text-lg leading-relaxed">
              <p>
                The Caribbean Legacy Archive is more than just a list of names. It is a curated repository of the 
                individuals whose intellect, bravery, and vision have contributed to the Caribbean we know today.
              </p>
              <p>
                Our mission is to provide an authoritative, educational platform where students, researchers, and 
                history enthusiasts can discover the rich tapestry of Caribbean leadership and contribution.
              </p>
              <div className="pt-8">
                <Link href="/about" className="inline-block px-8 py-4 bg-navy text-gold uppercase text-xs tracking-widest font-bold hover:bg-navy-light transition-colors">
                  Learn About Our Mission
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
