import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-navy text-ivory border-t border-gold/20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex flex-col mb-4">
              <span className="font-serif text-2xl tracking-tight text-gold">Caribbean Legacy</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-ivory/60 -mt-1 ml-0.5">Digital Archive</span>
            </Link>
            <p className="text-ivory/60 text-sm max-w-md leading-relaxed">
              Dedicated to the preservation and dissemination of Caribbean history through the lives and contributions 
              of historically documented figures. An authoritative educational resource for generations to come.
            </p>
          </div>
          
          <div>
            <h4 className="font-serif text-lg text-gold mb-4">Explore</h4>
            <ul className="space-y-2 text-sm text-ivory/70">
              <li><Link href="/profiles" className="hover:text-gold transition-colors">All Profiles</Link></li>
              <li><Link href="/islands" className="hover:text-gold transition-colors">By Island</Link></li>
              <li><Link href="/areas" className="hover:text-gold transition-colors">By Area of Influence</Link></li>
              <li><Link href="/about" className="hover:text-gold transition-colors">About the Archive</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg text-gold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-ivory/70">
              <li><Link href="/sources" className="hover:text-gold transition-colors">Primary Sources</Link></li>
              <li><Link href="/bibliography" className="hover:text-gold transition-colors">Bibliography</Link></li>
              <li><Link href="/contact" className="hover:text-gold transition-colors">Contact Curator</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gold/10 flex flex-col md:flex-row justify-between items-center text-xs text-ivory/40">
          <p>© {new Date().getFullYear()} Caribbean Legacy Archive. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-ivory transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-ivory transition-colors">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
