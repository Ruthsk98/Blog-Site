import Link from 'next/link';
import { Plus, Pencil, ExternalLink, Undo2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { signOut, restorePost } from './actions';
import DeleteButton from '@/components/DeleteButton';
import { formatDate } from '@/lib/utils';
import type { Post } from '@/lib/types';

const PAGE_SIZE = 10;

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ status?: string; page?: string; q?: string }> }) {
  const { status = 'all', page = '1', q = '' } = await searchParams;
  const pageNum = Math.max(1, parseInt(page) || 1);
  const supabase = await createClient();

  let query = supabase.from('posts').select('*, categories(*)', { count: 'exact' })
    .order('created_at', { ascending: false }).range((pageNum - 1) * PAGE_SIZE, pageNum * PAGE_SIZE - 1);
  if (status === 'published') query = query.eq('published', true).is('deleted_at', null);
  else if (status === 'draft') query = query.eq('published', false).is('deleted_at', null);
  else if (status === 'trash') query = query.not('deleted_at', 'is', null);
  else query = query.is('deleted_at', null);
  if (q) query = query.ilike('title', `%${q.replace(/[%,()]/g, ' ')}%`);
  const { data, count } = await query;
  const posts = (data ?? []) as Post[];
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));
  const link = (p: number, s = status) => `/admin?${new URLSearchParams({ status: s, page: String(p), ...(q && { q }) })}`;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <Link href="/admin/new" className="btn"><Plus size={16} /> New post</Link>
          <form action={signOut}><button className="btn-ghost">Sign out</button></form>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {['all', 'published', 'draft', 'trash'].map((s) => (
          <Link key={s} href={link(1, s)} className={`rounded-full border px-4 py-1.5 text-sm capitalize ${status === s ? 'border-crimson bg-crimson text-white' : 'border-ink-line text-neutral-300 hover:border-crimson'}`}>{s}</Link>
        ))}
        <form className="ml-auto"><input type="hidden" name="status" value={status} /><input name="q" defaultValue={q} placeholder="Search title…" className="field !py-1.5 !text-sm" /></form>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-ink-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink-soft text-neutral-400"><tr><th className="p-4">Title</th><th>Status</th><th>Category</th><th>Created</th><th className="pr-4 text-right">Actions</th></tr></thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="border-t border-ink-line">
                <td className="p-4 font-medium">{p.title}</td>
                <td><span className={`rounded-full px-2.5 py-0.5 text-xs ${p.deleted_at ? 'bg-neutral-700' : p.published ? 'bg-green-600/20 text-green-400' : 'bg-yellow-600/20 text-yellow-400'}`}>{p.deleted_at ? 'Trashed' : p.published ? 'Published' : 'Draft'}</span></td>
                <td className="text-neutral-400">{p.categories?.name ?? '—'}</td>
                <td className="text-neutral-400">{formatDate(p.created_at)}</td>
                <td className="pr-4"><div className="flex justify-end gap-1">
                  {p.deleted_at ? (
                    <form action={restorePost.bind(null, p.id)}><button aria-label="Restore" className="rounded p-1.5 text-neutral-400 hover:text-cream"><Undo2 size={16} /></button></form>
                  ) : (<>
                    {p.published && <Link href={`/posts/${p.slug}`} aria-label="View" className="rounded p-1.5 text-neutral-400 hover:text-cream"><ExternalLink size={16} /></Link>}
                    <Link href={`/admin/${p.id}/edit`} aria-label="Edit" className="rounded p-1.5 text-neutral-400 hover:text-cream"><Pencil size={16} /></Link>
                  </>)}
                  <DeleteButton id={p.id} title={p.title} />
                </div></td>
              </tr>
            ))}
            {posts.length === 0 && <tr><td colSpan={5} className="p-10 text-center text-neutral-500">No posts here yet.</td></tr>}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4 text-sm">
          {pageNum > 1 && <Link className="btn-ghost" href={link(pageNum - 1)}>← Prev</Link>}
          <span className="text-neutral-500">Page {pageNum} / {totalPages}</span>
          {pageNum < totalPages && <Link className="btn-ghost" href={link(pageNum + 1)}>Next →</Link>}
        </div>
      )}
    </>
  );
}
