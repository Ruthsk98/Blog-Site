export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');

export const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

export const readingTime = (text: string) => Math.max(1, Math.round(text.trim().split(/\s+/).length / 200));

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

export function toEmbedUrl(url: string): { kind: 'iframe' | 'video'; src: string } | null {
  if (!url) return null;
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
  if (yt) return { kind: 'iframe', src: `https://www.youtube-nocookie.com/embed/${yt[1]}` };
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return { kind: 'iframe', src: `https://player.vimeo.com/video/${vm[1]}` };
  if (/\.(mp4|webm)(\?.*)?$/i.test(url)) return { kind: 'video', src: url };
  return null;
}

export const escapeXml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
