'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getAdminLetters } from '@/lib/api';
import { AdminLetterItem } from '@/lib/types';
import { AdminLetterList } from '@/components/admin/admin-letter-list';
import { AdminLogoutButton } from '@/components/admin/admin-logout-button';

export function AdminLettersPageClient() {
  const [items, setItems] = useState<AdminLetterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAdminLetters()
      .then((data) => {
        setItems(data.items);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : '관리자 인증이 필요합니다.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen px-5 py-10 md:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-paper/40">Admin Inbox</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-paper">수신된 편지함</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-full border border-line px-4 py-2 text-xs uppercase tracking-[0.24em] text-paper/65 transition hover:bg-white/5"
            >
              Home
            </Link>
            <AdminLogoutButton />
          </div>
        </div>

        {loading ? (
          <div className="editorial-frame rounded-[28px] p-6 text-paper/65">불러오는 중...</div>
        ) : error ? (
          <div className="editorial-frame rounded-[28px] p-6 text-paper/65">{error}</div>
        ) : items.length === 0 ? (
          <div className="editorial-frame rounded-[28px] p-6 text-paper/65">아직 수신된 편지가 없습니다.</div>
        ) : (
          <AdminLetterList items={items} />
        )}
      </div>
    </main>
  );
}
