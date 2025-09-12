import { SettingsDocument } from "../../prismicio-types";
import Logo from "./logo";
import Navigation from "./navigation";

interface HeaderProps {
  settings: SettingsDocument;
}

export default function Header({ settings }: HeaderProps) {
  return (
    <header className="pb-20">
      <div className="container mx-auto">
        <div className="relative w-full">
          {/* Logo - Fixed top left */}
          <div className="fixed top-4 left-4 z-10">
            <Logo />
          </div>

          {/* Navigation - Fixed top center */}
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-10">
            <Navigation settings={settings} />
          </div>
        </div>
      </div>
    </header>
  );
}
