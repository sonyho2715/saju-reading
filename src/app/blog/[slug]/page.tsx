import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostBySlug, getAllPosts } from './content';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
    },
  };
}

export function generateStaticParams() {
  return getAllPosts().map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Simple markdown-like rendering: split by ## headers
  const sections = post.content.split(/^## /m);
  const intro = sections[0].trim();
  const namedSections = sections.slice(1).map((s) => {
    const newline = s.indexOf('\n');
    return {
      heading: s.slice(0, newline).trim(),
      body: s.slice(newline + 1).trim(),
    };
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-indigo-400"
        >
          <ArrowLeft className="h-4 w-4" />
          All Articles
        </Link>

        {/* Header */}
        <header className="mb-10">
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {post.readTime}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
        </header>

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          {intro && (
            <div className="mb-8 text-base leading-relaxed text-slate-300">
              {intro.split('\n\n').map((paragraph, i) => (
                <p key={i} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          )}

          {namedSections.map((section, i) => (
            <section key={i} className="mb-8">
              <h2 className="mb-4 text-xl font-semibold text-white">
                {section.heading}
              </h2>
              <div className="text-base leading-relaxed text-slate-300">
                {section.body.split('\n\n').map((paragraph, j) => (
                  <p key={j} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-16 border-t border-slate-800 pt-8">
          <div className="flex items-center justify-between">
            <Link
              href="/blog"
              className="text-sm text-slate-500 transition-colors hover:text-indigo-400"
            >
              More articles
            </Link>
            <Link
              href="/reading"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
            >
              Get Your Free Reading
            </Link>
          </div>
        </footer>
      </article>
    </main>
  );
}
