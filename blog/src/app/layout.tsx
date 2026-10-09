import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SITE_URL } from '@/lib/utils';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Ruthsk Blog', template: '%s | Ruthsk Blog' },
  description: 'Articles on tech, design and tutorials.',
  alternates: { types: { 'application/rss+xml': '/rss.xml' } },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
