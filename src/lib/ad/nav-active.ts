export function parseNavHref(href: string) {
  const [path, search = ''] = href.split('?');
  const params = new URLSearchParams(search);
  return { path, section: params.get('section') };
}

export function isNavHrefActive(href: string, pathname: string, searchParams: URLSearchParams) {
  const { path, section } = parseNavHref(href);

  const pathMatches =
    pathname === path || (path !== '/ad' && pathname.startsWith(`${path}/`));

  if (!pathMatches) return false;

  const currentSection = searchParams.get('section');

  if (section === null) {
    return currentSection === null;
  }

  return currentSection === section;
}
