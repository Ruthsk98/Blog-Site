'use client';
import { useState, useTransition } from 'react';
import { Trash2 } from 'lucide-react';
import { deletePost } from '@/app/admin/actions';

export default function DeleteButton({ id, title }: { id: string; title: string }) {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const run = (hard: boolean) => start(async () => { await deletePost(id, hard); setOpen(false); });
  return (
    <>
      <button onClick={() => setOpen(true)} aria-label="Delete" className="rounded p-1.5 text-neutral-400 hover:bg-ink-line hover:text-crimson-bright"><Trash2 size={16} /></button>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-md rounded-2xl bg-cream p-6 text-ink" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-serif text-xl font-bold">Delete this post?</h3>
            <p className="mt-2 text-sm text-neutral-600">“{title}” — move it to trash (restorable) or delete it forever.</p>
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button onClick={() => setOpen(false)} className="rounded-full border border-neutral-300 px-4 py-2 text-sm">Cancel</button>
              <button disabled={pending} onClick={() => run(false)} className="rounded-full bg-ink px-4 py-2 text-sm text-cream">Move to trash</button>
              <button disabled={pending} onClick={() => run(true)} className="btn">Delete forever</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
