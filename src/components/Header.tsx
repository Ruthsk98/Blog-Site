import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const links = [['Home', '/'], ['About', '/about'], ['Contact', '/contact']];
  return (
    <header className="sticky top-0 z-50 border-b border-ink-line bg-ink/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="font-serif text-xl font-bold tracking-tight">
          Ruthsk<span className="text-crimson">.</span> Blog
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="hidden text-neutral-300 transition hover:text-crimson-bright sm:block">{label}</Link>
          ))}
          <Link href={user ? '/admin' : '/admin/login'} className="btn !py-1.5">
            {user ? 'Dashboard' : 'Admin Login'}
          </Link>
        </nav>
      </div>
    </header>
  );
}
