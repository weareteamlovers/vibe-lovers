import {
  AdminLetterItem,
  AdminSession,
  LetterPayload,
  MediaItem,
  ProjectItem,
  TrackItem
} from '@/lib/types';
import { fallbackMedia, fallbackProjects, fallbackTracks } from '@/content/site';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api';

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {})
    },
    cache: 'no-store'
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function getProjects() {
  try {
    return await fetchJson<ProjectItem[]>('/projects');
  } catch {
    return fallbackProjects;
  }
}

export async function getMedia() {
  try {
    return await fetchJson<MediaItem[]>('/media');
  } catch {
    return fallbackMedia;
  }
}

export async function getTracks() {
  try {
    return await fetchJson<TrackItem[]>('/tracks');
  } catch {
    return fallbackTracks;
  }
}

export async function submitLetter(payload: LetterPayload) {
  return fetchJson<{ success: boolean; message: string }>('/letters', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function adminLogin(email: string, password: string) {
  return fetchJson<{ success: boolean; admin: AdminSession }>('/admin/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

export async function adminLogout() {
  return fetchJson<{ success: boolean }>('/admin/auth/logout', {
    method: 'POST'
  });
}

export async function getAdminMe() {
  return fetchJson<AdminSession>('/admin/me');
}

export async function getAdminLetters() {
  return fetchJson<{
    items: AdminLetterItem[];
    page: number;
    pageSize: number;
    total: number;
  }>('/admin/letters');
}

export async function getAdminLetter(id: string) {
  return fetchJson<AdminLetterItem>(`/admin/letters/${id}`);
}

export async function markLetterRead(id: string) {
  return fetchJson<{ success: boolean }>(`/admin/letters/${id}/read`, {
    method: 'PATCH'
  });
}

export async function deleteLetter(id: string) {
  return fetchJson<{ success: boolean }>(`/admin/letters/${id}`, {
    method: 'DELETE'
  });
}
