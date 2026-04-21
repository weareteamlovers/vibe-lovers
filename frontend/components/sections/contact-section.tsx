import Image from 'next/image';
import Link from 'next/link';

import { ArrowUpRight } from 'lucide-react';

import { contactLinks } from '@/content/site';
import { SectionShell } from '@/components/layout/section-shell';
import { AnimatedHeading } from '@/components/ui/animated-heading';

export function ContactSection() {
  return (
    <SectionShell id="exhibition" className="relative overflow-hidden pt-10 md:pt-16">
      <div className="absolute inset-0 -z-10">
        {/* Mobile background */}
        <div className="absolute inset-0 md:hidden">
          <Image
            src="/media/images/album_mob.jpg"
            alt="Contact background mobile"
            fill
            priority
            sizes="100vw"
            quality={100}
            className="object-cover opacity-100"
          />
        </div>

        {/* Desktop background */}
        <div className="absolute inset-0 hidden md:block">
          <Image
            src="/media/images/album_pc.jpg"
            alt="Contact background desktop"
            fill
            priority
            sizes="100vw"
            quality={100}
            className="object-cover opacity-100"
          />
        </div>

        <div className="absolute inset-0 bg-black/25" />
      </div>

      <AnimatedHeading
        eyebrow="사랑꾼들의 연락처"
        title={`나는 너랑 우리라는 단어만 쓸 수 있으면
충분하니 내 곁에 함께해줘`}
        description="팀사랑꾼들이 운영하는 채널들입니다."
        useDefaultTitleSizing={false}
        titleClassName="max-w-none text-[1.25rem] leading-[0.96] tracking-[-0.045em] sm:text-[1.8rem] md:text-[2.4rem] lg:text-[3rem] xl:text-[3.8rem]"
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
              <p className="text-[11px] uppercase tracking-[0.32em] text-paper/38">
                0{index + 1}
              </p>

              <h3 className="mt-4 text-2xl font-semibold tracking-tight text-paper">
                {link.label}
              </h3>
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