'use client';

import { usePathname } from 'next/navigation';
import { SettingsDocument } from '../../prismicio-types';
import Footer from './footer';
import { shouldExcludeFooter } from './footer-exclusion';

interface FooterWrapperProps {
  settings: SettingsDocument;
}

export default function FooterWrapper({ settings }: FooterWrapperProps) {
  const pathname = usePathname();
  
  // Check if footer should be excluded for this route
  if (shouldExcludeFooter(pathname)) {
    return null;
  }
  
  return <Footer settings={settings} />;
}
