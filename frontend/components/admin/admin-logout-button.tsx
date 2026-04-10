'use client';

import { useRouter } from 'next/navigation';
import { adminLogout } from '@/lib/api';

export function AdminLogoutButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={async () => {
        await adminLogout();
        router.push('/admin/login');
        router.refresh();
      }}
      className="rounded-full border border-line px-4 py-2 text-xs uppercase tracking-[0.24em] text-paper/65 transition hover:bg-white/5"
      data-cursor="interactive"
    >
      Logout
    </button>
  );
}
