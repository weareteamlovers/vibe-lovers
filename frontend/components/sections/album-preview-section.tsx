import Image from 'next/image';

import { SectionShell } from '@/components/layout/section-shell';
import { AnimatedHeading } from '@/components/ui/animated-heading';
import { TrackItem } from '@/lib/types';
import { AudioPlayer } from '@/components/audio/audio-player';

export function AlbumPreviewSection({ tracks }: { tracks: TrackItem[] }) {
  return (
    <SectionShell id="exhibition" className="relative overflow-hidden pt-10 md:pt-16">
      <div className="absolute inset-0 -z-10">
        {/* Mobile background */}
        <div className="absolute inset-0 md:hidden">
          <Image
            src="/media/images/album_mob.jpg"
            alt="Album preview mobile background"
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
            alt="Album preview desktop background"
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
        eyebrow="Album Preview"
        title="팀사랑꾼들 정규 1집 demo"
        description={`팀사랑꾼들은 10곡 이상의 정규 1집을 목표로 하고 있습니다. 2025년 겨울, 입대를 한 달 앞두고 음악을 시작했습니다.

음악을 전공한 사람이 아니다보니 아직 2곡 정도밖에 전체적인 코드 구성을 완성하지 못했고
이마저도 데모의 데모 수준입니다. 그럼에도 건반과 이어폰 마이크만으로 입대 전 한 달간 즐겁게 작업한 데모를 공유합니다.

앞으로 한 곡 한 곡 쌓여가는 팀사랑꾼들의 첫 앨범을 함께 응원해주세요!`}
      />

      <div className="mt-14">
        <AudioPlayer tracks={tracks} />
      </div>
    </SectionShell>
  );
}