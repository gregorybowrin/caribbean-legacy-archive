import { getAreas, getAreaBySlug, getFigures } from '@/lib/api';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export async function generateStaticParams() {
  const areas = await getAreas();
  return areas.map((area) => ({
    slug: area.slug,
  }));
}

export default async function AreaDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const area = await getAreaBySlug(slug);

  if (!area) {
    notFound();
  }

  const figures = await getFigures();
  const areaFigures = figures.filter((f) => 
    f.figure_areas?.some((fa) => fa.areas.id === area.id)
  );

  return (
    <div className="bg-ivory min-h-screen">
      <section className="bg-navy py-24 border-b-4 border-gold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-block px-3 py-1 bg-gold/10 border border-gold/30 rounded-full mb-6">
            <span className="text-gold text-[10px] uppercase tracking-[0.3em] font-medium">Area of Influence</span>
          </div>
          <h1 className="font-serif text-6xl text-ivory mb-6">{area.name}</h1>
          <p className="text-ivory/60 max-w-2xl text-lg leading-relaxed font-light">
            An archive of figures whose contributions in the field of {area.name.toLowerCase()} 
            have significantly impacted Caribbean history and development.
          </p>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12 border-b border-gold/10 pb-8">
          <div>
            <h2 className="font-serif text-3xl text-navy">Documented Figures</h2>
            <p className="text-navy/60 mt-2">Classified under {area.name}.</p>
          </div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-navy/40">
            {areaFigures.length} Entries Found
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {areaFigures.map((figure) => (
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
                <span className="text-[10px] uppercase tracking-widest text-tropical-green font-bold mb-2 block">
                  {figure.islands?.name}
                </span>
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

        {areaFigures.length === 0 && (
          <div className="text-center py-24 border-2 border-dashed border-gold/20 opacity-40">
            <p className="font-serif text-2xl text-navy">No profiles yet documented for this area.</p>
            <p className="text-sm uppercase tracking-widest mt-4">Our curators are constantly researching new entries.</p>
          </div>
        )}
      </section>
    </div>
  );
}
