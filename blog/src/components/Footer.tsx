import Link from 'next/link';
import { Github, Twitter, Linkedin, Rss } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-ink-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 text-sm text-neutral-400 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} Ruthsk Blog. All rights reserved.</p>
        <nav className="flex flex-wrap gap-5">
          <Link href="/" className="hover:text-cream">Home</Link>
          <Link href="/about" className="hover:text-cream">About</Link>
          <Link href="/contact" className="hover:text-cream">Contact</Link>
          <Link href="/rss.xml" className="inline-flex items-center gap-1 hover:text-cream"><Rss size={14} /> RSS</Link>
          <Link href="/sitemap.xml" className="hover:text-cream">Sitemap</Link>
        </nav>
        <div className="flex gap-4">
          <a href="https://github.com/Ruthsk98" aria-label="GitHub" className="hover:text-crimson-bright"><Github size={18} /></a>
          <a href="https://twitter.com/" aria-label="Twitter" className="hover:text-crimson-bright"><Twitter size={18} /></a>
          <a href="https://linkedin.com/" aria-label="LinkedIn" className="hover:text-crimson-bright"><Linkedin size={18} /></a>
        </div>
      </div>
    </footer>
  );
}
