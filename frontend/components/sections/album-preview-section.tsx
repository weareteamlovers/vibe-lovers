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
        title="팀사랑꾼들 정규 1집 demo"
        description="팀사랑꾼들은 10곡 이상의 정규 1집을 목표로 하고 있습니다. 아직 2곡 정도밖에 전체적인 코드 구성을 완성하지 못했고 
                      이마저도 장비가 없는 상황이라 보컬은 이어폰 마이크로 녹음했으며 데모의 데모 수준이지만 앞으로 한 곡 한 곡 쌓여가는 팀사랑꾼들의 첫 앨범을 함께 응원해주세요!"
      />
      <div className="mt-14">
        <AudioPlayer tracks={tracks} />
      </div>
    </SectionShell>
  );
}
