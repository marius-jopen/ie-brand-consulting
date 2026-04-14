import { Metadata } from "next";
import { notFound } from "next/navigation";

import { SliceZone } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";

import { createClient } from "@/prismicio";
import { components } from "@/slices";
import GoBackButton from "./GoBackButton";

type Params = { uid: string };

export default async function ReadPost({
  params,
}: {
  params: Promise<Params>;
}) {
  const { uid } = await params;
  const client = createClient();
  const post = await client.getByUID("read", uid).catch(() => notFound());

  const date = post.data.date
    ? new Date(post.data.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <article className="py-24 [&_.text-box]:!w-full [&_.text-box]:!px-6 md:[&_.text-box]:!w-1/2 md:[&_.text-box]:!px-0">
      <header className="mx-auto w-full px-6 md:w-1/2 md:px-0 mb-12">
        {date && (
          <p className="mb-4 text-sm uppercase tracking-wide text-neutral-500">
            {date}
          </p>
        )}
        {post.data.title && (
          <h1 className="text-4xl font-semibold leading-tight">
            {post.data.title}
          </h1>
        )}
        {post.data.teaser && (
          <p className="mt-4 text-lg text-neutral-600">{post.data.teaser}</p>
        )}
      </header>
      {post.data.thumbnail?.url && (
        <div className="mx-auto w-full px-6 md:w-1/2 md:px-0 mb-12">
          <PrismicNextImage
            field={post.data.thumbnail}
            fallbackAlt=""
            className="w-full h-auto"
          />
        </div>
      )}
      <SliceZone slices={post.data.slices} components={components} />
      <div className="mx-auto w-full px-6 md:w-1/2 md:px-0 mt-12">
        <GoBackButton />
      </div>
    </article>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { uid } = await params;
  const client = createClient();
  const post = await client.getByUID("read", uid).catch(() => notFound());

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.ie-brand.com";
  const canonicalUrl = `${baseUrl}/read/${uid}`;

  const title = post.data.meta_title || post.data.title;
  const description = post.data.meta_description || post.data.teaser;
  const image = post.data.meta_image?.url || post.data.thumbnail?.url;

  return {
    title: title || undefined,
    description: description || undefined,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "article",
      title: title || undefined,
      description: description || undefined,
      images: image ? [{ url: image }] : [],
      url: canonicalUrl,
    },
  };
}

export async function generateStaticParams() {
  const client = createClient();
  const posts = await client.getAllByType("read");
  return posts.map((post) => ({ uid: post.uid }));
}
