export const ISLAND_FLAGS: Record<string, string> = {
  'anguilla': 'ai', 'antigua-barbuda': 'ag', 'barbuda': 'ag', 'aruba': 'aw',
  'bahamas': 'bs', 'the-bahamas': 'bs', 'eleuthera': 'bs', 'andros': 'bs',
  'inagua': 'bs', 'grand-bahama': 'bs', 'exuma': 'bs', 'abaco': 'bs',
  'barbados': 'bb', 'british-virgin-islands': 'vg', 'bvi': 'vg', 'tortola': 'vg',
  'spanish-town': 'vg', 'cayman-islands': 'ky', 'the-cayman-islands': 'ky', 'cuba': 'cu', 'curacao': 'cw',
  'dominica': 'dm', 'dominican-republic': 'do', 'grenada': 'gd', 'carriacou-pm': 'gd',
  'guadeloupe': 'gp', 'marie-galante': 'gp', 'haiti': 'ht', 'jamaica': 'jm',
  'port-royal': 'jm', 'martinique': 'mq', 'montserrat': 'ms', 'puerto-rico': 'pr',
  'saint-kitts-nevis': 'kn', 'st-kitts-nevis': 'kn', 'nevis': 'kn', 'saint-lucia': 'lc',
  'saint-vincent-grenadines': 'vc', 'saint-vincent-the-grenadines': 'vc', 'st-vincent': 'vc', 'grenadines': 'vc',
  'trinidad-tobago': 'tt', 'turks-caicos': 'tc', 'tci': 'tc', 'us-virgin-islands': 'vi',
  'usvi': 'vi', 'guyana': 'gy', 'belize': 'bz', 'bermuda': 'bm', 'suriname': 'sr',
  'st-martin': 'mf', 'st-barths': 'bl', 'bonaire': 'bq', 'saba': 'bq', 'st-eustatius': 'bq',
  'spm': 'pm', 'saint-pierre': 'pm', 'navassa': 'um'
};

export function getIslandFlag(nameOrSlug: string | undefined): string | null {
  if (!nameOrSlug) return null;
  // Convert name to slug format and handle accents (e.g. "Curaçao" -> "curacao")
  const slug = nameOrSlug
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/ & /g, '-')
    .replace(/ and /g, '-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  
  if (!ISLAND_FLAGS[slug]) {
    // Try original just in case
    if (!ISLAND_FLAGS[nameOrSlug]) return null;
    return `https://flagcdn.com/w40/${ISLAND_FLAGS[nameOrSlug]}.png`;
  }
  return `https://flagcdn.com/w40/${ISLAND_FLAGS[slug]}.png`;
}
