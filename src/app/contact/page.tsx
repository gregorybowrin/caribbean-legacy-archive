export default function Contact() {
  return (
    <div className="bg-ivory min-h-screen py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-5xl text-navy mb-6">Contact Us</h1>
        <div className="bg-white p-8 md:p-12 border border-gold/20 shadow-sm rounded-sm">
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
      </div>
    </div>
  );
}
