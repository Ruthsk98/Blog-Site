import Link from 'next/link';
import { Search } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import PostCard from '@/components/PostCard';
import type { Category, Post } from '@/lib/types';

export const revalidate = 60;
const PAGE_SIZE = 9;

export default async function Home({ searchParams }: { searchParams: Promise<{ q?: string; category?: string; page?: string }> }) {
  const { q = '', category = '', page = '1' } = await searchParams;
  const pageNum = Math.max(1, parseInt(page) || 1);
  const supabase = await createClient();

  const { data: categories } = await supabase.from('categories').select('*').order('name');
  const cat = (categories as Category[] | null)?.find((c) => c.slug === category);

  let query = supabase.from('posts').select('*, categories(*)', { count: 'exact' })
    .eq('published', true).is('deleted_at', null)
    .order('created_at', { ascending: false })
    .range((pageNum - 1) * PAGE_SIZE, pageNum * PAGE_SIZE - 1);
  if (cat) query = query.eq('category_id', cat.id);
  if (q) { const s = q.replace(/[%,()]/g, ' '); query = query.or(`title.ilike.%${s}%,excerpt.ilike.%${s}%`); }
  const { data, count } = await query;
  const posts = (data ?? []) as Post[];
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));
  const href = (p: number) => `/?${new URLSearchParams({ ...(q && { q }), ...(category && { category }), page: String(p) })}`;

  return (
    <>
      <section className="relative overflow-hidden border-b border-ink-line">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[40rem] -translate-x-1/2 rounded-full bg-crimson/20 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-5 py-24 text-center">
          <h1 className="font-serif text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
            Ideas worth <span className="text-crimson">reading</span>.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-neutral-400">
            Notes on building software, designing products and learning in public — by Ruthsk.
          </p>
          <form action="/" className="mx-auto mt-8 flex max-w-lg items-center gap-2 rounded-full border border-ink-line bg-ink-soft p-1.5 pl-4 focus-within:border-crimson">
            <Search size={18} className="text-neutral-500" />
            <input name="q" defaultValue={q} placeholder="Search articles…" className="flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-neutral-500" />
            {category && <input type="hidden" name="category" value={category} />}
            <button className="btn">Search</button>
          </form>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Link href="/" className={`rounded-full border px-4 py-1.5 text-sm transition ${!category ? 'border-crimson bg-crimson text-white' : 'border-ink-line text-neutral-300 hover:border-crimson'}`}>All</Link>
            {(categories as Category[] | null)?.map((c) => (
              <Link key={c.id} href={`/?category=${c.slug}`} className={`rounded-full border px-4 py-1.5 text-sm transition ${category === c.slug ? 'border-crimson bg-crimson text-white' : 'border-ink-line text-neutral-300 hover:border-crimson'}`}>{c.name}</Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-14">
        <h2 className="mb-8 font-serif text-2xl font-bold">{q ? `Results for “${q}”` : cat ? cat.name : 'Latest articles'}</h2>
        {posts.length === 0 ? (
          <p className="py-20 text-center text-neutral-500">No articles found.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{posts.map((p) => <PostCard key={p.id} post={p} />)}</div>
        )}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-4 text-sm">
            {pageNum > 1 && <Link className="btn-ghost" href={href(pageNum - 1)}>← Newer</Link>}
            <span className="text-neutral-500">Page {pageNum} of {totalPages}</span>
            {pageNum < totalPages && <Link className="btn-ghost" href={href(pageNum + 1)}>Older →</Link>}
          </div>
        )}
      </section>
    </>
  );
}
