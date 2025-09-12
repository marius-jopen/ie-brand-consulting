import { PrismicPreview } from "@prismicio/next";
import { repositoryName, createClient } from "@/prismicio";
import HeaderWrapper from "@/lib/header-wrapper";
import FooterWrapper from "@/lib/footer-wrapper";
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
    <html lang="en">
      <body className="scrollbar-gutter-stable">
        <HeaderWrapper settings={settings} />
        <main>{children}</main>
        <FooterWrapper settings={settings} />
        <PrismicPreview repositoryName={repositoryName} />
      </body>
    </html>
  );
}
