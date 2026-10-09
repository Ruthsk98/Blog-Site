'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError('');
    const { error } = await createClient().auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    router.replace('/admin'); router.refresh();
  }
  return (
    <div className="mx-auto max-w-sm py-16">
      <h1 className="font-serif text-3xl font-bold">Admin login</h1>
      <form onSubmit={submit} className="mt-6 space-y-4 rounded-2xl border border-ink-line bg-ink-soft p-6">
        <input type="email" required placeholder="Email" className="field" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" required placeholder="Password" className="field" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-sm text-crimson-bright">{error}</p>}
        <button className="btn w-full" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </div>
  );
}
