'use client';

import * as HoverCard from '@radix-ui/react-hover-card';
import { useState } from 'react';
import { getFigurePreview } from '@/lib/actions';
import { AvatarFallback } from './AvatarFallback';
import Link from 'next/link';

interface ProfileHoverCardProps {
  slug: string;
  href: string;
  children: React.ReactNode;
}

export default function ProfileHoverCard({ slug, href, children }: ProfileHoverCardProps) {
  const [data, setData] = useState<{ name: string; image_url: string | null; snippet: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchPreview = async () => {
    if (hasFetched) return;
    setLoading(true);
    try {
      const result = await getFigurePreview(slug);
      if (result) {
        setData(result);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setHasFetched(true);
    }
  };

  return (
    <HoverCard.Root openDelay={300} closeDelay={150} onOpenChange={(open) => {
      if (open) fetchPreview();
    }}>
      <Link href={href} passHref legacyBehavior>
        <HoverCard.Trigger asChild>
          <a className="font-semibold text-navy/90 hover:text-gold border-b border-gold/30 hover:border-gold transition-colors">
            {children}
          </a>
        </HoverCard.Trigger>
      </Link>
      
      <HoverCard.Portal>
        <HoverCard.Content 
          asChild
          sideOffset={8}
        >
          <Link href={href} passHref legacyBehavior>
            <a className="w-80 bg-white border border-gold/20 shadow-xl rounded-sm overflow-hidden p-0 animate-in fade-in zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95 z-50 block group hover:border-gold/50 hover:shadow-2xl transition-all cursor-pointer">
              {loading && !data && (
                <div className="p-4 flex items-center justify-center h-24">
                  <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}

              {!loading && !data && hasFetched && (
                <div className="p-4 flex flex-col items-center justify-center h-24 bg-sand/10 text-center">
                  <p className="text-xs text-navy/60 italic font-serif">Profile preview not available.</p>
                </div>
              )}
              
              {data && (
                <div className="flex flex-col">
                  <div className="h-40 w-full relative bg-sand/20 overflow-hidden border-b border-gold/10 group-hover:border-gold/30 transition-colors">
                    {data.image_url ? (
                      <img src={data.image_url} alt={data.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <AvatarFallback name={data.name} island="" className="w-full h-full rounded-none" size="xl" />
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="font-serif font-bold text-lg text-navy leading-tight mb-2 group-hover:text-gold transition-colors">{data.name}</h4>
                    <p className="text-sm text-navy/80 leading-snug">{data.snippet}</p>
                  </div>
                </div>
              )}
            </a>
          </Link>
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}
