import Link from 'next/link';

export default function About() {
  return (
    <div className="bg-ivory min-h-screen py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-5xl text-navy mb-8">About the Archive</h1>
        
        <div className="prose prose-lg prose-navy max-w-none">
          <p className="text-xl leading-relaxed text-navy/80 mb-8">
            The Caribbean Legacy Archive is a comprehensive digital encyclopedia dedicated to documenting, preserving, and celebrating the lives of the remarkable individuals who have shaped the Caribbean.
          </p>
          
          <h2 className="font-serif text-3xl text-gold mt-12 mb-6">Our Mission</h2>
          <p>
            For centuries, the contributions of Caribbean leaders, artists, activists, and intellectuals have profoundly influenced global culture, politics, and human rights. However, many of these stories remain fragmented across disparate historical records or localized oral histories. 
          </p>
          <p>
            Our mission is to centralize this rich heritage into a single, authoritative platform. By providing deeply researched, 1,000+ word biographical essays, we aim to ensure that the legacy of the Caribbean is accessible to students, researchers, and descendants worldwide.
          </p>
          
          <h2 className="font-serif text-3xl text-gold mt-12 mb-6">The Collection</h2>
          <p>
            The archive currently houses over 500 detailed profiles spanning every major island nation and territory in the region. The collection is meticulously organized by both geographic origin and area of influence—from Civil Rights and Politics to Arts, Literature, and Sports.
          </p>
          
          <h2 className="font-serif text-3xl text-gold mt-12 mb-6">Connect With Us</h2>
          <p>
            The Caribbean Legacy Archive is an evolving project. We continuously expand our database and welcome historical corrections, primary source contributions, and partnerships from educational institutions.
          </p>
          <p>
            <Link href="/contact" className="text-gold font-bold hover:underline">Contact the Curator &rarr;</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
