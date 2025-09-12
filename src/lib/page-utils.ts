/**
 * Utility functions for page detection and conditional styling
 */

/**
 * Check if the current page is the Connect page
 * @param pathname - The current pathname (e.g., '/connect', '/contact')
 * @returns boolean - true if on Connect page, false otherwise
 */
export function isConnectPage(pathname: string): boolean {
  // Remove leading slash and get the route segment
  const route = pathname.replace(/^\//, '');
  
  // Check if the route matches Connect page patterns
  return route === 'connect' || route === 'contact';
}

/**
 * Check if the current page should have dark header/footer styling
 * @param pathname - The current pathname
 * @returns boolean - true if should have dark styling, false otherwise
 */
export function shouldUseDarkStyling(pathname: string): boolean {
  return isConnectPage(pathname);
}
