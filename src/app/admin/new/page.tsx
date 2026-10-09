import { createClient } from '@/lib/supabase/server';
import PostForm from '@/components/PostForm';
import type { Category } from '@/lib/types';

export default async function NewPost() {
  const supabase = await createClient();
  const { data } = await supabase.from('categories').select('*').order('name');
  return (<><h1 className="font-serif text-3xl font-bold">New post</h1><PostForm categories={(data ?? []) as Category[]} /></>);
}
