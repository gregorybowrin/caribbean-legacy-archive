import Link from 'next/link';
import { getAreas } from '@/lib/api';
import { Landmark, Scale, Hammer, Paintbrush, Book, HeartPulse } from 'lucide-react';

const areaIcons: Record<string, any> = {
  'politics': Landmark,
  'civil-rights': Scale,
  'labor-reform': Hammer,
  'arts': Paintbrush,
  'education': Book,
  'medicine': HeartPulse,
};

export default async function AreasPage() {
  const areas = await getAreas();
  return (
    <div className="bg-ivory min-h-screen">
      <section className="bg-navy py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-5xl text-gold mb-6">Areas of Influence</h1>
          <p className="text-ivory/60 max-w-2xl text-lg leading-relaxed font-light">
            Explore Caribbean legacy through specific fields of contribution. From political 
            reform to cultural movements, discover how these figures changed the world.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {areas.map((area) => {
              const Icon = areaIcons[area.slug] || Landmark;
              return (
                <Link 
                  key={area.id} 
                  href={`/areas/${area.slug}`}
                  className="group p-10 bg-white border border-gold/10 hover:border-gold hover:shadow-2xl transition-all duration-500 flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 bg-navy text-gold flex items-center justify-center rounded-full mb-8 group-hover:scale-110 transition-transform">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="font-serif text-2xl text-navy mb-4 group-hover:text-gold transition-colors">{area.name}</h3>
                  <p className="text-navy/60 text-sm mb-8 leading-relaxed">
                    Discover documented figures who have left an indelible mark on the field of {area.name.toLowerCase()}.
                  </p>
                  <div className="text-[10px] uppercase tracking-widest font-bold text-navy group-hover:text-gold transition-colors flex items-center">
                    Explore Category <span className="ml-2">→</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
