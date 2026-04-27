'use client';

import { FormEvent, useState } from 'react';

import { LoaderCircle, Send } from 'lucide-react';

import { submitLetter } from '@/lib/api';
import { SectionShell } from '@/components/layout/section-shell';
import { AnimatedHeading } from '@/components/ui/animated-heading';
import { SectionBackground } from '@/components/ui/section-background';
import letterBackground from '../../public/media/images/thingcover.jpg';

const LETTER_SECTION_TITLE = `이름 혹은 익명으로
팀사랑꾼들에게 편지를
남길 수 있어요`;

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

  const senderNameInputClassName = form.isAnonymous
    ? 'w-full cursor-not-allowed rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-paper/35 placeholder:text-paper/20 outline-none'
    : 'w-full rounded-2xl border border-line bg-white/[0.03] px-4 py-3 text-sm text-paper placeholder:text-paper/25 focus:border-paper/35 focus:outline-none';

  const handleAnonymousChange = (isAnonymous: boolean) => {
    setForm((prev) => ({
      ...prev,
      isAnonymous,
      senderName: isAnonymous ? '' : prev.senderName
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await submitLetter({
        senderName: form.isAnonymous ? undefined : form.senderName.trim() || undefined,
        title: form.title.trim() || undefined,
        body: form.body,
        isAnonymous: form.isAnonymous,
        website: form.website || undefined
      });

      setSuccess(response.message);
      setForm(initialState);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : '편지를 전송하지 못했습니다.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SectionShell id="letters" className="relative overflow-hidden pt-10 md:pt-16">
      <SectionBackground
        src={letterBackground}
        overlayClassName="bg-black/25"
        quality={100}
      />

      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <AnimatedHeading
          eyebrow="사랑꾼들의 편지함"
          title={LETTER_SECTION_TITLE}
          description="여기에서는 작성만 가능하며, 편지 목록과 내용은 오직 영우만 읽을 수 있습니다."
          titleClassName="-ml-[0.08em]"
        />

        <form onSubmit={handleSubmit} className="editorial-frame rounded-[32px] p-5 md:p-8">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-3">
              <label htmlFor="letter-sender-name" className="block space-y-2">
                <span className="text-xs uppercase tracking-[0.24em] text-paper/45">
                  보내는 이름
                </span>

                <input
                  id="letter-sender-name"
                  value={form.senderName}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, senderName: event.target.value }))
                  }
                  placeholder={form.isAnonymous ? '익명으로 전송됩니다' : '이름 또는 별칭'}
                  disabled={form.isAnonymous}
                  aria-disabled={form.isAnonymous}
                  className={senderNameInputClassName}
                />
              </label>

              <label className="inline-flex items-center gap-3 text-sm text-paper/70">
                <input
                  type="checkbox"
                  checked={form.isAnonymous}
                  onChange={(event) => handleAnonymousChange(event.target.checked)}
                  className="h-4 w-4 rounded border-line bg-transparent"
                />
                익명으로 보내기
              </label>
            </div>

            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.24em] text-paper/45">
                제목
              </span>

              <input
                value={form.title}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, title: event.target.value }))
                }
                placeholder="선택 입력"
                className="w-full rounded-2xl border border-line bg-white/[0.03] px-4 py-3 text-sm text-paper placeholder:text-paper/25 focus:border-paper/35 focus:outline-none"
              />
            </label>
          </div>

          <label className="mt-5 block space-y-2">
            <span className="text-xs uppercase tracking-[0.24em] text-paper/45">
              본문
            </span>

            <textarea
              value={form.body}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, body: event.target.value }))
              }
              placeholder={`어떤 글이든 좋아요. 팀사랑꾼들은 글을 쓰고 건네는 데에 큰 용기가 필요하다는 걸 잘 알고 있어요.
수수한 한마디가 군생활중인 영우에게 큰 힘이 됩니다.`}
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
            onChange={(event) =>
              setForm((prev) => ({ ...prev, website: event.target.value }))
            }
            aria-hidden="true"
          />

          <div className="mt-5">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-line px-6 py-3 text-sm uppercase tracking-[0.28em] text-paper transition hover:bg-white/5 disabled:opacity-60"
              data-cursor="interactive"
            >
              {submitting ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
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