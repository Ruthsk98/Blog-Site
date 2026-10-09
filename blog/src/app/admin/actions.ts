'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { slugify } from '@/lib/utils';

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');
  const { data: p } = await supabase.from('profiles').select('is_admin').eq('id', user.id).maybeSingle();
  if (!p?.is_admin) throw new Error('Not authorised');
  return { supabase, user };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}

export async function savePost(_prev: { error?: string } | undefined, fd: FormData): Promise<{ error?: string }> {
  const { supabase, user } = await requireAdmin();
  const id = String(fd.get('id') || '');
  const title = String(fd.get('title') || '').trim();
  if (!title) return { error: 'Title is required.' };
  const slug = slugify(String(fd.get('slug') || '') || title);
  if (!slug) return { error: 'Slug is invalid.' };

  const row: Record<string, unknown> = {
    title, slug,
    excerpt: String(fd.get('excerpt') || '') || null,
    content: String(fd.get('content') || ''),
    cover_image: String(fd.get('cover_image') || '') || null,
    video_url: String(fd.get('video_url') || '') || null,
    category_id: String(fd.get('category_id') || '') || null,
    published: fd.get('published') === 'on',
  };
  const created = String(fd.get('created_at') || '');
  if (created) row.created_at = new Date(created).toISOString();

  const { error } = id
    ? await supabase.from('posts').update(row).eq('id', id)
    : await supabase.from('posts').insert({ ...row, author_id: user.id });
  if (error) return { error: error.code === '23505' ? 'That slug is already used.' : error.message };

  revalidatePath('/'); revalidatePath(`/posts/${slug}`); revalidatePath('/admin');
  redirect('/admin');
}

export async function deletePost(id: string, hard: boolean) {
  const { supabase } = await requireAdmin();
  if (hard) await supabase.from('posts').delete().eq('id', id);
  else await supabase.from('posts').update({ deleted_at: new Date().toISOString(), published: false }).eq('id', id);
  revalidatePath('/'); revalidatePath('/admin');
}

export async function restorePost(id: string) {
  const { supabase } = await requireAdmin();
  await supabase.from('posts').update({ deleted_at: null }).eq('id', id);
  revalidatePath('/admin');
}
