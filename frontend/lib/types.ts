export type MediaType = 'image' | 'video' | 'poster';

export interface ProjectItem {
  id: number | string;
  name: string;
  description: string | null;
  htmlUrl: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  stargazersCount: number;
  updatedAt: string;
}

export interface MediaItem {
  id: string;
  type: MediaType;
  title: string;
  src: string;
  poster?: string | null;
  alt?: string | null;
  caption?: string | null;
  width?: number | null;
  height?: number | null;
  order: number;
}

export interface TrackItem {
  id: string;
  title: string;
  artist: string;
  durationSeconds: number;
  audioUrl: string;
  coverUrl?: string | null;
  order: number;
}

export interface LetterPayload {
  senderName?: string;
  isAnonymous: boolean;
  title?: string;
  body: string;
  website?: string;
}

export interface AdminSession {
  id: string;
  email: string;
}

export interface AdminLetterItem {
  id: string;
  senderName: string | null;
  isAnonymous: boolean;
  title: string | null;
  body: string;
  isRead: boolean;
  createdAt: string;
}
