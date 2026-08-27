export function parseNavHref(href: string) {
  const [path, search = ''] = href.split('?');
  const params = new URLSearchParams(search);
  return {
    path,
    section: params.get('section'),
    trashed: params.get('trashed'),
  };
}

export function isNavHrefActive(href: string, pathname: string, searchParams: URLSearchParams) {
  const { path, section, trashed } = parseNavHref(href);

  const pathMatches =
    pathname === path || (path !== '/ad' && pathname.startsWith(`${path}/`));

  if (!pathMatches) return false;

  const currentSection = searchParams.get('section');
  const currentTrashed = searchParams.get('trashed');

  if (trashed === '1') {
    return currentTrashed === '1' && currentSection === null;
  }

  if (section === null) {
    return currentSection === null && currentTrashed !== '1';
  }

  return currentSection === section;
}
