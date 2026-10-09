'use client';
import { useState } from 'react';
import { Heart, Share2, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function PostActions({ slug, initialLikes, title }: { slug: string; initialLikes: number; title: string }) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  async function like() {
    if (liked || typeof window === 'undefined') return;
    if (localStorage.getItem(`liked:${slug}`)) { setLiked(true); return; }
    setLiked(true); setLikes((n) => n + 1);
    const { data, error } = await createClient().rpc('increment_likes', { p_slug: slug });
    if (error) { setLiked(false); setLikes((n) => n - 1); return; }
    if (typeof data === 'number') setLikes(data);
    localStorage.setItem(`liked:${slug}`, '1');
  }
  async function share() {
    const url = window.location.href;
    if (navigator.share) { try { await navigator.share({ title, url }); return; } catch { /* cancelled */ } }
    await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000);
  }
  return (
    <div className="flex gap-3">
      <button onClick={like} className={`btn-ghost ${liked ? '!border-crimson !text-crimson' : ''}`}>
        <Heart size={16} fill={liked ? 'currentColor' : 'none'} /> {likes}
      </button>
      <button onClick={share} className="btn-ghost">{copied ? <><Check size={16} /> Copied</> : <><Share2 size={16} /> Share</>}</button>
    </div>
  );
}
