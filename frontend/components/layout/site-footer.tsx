import Image from 'next/image';

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-line">
      <div className="absolute inset-0">
        <Image
          src="/media/images/banners.avif"
          alt="Footer banner background"
          fill
          priority={false}
          sizes="100vw"
          quality={100}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/45" />
      </div>

      <div className="relative mx-auto flex min-h-[180px] max-w-7xl items-center justify-center px-6 py-10 text-center">
        <div className="space-y-2">
          <p className="text-base font-semibold tracking-[0.18em] text-paper md:text-lg">
            팀사랑꾼들닷컴 © 2026
          </p>
          <p className="text-sm text-paper/85 md:text-base">
            팀사랑꾼들은 한국의 락 밴드이자 AI Engineering Group 입니다.
          </p>
        </div>
      </div>
    </footer>
  );
}