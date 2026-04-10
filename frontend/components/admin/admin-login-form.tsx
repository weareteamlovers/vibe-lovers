'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoaderCircle, LockKeyhole } from 'lucide-react';
import { adminLogin } from '@/lib/api';

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await adminLogin(email, password);
      router.push('/admin/letters');
      router.refresh();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : '로그인에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="editorial-frame mx-auto w-full max-w-xl rounded-[32px] p-6 md:p-8">
      <div className="mb-8 space-y-3 text-center">
        <p className="text-xs uppercase tracking-[0.32em] text-paper/40">Admin Access</p>
        <h1 className="text-3xl font-semibold tracking-tight text-paper md:text-4xl">편지 인박스 로그인</h1>
      </div>
      <div className="space-y-5">
        <label className="block space-y-2">
          <span className="text-xs uppercase tracking-[0.24em] text-paper/45">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="w-full rounded-2xl border border-line bg-white/[0.03] px-4 py-3 text-sm text-paper focus:border-paper/35 focus:outline-none"
          />
        </label>
        <label className="block space-y-2">
          <span className="text-xs uppercase tracking-[0.24em] text-paper/45">Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="w-full rounded-2xl border border-line bg-white/[0.03] px-4 py-3 text-sm text-paper focus:border-paper/35 focus:outline-none"
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-full border border-line px-6 py-3 text-sm uppercase tracking-[0.28em] text-paper transition hover:bg-white/5 disabled:opacity-60"
        data-cursor="interactive"
      >
        {submitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <LockKeyhole className="h-4 w-4" />}
        로그인
      </button>
      {error ? <p className="mt-4 text-sm text-rose-300/90">{error}</p> : null}
    </form>
  );
}
