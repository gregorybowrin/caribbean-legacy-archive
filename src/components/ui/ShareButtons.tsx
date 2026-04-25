'use client';

import { MessageCircle, Link2, Share2, Check } from 'lucide-react';
import { useState } from 'react';

interface ShareButtonsProps {
  title: string;
  url: string;
}

// Custom Premium SVGs
const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153zM17.61 20.644h2.039L6.486 3.24H4.298L17.61 20.644z"/>
  </svg>
);

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareData = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  return (
    <div className="flex items-center space-x-6 py-8 border-y border-gold/10 my-8">
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-[0.2em] text-navy/40 font-bold flex items-center mb-1">
          <Share2 className="h-3 w-3 mr-2 text-gold" />
          Share This Legacy
        </span>
        <span className="text-[9px] text-navy/30 uppercase tracking-widest italic">Spread the history</span>
      </div>
      
      <div className="flex items-center space-x-3">
        <a 
          href={shareData.whatsapp} 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-3 bg-white border border-gold/20 text-navy hover:text-gold hover:border-gold hover:-translate-y-1 transition-all duration-300 shadow-sm"
          title="Share on WhatsApp"
        >
          <MessageCircle className="h-4 w-4" />
        </a>
        <a 
          href={shareData.facebook} 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-3 bg-white border border-gold/20 text-navy hover:text-gold hover:border-gold hover:-translate-y-1 transition-all duration-300 shadow-sm flex items-center justify-center"
          title="Share on Facebook"
        >
          <FacebookIcon />
        </a>
        <a 
          href={shareData.twitter} 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-3 bg-white border border-gold/20 text-navy hover:text-gold hover:border-gold hover:-translate-y-1 transition-all duration-300 shadow-sm flex items-center justify-center"
          title="Share on X"
        >
          <XIcon />
        </a>
        <button 
          onClick={copyToClipboard}
          className="p-3 bg-white border border-gold/20 text-navy hover:text-gold hover:border-gold hover:-translate-y-1 transition-all duration-300 shadow-sm relative group"
          title="Copy Link"
        >
          {copied ? <Check className="h-4 w-4 text-gold" /> : <Link2 className="h-4 w-4" />}
          <span className={`absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-navy text-gold text-[10px] whitespace-nowrap transition-opacity duration-300 ${copied ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            Link Copied
          </span>
        </button>
      </div>
    </div>
  );
}
