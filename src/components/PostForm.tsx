'use client';
import { useActionState, useState } from 'react';
import Link from 'next/link';
import { Upload } from 'lucide-react';
import { savePost } from '@/app/admin/actions';
import { createClient } from '@/lib/supabase/client';
import { slugify } from '@/lib/utils';
import type { Category, Post } from '@/lib/types';

export default function PostForm({ post, categories }: { post?: Post; categories: Category[] }) {
  const [state, action, pending] = useActionState(savePost, undefined);
  const [title, setTitle] = useState(post?.title ?? '');
  const [slug, setSlug] = useState(post?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(!!post);
  const [cover, setCover] = useState(post?.cover_image ?? '');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  async function upload(file: File) {
    setUploading(true); setUploadError('');
    const path = `covers/${Date.now()}-${file.name.replace(/[^\w.-]/g, '_')}`;
    const supabase = createClient();
    const { error } = await supabase.storage.from('blog-media').upload(path, file, { upsert: false });
    if (error) setUploadError(error.message);
    else setCover(supabase.storage.from('blog-media').getPublicUrl(path).data.publicUrl);
    setUploading(false);
  }
  const dt = post ? new Date(post.created_at).toISOString().slice(0, 16) : '';

  return (
    <form action={action} className="mt-8 grid gap-5 lg:grid-cols-3">
      {post && <input type="hidden" name="id" value={post.id} />}
      <div className="space-y-5 lg:col-span-2">
        <input name="title" required placeholder="Post title" className="field !text-xl font-semibold" value={title}
          onChange={(e) => { setTitle(e.target.value); if (!slugTouched) setSlug(slugify(e.target.value)); }} />
        <input name="slug" placeholder="slug-auto-generated" className="field font-mono text-sm" value={slug}
          onChange={(e) => { setSlug(slugify(e.target.value)); setSlugTouched(true); }} />
        <textarea name="excerpt" rows={2} placeholder="Short excerpt" className="field" defaultValue={post?.excerpt ?? ''} />
        <textarea name="content" rows={20} placeholder="Write in Markdown…" className="field font-mono text-sm" defaultValue={post?.content ?? ''} />
      </div>
      <aside className="space-y-5 rounded-2xl border border-ink-line bg-ink-soft p-5 lg:self-start">
        <label className="flex items-center gap-3"><input type="checkbox" name="published" defaultChecked={post?.published} className="h-4 w-4 accent-red-600" /><span className="text-sm">Published</span></label>
        <div>
          <label className="mb-1 block text-xs text-neutral-400">Category</label>
          <select name="category_id" className="field" defaultValue={post?.category_id ?? ''}>
            <option value="">— None —</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs text-neutral-400">Cover image (URL or upload)</label>
          <input name="cover_image" className="field" value={cover} onChange={(e) => setCover(e.target.value)} placeholder="https://…" />
          <label className="btn-ghost mt-2 w-full cursor-pointer !py-2"><Upload size={14} />{uploading ? 'Uploading…' : 'Upload image'}
            <input type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} /></label>
          {uploadError && <p className="mt-1 text-xs text-crimson-bright">{uploadError}</p>}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {cover && <img src={cover} alt="" className="mt-3 rounded-lg" />}
        </div>
        <div>
          <label className="mb-1 block text-xs text-neutral-400">Video URL (YouTube, Vimeo or .mp4)</label>
          <input name="video_url" className="field" defaultValue={post?.video_url ?? ''} />
        </div>
        {post && (
          <div>
            <label className="mb-1 block text-xs text-neutral-400">Publication date</label>
            <input type="datetime-local" name="created_at" className="field" defaultValue={dt} />
          </div>
        )}
        {state?.error && <p className="text-sm text-crimson-bright">{state.error}</p>}
        <div className="flex gap-2">
          <button className="btn flex-1" disabled={pending}>{pending ? 'Saving…' : post ? 'Update' : 'Create'}</button>
          <Link href="/admin" className="btn-ghost">Cancel</Link>
        </div>
      </aside>
    </form>
  );
}
