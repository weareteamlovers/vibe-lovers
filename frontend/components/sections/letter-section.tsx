'use client';

import { FormEvent, useState } from 'react';
import { LoaderCircle, Send } from 'lucide-react';
import { submitLetter } from '@/lib/api';
import { SectionShell } from '@/components/layout/section-shell';
import { AnimatedHeading } from '@/components/ui/animated-heading';
import Image from 'next/image';

const initialState = {
  senderName: '',
  title: '',
  body: '',
  isAnonymous: false,
  website: ''
};

export function LetterSection() {
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await submitLetter({
        senderName: form.senderName || undefined,
        title: form.title || undefined,
        body: form.body,
        isAnonymous: form.isAnonymous,
        website: form.website || undefined
      });
      setSuccess(response.message);
      setForm(initialState);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : '편지를 전송하지 못했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SectionShell id="exhibition" className="relative overflow-hidden pt-10 md:pt-16">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/media/images/thing.jpg"
          alt="Exhibition background"
          fill
          className="object-cover opacity-100"
        />
        <div className="absolute inset-0 bg-black/25" />
      </div>


      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <AnimatedHeading
          eyebrow="Letter Room"
          title="익명으로도, 이름을 적어서도 팀사랑꾼들에게 편지를 남길 수 있습니다"
          description="공개 페이지에서는 작성만 가능하며, 수신된 편지는 관리자 인박스에서만 읽을 수 있습니다. 기본 레이트 리미팅과 스팸 방지용 허니팟도 포함했습니다."
        />

        <form onSubmit={handleSubmit} className="editorial-frame rounded-[32px] p-5 md:p-8">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.24em] text-paper/45">보내는 이름</span>
              <input
                value={form.senderName}
                onChange={(event) => setForm((prev) => ({ ...prev, senderName: event.target.value }))}
                placeholder="이름 또는 별칭"
                className="w-full rounded-2xl border border-line bg-white/[0.03] px-4 py-3 text-sm text-paper placeholder:text-paper/25 focus:border-paper/35 focus:outline-none"
              />
            </label>
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.24em] text-paper/45">제목</span>
              <input
                value={form.title}
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                placeholder="선택 입력"
                className="w-full rounded-2xl border border-line bg-white/[0.03] px-4 py-3 text-sm text-paper placeholder:text-paper/25 focus:border-paper/35 focus:outline-none"
              />
            </label>
          </div>

          <label className="mt-5 block space-y-2">
            <span className="text-xs uppercase tracking-[0.24em] text-paper/45">본문</span>
            <textarea
              value={form.body}
              onChange={(event) => setForm((prev) => ({ ...prev, body: event.target.value }))}
              placeholder="당신의 마음과 이야기를 적어 주세요."
              rows={8}
              required
              className="w-full rounded-[26px] border border-line bg-white/[0.03] px-4 py-4 text-sm leading-relaxed text-paper placeholder:text-paper/25 focus:border-paper/35 focus:outline-none"
            />
          </label>

          <input
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            value={form.website}
            onChange={(event) => setForm((prev) => ({ ...prev, website: event.target.value }))}
            aria-hidden="true"
          />

          <div className="mt-5 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <label className="inline-flex items-center gap-3 text-sm text-paper/70">
              <input
                type="checkbox"
                checked={form.isAnonymous}
                onChange={(event) => setForm((prev) => ({ ...prev, isAnonymous: event.target.checked }))}
                className="h-4 w-4 rounded border-line bg-transparent"
              />
              익명으로 보내기
            </label>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-3 rounded-full border border-line px-6 py-3 text-sm uppercase tracking-[0.28em] text-paper transition hover:bg-white/5 disabled:opacity-60"
              data-cursor="interactive"
            >
              {submitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              보내기
            </button>
          </div>

          {success ? <p className="mt-5 text-sm text-emerald-300/90">{success}</p> : null}
          {error ? <p className="mt-5 text-sm text-rose-300/90">{error}</p> : null}
        </form>
      </div>
    </SectionShell>
  );
}
