import type { Metadata } from 'next';
import { IBM_Plex_Sans_KR } from 'next/font/google';
import './globals.css';
import { CustomCursor } from '@/components/cursor/custom-cursor';

const ibmPlexSansKr = IBM_Plex_Sans_KR({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-geist-sans',
  display: 'swap'
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: '팀사랑꾼들 | Editorial Portfolio',
  description:
    '팀사랑꾼들 — 싱어송라이터이자 AI Engineer의 예술적 포트폴리오 및 전시형 웹사이트.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={ibmPlexSansKr.variable}>
      <body>
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
