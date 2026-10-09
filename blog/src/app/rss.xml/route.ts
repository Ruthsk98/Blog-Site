import { createClient } from '@/lib/supabase/server';
import { SITE_URL, escapeXml } from '@/lib/utils';

export const revalidate = 3600;

export async function GET() {
  const supabase = await createClient();
  const { data: posts } = await supabase.from('posts').select('title, slug, excerpt, created_at')
    .eq('published', true).is('deleted_at', null).order('created_at', { ascending: false }).limit(30);
  const items = (posts ?? []).map((p) => `<item><title>${escapeXml(p.title)}</title><link>${SITE_URL}/posts/${p.slug}</link><guid>${SITE_URL}/posts/${p.slug}</guid><pubDate>${new Date(p.created_at).toUTCString()}</pubDate><description>${escapeXml(p.excerpt ?? '')}</description></item>`).join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Ruthsk Blog</title><link>${SITE_URL}</link><description>Articles on tech, design and tutorials.</description>${items}</channel></rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
