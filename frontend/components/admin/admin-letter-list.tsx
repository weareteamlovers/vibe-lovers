'use client';

import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { AdminLetterItem } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { deleteLetter, markLetterRead } from '@/lib/api';
import { useRouter } from 'next/navigation';

export function AdminLetterList({ items }: { items: AdminLetterItem[] }) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <article key={item.id} className="editorial-frame rounded-[28px] p-5 md:p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-paper/38">
                <span>{item.isAnonymous ? 'Anonymous' : item.senderName ?? 'Named'}</span>
                <span>•</span>
                <span>{item.isRead ? 'Read' : 'Unread'}</span>
                <span>•</span>
                <span>{formatDate(item.createdAt)}</span>
              </div>
              <h2 className="text-2xl font-semibold tracking-tight text-paper">{item.title ?? '(제목 없음)'}</h2>
              <p className="max-w-3xl text-sm leading-relaxed text-paper/65 line-clamp-3">{item.body}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={async () => {
                  await markLetterRead(item.id);
                  router.refresh();
                }}
                className="rounded-full border border-line px-4 py-2 text-xs uppercase tracking-[0.24em] text-paper/65 transition hover:bg-white/5"
                data-cursor="interactive"
              >
                Mark read
              </button>
              <Link
                href={`/admin/letters/${item.id}`}
                className="rounded-full border border-line px-4 py-2 text-xs uppercase tracking-[0.24em] text-paper/65 transition hover:bg-white/5"
                data-cursor="interactive"
              >
                Open
              </Link>
              <button
                type="button"
                onClick={async () => {
                  await deleteLetter(item.id);
                  router.refresh();
                }}
                className="rounded-full border border-line px-4 py-2 text-xs uppercase tracking-[0.24em] text-rose-200/80 transition hover:bg-rose-200/10"
                data-cursor="interactive"
              >
                <Trash2 className="mr-2 inline h-3.5 w-3.5" /> Delete
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
