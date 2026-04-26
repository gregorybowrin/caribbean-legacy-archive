'use client';

import React, { useEffect, useState, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import { geoMercator, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import { Maximize2, Minimize2, ArrowLeft, Users, Globe } from 'lucide-react';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function GlobalMap() {
  const [islands, setIslands] = useState<any[]>([]);
  const [selectedIsland, setSelectedIsland] = useState<any>(null);
  const [islandFigures, setIslandFigures] = useState<any[]>([]);
  const [hoveredIsland, setHoveredIsland] = useState<any>(null);
  const [worldData, setWorldData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    }
  }, []);

  // Map Projection
  const projection = geoMercator()
    .center([-75, 18]) // Centered on the Caribbean
    .scale(1500)
    .translate([dimensions.width / 2, dimensions.height / 2]);

  const pathGenerator = geoPath().projection(projection);

  useEffect(() => {
    async function fetchData() {
      // Fetch islands with counts
      const { data: islandsData } = await supabase
        .from('islands')
        .select(`
          *,
          figures:figures(count)
        `);
      
      if (islandsData) {
        setIslands(islandsData);
      }

      // Fetch World Map Data
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

  const handleIslandClick = async (island: any) => {
    if (selectedIsland?.id === island.id) {
      resetView();
      return;
    }
    
    setSelectedIsland(island);

    // Fetch figures for this island
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
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#020617] flex items-center justify-center">
        <div className="text-amber-500/50 animate-pulse text-sm font-light tracking-[0.2em] uppercase">
          Initializing Archive Map...
        </div>
      </div>
    );
  }

  // Calculate transformation logic
  const zoomFactor = selectedIsland ? 5 : (hoveredIsland ? 1.1 : 1);
  const targetX = selectedIsland 
    ? (dimensions.width / 2 - projection([selectedIsland.longitude, selectedIsland.latitude])![0] * zoomFactor)
    : (hoveredIsland ? (dimensions.width / 2 - projection([hoveredIsland.longitude, hoveredIsland.latitude])![0] * zoomFactor) * 0.1 : 0);
  const targetY = selectedIsland 
    ? (dimensions.height / 2 - projection([selectedIsland.longitude, selectedIsland.latitude])![1] * zoomFactor)
    : (hoveredIsland ? (dimensions.height / 2 - projection([hoveredIsland.longitude, hoveredIsland.latitude])![1] * zoomFactor) * 0.1 : 0);

  return (
    <div className="fixed inset-0 bg-[#020617] overflow-hidden select-none">
      {/* Immersive Background Grid */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#amber-500 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* Map Engine */}
      <motion.div 
        className="w-full h-full"
        animate={{
          scale: zoomFactor,
          x: targetX,
          y: targetY,
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 60 }}
        style={{ transformOrigin: '0 0' }}
      >
        <svg viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} className="w-full h-full">
          {/* World Landmasses */}
          <path
            d={pathGenerator(worldData) || ''}
            fill="#0f172a"
            stroke="#1e293b"
            strokeWidth="0.5"
          />

          {/* Legacy Beacons */}
          {islands.map((island) => {
            const [x, y] = projection([island.longitude, island.latitude]) || [0, 0];
            const isSelected = selectedIsland?.id === island.id;
            const isHovered = hoveredIsland?.id === island.id;
            
            return (
              <g key={island.id} 
                 className="cursor-pointer"
                 onMouseEnter={() => !selectedIsland && setHoveredIsland(island)}
                 onMouseLeave={() => setHoveredIsland(null)}
                 onClick={() => handleIslandClick(island)}
              >
                {/* Glow Pulse */}
                <motion.circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 10 : (isHovered ? 6 : 4)}
                  fill={isSelected ? '#f59e0b' : (isHovered ? '#fbbf24' : '#d97706')}
                  initial={{ opacity: 0.3 }}
                  animate={{ 
                    opacity: isSelected ? 0.8 : (isHovered ? 0.7 : [0.3, 0.6, 0.3]),
                    scale: isHovered ? 1.2 : 1
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 3 : 2}
                  fill="#fbbf24"
                />
              </g>
            );
          })}
        </svg>
      </motion.div>

      {/* Navigation Overlay */}
      <div className="absolute top-8 left-8 flex flex-col gap-4">
        <Link href="/" className="group flex items-center gap-3 text-white/50 hover:text-white transition-colors">
          <ArrowLeft size={18} />
          <span className="text-xs uppercase tracking-[0.2em] font-light">Exit Map</span>
        </Link>
        <h1 className="text-2xl font-serif text-white/90">Caribbean Archive Map</h1>
        <div className="flex items-center gap-2 text-amber-500/70 text-[10px] uppercase tracking-[0.3em]">
          <Globe size={12} />
          <span>{islands.length} Territories Documented</span>
        </div>
      </div>

      {/* Island Tooltip */}
      <AnimatePresence>
        {hoveredIsland && !selectedIsland && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-xl border border-white/10 px-6 py-4 rounded-full flex items-center gap-4 shadow-2xl"
          >
            <div className="text-amber-500 font-serif text-lg">{hoveredIsland.name}</div>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-widest">
              <Users size={14} className="text-amber-500/50" />
              <span>{hoveredIsland.figures?.[0]?.count || 0} Profiles</span>
            </div>
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
            className="absolute top-0 right-0 w-[400px] h-full bg-[#020617]/95 backdrop-blur-3xl border-l border-white/10 p-12 overflow-y-auto"
          >
            <button 
              onClick={resetView}
              className="mb-12 flex items-center gap-2 text-amber-500 hover:text-amber-400 transition-colors text-xs uppercase tracking-widest"
            >
              <Minimize2 size={16} />
              <span>Zoom Out</span>
            </button>

            <h2 className="text-4xl font-serif text-white mb-4 leading-tight">{selectedIsland.name}</h2>
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
