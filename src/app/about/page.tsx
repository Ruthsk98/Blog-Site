import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'About' };

const skills = ['TypeScript', 'Next.js', 'React', 'Supabase', 'UI/UX', 'Tailwind CSS', 'PostgreSQL'];
const highlights = [
  ['Built in public', 'Writing about what I ship and what breaks along the way.'],
  ['Design-minded engineer', 'Caring as much about the interface as the query behind it.'],
  ['Always learning', 'Tutorials and notes written for the person I was last year.'],
];

export default function About() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <p className="text-sm font-semibold uppercase tracking-widest text-crimson">About</p>
      <h1 className="mt-3 font-serif text-5xl font-bold">Hi, I&apos;m Ruth.</h1>
      <div className="mt-10 rounded-2xl bg-cream p-8 text-ink sm:p-10">
        <h2 className="font-serif text-2xl font-bold">Mission</h2>
        <p className="mt-3 leading-8 text-neutral-700">
          {/* TODO: replace with your own words */}
          Ruthsk Blog exists to make technology and design approachable — clear explanations, honest
          lessons and practical tutorials you can actually follow.
        </p>
        <h2 className="mt-8 font-serif text-2xl font-bold">Background</h2>
        <p className="mt-3 leading-8 text-neutral-700">
          Add a short paragraph about your journey, what you work on, and why you started writing.
        </p>
        <h2 className="mt-8 font-serif text-2xl font-bold">Skills</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {skills.map((s) => <span key={s} className="rounded-full bg-ink px-3 py-1 text-sm text-cream">{s}</span>)}
        </div>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {highlights.map(([t, d]) => (
          <div key={t} className="rounded-2xl border border-ink-line bg-ink-soft p-6">
            <h3 className="font-semibold text-crimson-bright">{t}</h3>
            <p className="mt-2 text-sm text-neutral-400">{d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
