import {
  AdminLetterItem,
  AdminSession,
  LetterPayload,
  MediaItem,
  ProjectItem,
  TrackItem
} from '@/lib/types';
import { fallbackMedia, fallbackProjects, fallbackTracks } from '@/content/site';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api';

async function fetchPublicJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json'
    },
    next: { revalidate: 3600 }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

async function fetchPrivateJson<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
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

export async function getProjects(): Promise<ProjectItem[]> {
  try {
    return await fetchPublicJson<ProjectItem[]>('/projects');
  } catch {
    return fallbackProjects;
  }
}

export async function getMedia(): Promise<MediaItem[]> {
  try {
    return await fetchPublicJson<MediaItem[]>('/media');
  } catch {
    return fallbackMedia;
  }
}

export async function getTracks(): Promise<TrackItem[]> {
  try {
    return await fetchPublicJson<TrackItem[]>('/tracks');
  } catch {
    return fallbackTracks;
  }
}

export async function submitLetter(
  payload: LetterPayload
): Promise<{ success: boolean; message: string }> {
  return fetchPrivateJson<{ success: boolean; message: string }>('/letters', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function adminLogin(
  email: string,
  password: string
): Promise<{ success: boolean; admin: AdminSession }> {
  return fetchPrivateJson<{ success: boolean; admin: AdminSession }>(
    '/admin/auth/login',
    {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }
  );
}

export async function adminLogout(): Promise<{ success: boolean }> {
  return fetchPrivateJson<{ success: boolean }>('/admin/auth/logout', {
    method: 'POST'
  });
}

export async function getAdminMe(): Promise<AdminSession> {
  return fetchPrivateJson<AdminSession>('/admin/me');
}

export async function getAdminLetters(): Promise<{
  items: AdminLetterItem[];
  page: number;
  pageSize: number;
  total: number;
}> {
  return fetchPrivateJson<{
    items: AdminLetterItem[];
    page: number;
    pageSize: number;
    total: number;
  }>('/admin/letters');
}

export async function getAdminLetter(id: string): Promise<AdminLetterItem> {
  return fetchPrivateJson<AdminLetterItem>(`/admin/letters/${id}`);
}

export async function markLetterRead(
  id: string
): Promise<{ success: boolean }> {
  return fetchPrivateJson<{ success: boolean }>(
    `/admin/letters/${id}/read`,
    {
      method: 'PATCH'
    }
  );
}

export async function deleteLetter(id: string): Promise<{ success: boolean }> {
  return fetchPrivateJson<{ success: boolean }>(`/admin/letters/${id}`, {
    method: 'DELETE'
  });
}