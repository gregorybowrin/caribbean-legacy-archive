'use client';

import { useState, useEffect } from 'react';

type Figure = { id: string; name: string };
type SearchResult = {
  title: string;
  imageUrl: string;
  sourceUrl: string;
  creator: string | null;
  license: string | null;
  creditLine: string | null;
  source: string;
};

export default function CuratorDashboard() {
  const [missingFigures, setMissingFigures] = useState<Figure[]>([]);
  const [selectedFigure, setSelectedFigure] = useState<Figure | null>(null);
  const [results, setResults] = useState<{ wikipedia: SearchResult[], loc: SearchResult[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/curator/missing')
      .then(res => res.json())
      .then(data => setMissingFigures(data))
      .catch(err => console.error('Error fetching missing figures', err));
  }, []);

  const handleSearch = async (figure: Figure) => {
    setSelectedFigure(figure);
    setLoading(true);
    setResults(null);
    setStatus(null);
    try {
      const res = await fetch(`/api/curator/search?q=${encodeURIComponent(figure.name)}`);
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error(err);
      setStatus('Error searching for images.');
    }
    setLoading(false);
  };

  const handleApprove = async (result: SearchResult) => {
    if (!selectedFigure) return;
    setStatus('Saving...');
    try {
      const res = await fetch('/api/curator/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ figureId: selectedFigure.id, metadata: result })
      });
      if (res.ok) {
        setStatus(`Successfully saved image for ${selectedFigure.name}!`);
        setMissingFigures(prev => prev.filter(f => f.id !== selectedFigure.id));
        setResults(null);
        setSelectedFigure(null);
      } else {
        setStatus('Error saving image.');
      }
    } catch (err) {
      console.error(err);
      setStatus('Error saving image.');
    }
  };

  const ResultCard = ({ result }: { result: SearchResult }) => (
    <div className="border border-gold/20 p-4 bg-white shadow-sm space-y-4">
      <div className="aspect-[4/5] bg-sand/10 overflow-hidden relative border border-gold/10">
        <img src={result.imageUrl} alt={result.title} className="object-cover w-full h-full" />
      </div>
      <div className="text-sm">
        <p><strong>Title:</strong> {result.title}</p>
        <p><strong>Source:</strong> <a href={result.sourceUrl} target="_blank" className="text-tropical-green underline">{result.source}</a></p>
        {result.creator && <p><strong>Creator:</strong> {result.creator}</p>}
        {result.license && <p><strong>License:</strong> {result.license}</p>}
        {result.creditLine && <p className="italic text-xs mt-2 text-navy/60">{result.creditLine}</p>}
      </div>
      <button 
        onClick={() => handleApprove(result)}
        className="w-full py-2 bg-navy text-gold hover:bg-navy/90 transition-colors font-serif"
      >
        Approve & Save
      </button>
    </div>
  );

  return (
    <div className="bg-ivory min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-serif text-navy mb-8 border-b border-gold/20 pb-4">Image Curator Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 border border-gold/20 bg-white p-4 max-h-[80vh] overflow-y-auto">
            <h2 className="font-serif text-xl mb-4 text-navy">Missing Images ({missingFigures.length})</h2>
            <ul className="space-y-2">
              {missingFigures.map(f => (
                <li key={f.id}>
                  <button 
                    onClick={() => handleSearch(f)}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors ${selectedFigure?.id === f.id ? 'bg-gold/20 font-bold' : 'hover:bg-sand'}`}
                  >
                    {f.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="lg:col-span-3">
            {status && (
              <div className="mb-4 p-4 bg-tropical-green/10 border border-tropical-green text-tropical-green font-medium">
                {status}
              </div>
            )}
            
            {loading && <p className="text-navy/60 italic">Searching archives...</p>}
            
            {results && selectedFigure && (
              <div className="space-y-8">
                <h2 className="font-serif text-2xl text-navy">Results for: {selectedFigure.name}</h2>
                
                <div>
                  <h3 className="font-serif text-xl text-navy mb-4 pb-2 border-b border-gold/10">Wikimedia Commons (Fuzzy Search)</h3>
                  {results.wikipedia.length === 0 ? <p className="text-sm text-navy/60">No Wikipedia results found.</p> : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {results.wikipedia.map((r, i) => <ResultCard key={i} result={r} />)}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-serif text-xl text-navy mb-4 pb-2 border-b border-gold/10">Library of Congress</h3>
                  {results.loc.length === 0 ? <p className="text-sm text-navy/60">No LoC results found.</p> : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {results.loc.map((r, i) => <ResultCard key={i} result={r} />)}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {!selectedFigure && !loading && (
              <div className="flex items-center justify-center h-64 border border-dashed border-gold/40 text-navy/40">
                Select a figure from the sidebar to search for images.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
