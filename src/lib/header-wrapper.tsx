'use client';

import { usePathname } from 'next/navigation';
import { SettingsDocument } from '../../prismicio-types';
import Header from './header';
import { shouldUseDarkStyling } from './page-utils';
import { useMemo } from 'react';

interface HeaderWrapperProps {
  settings: SettingsDocument;
}

export default function HeaderWrapper({ settings }: HeaderWrapperProps) {
  const pathname = usePathname();
  const isDarkMode = useMemo(() => shouldUseDarkStyling(pathname), [pathname]);
  
  return <Header settings={settings} isDarkMode={isDarkMode} />;
}
