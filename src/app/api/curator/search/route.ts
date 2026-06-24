import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('q');

  if (!name) {
    return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
  }

  const results = {
    wikipedia: [] as any[],
    loc: [] as any[]
  };

  const options = { headers: { 'User-Agent': 'CaribbeanLegacyArchive/1.0 (contact@caribbeanlegacyarchive.com)' } };

  try {
    // 1. Wikipedia Fuzzy Search
    const wikiSearchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(name)}&format=json`;
    const wikiSearchRes = await fetch(wikiSearchUrl, options);
    const wikiSearchData = await wikiSearchRes.json();

    if (wikiSearchData.query && wikiSearchData.query.search) {
      // Get top 3 Wikipedia matches
      const topHits = wikiSearchData.query.search.slice(0, 3);
      
      for (const hit of topHits) {
        const title = hit.title;
        
        // Fetch image and metadata for this title
        const imgUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&piprop=original|name&format=json`;
        const imgRes = await fetch(imgUrl, options);
        const imgData = await imgRes.json();
        
        const pages = imgData.query?.pages || {};
        const pageId = Object.keys(pages)[0];
        
        if (pageId && pageId !== '-1' && pages[pageId].original) {
          const originalUrl = pages[pageId].original.source;
          const filename = pages[pageId].pageimage;
          
          let creator = null;
          let license = null;
          let sourceUrl = null;
          
          if (filename) {
            const metaUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(filename)}&prop=imageinfo&iiprop=extmetadata|url&format=json`;
            const metaRes = await fetch(metaUrl, options);
            const metaData = await metaRes.json();
            
            const mPages = metaData.query?.pages || {};
            const mPageId = Object.keys(mPages)[0];
            
            if (mPageId && mPages[mPageId].imageinfo && mPages[mPageId].imageinfo.length > 0) {
              const info = mPages[mPageId].imageinfo[0];
              sourceUrl = info.descriptionurl;
              const ext = info.extmetadata;
              
              if (ext) {
                if (ext.Artist) creator = ext.Artist.value.replace(/<[^>]*>?/gm, '').trim();
                if (ext.LicenseShortName) {
                  license = ext.LicenseShortName.value;
                  if (license.toLowerCase().includes('pd') || license.toLowerCase().includes('public domain')) {
                    license = 'Public Domain';
                  }
                }
              }
            }
          }
          
          let creditLine = null;
          if (license) {
            creditLine = `Image: ${title}, ${license}, via Wikimedia Commons.`;
          }

          results.wikipedia.push({
            title,
            imageUrl: originalUrl,
            sourceUrl: sourceUrl || originalUrl,
            creator,
            license,
            creditLine,
            source: 'Wikimedia Commons'
          });
        }
      }
    }
  } catch (error) {
    console.error('Wikipedia search error:', error);
  }

  try {
    // 2. Library of Congress Search
    const locUrl = `https://www.loc.gov/search/?q=${encodeURIComponent(name)}&fo=json`;
    const locRes = await fetch(locUrl);
    const locData = await locRes.json();
    
    if (locData.results) {
      const locHits = locData.results
        .filter((r: any) => r.image_url && r.image_url.length > 0 && r.image_url[0].includes('iiif'))
        .slice(0, 3);
        
      for (const hit of locHits) {
        results.loc.push({
          title: hit.title,
          imageUrl: hit.image_url[0],
          sourceUrl: hit.url,
          creator: hit.contributor ? hit.contributor.join(', ') : 'Unknown',
          license: 'Public Domain', // LOC items are generally PD or have no known restrictions if available in high-res, but must be manually verified.
          creditLine: `Image: ${hit.title}, Library of Congress.`,
          source: 'Library of Congress'
        });
      }
    }
  } catch (error) {
    console.error('LOC search error:', error);
  }

  return NextResponse.json(results);
}
