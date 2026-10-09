export type Category = { id: string; name: string; slug: string };
export type Post = {
  id: string; title: string; slug: string; excerpt: string | null; content: string;
  cover_image: string | null; video_url: string | null; category_id: string | null;
  published: boolean; likes: number; created_at: string; updated_at: string; deleted_at: string | null;
  categories?: Category | null;
};
