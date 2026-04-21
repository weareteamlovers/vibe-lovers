import Image from 'next/image';

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-line">
      <div className="absolute inset-0">
        <Image
          src="/media/images/banners.avif"
          alt="Footer banner background"
          fill
          sizes="100vw"
          quality={100}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative w-full px-4 py-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="flex w-full items-center justify-between gap-4">
          <p className="shrink-0 text-left text-[11px] font-semibold tracking-[0.12em] text-paper sm:text-sm md:text-base">
            팀사랑꾼들닷컴 © 2026
          </p>

          <p className="min-w-0 text-right text-[10px] leading-relaxed text-paper/85 sm:text-xs md:text-sm">
            <span>팀사랑꾼들은 한국의 락 밴드이자</span>
            <br className="sm:hidden" />
            <span className="whitespace-nowrap sm:whitespace-normal">
              {' '}AI Engineering Group 입니다.
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}