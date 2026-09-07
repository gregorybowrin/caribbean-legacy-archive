import Link from 'next/link';

export default function Contact() {
  return (
    <div className="bg-ivory min-h-screen py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-5xl text-navy mb-6">Contact & Nominations</h1>
        <div className="bg-white p-8 md:p-12 border border-gold/20 shadow-sm rounded-sm mb-12">
          <p className="text-lg text-navy/70 mb-8 leading-relaxed">
            Whether you have an inquiry about a historical figure, wish to report a correction, or want to explore partnership opportunities, we welcome your correspondence.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="font-serif text-2xl text-gold mb-4">Email</h3>
              <a href="mailto:admin@caribbeanlegacyarchive.com" className="text-navy text-lg hover:text-gold transition-colors">
                admin@caribbeanlegacyarchive.com
              </a>
              <p className="text-sm text-navy/50 mt-2">We aim to respond to all inquiries within 48-72 hours.</p>
            </div>
            
            <div>
              <h3 className="font-serif text-2xl text-gold mb-4">Mailing Address</h3>
              <address className="text-navy text-lg not-italic leading-relaxed">
                Caribbean Legacy Archive<br />
                P.O. Box 2359<br />
                Basseterre, St. Kitts
              </address>
            </div>
          </div>
        </div>

        <div className="bg-sand/20 p-8 md:p-12 border border-gold/20 shadow-sm rounded-sm">
          <h2 className="font-serif text-3xl text-navy mb-4">Nominate a Legacy Figure</h2>
          <p className="text-lg text-navy/70 mb-6 leading-relaxed">
            Do you know of a historically significant Caribbean figure who is not yet featured in the Archive? We accept nominations from researchers, historians, and the general public.
          </p>
          
          <div className="bg-white border-l-4 border-gold p-6 mb-8">
            <h4 className="font-serif text-xl text-navy mb-2">Before Submitting</h4>
            <p className="text-navy/70 mb-4">
              Please ensure that the individual satisfies our editorial standards and that reliable sources are available to document their life and contribution.
            </p>
            <Link 
              href="/about/inclusion-criteria" 
              className="text-gold font-bold hover:text-navy transition-colors underline underline-offset-4"
            >
              Review the Inclusion Criteria &rarr;
            </Link>
          </div>

          <p className="text-navy/70">
            To submit a nomination, please email us at <a href="mailto:admin@caribbeanlegacyarchive.com" className="text-gold hover:underline">admin@caribbeanlegacyarchive.com</a> with the subject line <strong>"Nomination: [Figure Name]"</strong>. Please include a brief summary of their historical significance and links to at least three verifiable sources.
          </p>
        </div>
      </div>
    </div>
  );
}
