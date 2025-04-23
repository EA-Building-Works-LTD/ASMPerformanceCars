import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { client, urlForImage } from '@/sanity/lib/client';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import type { Metadata } from 'next';
import KeyTakeaways from '@/components/blog/KeyTakeaways';
import BlogAd from '@/components/blog/BlogAd';
import ResponsiveBlogAd from '@/components/blog/ResponsiveBlogAd';
import { addCanonicalUrl } from '@/components/shared/CanonicalUrl';
import TableOfContents from '@/components/blog/TableOfContents';
import PortableTextWrapper from '@/components/blog/PortableTextWrapper';
import AuthorBioPortableText from '@/components/blog/AuthorBioPortableText';

/* ---------- helpers ---------- */

async function getActiveAds() {
  return client.fetch(`
    *[_type=="blogAd" && isActive]{
      _id,title,adSize,adImage,adVideo,link,trackingId,displayLocation
    }
  `);
}

interface BlogAd {
  _id: string;
  title: string;
  adSize: string;
  adImage: any;
  adVideo?: any;
  link: string;
  trackingId?: string;
  displayLocation: string;
}

async function getPostBySlug(slug: string) {
  return client.fetch(
    `
    *[_type=="post" && slug.current==$slug][0]{
      _id,title,slug,mainImage,body,publishedAt,keyTakeaways,
      "categories":categories[]->title,
      "author":author->{name,image,bio},
      "estimatedReadingTime":round(length(pt::text(body))/5/180),
      seo{metaTitle,metaDescription}
    }`,
    { slug }
  );
}

/* ---------- metadata ---------- */

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found | ASM Performance Cars',
      description:
        'The blog post you are looking for does not exist or has been removed.',
    };
  }

  const postTitle = post.seo?.metaTitle || post.title;
  const brandedTitle = `${postTitle} | ASM Performance Cars`;

  const meta: Metadata = {
    title: brandedTitle,
    description:
      post.seo?.metaDescription ||
      `Read about ${post.title} on ASM Performance Cars`,
    openGraph: {
      title: brandedTitle,
      description: post.seo?.metaDescription,
      images: post.mainImage ? [urlForImage(post.mainImage).url()] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: brandedTitle,
      description: post.seo?.metaDescription,
      images: post.mainImage ? [urlForImage(post.mainImage).url()] : [],
    },
  };

  return addCanonicalUrl(meta, `/blog/${slug}`);
}

/* ---------- page ---------- */

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  const post = await getPostBySlug(slug);
  const ads = (await getActiveAds()) as BlogAd[];

  const aboveBackLinkAd = ads.find(a => a.displayLocation === 'above_back_link');
  const belowTakeawaysAd = ads.find(a => a.displayLocation === 'below_takeaways');
  const midContentAd = ads.find(a => a.displayLocation === 'mid_content');
  const aboveBioAd = ads.find(a => a.displayLocation === 'above_bio');

  if (!post) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/blog" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  /* ----- helper to inject mid-content ad ----- */
  const renderContentWithMidAd = () => {
    if (!midContentAd || !post.body) return <PortableTextWrapper value={post.body} />;

    const blocks = post.body;
    if (!Array.isArray(blocks) || blocks.length <= 5) {
      return (
        <>
          <PortableTextWrapper value={post.body} />
          <div className="mt-12">
            <BlogAd ad={midContentAd} />
          </div>
        </>
      );
    }

    const mid = Math.floor(blocks.length / 2);
    return (
      <>
        <PortableTextWrapper value={blocks.slice(0, mid)} />
        <BlogAd ad={midContentAd} />
        <PortableTextWrapper value={blocks.slice(mid)} />
      </>
    );
  };

  /* ---------- render ---------- */

  return (
    <Layout>
      <article className="container mx-auto px-4 pt-4 pb-10 md:pt-8 md:pb-16">
        {aboveBackLinkAd && (
          <div className="mb-4">
            <ResponsiveBlogAd desktopAd={aboveBackLinkAd} className="mt-0" />
          </div>
        )}

        {/* back link */}
        <div className="mb-8">
          <Button
            variant="ghost"
            asChild
            className="text-gray-600 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-500"
          >
            <Link href="/blog" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </Button>
        </div>

        {/* header */}
        <div className="max-w-3xl mx-auto mb-12">
          {post.categories?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.categories.map((cat: string) => (
                <Link
                  key={cat}
                  href={`/blog/category/${cat
                    .toLowerCase()
                    .replace(/\s*&\s*/g, '-and-')
                    .replace(/\s+/g, '-')}`}
                >
                  <Badge className="bg-red-600 hover:bg-red-700 text-white">
                    {cat}
                  </Badge>
                </Link>
              ))}
            </div>
          )}

          <h1 className="text-4xl md:text-5xl font-bold mb-6 dark:text-white">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center text-sm text-gray-600 dark:text-gray-400 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>By {post.author?.name || 'Unknown'}</span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {post.publishedAt
                  ? format(new Date(post.publishedAt), 'MMM d, yyyy')
                  : 'Unknown date'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.estimatedReadingTime || 5} min read</span>
            </div>
          </div>
        </div>

        {post.mainImage && (
          <div className="max-w-4xl mx-auto mb-12 relative h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-xl">
            <Image
              src={urlForImage(post.mainImage).url()}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {post.keyTakeaways?.length > 0 && (
          <KeyTakeaways takeaways={post.keyTakeaways} />
        )}

        {belowTakeawaysAd && <BlogAd ad={belowTakeawaysAd} />}

        {/* content + ToC */}
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:gap-10 relative">
          {post.body && (
            <div className="md:hidden w-full mb-8">
              <TableOfContents content={post.body} />
            </div>
          )}

          <div className="flex-1 blog-content max-w-3xl mx-auto order-1 md:order-1">
            {post.body && renderContentWithMidAd()}
          </div>

          {post.body && (
            <div
              className="hidden md:block md:w-64 shrink-0 order-2 md:order-2"
              style={{
                position: 'sticky',
                alignSelf: 'flex-start',
                top: '2rem',
                height: 'fit-content',
              }}
            >
              <TableOfContents content={post.body} />
            </div>
          )}
        </div>

        {aboveBioAd && (
          <div className="max-w-3xl mx-auto">
            <BlogAd ad={aboveBioAd} />
          </div>
        )}

        {post.author && (
          <div className="max-w-3xl mx-auto mt-12 p-6 border border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-zinc-900">
            <div className="flex items-start gap-4">
              {post.author.image ? (
                <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-gray-100 dark:border-gray-800">
                  <Image
                    src={urlForImage(post.author.image).url()}
                    alt={post.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-red-600 dark:text-red-400 text-xl font-bold">
                    {post.author.name.charAt(0)}
                  </span>
                </div>
              )}

              <div>
                <h3 className="font-bold text-lg mb-2">About {post.author.name}</h3>
                {post.author.bio && (
                  <AuthorBioPortableText value={post.author.bio} />
                )}
              </div>
            </div>
          </div>
        )}
      </article>
    </Layout>
  );
}
