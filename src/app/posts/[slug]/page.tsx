import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { createClient } from '@/lib/supabase/server';
import PostActions from '@/components/PostActions';
import { formatDate, readingTime, toEmbedUrl } from '@/lib/utils';
import type { Post } from '@/lib/types';

export const revalidate = 60;

async function getPost(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase.from('posts').select('*, categories(*)')
    .eq('slug', slug).eq('published', true).is('deleted_at', null).maybeSingle();
  return data as Post | null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return {};
  return {
    title: post.title, description: post.excerpt ?? undefined,
    openGraph: { title: post.title, description: post.excerpt ?? undefined, type: 'article', images: post.cover_image ? [post.cover_image] : [] },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = await getPost((await params).slug);
  if (!post) notFound();
  const embed = post.video_url ? toEmbedUrl(post.video_url) : null;

  return (
    <article className="mx-auto max-w-3xl px-5 pt-12">
      <Link href="/" className="text-sm text-neutral-400 hover:text-crimson-bright">← All articles</Link>
      <div className="mt-6 flex items-center gap-3 text-sm text-neutral-400">
        {post.categories && <span className="rounded-full bg-crimson px-3 py-0.5 text-xs font-semibold text-white">{post.categories.name}</span>}
        <span>{formatDate(post.created_at)}</span><span>· {readingTime(post.content)} min read</span>
      </div>
      <h1 className="mt-4 font-serif text-4xl font-bold leading-tight sm:text-5xl">{post.title}</h1>
      {post.excerpt && <p className="mt-4 text-lg text-neutral-400">{post.excerpt}</p>}
      <div className="mt-6"><PostActions slug={post.slug} initialLikes={post.likes} title={post.title} /></div>

      {post.cover_image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.cover_image} alt={post.title} className="mt-10 w-full rounded-2xl object-cover" />
      )}
      {embed && (
        <div className="mt-8 aspect-video overflow-hidden rounded-2xl bg-black">
          {embed.kind === 'iframe'
            ? <iframe src={embed.src} className="h-full w-full" allowFullScreen loading="lazy" title="Video" />
            : <video src={embed.src} controls className="h-full w-full" />}
        </div>
      )}
      <div className="prose-post mt-10 rounded-2xl bg-cream px-6 py-8 sm:px-10">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </div>
      <div className="mt-8"><PostActions slug={post.slug} initialLikes={post.likes} title={post.title} /></div>
    </article>
  );
}
