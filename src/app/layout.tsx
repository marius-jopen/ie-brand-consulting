import { PrismicPreview } from "@prismicio/next";
import { repositoryName, createClient } from "@/prismicio";
import HeaderWrapper from "@/lib/header-wrapper";
import FooterWrapper from "@/lib/footer-wrapper";
import PageFade from "@/lib/PageFade";
import Welcome from "@/lib/Welcome";
import CursorDot from "@/lib/CursorDot";
import Script from "next/script";
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
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-YQDBN47J3D"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-YQDBN47J3D');
          `}
        </Script>
      </head>
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
