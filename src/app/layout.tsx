import { PrismicPreview } from "@prismicio/next";
import { repositoryName, createClient } from "@/prismicio";
import HeaderWrapper from "@/lib/header-wrapper";
import FooterWrapper from "@/lib/footer-wrapper";
import PageFade from "@/lib/PageFade";
import Welcome from "@/lib/Welcome";
import CursorDot from "@/lib/CursorDot";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  icons: {
    icon: "/svgs/favicon-transparent.png",
  },
};

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
      <body className="scrollbar-gutter-stable antialiased flex flex-col min-h-screen">
        <CursorDot />
        <Welcome />
        <PageFade className="relative z-40">
        <HeaderWrapper settings={settings} />
        </PageFade>
        <main className="flex-1">
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
