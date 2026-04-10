import Image from 'next/image';
import { SectionShell } from '@/components/layout/section-shell';
import { AnimatedHeading } from '@/components/ui/animated-heading';
import { TrackItem } from '@/lib/types';
import { AudioPlayer } from '@/components/audio/audio-player';

export function AlbumPreviewSection({ tracks }: { tracks: TrackItem[] }) {
  return (
    <SectionShell id="exhibition" className="relative overflow-hidden pt-10 md:pt-16">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/media/images/lambs.jpg"
          alt="Exhibition background"
          fill
          className="object-cover opacity-100"
        />
        <div className="absolute inset-0 bg-black/25" />
      </div>

      
      <AnimatedHeading
        eyebrow="Album Preview"
        title="팀사랑꾼들 정규 1집 맛보기 공간"
        description="트랙을 한 곡씩 재생하며 분위기를 미리 감상할 수 있는 리스닝 룸입니다. 나중에 MP3와 커버 이미지만 바꾸면 바로 실사용 가능합니다."
      />
      <div className="mt-14">
        <AudioPlayer tracks={tracks} />
      </div>
    </SectionShell>
  );
}
