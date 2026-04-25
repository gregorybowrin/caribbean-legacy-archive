'use client';

import Link from 'next/link';
import { Search, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-navy text-ivory sticky top-0 z-50 border-b border-gold/20 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex flex-col group">
              <span className="font-serif text-2xl tracking-tight text-gold group-hover:text-ivory transition-colors">Caribbean Legacy</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-ivory/60 -mt-1 ml-0.5">Digital Archive</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/profiles" className="text-sm font-medium hover:text-gold transition-colors">Profiles</Link>
            <Link href="/islands" className="text-sm font-medium hover:text-gold transition-colors">Islands</Link>
            <Link href="/areas" className="text-sm font-medium hover:text-gold transition-colors">Areas of Influence</Link>
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Search figures..." 
                className="bg-navy-light border border-gold/30 text-ivory text-xs py-2 px-4 pl-10 focus:outline-none focus:ring-1 focus:ring-gold rounded-sm w-48 transition-all focus:w-64"
              />
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gold/60" />
            </div>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gold">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-navy-light border-b border-gold/20 pb-6 px-4 space-y-4 pt-2">
          <Link href="/profiles" className="block text-lg font-serif text-ivory hover:text-gold">Profiles</Link>
          <Link href="/islands" className="block text-lg font-serif text-ivory hover:text-gold">Islands</Link>
          <Link href="/areas" className="block text-lg font-serif text-ivory hover:text-gold">Areas</Link>
          <div className="relative mt-4">
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full bg-navy border border-gold/30 text-ivory py-3 px-10 focus:outline-none focus:ring-1 focus:ring-gold rounded-sm"
            />
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-gold/60" />
          </div>
        </div>
      )}
    </nav>
  );
}
