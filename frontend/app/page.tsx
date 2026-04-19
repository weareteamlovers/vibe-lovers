import { HeroSection } from '@/components/sections/hero-section';
import { FullVideoSection } from '@/components/sections/full-video-section';
import { ProjectsSection } from '@/components/sections/projects-section';
import { AlbumPreviewSection } from '@/components/sections/album-preview-section';
import { LetterSection } from '@/components/sections/letter-section';
import { ContactSection } from '@/components/sections/contact-section';
import { SiteFooter } from '@/components/layout/site-footer';

import { getMedia, getProjects, getTracks } from '@/lib/api';

export default async function HomePage() {
  const [media, projects, tracks] = await Promise.all([
    getMedia(),
    getProjects(),
    getTracks()
  ]);

  return (
    <main className="overflow-x-hidden">
      <HeroSection />

      <FullVideoSection items={media} />

      <ProjectsSection items={projects} />

      <AlbumPreviewSection tracks={tracks} />

      <LetterSection />

      <ContactSection />

      <SiteFooter />
    </main>
  );
}

export const revalidate = 3600;