import { getFigures, getFigureBySlug } from '@/lib/api';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, MapPin, Link as LinkIcon, BookOpen, Quote } from 'lucide-react';

import ShareButtons from '@/components/ui/ShareButtons';

export async function generateStaticParams() {
  const figures = await getFigures();
  return figures.map((figure) => ({
    slug: figure.slug,
  }));
}

export default async function ProfileDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const figure = await getFigureBySlug(slug);

  if (!figure) {
    notFound();
  }

  const figures = await getFigures();
  const relatedFigures = figures.filter(f => f.slug !== figure.slug).slice(0, 2);

  return (
    <div className="bg-ivory min-h-screen">
      {/* Breadcrumbs */}
      <div className="bg-sand/30 border-b border-gold/10 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-[10px] uppercase tracking-widest flex items-center space-x-2 text-navy/40">
            <Link href="/" className="hover:text-navy">Home</Link>
            <span>/</span>
            <Link href="/profiles" className="hover:text-navy">Profiles</Link>
            <span>/</span>
            <span className="text-navy/80">{figure.name}</span>
          </nav>
        </div>
      </div>

      <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Sidebar / Image */}
          <div className="lg:col-span-4 space-y-8">
            <div className="relative border-4 border-white shadow-2xl overflow-hidden aspect-[4/5]">
              <img 
                src={figure.image_url} 
                alt={figure.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 border border-gold/20 pointer-events-none"></div>
            </div>

            <div className="bg-white border border-gold/20 p-8 shadow-sm">
              <h3 className="font-serif text-xl text-navy mb-6 border-b border-gold/20 pb-4">Biographical Details</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 text-tropical-green mr-3 mt-1" />
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-navy/40 block">Origin</span>
                    <Link href={`/islands/${figure.islands?.slug}`} className="text-sm font-semibold hover:text-gold transition-colors">
                      {figure.islands?.name}
                    </Link>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Calendar className="h-4 w-4 text-gold mr-3 mt-1" />
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-navy/40 block">Life Dates</span>
                    <span className="text-sm font-semibold">
                      {figure.birth_date ? new Date(figure.birth_date).getFullYear() : 'Unknown'} – {figure.death_date ? new Date(figure.death_date).getFullYear() : 'Present'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start">
                  <BookOpen className="h-4 w-4 text-navy/60 mr-3 mt-1" />
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-navy/40 block">Areas of Influence</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {figure.figure_areas?.map((fa, idx) => (
                        <Link 
                          key={idx} 
                          href={`/areas/${fa.areas.slug}`}
                          className="text-[9px] uppercase tracking-tighter bg-sand px-2 py-1 border border-gold/20 hover:border-gold transition-colors"
                        >
                          {fa.areas.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8">
            <header className="mb-12">
              <h1 className="font-serif text-5xl md:text-6xl text-navy mb-4 leading-tight">{figure.name}</h1>
              <div className="w-24 h-1 bg-gold"></div>
            </header>

            <section className="prose prose-navy max-w-none">
              <div className="relative mb-12">
                <Quote className="absolute -left-8 -top-8 h-16 w-16 text-gold/10 pointer-events-none" />
                <h2 className="font-serif text-3xl text-navy mb-6">Biography</h2>
                <div className="text-navy/80 text-lg leading-relaxed space-y-6">
                  {figure.bio.split('\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>

              <ShareButtons 
                title={`Learn about the legacy of ${figure.name}`} 
                url={`https://caribbeanlegacyarchive.com/profiles/${figure.slug}`} 
              />

              <div className="mb-12 pt-12 border-t border-gold/10">
                <h2 className="font-serif text-3xl text-navy mb-6">Major Contributions</h2>
                <div className="text-navy/80 text-lg leading-relaxed bg-white p-8 border-l-4 border-tropical-green shadow-sm">
                  {figure.contributions}
                </div>
              </div>

              {figure.sources && figure.sources.length > 0 && (
                <div className="mb-12 pt-12 border-t border-gold/10">
                  <h2 className="font-serif text-2xl text-navy mb-6">Verified Sources</h2>
                  <ul className="space-y-4">
                    {figure.sources.map((source) => (
                      <li key={source.id}>
                        <a 
                          href={source.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="group flex items-center p-4 bg-white border border-gold/20 hover:border-gold transition-all"
                        >
                          <LinkIcon className="h-4 w-4 text-gold mr-4" />
                          <div>
                            <span className="text-sm font-medium text-navy block group-hover:text-gold">{source.title}</span>
                            <span className="text-[10px] text-navy/40 truncate block max-w-md">{source.url}</span>
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>

            {/* Related Profiles Placeholder */}
            <section className="pt-12 border-t border-gold/10">
              <h2 className="font-serif text-2xl text-navy mb-8">Related Figures</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedFigures.map(related => (
                  <Link 
                    key={related.id} 
                    href={`/profiles/${related.slug}`}
                    className="flex bg-white border border-gold/10 overflow-hidden hover:shadow-lg transition-all"
                  >
                    <div className="w-24 h-24 flex-shrink-0 grayscale hover:grayscale-0 transition-all">
                      <img src={related.image_url} alt={related.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4">
                      <h4 className="font-serif text-lg text-navy line-clamp-1">{related.name}</h4>
                      <span className="text-[10px] uppercase tracking-widest text-navy/40">{related.islands?.name}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </article>
    </div>
  );
}
