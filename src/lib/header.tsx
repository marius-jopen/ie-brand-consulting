import { SettingsDocument } from "../../prismicio-types";
import Logo from "./logo";
import Navigation from "./navigation";

interface HeaderProps {
  settings: SettingsDocument;
}

export default function Header({ settings }: HeaderProps) {
  return (
    <header className="pb-20">
      <div>
        <div>
          <div>
            {/* Logo */}
            <div>
              <Logo />
            </div>

            {/* Navigation */}
            <Navigation settings={settings} />
          </div>
        </div>
      </div>
    </header>
  );
}
