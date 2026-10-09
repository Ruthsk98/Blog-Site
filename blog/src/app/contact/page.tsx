'use client';
import { useState } from 'react';
import { Mail, MapPin, Github, Twitter, Linkedin, Send } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const EMAIL = 'hello@example.com';   // TODO: your email
const LOCATION = 'Your City, Country'; // TODO: your location

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  function validate() {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 2) e.name = 'Please enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address.';
    if (form.message.trim().length < 10) e.message = 'Message should be at least 10 characters.';
    setErrors(e); return Object.keys(e).length === 0;
  }
  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setStatus('sending');
    const { error } = await createClient().from('contact_messages').insert({
      name: form.name.trim(), email: form.email.trim(), message: form.message.trim(),
    });
    if (error) { setStatus('error'); return; }
    setStatus('sent'); setForm({ name: '', email: '', message: '' });
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-12 px-5 py-16 md:grid-cols-2">
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-crimson">Contact</p>
        <h1 className="mt-3 font-serif text-5xl font-bold">Let&apos;s talk.</h1>
        <p className="mt-4 text-neutral-400">Questions, collaborations or feedback — send a note and I&apos;ll reply soon.</p>
        <ul className="mt-8 space-y-4 text-neutral-300">
          <li className="flex items-center gap-3"><Mail size={18} className="text-crimson" /><a href={`mailto:${EMAIL}`} className="hover:text-crimson-bright">{EMAIL}</a></li>
          <li className="flex items-center gap-3"><MapPin size={18} className="text-crimson" />{LOCATION}</li>
        </ul>
        <div className="mt-6 flex gap-4 text-neutral-400">
          <a href="https://github.com/Ruthsk98" aria-label="GitHub" className="hover:text-crimson-bright"><Github /></a>
          <a href="https://twitter.com/" aria-label="Twitter" className="hover:text-crimson-bright"><Twitter /></a>
          <a href="https://linkedin.com/" aria-label="LinkedIn" className="hover:text-crimson-bright"><Linkedin /></a>
        </div>
      </div>

      <form onSubmit={submit} noValidate className="space-y-4 rounded-2xl border border-ink-line bg-ink-soft p-6">
        {(['name', 'email'] as const).map((f) => (
          <div key={f}>
            <label className="mb-1 block text-sm capitalize text-neutral-300" htmlFor={f}>{f}</label>
            <input id={f} type={f === 'email' ? 'email' : 'text'} className="field" value={form[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })} />
            {errors[f] && <p className="mt-1 text-xs text-crimson-bright">{errors[f]}</p>}
          </div>
        ))}
        <div>
          <label className="mb-1 block text-sm text-neutral-300" htmlFor="message">Message</label>
          <textarea id="message" rows={6} className="field" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          {errors.message && <p className="mt-1 text-xs text-crimson-bright">{errors.message}</p>}
        </div>
        <button className="btn w-full" disabled={status === 'sending'}><Send size={16} />{status === 'sending' ? 'Sending…' : 'Send message'}</button>
        {status === 'sent' && <p className="text-sm text-green-400">Thanks! Your message was sent.</p>}
        {status === 'error' && <p className="text-sm text-crimson-bright">Something went wrong. Please email me directly.</p>}
      </form>
    </div>
  );
}
