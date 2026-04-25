'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, X } from 'lucide-react';

interface ProfileExplorerProps {
  initialFigures: any[];
  islands: any[];
  areas: any[];
}

export default function ProfileExplorer({ initialFigures, islands, areas }: ProfileExplorerProps) {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIsland, setSelectedIsland] = useState('All Islands');
  const [selectedArea, setSelectedArea] = useState('All Areas');
  const [filteredFigures, setFilteredFigures] = useState(initialFigures);

  // Initialize search from URL if present
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setSearchQuery(q);
  }, [searchParams]);

  // Filter Logic
  useEffect(() => {
    let result = initialFigures;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(f => 
        f.name.toLowerCase().includes(q) || 
        f.bio.toLowerCase().includes(q) ||
        (f.islands?.name && f.islands.name.toLowerCase().includes(q))
      );
    }

    if (selectedIsland !== 'All Islands') {
      result = result.filter(f => f.islands?.name === selectedIsland);
    }

    if (selectedArea !== 'All Areas') {
      result = result.filter(f => 
        f.figure_areas?.some((fa: any) => fa.areas.name === selectedArea)
      );
    }

    setFilteredFigures(result);
  }, [searchQuery, selectedIsland, selectedArea, initialFigures]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedIsland('All Islands');
    setSelectedArea('All Areas');
  };

  return (
    <>
      {/* Filters & Search Bar */}
      <section className="sticky top-0 z-40 bg-sand/80 backdrop-blur-md border-b border-gold/10 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <div className="relative flex-grow md:w-80">
              <input 
                type="text" 
                placeholder="Search by name, island, or keyword..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gold/30 py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-gold rounded-sm shadow-inner"
              />
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-navy/40" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3.5 text-navy/20 hover:text-navy/60"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          
          <div className="flex space-x-2 w-full md:w-auto">
            <select 
              value={selectedIsland}
              onChange={(e) => setSelectedIsland(e.target.value)}
              className="bg-white border border-gold/30 py-2 px-3 text-xs focus:outline-none rounded-sm flex-1 md:flex-none"
            >
              <option>All Islands</option>
              {islands.map(i => <option key={i.id} value={i.name}>{i.name}</option>)}
            </select>
            
            <select 
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="bg-white border border-gold/30 py-2 px-3 text-xs focus:outline-none rounded-sm flex-1 md:flex-none"
            >
              <option>All Areas</option>
              {areas.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
            </select>

            {(searchQuery || selectedIsland !== 'All Islands' || selectedArea !== 'All Areas') && (
              <button 
                onClick={clearFilters}
                className="p-2 text-navy/40 hover:text-navy transition-colors"
                title="Clear Filters"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Results Count */}
      <section className="bg-ivory pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[10px] uppercase tracking-widest text-navy/40 font-bold">
            Showing {filteredFigures.length} of {initialFigures.length} profiles
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredFigures.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredFigures.map((figure) => (
                <Link 
                  key={figure.id} 
                  href={`/profiles/${figure.slug}`}
                  className="group flex flex-col bg-white border border-navy/5 shadow-sm hover:shadow-xl transition-all duration-500 rounded-sm overflow-hidden"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-sand/10">
                    {figure.image_url ? (
                      <img 
                        src={figure.image_url} 
                        alt={figure.name} 
                        className="object-cover w-full h-full grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-sand/20 group-hover:bg-sand/30 transition-colors">
                        <span className="font-serif text-gold/30 text-5xl italic">{figure.name.charAt(0)}</span>
                        <span className="text-[10px] uppercase tracking-widest text-gold/40 mt-4">Portrait Pending</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-navy/10 group-hover:bg-transparent transition-all"></div>
                  </div>
                  <div className="p-6">
                    <span className="text-[10px] uppercase tracking-widest text-tropical-green font-bold mb-2 block">
                      {figure.islands?.name || 'Caribbean'}
                    </span>
                    <h3 className="font-serif text-xl text-navy mb-2 group-hover:text-gold transition-colors">{figure.name}</h3>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {figure.figure_areas?.map((fa: any, idx: number) => (
                        <span key={idx} className="text-[9px] uppercase tracking-tighter bg-sand px-1.5 py-0.5 rounded-sm border border-gold/10 text-navy/70">
                          {fa.areas.name}
                        </span>
                      ))}
                    </div>
                    <p className="text-navy/60 text-xs line-clamp-3 leading-relaxed mb-4 italic">
                      "{figure.bio}"
                    </p>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-navy group-hover:text-gold flex items-center transition-colors">
                      Enter Archive <span className="ml-2">→</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center border-2 border-dashed border-gold/10 rounded-lg">
              <h3 className="font-serif text-2xl text-navy/40 mb-2">No matches found</h3>
              <p className="text-navy/30 mb-8">Try adjusting your filters or search terms.</p>
              <button 
                onClick={clearFilters}
                className="px-6 py-2 bg-navy text-gold text-xs uppercase tracking-widest font-bold hover:bg-navy-light rounded-sm"
              >
                Reset Search
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
