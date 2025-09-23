import { type Metadata } from "next";

import { asText } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";
import SectionDotsNav from "@/lib/SectionDotsNav";

export default async function Home() {
  const client = createClient();
  const home = await client.getByUID("page", "home");

  // <SliceZone> renders the page's slices.
  return (
    <>
      {home.data.navigation && <SectionDotsNav enabled />}
      <SliceZone key="home" slices={home.data.slices} components={components} />
    </>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const home = await client.getByUID("page", "home");

  return {
    title: asText(home.data.title),
    description: home.data.meta_description,
    openGraph: {
      title: home.data.meta_title ?? undefined,
      images: [{ url: home.data.meta_image.url ?? "" }],
    },
  };
}
