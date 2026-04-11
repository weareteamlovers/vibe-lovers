'use client';

import Image from 'next/image';
import { Pause, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { TrackItem } from '@/lib/types';
import { cn, formatDuration } from '@/lib/utils';

export function AudioPlayer({ tracks }: { tracks: TrackItem[] }) {
  const [activeTrackId, setActiveTrackId] = useState<string | null>(tracks[0]?.id ?? null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const activeTrack = tracks.find((track) => track.id === activeTrackId) ?? tracks[0];

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
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !activeTrack) return;

    audio.src = activeTrack.audioUrl;
    audio.load();

    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    }
  }, [activeTrack, isPlaying]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    await audio.play();
    setIsPlaying(true);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr_0.9fr]">
      <div className="editorial-frame rounded-[32px] p-4 md:p-6">
        <div className="grid gap-5 md:grid-cols-[220px_1fr] md:items-center">
          <div className="overflow-hidden rounded-[24px] border border-line bg-white/[0.03]">
            <Image
              src={activeTrack.coverUrl ?? '/covers/cover-01.svg'}
              alt={activeTrack.title}
              width={900}
              height={900}
              className="aspect-square h-full w-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-paper/42">Now listening</p>
              <h3 className="mt-3 text-3xl font-semibold tracking-tight text-paper md:text-5xl">
                {activeTrack.title}
              </h3>
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
              onClick={togglePlay}
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
                onClick={() => {
                  setActiveTrackId(track.id);
                  setIsPlaying(true);
                }}
                className={cn(
                  'flex w-full items-center justify-between rounded-[22px] border border-transparent px-4 py-4 text-left transition',
                  active ? 'border-line bg-white/[0.06]' : 'hover:border-line hover:bg-white/[0.03]'
                )}
                data-cursor="interactive"
              >
                <div className="flex items-center gap-4">
                  <span className="text-xs uppercase tracking-[0.22em] text-paper/35">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="text-base font-medium text-paper">{track.title}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-paper/40">{track.artist}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
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
          <h4 className="mt-3 text-xl font-medium text-paper md:text-2xl">{activeTrack.title}</h4>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-paper/40">{activeTrack.artist}</p>
        </div>

        <div className="max-h-[460px] overflow-y-auto pr-2">
          <div className="whitespace-pre-line text-sm leading-8 text-paper/78 md:text-base">
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