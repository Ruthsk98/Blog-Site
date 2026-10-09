# Ruthsk Blog — Next.js + Supabase + Vercel

## File structure
```
├── middleware.ts            → src/middleware.ts (guards /admin/*)
├── supabase/schema.sql      Tables, RLS, triggers, storage bucket
└── src
    ├── app
    │   ├── layout.tsx · page.tsx (Home) · globals.css · robots.ts
    │   ├── about/page.tsx · contact/page.tsx
    │   ├── posts/[slug]/page.tsx        Article route (markdown, video, like/share)
    │   ├── sitemap.xml/route.ts · rss.xml/route.ts
    │   └── admin
    │       ├── layout.tsx (admin check) · page.tsx (post table) · actions.ts (server actions)
    │       ├── login/page.tsx · new/page.tsx · [id]/edit/page.tsx
    ├── components  Header, Footer, PostCard, PostActions, PostForm, DeleteButton
    └── lib         supabase/{client,server}.ts · utils.ts · types.ts
```

## Local setup
1. `npm install`
2. Copy `.env.example` to `.env.local` and fill in the values (Supabase → Project Settings → API).
3. Run `supabase/schema.sql` in the Supabase SQL Editor.
4. Supabase → Authentication → Users → **Add user** (your email + password, auto-confirm).
5. Run in SQL Editor: `update public.profiles set is_admin = true where id = (select id from auth.users where email = 'YOU@EXAMPLE.COM');`
6. Supabase → Authentication → Providers → Email → turn **off** "Allow new users to sign up" (only you can log in).
7. `npm run dev` → http://localhost:3000, admin at `/admin/login`.

## Deploy to Vercel
1. Push to GitHub (`git init && git add . && git commit -m "init" && git remote add origin https://github.com/Ruthsk98/Blog.git && git push -u origin main`).
2. vercel.com → **Add New → Project** → import the repo (framework auto-detects Next.js).
3. Environment Variables (all environments):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` = your final URL, e.g. `https://ruthsk-blog.vercel.app`
4. Deploy. Then in Supabase → Authentication → URL Configuration set **Site URL** to your Vercel URL.
5. Submit `https://YOUR-DOMAIN/sitemap.xml` in Google Search Console.

## Notes
- Anon key is safe to expose; security comes from the RLS policies. Never put the `service_role` key in a `NEXT_PUBLIC_` variable.
- Post bodies render as Markdown (raw HTML is not rendered, which prevents XSS).
- Replace placeholder text in `about/page.tsx` and the email/location in `contact/page.tsx`.
