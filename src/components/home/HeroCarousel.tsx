'use client';

import { useState, useEffect } from 'react';

export default function HeroCarousel({ figures }: { figures: any[] }) {
  const [carouselFigures, setCarouselFigures] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Filter to figures with images
    const withImages = figures.filter(fig => fig.image_url && fig.image_url.trim() !== '');
    
    // Shuffle the array (Fisher-Yates)
    const shuffled = [...withImages];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // Select 15 random figures
    setCarouselFigures(shuffled.slice(0, 15));
    setMounted(true);
  }, [figures]);

  // Prevent hydration errors by returning empty background until client side calculates random images
  if (!mounted) {
    return (
      <div className="absolute inset-0 z-0 flex items-stretch pointer-events-none opacity-30">
         <div className="flex w-full h-full bg-navy/5"></div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-0 flex items-stretch pointer-events-none opacity-30">
      <div className="flex animate-marquee w-max h-full">
        {/* Render two identical sets of the 15 images to create a seamless infinite scroll */}
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
  );
}
