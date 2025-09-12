/**
 * Array of routes where the footer should be excluded
 * Add or remove routes as needed
 */
export const FOOTER_EXCLUDED_ROUTES = [
  'services',
  'connect',
  // Add more routes here as needed
  // 'about',
  // 'contact',
];

/**
 * Check if the current route should exclude the footer
 * @param pathname - The current pathname (e.g., '/services', '/connect')
 * @returns boolean - true if footer should be excluded, false otherwise
 */
export function shouldExcludeFooter(pathname: string): boolean {
  // Remove leading slash and get the route segment
  const route = pathname.replace(/^\//, '');
  
  // Check if the route is in the exclusion list
  return FOOTER_EXCLUDED_ROUTES.includes(route);
}
