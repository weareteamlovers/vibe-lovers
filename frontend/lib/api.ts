import {
  AdminLetterItem,
  AdminSession,
  LetterPayload,
  MediaItem,
  ProjectItem,
  TrackItem,
} from '@/lib/types';
import { fallbackMedia, fallbackProjects, fallbackTracks } from '@/content/site';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api';

const ADMIN_TOKEN_STORAGE_KEY = 'teamlovers_admin_token';

type AdminLoginResponse = {
  success: boolean;
  admin: AdminSession;
  token?: string;
};

function getStoredAdminToken() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);
}

function setStoredAdminToken(token: string) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, token);
}

function clearStoredAdminToken() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
}

async function fetchPublicJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    next: {
      revalidate: 3600,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

async function fetchPrivateJson<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const token = getStoredAdminToken();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorText = await response.text();
    let message = errorText || `Request failed: ${response.status}`;

    try {
      const parsed = JSON.parse(errorText) as { message?: string };
      message = parsed.message || message;
    } catch {
      // keep original message
    }

    throw new Error(message);
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
  payload: LetterPayload,
): Promise<{ success: boolean; message: string }> {
  return fetchPrivateJson<{ success: boolean; message: string }>('/letters', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function adminLogin(
  email: string,
  password: string,
): Promise<{ success: boolean; admin: AdminSession }> {
  const result = await fetchPrivateJson<AdminLoginResponse>(
    '/admin/auth/login',
    {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    },
  );

  if (result.token) {
    setStoredAdminToken(result.token);
  }

  return {
    success: result.success,
    admin: result.admin,
  };
}

export async function adminLogout(): Promise<{ success: boolean }> {
  try {
    return await fetchPrivateJson<{ success: boolean }>('/admin/auth/logout', {
      method: 'POST',
    });
  } finally {
    clearStoredAdminToken();
  }
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
  id: string,
): Promise<{ success: boolean }> {
  return fetchPrivateJson<{ success: boolean }>(`/admin/letters/${id}/read`, {
    method: 'PATCH',
  });
}

export async function deleteLetter(id: string): Promise<{ success: boolean }> {
  return fetchPrivateJson<{ success: boolean }>(`/admin/letters/${id}`, {
    method: 'DELETE',
  });
}