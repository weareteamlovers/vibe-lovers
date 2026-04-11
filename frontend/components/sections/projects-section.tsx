'use client';

import Link from 'next/link';
import { ArrowUpRight, Star } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { ProjectItem } from '@/lib/types';
import { SectionShell } from '@/components/layout/section-shell';
import { AnimatedHeading } from '@/components/ui/animated-heading';
import { formatDate } from '@/lib/utils';
import Image from 'next/image';

export function ProjectsSection({ items }: { items: ProjectItem[] }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <SectionShell id="exhibition" className="relative overflow-hidden pt-10 md:pt-16">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/media/images/thir.jpg"
          alt="Exhibition background"
          fill
          className="object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-black/15" />
      </div>

      <AnimatedHeading
        eyebrow="사랑꾼들의 작업실"
        title="we are teamlovers !"
        description="팀사랑꾼들이 AI 엔지니어로서 작업중인 프로젝트들입니다."
      />

      <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-6 auto-rows-[minmax(220px,auto)]">
        {items.map((project, index) => {
          const spanClass = index % 3 === 0 ? 'md:col-span-3 md:row-span-2' : index % 3 === 1 ? 'md:col-span-3' : 'md:col-span-2';

          return (
            <motion.article
              key={project.id}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 34, filter: 'blur(10px)' }}
              whileInView={
                prefersReducedMotion
                  ? undefined
                  : { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, delay: index * 0.08 } }
              }
              viewport={{ once: true, margin: '-10% 0px' }}
              whileHover={prefersReducedMotion ? undefined : { y: -8 }}
              className={`group editorial-frame relative flex min-h-[240px] flex-col justify-between rounded-[30px] p-6 ${spanClass}`}
              data-cursor="interactive"
            >
              <div className="absolute inset-0 rounded-[30px] bg-gradient-to-br from-white/[0.08] to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.3em] text-paper/40">Repository</p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight text-paper md:text-3xl">{project.name}</h3>
                </div>
                <Link
                  href={project.htmlUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-line p-3 text-paper/70 transition hover:text-paper"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="relative mt-8 space-y-5">
                <p className="max-w-2xl text-sm leading-relaxed text-paper/68 md:text-base">
                  {project.description ?? '설명이 비어 있는 저장소입니다.'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {(project.topics?.length ? project.topics : [project.language ?? 'Code']).slice(0, 5).map((topic) => (
                    <span
                      key={topic}
                      className="rounded-full border border-line px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-paper/48"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5 text-xs uppercase tracking-[0.24em] text-paper/45">
                <span>{project.language ?? 'Mixed stack'}</span>
                <span className="inline-flex items-center gap-2">
                  <Star className="h-3.5 w-3.5" /> {project.stargazersCount}
                </span>
                <span>{formatDate(project.updatedAt)}</span>
              </div>
            </motion.article>
          );
        })}
      </div>
    </SectionShell>
  );
}
