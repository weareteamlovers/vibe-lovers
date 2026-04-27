import Image from 'next/image';

import { SectionShell } from '@/components/layout/section-shell';
import { AudioPlayer } from '@/components/audio/audio-player';
import { AnimatedHeading } from '@/components/ui/animated-heading';
import { TrackItem } from '@/lib/types';

// 배경 모드:
// - 'color' : 단색 배경 사용
// - 'photo' : 모바일/PC에서 서로 다른 배경 사진 사용
const BACKGROUND_MODE: 'color' | 'photo' = 'color';

const ALBUM_BACKGROUND_COLOR = '#67161C';

// photo 모드일 때 사용할 파일 경로
// public/media/images 폴더에 넣어두면 됩니다.
const ALBUM_BACKGROUND_MOBILE = '/media/images/album-mobile.jpg';
const ALBUM_BACKGROUND_DESKTOP = '/media/images/album-desktop.jpg';

const ALBUM_DESCRIPTION = `팀사랑꾼들은 10곡 이상의 정규 1집을 목표로 하고 있습니다.

2025년 겨울, 입대를 한 달 앞두고 음악을 시작했습니다. 음악을 전공한 사람이 아니다 보니 아직은 서툴고, 악기 소리도 투박한 데모입니다. 그럼에도 건반과 이어폰 마이크만으로 한 달 동안 즐겁게 작업했던 곡들을 이곳에 공유합니다.

이어폰을 착용하고 들어주세요. 그리고 앞으로 한 곡 한 곡 쌓여갈 팀사랑꾼들의 첫 번째 앨범을 함께 응원해 주세요!

아래로 내리면 가사가 있어요.
〈우리집 사랑 노래〉는 노이즈가 크니 볼륨을 조금 낮추어 들어주세요.`;

export function AlbumPreviewSection({ tracks }: { tracks: TrackItem[] }) {
  return (
    <SectionShell id="album-preview" className="relative overflow-hidden pt-10 md:pt-16">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        {BACKGROUND_MODE === 'photo' ? (
          <>
            <div className="absolute inset-0 md:hidden">
              <Image
                src={ALBUM_BACKGROUND_MOBILE}
                alt=""
                fill
                priority
                sizes="100vw"
                quality={100}
                className="object-cover object-center"
              />
            </div>

            <div className="absolute inset-0 hidden md:block">
              <Image
                src={ALBUM_BACKGROUND_DESKTOP}
                alt=""
                fill
                priority
                sizes="100vw"
                quality={100}
                className="object-cover object-center"
              />
            </div>

            <div className="absolute inset-0 bg-black/25" />
          </>
        ) : (
          <div
            className="absolute inset-0"
            style={{ backgroundColor: ALBUM_BACKGROUND_COLOR }}
          />
        )}
      </div>

      <AnimatedHeading
        eyebrow="Album Preview"
        title="팀사랑꾼들 정규 1집 demo"
        description={ALBUM_DESCRIPTION}
        singleLineTitle
        titleClassName="-ml-[0.08em]"
        descriptionClassName="max-w-4xl whitespace-pre-line break-words"
      />

      <div className="mt-14">
        <AudioPlayer tracks={tracks} />
      </div>
    </SectionShell>
  );
}