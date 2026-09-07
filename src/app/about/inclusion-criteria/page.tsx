import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Inclusion Criteria | Caribbean Legacy Archive',
  description: 'Learn about the criteria for inclusion in the Caribbean Legacy Archive.',
};

export default function InclusionCriteriaPage() {
  return (
    <div className="bg-ivory min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <header className="mb-12 text-center">
          <span className="text-gold text-xs uppercase tracking-[0.3em] font-bold mb-4 block">Editorial Standards</span>
          <h1 className="font-serif text-4xl md:text-5xl text-navy mb-6">Who Belongs in the Caribbean Legacy Archive?</h1>
          <div className="w-24 h-1 bg-gold mx-auto"></div>
        </header>

        <article className="prose prose-navy prose-lg max-w-none 
                            prose-headings:font-serif prose-headings:text-navy prose-headings:font-bold
                            prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-6 prose-h3:border-b prose-h3:border-gold/20 prose-h3:pb-2
                            prose-h4:text-xl prose-h4:mt-8 prose-h4:mb-4
                            prose-p:text-navy/80 prose-p:leading-relaxed
                            prose-ul:text-navy/80 prose-li:my-1
                            prose-blockquote:border-l-4 prose-blockquote:border-gold prose-blockquote:bg-sand/30 prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:italic prose-blockquote:font-serif prose-blockquote:text-navy">
          
          <p>
            The Caribbean Legacy Archive is a curated historical and educational resource—not a directory based on fame or popularity. It honours people whose lives and work have made a meaningful and lasting contribution to the Caribbean or to humanity.
          </p>

          <p>Inclusion in the Archive is based on three core standards:</p>

          <h4>Historical Significance</h4>
          <p>
            The individual’s actions, achievements or influence must have contributed meaningfully to Caribbean history, culture, development or society.
          </p>

          <h4>Verifiability</h4>
          <p>
            The individual’s life and contribution must be supported by credible evidence. Sources may include books, academic publications, government records, reputable newspapers, historical archives, recorded interviews and other reliable materials.
          </p>

          <h4>Enduring Legacy</h4>
          <p>
            The person’s contribution should continue to hold historical, cultural, educational or social importance beyond their own lifetime or period of activity.
          </p>

          <h3>The Rule of Three</h3>
          <p>
            A proposed individual should normally satisfy at least three of the following considerations:
          </p>
          <ul>
            <li>Changed history or influenced an important development</li>
            <li>Improved the lives of others</li>
            <li>Created an institution, body of work or achievement that endured</li>
            <li>Represented Caribbean excellence</li>
            <li>Preserved or advanced Caribbean culture</li>
            <li>Inspired future generations</li>
            <li>Has a life and contribution that are well documented</li>
            <li>Provides lasting educational value</li>
          </ul>

          <p>Our guiding question is:</p>
          <blockquote>
            <strong>Why should someone 100 years from now still learn about this person?</strong>
          </blockquote>

          <h3>Areas of Contribution</h3>
          <p>Individuals may be recognized for contributions in areas such as:</p>
          <ul>
            <li>Government and politics</li>
            <li>Education</li>
            <li>Science and medicine</li>
            <li>Arts and literature</li>
            <li>Religion</li>
            <li>Sports</li>
            <li>Business and entrepreneurship</li>
            <li>Social service and humanitarian work</li>
            <li>Military, law and public service</li>
          </ul>
          <p><em>This list should not be treated as exhaustive.</em></p>

          <h3>What Does Not Qualify?</h3>
          <p>Inclusion will not ordinarily be granted on the basis of:</p>
          <ul>
            <li>Temporary fame or popularity</li>
            <li>Celebrity status without a demonstrable, lasting contribution</li>
            <li>Self-promotion or commercial marketing</li>
            <li>Claims that cannot be supported by reliable documentation</li>
            <li>Public recognition alone, without historical or educational significance</li>
          </ul>

          <h3>Review and Selection</h3>
          <p>
            Every proposed profile should be assessed against the Archive’s published criteria. Meeting the basic requirements would make a person <strong>eligible for consideration</strong>, but it should not guarantee inclusion.
          </p>
          <p>The Archive should retain editorial discretion to:</p>
          <ul>
            <li>Verify submitted information</li>
            <li>Request additional evidence</li>
            <li>Consult historians or subject specialists</li>
            <li>Correct or update published profiles</li>
            <li>Decline nominations that do not meet its standards</li>
          </ul>
        </article>

        <div className="mt-16 bg-white border border-gold/20 p-10 text-center shadow-sm">
          <h3 className="font-serif text-2xl text-navy mb-4">Nominate Someone</h3>
          <p className="text-navy/70 text-sm mb-8 max-w-2xl mx-auto">
            Before submitting a nomination, please ensure that the individual satisfies the inclusion criteria and that reliable sources are available to document their life and contribution.
          </p>
          <Link 
            href="/contact" 
            className="inline-block bg-gold text-navy font-bold uppercase tracking-widest text-xs px-8 py-4 hover:bg-navy hover:text-gold transition-colors shadow-sm"
          >
            Nominate a Caribbean Legacy Figure
          </Link>
        </div>
      </div>
    </div>
  );
}
