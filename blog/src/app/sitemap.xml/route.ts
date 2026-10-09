import { createClient } from '@/lib/supabase/server';
import { SITE_URL, escapeXml } from '@/lib/utils';

export const revalidate = 3600;

export async function GET() {
  const supabase = await createClient();
  const { data: posts } = await supabase.from('posts').select('slug, updated_at')
    .eq('published', true).is('deleted_at', null).order('updated_at', { ascending: false });

  const urls = [
    { loc: `${SITE_URL}/`, priority: '1.0' },
    { loc: `${SITE_URL}/about`, priority: '0.6' },
    { loc: `${SITE_URL}/contact`, priority: '0.5' },
    ...(posts ?? []).map((p) => ({ loc: `${SITE_URL}/posts/${p.slug}`, lastmod: p.updated_at, priority: '0.8' })),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${escapeXml(u.loc)}</loc>${'lastmod' in u && u.lastmod ? `<lastmod>${new Date(u.lastmod as string).toISOString()}</lastmod>` : ''}<priority>${u.priority}</priority></url>`).join('\n')}
</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
