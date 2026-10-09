import Link from 'next/link';
import { Clock } from 'lucide-react';
import type { Post } from '@/lib/types';
import { formatDate, readingTime } from '@/lib/utils';

export default function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/posts/${post.slug}`} className="group flex flex-col overflow-hidden rounded-2xl bg-cream text-ink shadow-lg transition hover:-translate-y-1 hover:shadow-crimson/20">
      <div className="aspect-[16/10] overflow-hidden bg-cream-deep">
        {post.cover_image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.cover_image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center gap-3 text-xs">
          {post.categories && <span className="rounded-full bg-crimson px-2.5 py-0.5 font-semibold text-white">{post.categories.name}</span>}
          <span className="text-neutral-500">{formatDate(post.created_at)}</span>
          <span className="ml-auto inline-flex items-center gap-1 text-neutral-500"><Clock size={12} />{readingTime(post.content)} min</span>
        </div>
        <h3 className="font-serif text-xl font-bold leading-snug group-hover:text-crimson">{post.title}</h3>
        {post.excerpt && <p className="mt-2 line-clamp-3 text-sm text-neutral-600">{post.excerpt}</p>}
        <span className="mt-4 text-sm font-semibold text-crimson">Read more →</span>
      </div>
    </Link>
  );
}
