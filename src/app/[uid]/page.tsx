import { Metadata } from "next";
import { notFound } from "next/navigation";

import { asText, filter } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";
import SectionDotsNav from "@/lib/SectionDotsNav";

type Params = { uid: string };

export default async function Page({ params }: { params: Promise<Params> }) {
  const { uid } = await params;
  const client = createClient();
  const page = await client.getByUID("page", uid).catch(() => notFound());

  // <SliceZone> renders the page's slices.
  return (
    <>
      {page.data.navigation && <SectionDotsNav enabled />}
      <SliceZone key={uid} slices={page.data.slices} components={components} />
    </>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { uid } = await params;
  const client = createClient();
  const page = await client.getByUID("page", uid).catch(() => notFound());

  // Fetch home page for fallback metadata
  const home = await client.getByUID("page", "home");

  // Use page metadata if available, otherwise fall back to home page metadata
  const title = page.data.meta_title || home.data.meta_title;
  const description = page.data.meta_description || home.data.meta_description;
  const image = page.data.meta_image?.url || home.data.meta_image?.url;

  return {
    title: title || asText(page.data.title),
    description: description,
    openGraph: {
      type: "website",
      title: title ?? undefined,
      images: image ? [{ url: image }] : [],
    },
  };
}

export async function generateStaticParams() {
  const client = createClient();

  // Get all pages from Prismic, except the homepage.
  const pages = await client.getAllByType("page", {
    filters: [filter.not("my.page.uid", "home")],
  });

  return pages.map((page) => ({ uid: page.uid }));
}
