import { MetadataRoute } from "next";
import { createClient } from "@/prismicio";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.ie-brand.com";

  const client = createClient();

  try {
    // Get all pages from Prismic, including the homepage
    const pages = await client.getAllByType("page");

    const sitemapEntries: MetadataRoute.Sitemap = [];

    for (const page of pages) {
      // Skip slice-simulator and other non-indexable pages
      if (page.uid === "slice-simulator" || !page.uid) {
        continue;
      }

      // Determine the URL based on whether it's the home page or a regular page
      const url = page.uid === "home" ? baseUrl : `${baseUrl}/${page.uid}`;

      // Get last modified date from the page
      const lastModified = page.last_publication_date
        ? new Date(page.last_publication_date)
        : new Date();

      sitemapEntries.push({
        url,
        lastModified,
        changeFrequency: "monthly",
        priority: page.uid === "home" ? 1.0 : 0.8,
      });
    }

    return sitemapEntries;
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // Return at least the homepage if there's an error
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 1.0,
      },
    ];
  }
}
