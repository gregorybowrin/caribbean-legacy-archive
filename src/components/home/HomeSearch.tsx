'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export default function HomeSearch() {
  const [query, setQuery] = useState('');
  const useRouterInstance = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      useRouterInstance.push(`/profiles?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
      <input 
        type="text" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name, island, or area of influence..." 
        className="w-full bg-ivory text-navy py-5 px-14 rounded-sm shadow-2xl focus:outline-none focus:ring-2 focus:ring-gold text-lg"
      />
      <Search className="absolute left-5 top-5 h-6 w-6 text-navy/40" />
      <button 
        type="submit"
        className="absolute right-2 top-2 bottom-2 px-6 bg-navy text-gold uppercase text-xs tracking-widest font-bold hover:bg-navy-light transition-colors rounded-sm"
      >
        Search
      </button>
    </form>
  );
}
