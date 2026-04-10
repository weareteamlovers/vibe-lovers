'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getAdminLetter, markLetterRead } from '@/lib/api';
import { AdminLetterItem } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export function AdminLetterDetailClient({ id }: { id: string }) {
  const [item, setItem] = useState<AdminLetterItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAdminLetter(id)
      .then(async (letter) => {
        if (!letter.isRead) {
          await markLetterRead(id);
          setItem({ ...letter, isRead: true });
          return;
        }
        setItem(letter);
      })
      .catch((err) => setError(err instanceof Error ? err.message : '편지를 불러오지 못했습니다.'));
  }, [id]);

  return (
    <main className="min-h-screen px-5 py-10 md:px-8 lg:px-12">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/admin/letters"
          className="mb-6 inline-flex rounded-full border border-line px-4 py-2 text-xs uppercase tracking-[0.24em] text-paper/65 transition hover:bg-white/5"
        >
          Back
        </Link>
        {error ? (
          <div className="editorial-frame rounded-[28px] p-6 text-paper/65">{error}</div>
        ) : !item ? (
          <div className="editorial-frame rounded-[28px] p-6 text-paper/65">불러오는 중...</div>
        ) : (
          <article className="editorial-frame rounded-[32px] p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-paper/38">
              <span>{item.isAnonymous ? 'Anonymous' : item.senderName ?? 'Named'}</span>
              <span>•</span>
              <span>{item.isRead ? 'Read' : 'Unread'}</span>
              <span>•</span>
              <span>{formatDate(item.createdAt)}</span>
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-paper md:text-5xl">
              {item.title ?? '(제목 없음)'}
            </h1>
            <div className="mt-8 whitespace-pre-wrap text-base leading-8 text-paper/72">{item.body}</div>
          </article>
        )}
      </div>
    </main>
  );
}
