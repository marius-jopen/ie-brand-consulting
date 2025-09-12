'use client';

import { usePathname } from 'next/navigation';
import { SettingsDocument } from '../../prismicio-types';
import Footer from './footer';
import { shouldExcludeFooter } from './footer-exclusion';
import { shouldUseDarkStyling } from './page-utils';

interface FooterWrapperProps {
  settings: SettingsDocument;
}

export default function FooterWrapper({ settings }: FooterWrapperProps) {
  const pathname = usePathname();
  
  // Check if footer should be excluded for this route
  if (shouldExcludeFooter(pathname)) {
    return null;
  }
  
  const isDarkMode = shouldUseDarkStyling(pathname);
  
  return <Footer settings={settings} isDarkMode={isDarkMode} />;
}
