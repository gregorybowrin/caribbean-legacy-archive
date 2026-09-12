'use client';

import { MessageCircle, Link2, Share2, Check } from 'lucide-react';
import { useState } from 'react';

interface ShareButtonsProps {
  title: string;
  url: string;
}

// Custom Premium SVGs for better branding
const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
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
    <div className="my-10 bg-white border border-gold/30 rounded-xl p-5 md:p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 transition-shadow hover:shadow-md">
      <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
        <span className="text-sm md:text-base uppercase tracking-[0.2em] text-navy font-bold flex items-center mb-2">
          <Share2 className="h-5 w-5 mr-3 text-gold" />
          Share This Legacy
        </span>
        <span className="text-xs text-navy/60 uppercase tracking-widest italic">
          Help preserve and spread this history
        </span>
      </div>
      
      <div className="flex items-center space-x-3 md:space-x-4 w-full sm:w-auto justify-center">
        <a 
          href={shareData.whatsapp} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex-1 sm:flex-none flex items-center justify-center h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-500 hover:text-white hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
          title="Share on WhatsApp"
        >
          <MessageCircle className="h-5 w-5" />
        </a>
        <a 
          href={shareData.facebook} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex-1 sm:flex-none flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
          title="Share on Facebook"
        >
          <FacebookIcon />
        </a>
        <a 
          href={shareData.twitter} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex-1 sm:flex-none flex items-center justify-center h-12 w-12 rounded-full bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-900 hover:text-white hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
          title="Share on X / Twitter"
        >
          <XIcon />
        </a>
        <button 
          onClick={copyToClipboard}
          className="flex-1 sm:flex-none flex items-center justify-center h-12 w-12 rounded-full bg-gold/10 text-gold border border-gold/20 hover:bg-gold hover:text-navy hover:-translate-y-1 hover:shadow-lg transition-all duration-300 relative group"
          title="Copy Link"
        >
          {copied ? <Check className="h-5 w-5" /> : <Link2 className="h-5 w-5" />}
          <span className={`absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-navy text-ivory text-[10px] whitespace-nowrap rounded transition-opacity duration-300 ${copied ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            Link Copied!
          </span>
        </button>
      </div>
    </div>
  );
}
