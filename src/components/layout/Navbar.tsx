'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Menu, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');

  const submitSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/profiles?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      setSearchQuery(''); // clear after search
    }
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      submitSearch(e.currentTarget.value);
    }
  };

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
            <Link href="/map" className="text-sm font-medium text-gold hover:text-ivory transition-colors flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse"></span>
              Legacy Map
            </Link>
            <Link href="/areas" className="text-sm font-medium hover:text-gold transition-colors">Areas of Influence</Link>
            
            {/* About Dropdown */}
            <div className="relative group cursor-pointer py-6">
              <span className="text-sm font-medium hover:text-gold transition-colors flex items-center gap-1">
                About
                <ChevronDown className="h-3 w-3 transition-transform group-hover:rotate-180" />
              </span>
              <div className="absolute left-0 top-[60px] w-48 bg-navy border border-gold/20 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <Link href="/about" className="block px-4 py-3 text-sm text-ivory hover:bg-gold hover:text-navy transition-colors border-b border-gold/10">About the Archive</Link>
                <Link href="/about/inclusion-criteria" className="block px-4 py-3 text-sm text-ivory hover:bg-gold hover:text-navy transition-colors border-b border-gold/10">Inclusion Criteria</Link>
                <Link href="/contact" className="block px-4 py-3 text-sm text-ivory hover:bg-gold hover:text-navy transition-colors">Nominate a Person</Link>
              </div>
            </div>

            <div className="relative group">
              <input 
                type="text" 
                placeholder="Search figures..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="bg-navy-light border border-gold/30 text-ivory text-xs py-2 px-4 pl-10 focus:outline-none focus:ring-1 focus:ring-gold rounded-sm w-48 transition-all focus:w-64"
              />
              <button 
                onClick={() => submitSearch(searchQuery)}
                className="absolute left-3 top-2.5"
              >
                <Search className="h-3.5 w-3.5 text-gold/60 hover:text-gold transition-colors cursor-pointer" />
              </button>
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
          <Link href="/areas" className="block text-lg font-serif text-ivory hover:text-gold">Areas of Influence</Link>
          
          <div className="pt-2 pb-2 border-y border-gold/10 my-2">
            <span className="block text-lg font-serif text-gold mb-2">About</span>
            <div className="pl-4 space-y-3">
              <Link href="/about" className="block text-ivory hover:text-gold">About the Archive</Link>
              <Link href="/about/inclusion-criteria" className="block text-ivory hover:text-gold">Inclusion Criteria</Link>
              <Link href="/contact" className="block text-ivory hover:text-gold">Nominate a Person</Link>
            </div>
          </div>

          <div className="relative mt-4">
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="w-full bg-navy border border-gold/30 text-ivory py-3 px-10 focus:outline-none focus:ring-1 focus:ring-gold rounded-sm"
            />
            <button 
              onClick={() => submitSearch(searchQuery)}
              className="absolute left-3 top-3.5"
            >
              <Search className="h-4 w-4 text-gold/60" />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
