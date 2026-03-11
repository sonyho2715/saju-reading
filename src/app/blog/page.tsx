import { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from './[slug]/content';
import { BookOpen, Clock, Calendar } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Learn about Korean Saju, Four Pillars of Destiny, and how to read your birth chart. Articles on elements, compatibility, and luck cycles.',
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Saju Insights
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-400">
            Explore the wisdom of Korean Four Pillars of Destiny. Learn about
            elements, chart reading, compatibility, and practical applications.
          </p>
        </div>

        {/* Posts Grid */}
        <div className="space-y-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block rounded-xl border border-slate-800 bg-slate-900/50 p-6 transition-all hover:border-indigo-500/50 hover:bg-slate-900/80"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h2 className="mb-2 text-xl font-semibold text-white transition-colors group-hover:text-indigo-400">
                    {post.title}
                  </h2>
                  <p className="mb-4 text-sm leading-relaxed text-slate-400">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {post.readTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(post.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
                <BookOpen className="mt-1 h-5 w-5 flex-shrink-0 text-slate-600 transition-colors group-hover:text-indigo-400" />
              </div>
            </Link>
          ))}
        </div>

        {/* Back link */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="text-sm text-slate-500 transition-colors hover:text-indigo-400"
          >
            Back to SajuReading
          </Link>
        </div>
      </div>
    </main>
  );
}
