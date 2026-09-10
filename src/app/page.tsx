import Link from 'next/link';
import { Search, Landmark, Globe } from 'lucide-react';
import { getFigures, getIslands, getAreas } from '@/lib/api';
import { ISLAND_FLAGS } from '@/lib/flags';
import HomeSearch from '@/components/home/HomeSearch';
import RandomFeaturedProfiles from '@/components/home/RandomFeaturedProfiles';

export default async function Home() {
  const [figures, islands, areas] = await Promise.all([
    getFigures(),
    getIslands(),
    getAreas()
  ]);

  const carouselFigures = figures
    .filter(f => f.image_url && f.image_url.trim() !== '')
    .slice(0, 15);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-navy overflow-hidden">
        {/* Scrolling Carousel Background */}
        <div className="absolute inset-0 z-0 flex items-stretch pointer-events-none opacity-30">
          <div className="flex animate-marquee w-max h-full">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex h-full">
                {carouselFigures.map((fig) => (
                  <div key={fig.id} className="h-full w-[300px] md:w-[450px] flex-shrink-0 grayscale">
                    <img src={fig.image_url} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Background Texture/Overlay */}
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"></div>
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-navy/60 via-navy/80 to-navy"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <div className="inline-block px-3 py-1 border border-gold/30 rounded-full mb-6">
            <span className="text-gold text-[10px] uppercase tracking-[0.3em] font-medium">Authoritative Caribbean History</span>
          </div>
          <h1 className="font-serif text-5xl md:text-7xl text-ivory mb-6 leading-tight">
            Preserving the Legacy of <br />
            <span className="text-gold italic">Caribbean Figures</span>
          </h1>
          <p className="text-lg md:text-xl text-ivory/80 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            A curated digital archive documenting the lives and contributions of those who shaped the Caribbean and the world.
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

          <RandomFeaturedProfiles 
            figures={figures
              .filter(f => f.image_url && f.image_url.trim() !== '')
              .map(f => ({
                id: f.id,
                name: f.name,
                slug: f.slug,
                image_url: f.image_url,
                bio: f.bio ? (f.bio.length > 150 ? f.bio.substring(0, 150) + '...' : f.bio) : '',
                islands: { name: f.islands?.name }
              }))} 
          />
        </div>
      </section>

      {/* Areas of Influence */}
      <section className="py-24 bg-navy border-y border-gold/20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center mb-16">
            <Landmark className="h-10 w-10 text-gold mb-6" />
            <h2 className="font-serif text-4xl text-ivory">Areas of Influence</h2>
            <p className="text-ivory/70 mt-4 max-w-2xl font-light text-lg">
              Discover the pioneers, leaders, and creatives who shaped distinct fields of Caribbean history.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {areas.map((area) => (
              <Link 
                key={area.id} 
                href={`/areas/${area.slug}`}
                className="p-8 bg-white/5 border border-gold/20 hover:border-gold hover:bg-gold/10 transition-all duration-300 group flex flex-col items-center text-center backdrop-blur-sm"
              >
                <h3 className="font-serif text-xl text-ivory group-hover:text-gold transition-colors">{area.name}</h3>
                <div className="mt-4 w-8 h-[1px] bg-gold/50 group-hover:w-16 transition-all duration-300"></div>
                <span className="text-[10px] text-ivory/50 uppercase tracking-widest mt-4 block">View Figures</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Territory */}
      <section className="py-24 bg-sand/30 border-b border-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center mb-16">
            <Globe className="h-10 w-10 text-tropical-green mb-6" />
            <h2 className="font-serif text-4xl text-navy">Browse by Territory</h2>
            <p className="text-navy/60 mt-4 max-w-2xl font-light text-lg">
              Explore our vast collection categorized by Caribbean nations and territories.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {islands.map((island) => (
              <Link 
                key={island.id} 
                href={`/islands/${island.slug}`}
                className="p-6 bg-white border border-gold/20 hover:border-gold hover:bg-gold/5 hover:shadow-md transition-all duration-300 group flex flex-col items-center text-center"
              >
                {ISLAND_FLAGS[island.slug] ? (
                  <img 
                    src={`https://flagcdn.com/w40/${ISLAND_FLAGS[island.slug]}.png`}
                    alt={`${island.name} Flag`}
                    className="w-10 h-auto rounded-sm shadow-sm border border-navy/10 mb-4 group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-10 h-7 rounded-sm shadow-sm border border-navy/10 mb-4 bg-navy/5 flex items-center justify-center">
                    <Globe className="w-4 h-4 text-navy/20" />
                  </div>
                )}
                <h3 className="font-serif text-sm text-navy group-hover:text-gold transition-colors leading-snug mb-3 flex-grow flex items-center justify-center">
                  {island.name}
                </h3>
                <span className="text-[9px] text-navy/40 uppercase tracking-widest block w-full border-t border-navy/5 pt-3 mt-auto">
                  Explore
                </span>
              </Link>
            ))}
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
