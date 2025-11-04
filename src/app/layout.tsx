import { PrismicPreview } from "@prismicio/next";
import { repositoryName, createClient } from "@/prismicio";
import HeaderWrapper from "@/lib/header-wrapper";
import FooterWrapper from "@/lib/footer-wrapper";
import PageFade from "@/lib/PageFade";
import Welcome from "@/lib/Welcome";
import CursorDot from "@/lib/CursorDot";
import "./globals.css";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch settings data
  const client = createClient();
  const settings = await client.getSingle("settings");

  return (
    <html lang="en" className="welcome-active">
      <body className="scrollbar-gutter-stable antialiased">
        <CursorDot />
        <Welcome />
        <PageFade className="relative z-40">
        <HeaderWrapper settings={settings} />
        </PageFade>
        <main>
          <PageFade>
            {children}
          </PageFade>
        </main>
        <FooterWrapper settings={settings} />
        <PrismicPreview repositoryName={repositoryName} />
      </body>
    </html>
  );
}
