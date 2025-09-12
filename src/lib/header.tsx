import { SettingsDocument } from "../../prismicio-types";
import Logo from "./logo";
import Navigation from "./navigation";

interface HeaderProps {
  settings: SettingsDocument;
  isDarkMode?: boolean;
}

export default function Header({ settings, isDarkMode = false }: HeaderProps) {
  const headerClasses = isDarkMode 
    ? "pb-20 bg-tertiary" 
    : "pb-20";
  
  const logoVariant = isDarkMode ? 'white' : 'default';

  return (
    <header className={headerClasses}>
      <div className="container mx-auto">
        <div className="relative w-full">
          {/* Logo - Fixed top left */}
          <div className="fixed top-4 left-4 z-10">
            <Logo variant={logoVariant} />
          </div>

          {/* Navigation - Fixed top center */}
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-10">
            <Navigation settings={settings} isDarkMode={isDarkMode} />
          </div>
        </div>
      </div>
    </header>
  );
}
