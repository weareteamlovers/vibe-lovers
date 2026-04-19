import Image from 'next/image';

import { SectionShell } from '@/components/layout/section-shell';
import { AudioPlayer } from '@/components/audio/audio-player';
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

export function AlbumPreviewSection({ tracks }: { tracks: TrackItem[] }) {
  return (
    <SectionShell id="exhibition" className="relative overflow-hidden pt-10 md:pt-16">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        {BACKGROUND_MODE === 'photo' ? (
          <>
            {/* Mobile background */}
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

            {/* Desktop background */}
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

      <div className="flex flex-col gap-4">
        <p className="break-keep text-xs uppercase tracking-[0.35em] text-paper/50">
          Album Preview
        </p>

        <h2 className="max-w-5xl break-keep text-3xl font-semibold leading-[1.08] tracking-tight text-paper sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
          팀사랑꾼들 정규 1집 demo
        </h2>

        <p className="w-full max-w-4xl whitespace-normal break-words text-sm leading-relaxed text-paper/65 md:text-base">
          팀사랑꾼들은 10곡 이상의 정규 1집을 목표로 하고 있습니다. 2025년 겨울, 입대를 한 달 앞두고 음악을 시작했습니다. 음악을 전공한 사람이 아니다보니 아직 2곡 정도밖에 전체적인 코드 구성을 완성하지 못했고 이마저도 데모의 데모 수준입니다. 그럼에도 건반과 이어폰 마이크만으로 입대 전 한 달간 즐겁게 작업한 데모를 공유합니다. 앞으로 한 곡 한 곡 쌓여가는 팀사랑꾼들의 첫 앨범을 함께 응원해주세요!
        </p>
      </div>

      <div className="mt-14">
        <AudioPlayer tracks={tracks} />
      </div>
    </SectionShell>
  );
}