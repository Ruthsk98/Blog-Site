import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import PostForm from '@/components/PostForm';
import type { Category, Post } from '@/lib/types';

export default async function EditPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: post }, { data: cats }] = await Promise.all([
    supabase.from('posts').select('*').eq('id', id).maybeSingle(),
    supabase.from('categories').select('*').order('name'),
  ]);
  if (!post) notFound();
  return (<><h1 className="font-serif text-3xl font-bold">Edit post</h1><PostForm post={post as Post} categories={(cats ?? []) as Category[]} /></>);
}
