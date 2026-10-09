import { createClient } from '@/lib/supabase/server';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  // /admin/login renders without a user; middleware already guards the rest.
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).maybeSingle();
    if (!profile?.is_admin) {
      return (
        <div className="mx-auto max-w-md px-5 py-24 text-center">
          <h1 className="font-serif text-3xl font-bold">Not authorised</h1>
          <p className="mt-3 text-neutral-400">This account is not an admin. Set <code>is_admin = true</code> on your profile row in Supabase.</p>
        </div>
      );
    }
  }
  return <div className="mx-auto max-w-6xl px-5 py-10">{children}</div>;
}
