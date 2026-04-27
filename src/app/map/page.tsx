'use client';

import React, { useEffect, useState, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence, animate } from 'framer-motion';
import { geoMercator, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import { Maximize2, Minimize2, ArrowLeft, Users, Globe } from 'lucide-react';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ISLAND_FLAGS: Record<string, string> = {
  'anguilla': 'ai',
  'antigua-barbuda': 'ag',
  'barbuda': 'ag',
  'aruba': 'aw',
  'bahamas': 'bs',
  'the-bahamas': 'bs',
  'eleuthera': 'bs',
  'andros': 'bs',
  'inagua': 'bs',
  'grand-bahama': 'bs',
  'exuma': 'bs',
  'abaco': 'bs',
  'barbados': 'bb',
  'british-virgin-islands': 'vg',
  'bvi': 'vg',
  'tortola': 'vg',
  'spanish-town': 'vg',
  'cayman-islands': 'ky',
  'cuba': 'cu',
  'curacao': 'cw',
  'dominica': 'dm',
  'dominican-republic': 'do',
  'grenada': 'gd',
  'carriacou-pm': 'gd',
  'guadeloupe': 'gp',
  'marie-galante': 'gp',
  'haiti': 'ht',
  'jamaica': 'jm',
  'port-royal': 'jm',
  'martinique': 'mq',
  'montserrat': 'ms',
  'puerto-rico': 'pr',
  'saint-kitts-nevis': 'kn',
  'st-kitts-nevis': 'kn',
  'nevis': 'kn',
  'saint-lucia': 'lc',
  'saint-vincent-grenadines': 'vc',
  'st-vincent': 'vc',
  'grenadines': 'vc',
  'trinidad-tobago': 'tt',
  'turks-caicos': 'tc',
  'tci': 'tc',
  'us-virgin-islands': 'vi',
  'usvi': 'vi',
  'guyana': 'gy',
  'belize': 'bz',
  'bermuda': 'bm',
  'suriname': 'sr',
  'st-martin': 'mf',
  'st-barths': 'bl',
  'bonaire': 'bq',
  'saba': 'bq',
  'st-eustatius': 'bq',
  'spm': 'pm',
  'saint-pierre': 'pm',
  'navassa': 'um'
};

export default function GlobalMap() {
  const [islands, setIslands] = useState<any[]>([]);
  const [selectedIsland, setSelectedIsland] = useState<any>(null);
  const [islandFigures, setIslandFigures] = useState<any[]>([]);
  const [hoveredIsland, setHoveredIsland] = useState<any>(null);
  const [worldData, setWorldData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [mapCenter, setMapCenter] = useState<[number, number]>([11, 30]); // Further north to crop Antarctica
  const [mapScale, setMapScale] = useState(240); // Larger scale to fill screen better
  const [introFinished, setIntroFinished] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const flyoutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    }
  }, []);

  // Handle Trackpad Panning
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (selectedIsland) {
        e.preventDefault();
        setPanOffset(prev => ({
          x: prev.x - e.deltaX,
          y: prev.y - e.deltaY
        }));
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [selectedIsland]);

  // Map Projection
  const projection = geoMercator()
    .center(mapCenter)
    .scale(mapScale)
    .translate([dimensions.width / 2, dimensions.height / 2]);

  const pathGenerator = geoPath().projection(projection);

  useEffect(() => {
    async function fetchData() {
      const { data: islandsData } = await supabase
        .from('islands')
        .select(`
          *,
          figures:figures(count)
        `);
      
      if (islandsData) {
        // Filter out northern territories (Bermuda, SPM) globally
        setIslands(islandsData.filter(i => i.latitude !== null && i.latitude < 28));
      }

      try {
        const response = await fetch('https://unpkg.com/world-atlas@2.0.2/countries-110m.json');
        const data = await response.json();
        setWorldData(feature(data, data.objects.countries));
      } catch (error) {
        console.error('Error loading map data:', error);
      }

      setLoading(false);
    }

    fetchData();
  }, []);

  // Trigger Intro Animation
  useEffect(() => {
    if (!loading && !introFinished) {
      const timer = setTimeout(() => {
        // Smoothly animate the projection parameters
        const startCenter: [number, number] = [11, 30];
        const endCenter: [number, number] = [-75, 18];
        const startScale = 240;
        const endScale = 1500;
        
        animate(0, 1, {
          duration: 2.5,
          ease: "easeInOut",
          onUpdate: (latest) => {
            setMapCenter([
              startCenter[0] + (endCenter[0] - startCenter[0]) * latest,
              startCenter[1] + (endCenter[1] - startCenter[1]) * latest
            ]);
            setMapScale(startScale + (endScale - startScale) * latest);
          },
          onComplete: () => setIntroFinished(true)
        });
      }, 1000); // 1s pause at the global view
      return () => clearTimeout(timer);
    }
  }, [loading, introFinished]);

  const handleIslandClick = async (island: any) => {
    if (selectedIsland?.id === island.id) {
      resetView();
      return;
    }
    
    setSelectedIsland(island);
    setPanOffset({ x: 0, y: 0 }); // Reset pan on new selection

    const { data: figures } = await supabase
      .from('figures')
      .select('*')
      .eq('island_id', island.id)
      .limit(10);
    
    if (figures) {
      setIslandFigures(figures);
    }
  };

  const resetView = () => {
    setSelectedIsland(null);
    setIslandFigures([]);
    setPanOffset({ x: 0, y: 0 });
  };

  // Calculate transformation logic
  const zoomFactor = selectedIsland ? 5 : 1;
  const targetX = selectedIsland 
    ? (dimensions.width / 2 - projection([selectedIsland.longitude, selectedIsland.latitude])![0] * zoomFactor) + panOffset.x
    : 0;
  const targetY = selectedIsland 
    ? (dimensions.height / 2 - projection([selectedIsland.longitude, selectedIsland.latitude])![1] * zoomFactor) + panOffset.y
    : 0;

  return (
    <div className="fixed inset-0 bg-[#020617] overflow-hidden select-none">
      <AnimatePresence>
        {loading && (
          <motion.div 
            key="loading-screen"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 bg-[#020617] flex items-center justify-center z-[100]"
          >
            <div className="text-amber-500/50 animate-pulse text-sm font-light tracking-[0.2em] uppercase">
              Initializing Archive Map v0.2-flags...
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Immersive Background Grid */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#amber-500 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* Map Engine */}
      <motion.div 
        className="w-full h-full cursor-grab active:cursor-grabbing"
        animate={{
          scale: zoomFactor,
          x: targetX,
          y: targetY,
        }}
        transition={{ 
          type: 'spring', 
          damping: 25, 
          stiffness: 60,
          restDelta: 0.001 
        }}
        style={{ transformOrigin: '0 0' }}
      >
        <svg 
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} 
          className="w-full h-full"
          onClick={(e) => {
            if (e.target === e.currentTarget) resetView();
          }}
        >
          <path
            d={pathGenerator(worldData) || ''}
            fill="#0f172a"
            stroke="#1e293b"
            strokeWidth="0.5"
            onClick={resetView}
          />

          {islands.map((island) => {
            const [x, y] = projection([island.longitude, island.latitude]) || [0, 0];
            const isSelected = selectedIsland?.id === island.id;
            const isHovered = hoveredIsland?.id === island.id;
            
            return (
              <g key={island.id} 
                 className="cursor-pointer"
                 onMouseEnter={() => setHoveredIsland(island)}
                 onMouseLeave={() => setHoveredIsland(null)}
                 onClick={(e) => {
                   e.stopPropagation();
                   handleIslandClick(island);
                 }}
              >
                {/* Large Invisible Hit-box (Smart-sized based on zoom) */}
                <circle
                  cx={x}
                  cy={y}
                  r={selectedIsland ? 8 : 12} // Reduced from 20 to prevent overlap
                  fill="transparent"
                />


                <motion.circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 10 : (isHovered ? 8 : 4)}
                  fill={isSelected ? '#0ea5e9' : (isHovered ? '#fbbf24' : '#d97706')}
                  initial={{ opacity: 0.3 }}
                  animate={{ 
                    opacity: isSelected ? 0.9 : (isHovered ? 0.9 : (introFinished ? 0.4 : 0.8)),
                    scale: isHovered ? 1.5 : 1,
                  }}
                  transition={{ 
                    scale: { type: 'spring', stiffness: 300, damping: 20 }
                  }}
                />
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 3 : 2}
                  fill={isSelected ? '#ffffff' : '#fbbf24'}
                />
              </g>
            );
          })}

          {/* Single Global Pulsing Active Halo */}
          <AnimatePresence mode="wait">
            {selectedIsland && (
              <motion.circle
                key={`global-pulse-${selectedIsland.id}`}
                cx={projection([selectedIsland.longitude, selectedIsland.latitude])![0]}
                cy={projection([selectedIsland.longitude, selectedIsland.latitude])![1]}
                initial={{ r: 10, opacity: 0.8 }}
                animate={{ 
                  r: 20, 
                  opacity: 0,
                }}
                exit={{ 
                  opacity: 0,
                  scale: 0,
                  transition: { duration: 0.2 } 
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 1.2,
                  ease: "easeOut"
                }}
                fill="none"
                stroke="#fbbf24"
                strokeWidth="2"
              />
            )}
          </AnimatePresence>
        </svg>
      </motion.div>

      {/* Global Navigation - Top Left */}
      <div className="absolute top-12 left-12 z-20">
        <Link href="/" className="group flex items-center gap-3 text-white/50 hover:text-white transition-colors">
          <ArrowLeft size={18} />
          <span className="text-xs uppercase tracking-[0.2em] font-light">Exit Map</span>
        </Link>
      </div>

      {/* Map Identity & Controls - Relocated to Lower Left */}
      <div className="absolute bottom-12 left-0 right-0 z-20 pointer-events-none flex justify-center">
        <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-start">
          <div className="flex flex-col gap-4 pointer-events-auto items-start -ml-[7px]">
            <h1 className="text-4xl font-serif text-white/90">Caribbean Legacy Map</h1>
            <div className="flex items-center gap-2 text-amber-500/70 text-[10px] uppercase tracking-[0.3em] mb-4">
              <Globe size={12} />
              <span>{islands.length} Territories Documented</span>
            </div>

            <div className="relative group pointer-events-auto">
              <div className={`flex items-center gap-3 bg-white/5 backdrop-blur-md border-2 border-amber-500 rounded-full px-4 py-2.5 transition-all duration-300 ${isSearchOpen || searchQuery ? 'w-[320px] bg-white/10' : 'w-[200px]'}`}>
                <Globe size={14} className="text-amber-500/50" />
                <input 
                  type="text"
                  placeholder="Find Territory..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        const query = searchQuery.toLowerCase().replace(/\bst\.?\s*/g, 'saint ').trim();
                      const filtered = islands.filter(i => 
                        i.name.toLowerCase().includes(query) || 
                        i.name.toLowerCase().includes(searchQuery.toLowerCase())
                      );
                      if (filtered.length > 0) {
                        handleIslandClick(filtered[0]);
                        setSearchQuery('');
                        setIsSearchOpen(false);
                      }
                    }
                  }}
                  className="bg-transparent border-none outline-none text-[11px] text-white placeholder:text-white/30 uppercase tracking-widest w-full"
                />
              </div>

              <AnimatePresence>
                {isSearchOpen && searchQuery.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full mt-2 left-0 w-[320px] max-h-[300px] overflow-y-auto bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl z-40 p-1.5"
                  >
                    {islands
                      .filter(i => {
                          const query = searchQuery.toLowerCase().replace(/\bst\.?\s*/g, 'saint ').trim();
                        return i.name.toLowerCase().includes(query) || 
                               i.name.toLowerCase().includes(searchQuery.toLowerCase());
                      })
                      .map(island => (
                        <button
                          key={island.id}
                          onClick={() => {
                            handleIslandClick(island);
                            setSearchQuery('');
                            setIsSearchOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-white/5 rounded-xl transition-colors group flex items-center justify-between"
                        >
                          <span className="text-[11px] text-white/60 group-hover:text-white transition-colors uppercase tracking-wider">{island.name}</span>
                          <ArrowLeft size={12} className="rotate-180 text-amber-500 opacity-0 group-hover:opacity-100 transition-all" />
                        </button>
                      ))}
                    {islands.filter(i => {
                        const query = searchQuery.toLowerCase().replace(/\bst\.?\s*/g, 'saint ').trim();
                      return i.name.toLowerCase().includes(query) || 
                             i.name.toLowerCase().includes(searchQuery.toLowerCase());
                    }).length === 0 && (
                      <div className="px-4 py-8 text-center text-white/20 text-[10px] uppercase tracking-widest font-light">
                        No territories found
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>


      {/* Persistent Global View Button (Bottom Left) */}
      <AnimatePresence>
        {selectedIsland && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-8 left-0 right-0 pointer-events-none flex justify-center"
          >
            <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-start">
              <button
                onClick={resetView}
                className="bg-amber-500 text-slate-950 px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl hover:bg-amber-400 transition-all group pointer-events-auto mb-[320px]"
              >
                <Minimize2 size={18} className="group-hover:scale-110 transition-transform" />
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Return to Global View</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Island Label */}
      <AnimatePresence>
        {hoveredIsland && (
          <motion.div
            initial={{ opacity: 0, scale: 0.3, y: 0 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: -55, // Rise in place
            }}
            exit={{ opacity: 0, scale: 0.3, y: 0 }}
            style={{ 
              position: 'absolute',
              top: (projection([hoveredIsland.longitude, hoveredIsland.latitude])![1] * zoomFactor) + targetY,
              left: (projection([hoveredIsland.longitude, hoveredIsland.latitude])![0] * zoomFactor) + targetX,
              x: '-50%',
              pointerEvents: 'none'
            }}
            className="w-[200px] flex flex-col items-center gap-1 z-50"
          >
            <div className="bg-slate-950/90 backdrop-blur-md border border-amber-500/40 px-5 py-3 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <div className="text-[#fbbf24] font-serif text-base text-center whitespace-nowrap tracking-wide">
                {hoveredIsland.name}
              </div>
              <div className="text-[9px] text-white font-medium uppercase tracking-[0.2em] text-center mt-1.5 opacity-90">
                {hoveredIsland.figures?.[0]?.count || 0} Profiles Documented
              </div>
            </div>
            {/* Tooltip Arrow */}
            <div className="w-2.5 h-2.5 bg-slate-950 border-r border-b border-amber-500/40 rotate-45 -mt-1.5" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Island Detail Fly-out */}
      <AnimatePresence>
        {selectedIsland && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 100 }}
            ref={flyoutRef}
            onWheel={(e) => e.stopPropagation()}
            className="absolute top-0 right-0 w-[400px] h-full bg-[#020617]/95 backdrop-blur-3xl border-l border-white/10 px-0 pb-12 overflow-y-auto z-50"
          >
            <div className="sticky top-0 z-20 bg-[#020617] backdrop-blur-3xl pt-32 px-12 pb-8 border-b border-white/10">
              <button 
                onClick={resetView}
                className="mb-8 flex items-center gap-2 text-amber-500 hover:text-amber-400 transition-colors text-xs uppercase tracking-widest"
              >
                <Minimize2 size={16} />
                <span>Zoom Out</span>
              </button>

              <div className="flex items-center gap-4">
                {ISLAND_FLAGS[selectedIsland.slug] && (
                  <img 
                    src={`https://flagcdn.com/w80/${ISLAND_FLAGS[selectedIsland.slug]}.png`}
                    alt={`${selectedIsland.name} Flag`}
                    className="w-10 h-auto rounded shadow-sm border border-white/10"
                  />
                )}
                <h2 className="text-4xl font-serif text-white leading-tight">{selectedIsland.name}</h2>
              </div>
            </div>

            <div className="px-12 pt-12 pb-12">
              <p className="text-white/50 text-sm font-light leading-relaxed mb-12">
                {selectedIsland.description}
              </p>

              <div className="space-y-8">
                <div className="text-[10px] uppercase tracking-[0.3em] text-white/30 border-b border-white/5 pb-4">
                  Documented Figures
                </div>
                {islandFigures.map((figure) => (
                  <Link 
                    key={figure.id} 
                    href={`/profiles/${figure.slug}`}
                    className="block group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg text-white/80 group-hover:text-amber-500 transition-colors">
                        {figure.name}
                      </span>
                      <ArrowLeft size={14} className="rotate-180 text-amber-500/0 group-hover:text-amber-500 transition-all" />
                    </div>
                    <div className="text-[10px] text-white/30 uppercase tracking-widest">
                      {figure.areas?.join(' • ') || 'Historical Figure'}
                    </div>
                  </Link>
                ))}
                <Link 
                  href={`/islands/${selectedIsland.slug}`}
                  className="mt-8 block text-center py-4 border border-amber-500/20 text-amber-500 text-xs uppercase tracking-widest hover:bg-amber-500/5 transition-colors"
                >
                  View Full Collection
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
