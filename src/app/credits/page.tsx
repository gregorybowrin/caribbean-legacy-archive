export const metadata = {
  title: 'Image Credits & Rights | Caribbean Legacy Archive',
  description: 'Our policy and workflow for sourcing historical imagery and portraits.',
};

export default function CreditsPage() {
  return (
    <div className="bg-ivory min-h-screen">
      <section className="bg-navy py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl text-gold mb-4">Image Credits & Rights</h1>
          <p className="text-ivory/60 font-light">
            Our policy on sourcing, licensing, and attributing the imagery used throughout the archive.
          </p>
        </div>
      </section>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-navy max-w-none space-y-8">
          <p className="text-lg text-navy/80 leading-relaxed">
            The Caribbean Legacy Archive is committed to maintaining a credible, authoritative, and legally sound repository of historical figures. To ensure this, we employ a strict <strong>source-and-license workflow</strong> for every image displayed on our platform.
          </p>

          <h2 className="font-serif text-2xl text-navy border-b border-gold/20 pb-2">Our Sourcing Policy</h2>
          <p className="text-navy/80">
            We do not use unverified images scraped from search engines or social media. Instead, we prioritize the following sources:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-navy/80">
            <li><strong>Public Domain Archives:</strong> Images sourced from the Library of Congress, U.S. National Archives, Wikimedia Commons, National Library of Jamaica, Digital Library of the Caribbean (dLOC), UK National Archives, and the NYPL/Schomburg Center.</li>
            <li><strong>Creative Commons:</strong> We utilize images with licenses that permit reuse, specifically <em>CC BY</em>, <em>CC BY-SA</em>, or <em>CC0/Public Domain</em>, and always provide proper attribution.</li>
            <li><strong>Directly Licensed Material:</strong> When an image's rights are unclear but historically significant, we seek direct permission from the respective museum, archive, or rights holder.</li>
            <li><strong>Original & Reconstructed Graphics:</strong> For figures where no verified portrait exists, we utilize original graphics, maps, timelines, or clearly labeled reconstructive illustrations to provide atmosphere without misleading the viewer.</li>
          </ul>

          <h2 className="font-serif text-2xl text-navy border-b border-gold/20 pb-2">Attribution and Metadata</h2>
          <p className="text-navy/80">
            For every image sourced, we maintain a strict record of its metadata, including the title, creator, archive source, license type, and download date.
          </p>
          <p className="text-navy/80">
            When browsing a profile in the archive, you will find the image credit line displayed directly beneath the portrait. This credit typically includes the title of the work, the creator's name, the license, and a link to the source repository when applicable.
          </p>

          <h2 className="font-serif text-2xl text-navy border-b border-gold/20 pb-2">Verified Resources</h2>
          <p className="text-navy/80">
            If you are interested in exploring the public domain and open-license archives we rely on, we recommend starting here:
          </p>
          <ul className="space-y-4 text-navy/80">
            <li><a href="https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia" target="_blank" rel="noopener noreferrer" className="text-tropical-green hover:underline">Wikimedia Reuse Guide</a></li>
            <li><a href="https://wiki.creativecommons.org/wiki/Recommended_practices_for_attribution" target="_blank" rel="noopener noreferrer" className="text-tropical-green hover:underline">Creative Commons Attribution Practices</a></li>
            <li><a href="https://www.loc.gov/free-to-use/" target="_blank" rel="noopener noreferrer" className="text-tropical-green hover:underline">Library of Congress Free-to-Use Images</a></li>
            <li><a href="https://dloc.com/" target="_blank" rel="noopener noreferrer" className="text-tropical-green hover:underline">Digital Library of the Caribbean (dLOC)</a></li>
            <li><a href="https://nlj.gov.jm/digital-collections/" target="_blank" rel="noopener noreferrer" className="text-tropical-green hover:underline">National Library of Jamaica Digital Collections</a></li>
          </ul>

          <div className="mt-12 p-6 bg-sand/20 border border-gold/20 text-sm text-navy/70 italic">
            If you represent an archive or are a rights holder and believe an image has been used improperly or lacks sufficient attribution, please contact us so we can immediately rectify the record.
          </div>
        </div>
      </article>
    </div>
  );
}
