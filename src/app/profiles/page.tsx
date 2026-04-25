import Link from 'next/link';
import { Search, Filter } from 'lucide-react';
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
          <p className="text-ivory/60 max-w-2xl">
            Explore the lives and contributions of documented Caribbean figures. 
            Filter by island or area of influence to narrow your search.
          </p>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="sticky top-20 z-40 bg-sand/50 backdrop-blur-md border-b border-gold/10 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <div className="relative flex-grow md:w-64">
              <input 
                type="text" 
                placeholder="Search profiles..." 
                className="w-full bg-white border border-gold/30 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-gold rounded-sm"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-navy/40" />
            </div>
            <button className="flex items-center px-4 py-2 bg-white border border-gold/30 text-xs uppercase tracking-widest font-bold text-navy hover:bg-gold/5">
              <Filter className="h-3 w-3 mr-2" /> Filter
            </button>
          </div>
          
          <div className="flex space-x-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <select className="bg-white border border-gold/30 py-2 px-3 text-xs focus:outline-none rounded-sm">
              <option>All Islands</option>
              {islands.map(i => <option key={i.id}>{i.name}</option>)}
            </select>
            <select className="bg-white border border-gold/30 py-2 px-3 text-xs focus:outline-none rounded-sm">
              <option>All Areas</option>
              {areas.map(a => <option key={a.id}>{a.name}</option>)}
            </select>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {figures.map((figure) => (
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
                  <div className="absolute inset-0 bg-navy/10 group-hover:bg-transparent transition-all"></div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] uppercase tracking-widest text-tropical-green font-bold">
                      {figure.islands?.name}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl text-navy mb-2 group-hover:text-gold transition-colors">{figure.name}</h3>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {figure.figure_areas?.map((fa, idx) => (
                      <span key={idx} className="text-[9px] uppercase tracking-tighter bg-sand px-1.5 py-0.5 rounded-sm border border-gold/10">
                        {fa.areas.name}
                      </span>
                    ))}
                  </div>
                  <p className="text-navy/60 text-xs line-clamp-3 leading-relaxed mb-4">
                    {figure.bio}
                  </p>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-navy group-hover:text-gold flex items-center transition-colors">
                    Read Profile <span className="ml-2">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
