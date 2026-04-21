'use client';

import Image from 'next/image';
import { Pause, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { TrackItem } from '@/lib/types';
import { cn, formatDuration } from '@/lib/utils';

const LYRICS_FONT_STACK =
  "'SF Pro Text', 'SF Pro Display', 'SF Pro KR', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Pretendard', 'Malgun Gothic', sans-serif";

function AutoFitText({
  text,
  className,
  mobileMinPx,
  mobileMaxPx,
  desktopMinPx,
  desktopMaxPx
}: {
  text: string;
  className?: string;
  mobileMinPx: number;
  mobileMaxPx: number;
  desktopMinPx: number;
  desktopMaxPx: number;
}) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLSpanElement | null>(null);
  const [fontSize, setFontSize] = useState(mobileMaxPx);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const textEl = textRef.current;
    if (!wrapper || !textEl) return;

    let frame = 0;

    const fitText = () => {
      const isDesktop = window.matchMedia('(min-width: 768px)').matches;
      const minPx = isDesktop ? desktopMinPx : mobileMinPx;
      const maxPx = isDesktop ? desktopMaxPx : mobileMaxPx;

      const containerWidth = wrapper.clientWidth;
      if (!containerWidth) return;

      let nextSize = maxPx;
      textEl.style.fontSize = `${nextSize}px`;

      while (nextSize > minPx && textEl.scrollWidth > containerWidth) {
        nextSize -= 1;
        textEl.style.fontSize = `${nextSize}px`;
      }

      setFontSize(nextSize);
    };

    const scheduleFit = () => {
      cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(fitText);
    };

    scheduleFit();

    const resizeObserver = new ResizeObserver(() => {
      scheduleFit();
    });

    resizeObserver.observe(wrapper);

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        scheduleFit();
      });
    }

    window.addEventListener('resize', scheduleFit);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener('resize', scheduleFit);
    };
  }, [text, mobileMinPx, mobileMaxPx, desktopMinPx, desktopMaxPx]);

  return (
    <div ref={wrapperRef} className="w-full min-w-0">
      <span
        ref={textRef}
        className={cn('block w-full whitespace-nowrap', className)}
        style={{
          fontSize: `${fontSize}px`,
          lineHeight: 1.05
        }}
        title={text}
      >
        {text}
      </span>
    </div>
  );
}

export function AudioPlayer({ tracks }: { tracks: TrackItem[] }) {
  const [activeTrackId, setActiveTrackId] = useState<string | null>(tracks[0]?.id ?? null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lyricsContainerRef = useRef<HTMLDivElement | null>(null);

  const activeTrack = tracks.find((track) => track.id === activeTrackId) ?? tracks[0] ?? null;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const ratio = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
      setProgress(ratio);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      audio.currentTime = 0;
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !activeTrack) return;

    if (audio.dataset.trackId === activeTrack.id) return;

    audio.src = activeTrack.audioUrl;
    audio.load();
    audio.dataset.trackId = activeTrack.id;
    setProgress(0);
  }, [activeTrack]);

  useEffect(() => {
    const container = lyricsContainerRef.current;
    if (!container) return;

    const frame = window.requestAnimationFrame(() => {
      container.scrollTo({
        top: 0,
        behavior: 'auto'
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [activeTrackId]);

  const handleSelectTrack = async (track: TrackItem) => {
    const audio = audioRef.current;

    setActiveTrackId(track.id);
    setProgress(0);

    if (!audio) {
      setIsPlaying(true);
      return;
    }

    const isDifferentTrack = audio.dataset.trackId !== track.id;

    if (isDifferentTrack) {
      audio.pause();
      audio.src = track.audioUrl;
      audio.load();
      audio.dataset.trackId = track.id;
    }

    try {
      await audio.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio || !activeTrack) return;

    if (audio.dataset.trackId !== activeTrack.id) {
      audio.src = activeTrack.audioUrl;
      audio.load();
      audio.dataset.trackId = activeTrack.id;
      setProgress(0);
    }

    if (!audio.paused) {
      audio.pause();
      return;
    }

    try {
      await audio.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  if (!activeTrack) {
    return (
      <div className="editorial-frame rounded-[32px] p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-paper/45">Preview Tracks</p>
        <p className="mt-4 text-paper/70">등록된 트랙이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr_0.9fr]">
      <div className="editorial-frame rounded-[32px] p-4 md:p-6">
        <div className="grid gap-5">
          <div className="mx-auto w-full max-w-[320px] overflow-hidden rounded-[24px] border border-line bg-white/[0.03]">
            <Image
              src={activeTrack.coverUrl ?? '/covers/cover-01.svg'}
              alt={activeTrack.title}
              width={900}
              height={900}
              className="aspect-square h-full w-full object-cover"
            />
          </div>

          <div className="space-y-6 min-w-0">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.3em] text-paper/42">Now listening</p>

              <div className="mt-3 w-full min-w-0">
                <AutoFitText
                  text={activeTrack.title}
                  className="font-semibold tracking-tight text-paper"
                  mobileMinPx={22}
                  mobileMaxPx={30}
                  desktopMinPx={28}
                  desktopMaxPx={48}
                />
              </div>

              <p className="mt-2 text-sm text-paper/58 md:text-base">{activeTrack.artist}</p>
            </div>

            <div className="space-y-3">
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-paper transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs uppercase tracking-[0.22em] text-paper/45">
                <span>{isPlaying ? 'Playing' : 'Paused'}</span>
                <span>{formatDuration(activeTrack.durationSeconds)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => void togglePlay()}
              className="inline-flex items-center gap-3 rounded-full border border-line px-5 py-3 text-sm uppercase tracking-[0.28em] text-paper transition hover:bg-white/5"
              data-cursor="interactive"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isPlaying ? 'Pause' : 'Play'}
            </button>
          </div>
        </div>
      </div>

      <div className="editorial-frame rounded-[32px] p-4 md:p-6">
        <div className="mb-5 flex items-center justify-between border-b border-line pb-4">
          <p className="text-sm uppercase tracking-[0.25em] text-paper/45">Preview Tracks</p>
          <span className="text-xs uppercase tracking-[0.25em] text-paper/35">
            {tracks.length} pieces
          </span>
        </div>

        <div className="space-y-2">
          {tracks.map((track, index) => {
            const active = track.id === activeTrackId;

            return (
              <button
                key={track.id}
                type="button"
                onClick={() => void handleSelectTrack(track)}
                className={cn(
                  'flex w-full items-center justify-between gap-4 rounded-[22px] border border-transparent px-4 py-4 text-left transition',
                  active ? 'border-line bg-white/[0.06]' : 'hover:border-line hover:bg-white/[0.03]'
                )}
                data-cursor="interactive"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <span className="shrink-0 text-xs uppercase tracking-[0.22em] text-paper/35">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <div className="min-w-0">
                    <AutoFitText
                      text={track.title}
                      className="font-medium text-paper"
                      mobileMinPx={12}
                      mobileMaxPx={16}
                      desktopMinPx={12}
                      desktopMaxPx={16}
                    />
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-paper/40">
                      {track.artist}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-4">
                  {active ? <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-paper" /> : null}
                  <span className="text-xs uppercase tracking-[0.2em] text-paper/45">
                    {formatDuration(track.durationSeconds)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="editorial-frame rounded-[32px] p-4 md:p-6">
        <div className="mb-5 border-b border-line pb-4">
          <p className="text-sm uppercase tracking-[0.25em] text-paper/45">Lyrics</p>
          <h4
            className="mt-3 text-xl font-semibold tracking-tight text-paper md:text-2xl"
            style={{ fontFamily: LYRICS_FONT_STACK }}
          >
            {activeTrack.title}
          </h4>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-paper/40">
            {activeTrack.artist}
          </p>
        </div>

        <div ref={lyricsContainerRef} className="max-h-[460px] overflow-y-auto pr-2">
          <div
            className="whitespace-pre-line text-[1.08rem] font-medium leading-[2.0] tracking-[-0.01em] text-paper/90 md:text-[1.24rem] md:leading-[2.08]"
            style={{ fontFamily: LYRICS_FONT_STACK }}
          >
            {activeTrack.lyrics?.trim()
              ? activeTrack.lyrics
              : '아직 등록된 가사가 없습니다.\ntracks 데이터에 lyrics 필드를 추가해 주세요.'}
          </div>
        </div>
      </div>

      <audio ref={audioRef} preload="metadata" />
    </div>
  );
}