import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { contactLinks } from '@/content/site';
import { SectionShell } from '@/components/layout/section-shell';
import { AnimatedHeading } from '@/components/ui/animated-heading';

export function ContactSection() {
  return (
    <SectionShell id="contact" className="pb-28">
      <AnimatedHeading
        eyebrow="Contact"
        title="작업, 공연, 기술 협업, 글과 기록을 이어주는 외부 채널"
        description="모든 링크는 새 탭에서 열리며, 전시형 톤을 유지하도록 리스트 대신 에디토리얼 패널로 배치했습니다."
      />

      <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        {contactLinks.map((link, index) => (
          <Link
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="group editorial-frame flex min-h-[180px] flex-col justify-between rounded-[30px] p-6 transition hover:-translate-y-1 hover:bg-white/[0.04]"
            data-cursor="interactive"
          >
            <div>
              <p className="text-[11px] uppercase tracking-[0.32em] text-paper/38">0{index + 1}</p>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight text-paper">{link.label}</h3>
            </div>
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-paper/48">
              <span>Open channel</span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </div>
    </SectionShell>
  );
}
