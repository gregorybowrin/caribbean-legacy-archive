'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AvatarFallback } from '@/components/ui/AvatarFallback';

export default function RandomFeaturedProfiles({ figures }: { figures: any[] }) {
  const [featured, setFeatured] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 1. Filter to only include figures that actually have an image (handling null, undefined, or empty strings)
    const withImages = figures.filter(fig => fig.image_url && fig.image_url.trim() !== '');
    
    // Debugging to ensure the filter works correctly
    console.log(`Total figures: ${figures.length}, Figures with images: ${withImages.length}`);
    
    // 2. Shuffle the array using the Fisher-Yates algorithm
    const shuffled = [...withImages];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // 3. Take the first 8
    setFeatured(shuffled.slice(0, 8));
    setMounted(true);
  }, [figures]);

  // Prevent hydration mismatch by rendering invisible placeholders until mounted
  if (!mounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="aspect-[4/5] bg-navy/5 animate-pulse rounded-sm border border-gold/10"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {featured.map((figure) => (
        <Link 
          key={figure.id} 
          href={`/profiles/${figure.slug}`}
          className="group flex flex-col bg-white border border-navy/5 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
        >
          <div className="relative aspect-[4/5] overflow-hidden bg-navy-light">
            {figure.image_url ? (
              <img 
                src={figure.image_url} 
                alt={figure.name} 
                onError={(e) => {
                  // Fallback gracefully if the hotlinked image returns a 404
                  e.currentTarget.style.display = 'none';
                }}
                className="object-cover w-full h-full grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
              />
            ) : null}
            <div className="absolute inset-0 flex items-center justify-center -z-10">
              <AvatarFallback name={figure.name} island={figure.islands?.name} size="lg" className="w-full h-full rounded-none opacity-50" />
            </div>
            <div className="absolute inset-0 bg-navy/20 group-hover:bg-transparent transition-all"></div>
          </div>
          <div className="p-6 border-t border-gold/10">
            <span className="text-[10px] uppercase tracking-widest text-tropical-green font-bold mb-2 block line-clamp-1">
              {figure.islands?.name}
            </span>
            <h3 className="font-serif text-xl text-navy mb-2 group-hover:text-gold transition-colors line-clamp-1">{figure.name}</h3>
            <p className="text-navy/60 text-xs line-clamp-2 leading-relaxed">
              {figure.bio}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
