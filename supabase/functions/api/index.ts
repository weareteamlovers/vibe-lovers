import { createClient } from 'supabase-js';

type LetterPayload = {
  senderName?: unknown;
  isAnonymous?: unknown;
  title?: unknown;
  body?: unknown;
  website?: unknown;
};

type LoginPayload = {
  email?: unknown;
  password?: unknown;
};

type GithubRepositoryResponse = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  stargazers_count: number;
  updated_at: string;
};

type JwtPayload = {
  sub: string;
  email: string;
  exp: number;
  iat: number;
};

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

function getAllowedOrigins() {
  const primary = Deno.env.get('FRONTEND_ORIGIN') ?? 'https://www.weareteamlovers.com';
  const extra = Deno.env.get('CORS_ALLOWED_ORIGINS') ?? '';

  return [primary, ...extra.split(',').map((origin) => origin.trim()).filter(Boolean)];
}

function getAllowedOrigin(req: Request) {
  const requestOrigin = req.headers.get('origin') ?? '';
  const allowedOrigins = getAllowedOrigins();

  if (allowedOrigins.includes(requestOrigin)) {
    return requestOrigin;
  }

  return allowedOrigins[0] ?? 'https://www.weareteamlovers.com';
}

function corsHeaders(req: Request) {
  return {
    'Access-Control-Allow-Origin': getAllowedOrigin(req),
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    Vary: 'Origin',
  };
}

function json(req: Request, body: unknown, status = 200, extraHeaders: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders(req),
      ...extraHeaders,
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}

function getRoute(req: Request) {
  const pathname = new URL(req.url).pathname;

  return (
    pathname
      .replace(/^\/functions\/v1\/api/, '')
      .replace(/^\/api/, '')
      .replace(/\/$/, '') || '/'
  );
}

function normalizeString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const hashBuffer = await crypto.subtle.digest('SHA-256', bytes);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function getClientIp(req: Request) {
  const forwardedFor = req.headers.get('x-forwarded-for');
  const cfConnectingIp = req.headers.get('cf-connecting-ip');
  const realIp = req.headers.get('x-real-ip');

  return (
    forwardedFor?.split(',')[0]?.trim() ||
    cfConnectingIp?.trim() ||
    realIp?.trim() ||
    'unknown'
  );
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function formatKoreanDate(date: Date) {
  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);
}

function parseCookieHeader(cookieHeader: string | null) {
  const cookies: Record<string, string> = {};

  if (!cookieHeader) return cookies;

  for (const part of cookieHeader.split(';')) {
    const [rawKey, ...rawValue] = part.trim().split('=');
    if (!rawKey) continue;

    cookies[rawKey] = decodeURIComponent(rawValue.join('=') ?? '');
  }

  return cookies;
}

function getAdminCookieName() {
  return Deno.env.get('ADMIN_COOKIE_NAME') ?? 'teamlovers_admin';
}

function getTokenFromRequest(req: Request) {
  const authorization = req.headers.get('authorization');

  if (authorization?.startsWith('Bearer ')) {
    return authorization.slice('Bearer '.length).trim();
  }

  const cookies = parseCookieHeader(req.headers.get('cookie'));
  return cookies[getAdminCookieName()] ?? null;
}

function base64UrlEncode(input: string | ArrayBuffer) {
  const bytes =
    typeof input === 'string' ? new TextEncoder().encode(input) : new Uint8Array(input);

  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
}

function base64UrlDecode(input: string) {
  const normalized = input.replaceAll('-', '+').replaceAll('_', '/');
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  return new TextDecoder().decode(bytes);
}

async function getJwtKey() {
  const secret = Deno.env.get('JWT_SECRET');

  if (!secret) {
    throw new Error('JWT_SECRET is missing');
  }

  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    {
      name: 'HMAC',
      hash: 'SHA-256',
    },
    false,
    ['sign', 'verify'],
  );
}

function parseExpiresInSeconds(value: string | null) {
  const expiresIn = value ?? '7d';
  const match = expiresIn.match(/^(\d+)([smhd])$/);

  if (!match) return 60 * 60 * 24 * 7;

  const amount = Number(match[1]);
  const unit = match[2];

  if (unit === 's') return amount;
  if (unit === 'm') return amount * 60;
  if (unit === 'h') return amount * 60 * 60;
  return amount * 60 * 60 * 24;
}

async function signJwt(admin: { id: string; email: string }) {
  const now = Math.floor(Date.now() / 1000);
  const expiresInSeconds = parseExpiresInSeconds(Deno.env.get('JWT_EXPIRES_IN'));

  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const payload: JwtPayload = {
    sub: admin.id,
    email: admin.email,
    iat: now,
    exp: now + expiresInSeconds,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  const key = await getJwtKey();
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(signingInput),
  );

  return `${signingInput}.${base64UrlEncode(signature)}`;
}

async function verifyJwt(token: string): Promise<JwtPayload | null> {
  const parts = token.split('.');

  if (parts.length !== 3) return null;

  const [encodedHeader, encodedPayload, encodedSignature] = parts;
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  const key = await getJwtKey();
  const expectedSignature = encodedSignature.replaceAll('-', '+').replaceAll('_', '/');
  const paddedSignature = expectedSignature.padEnd(
    expectedSignature.length + ((4 - (expectedSignature.length % 4)) % 4),
    '=',
  );

  const signatureBytes = Uint8Array.from(atob(paddedSignature), (char) => char.charCodeAt(0));

  const verified = await crypto.subtle.verify(
    'HMAC',
    key,
    signatureBytes,
    new TextEncoder().encode(signingInput),
  );

  if (!verified) return null;

  const payload = JSON.parse(base64UrlDecode(encodedPayload)) as JwtPayload;
  const now = Math.floor(Date.now() / 1000);

  if (!payload.sub || !payload.email || !payload.exp || payload.exp < now) {
    return null;
  }

  return payload;
}

async function requireAdmin(req: Request) {
  const token = getTokenFromRequest(req);

  if (!token) {
    return null;
  }

  const payload = await verifyJwt(token);

  if (!payload) {
    return null;
  }

  const adminEmail = Deno.env.get('ADMIN_EMAIL');

  if (adminEmail && payload.email !== adminEmail) {
    return null;
  }

  return {
    id: payload.sub,
    email: payload.email,
  };
}

async function sendNewLetterAlert(payload: {
  letterId: string;
  senderName: string | null;
  title: string | null;
  body: string;
  isAnonymous: boolean;
  createdAt: Date;
}) {
  const enabled =
    (Deno.env.get('LETTER_ALERT_ENABLED') ?? 'false').toLowerCase() === 'true';

  if (!enabled) return;

  const apiKey = Deno.env.get('RESEND_API_KEY');
  const from = Deno.env.get('LETTER_ALERT_FROM_EMAIL');
  const to = Deno.env.get('LETTER_ALERT_TO_EMAIL');

  if (!apiKey || !from || !to) {
    console.warn('LETTER_ALERT 설정이 비어 있어 편지 알림 이메일 전송을 건너뜁니다.');
    return;
  }

  const senderLabel = payload.isAnonymous
    ? '익명'
    : payload.senderName?.trim() || '이름 미입력';

  const titleLabel = payload.title?.trim() || '(제목 없음)';
  const createdAtLabel = formatKoreanDate(payload.createdAt);

  const text = [
    '새 편지가 도착했습니다.',
    '',
    `편지 ID: ${payload.letterId}`,
    `작성 시각: ${createdAtLabel}`,
    `보낸 사람: ${senderLabel}`,
    `제목: ${titleLabel}`,
    '',
    '[본문]',
    payload.body,
  ].join('\n');

  const html = `
    <h2>새 편지가 도착했습니다</h2>
    <p><strong>편지 ID</strong>: ${escapeHtml(payload.letterId)}</p>
    <p><strong>작성 시각</strong>: ${escapeHtml(createdAtLabel)}</p>
    <p><strong>보낸 사람</strong>: ${escapeHtml(senderLabel)}</p>
    <p><strong>제목</strong>: ${escapeHtml(titleLabel)}</p>
    <hr />
    <h3>본문</h3>
    <p style="white-space: pre-wrap;">${escapeHtml(payload.body)}</p>
  `;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `[vibe-lovers] 새 편지 도착 - ${titleLabel}`,
      text,
      html,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Resend 전송 실패: ${response.status} ${errorText}`);
  }
}

async function createLetter(req: Request) {
  let payload: LetterPayload;

  try {
    payload = await req.json();
  } catch {
    return json(req, { message: 'Invalid JSON body' }, 400);
  }

  const website = normalizeString(payload.website);

  if (website) {
    return json(req, { message: 'Spam detected' }, 400);
  }

  if (!isBoolean(payload.isAnonymous)) {
    return json(req, { message: 'isAnonymous must be boolean' }, 400);
  }

  const isAnonymous = payload.isAnonymous;
  const senderName = normalizeString(payload.senderName);
  const title = normalizeString(payload.title);
  const body = normalizeString(payload.body);

  if (senderName.length > 60) {
    return json(req, { message: 'senderName must be 60 characters or less' }, 400);
  }

  if (title.length > 120) {
    return json(req, { message: 'title must be 120 characters or less' }, 400);
  }

  if (body.length < 5 || body.length > 5000) {
    return json(req, { message: 'body must be between 5 and 5000 characters' }, 400);
  }

  const ip = getClientIp(req);
  const ipHash = ip !== 'unknown' ? await sha256(ip) : null;
  const userAgent = req.headers.get('user-agent');
  const oneMinuteAgo = new Date(Date.now() - 60_000).toISOString();

  if (ipHash) {
    const { count, error: countError } = await supabase
      .from('Letter')
      .select('id', { count: 'exact', head: true })
      .eq('ipHash', ipHash)
      .gte('createdAt', oneMinuteAgo);

    if (countError) {
      console.error('Letter rate limit countError:', JSON.stringify(countError, null, 2));
      return json(req, { message: '편지 전송 확인 중 오류가 발생했습니다.' }, 500);
    }

    if ((count ?? 0) >= 3) {
      return json(req, { message: '잠시 후 다시 시도해주세요.' }, 429);
    }
  }

  const now = new Date().toISOString();

  const letter = {
    id: crypto.randomUUID(),
    senderName: isAnonymous ? null : senderName || null,
    title: title || null,
    body,
    isAnonymous,
    isRead: false,
    ipHash,
    userAgent: userAgent || null,
    createdAt: now,
    updatedAt: now,
  };

  const { data, error } = await supabase
    .from('Letter')
    .insert(letter)
    .select('id, senderName, title, body, isAnonymous, createdAt')
    .single();

  if (error) {
    console.error('Letter insert error:', JSON.stringify(error, null, 2));
    return json(req, { message: '편지를 저장하지 못했습니다.' }, 500);
  }

  sendNewLetterAlert({
    letterId: data.id,
    senderName: data.senderName,
    title: data.title,
    body: data.body,
    isAnonymous: data.isAnonymous,
    createdAt: new Date(data.createdAt),
  }).catch((error) => {
    console.error('편지 알림 이메일 전송 실패:', error);
  });

  return json(req, {
    success: true,
    message: '편지가 안전하게 전달되었습니다.',
  });
}

async function listMedia(req: Request) {
  const { data, error } = await supabase
    .from('MediaItem')
    .select('*')
    .order('order', { ascending: true });

  if (error) {
    console.error('Media list error:', JSON.stringify(error, null, 2));
    return json(req, { message: '미디어를 불러오지 못했습니다.' }, 500);
  }

  return json(req, data ?? []);
}

async function listTracks(req: Request) {
  const { data, error } = await supabase
    .from('Track')
    .select('*')
    .eq('isPublished', true)
    .order('order', { ascending: true });

  if (error) {
    console.error('Track list error:', JSON.stringify(error, null, 2));
    return json(req, { message: '트랙을 불러오지 못했습니다.' }, 500);
  }

  return json(req, data ?? []);
}

function normalizeGithubRepo(repo: GithubRepositoryResponse) {
  return {
    id: repo.id,
    name: repo.name,
    description: repo.description,
    htmlUrl: repo.html_url,
    homepage: repo.homepage,
    language: repo.language,
    topics: repo.topics ?? [],
    stargazersCount: repo.stargazers_count,
    updatedAt: repo.updated_at,
  };
}

async function getFreshGithubCache() {
  const cacheTtlMinutes = Number(Deno.env.get('GITHUB_CACHE_TTL_MINUTES') ?? '30');
  const threshold = new Date(Date.now() - cacheTtlMinutes * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from('CachedGithubRepo')
    .select('payload')
    .gte('fetchedAt', threshold)
    .order('updatedAtGitHub', { ascending: false });

  if (error) {
    console.warn('GitHub fresh cache error:', JSON.stringify(error, null, 2));
    return [];
  }

  return (data ?? [])
    .map((row) => row.payload as GithubRepositoryResponse | null)
    .filter(Boolean) as GithubRepositoryResponse[];
}

async function getStaleGithubCache() {
  const { data, error } = await supabase
    .from('CachedGithubRepo')
    .select('payload')
    .order('updatedAtGitHub', { ascending: false });

  if (error) {
    console.warn('GitHub stale cache error:', JSON.stringify(error, null, 2));
    return [];
  }

  return (data ?? [])
    .map((row) => row.payload as GithubRepositoryResponse | null)
    .filter(Boolean) as GithubRepositoryResponse[];
}

async function fetchGithubRepositories() {
  const freshCache = await getFreshGithubCache();

  if (freshCache.length > 0) {
    return freshCache;
  }

  const username = Deno.env.get('GITHUB_USERNAME');
  const token = Deno.env.get('GITHUB_TOKEN');

  if (!username) {
    const staleCache = await getStaleGithubCache();
    return staleCache;
  }

  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      },
    );

    if (!response.ok) {
      throw new Error(`GitHub API failed: ${response.status}`);
    }

    const data = (await response.json()) as GithubRepositoryResponse[];
    const now = new Date().toISOString();

    const normalizedRows = data.map((repo) => ({
      id: crypto.randomUUID(),
      repoId: String(repo.id),
      name: repo.name,
      description: repo.description,
      htmlUrl: repo.html_url,
      homepage: repo.homepage,
      language: repo.language,
      topics: repo.topics ?? [],
      stargazersCount: repo.stargazers_count,
      updatedAtGitHub: repo.updated_at,
      payload: repo,
      fetchedAt: now,
      createdAt: now,
      updatedAt: now,
    }));

    const deleteResult = await supabase.from('CachedGithubRepo').delete().neq('id', '');

    if (deleteResult.error) {
      console.warn('GitHub cache delete error:', JSON.stringify(deleteResult.error, null, 2));
    }

    if (normalizedRows.length > 0) {
      const insertResult = await supabase.from('CachedGithubRepo').insert(normalizedRows);

      if (insertResult.error) {
        console.warn('GitHub cache insert error:', JSON.stringify(insertResult.error, null, 2));
      }
    }

    return data;
  } catch (error) {
    console.warn('Falling back to stale GitHub cache:', error);
    return getStaleGithubCache();
  }
}

async function listProjects(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get('q')?.trim().toLowerCase() ?? '';
  const language = url.searchParams.get('language')?.trim().toLowerCase() ?? '';
  const sort = url.searchParams.get('sort') ?? 'updated';

  const repositories = await fetchGithubRepositories();

  let curated = repositories.map(normalizeGithubRepo);

  if (q) {
    curated = curated.filter((repo) => {
      return [repo.name, repo.description ?? '', ...(repo.topics ?? [])]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }

  if (language) {
    curated = curated.filter((repo) => (repo.language ?? '').toLowerCase() === language);
  }

  curated.sort((a, b) => {
    if (sort === 'stars') return b.stargazersCount - a.stargazersCount;
    if (sort === 'name') return a.name.localeCompare(b.name);
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return json(req, curated);
}

async function adminLogin(req: Request) {
  let payload: LoginPayload;

  try {
    payload = await req.json();
  } catch {
    return json(req, { message: 'Invalid JSON body' }, 400);
  }

  const email = normalizeString(payload.email);
  const password = normalizeString(payload.password);

  const adminEmail = Deno.env.get('ADMIN_EMAIL') ?? '';
  const adminPassword = Deno.env.get('ADMIN_PASSWORD') ?? '';

  if (!adminEmail || !adminPassword) {
    console.error('ADMIN_EMAIL 또는 ADMIN_PASSWORD secret이 비어 있습니다.');
    return json(req, { message: '관리자 설정이 완료되지 않았습니다.' }, 500);
  }

  if (email !== adminEmail || password !== adminPassword) {
    return json(req, { message: 'Invalid credentials' }, 401);
  }

  const adminSession = {
    id: await sha256(adminEmail),
    email: adminEmail,
  };

  const token = await signJwt(adminSession);
  const cookieName = getAdminCookieName();
  const maxAge = parseExpiresInSeconds(Deno.env.get('JWT_EXPIRES_IN'));

  const setCookie = [
    `${cookieName}=${encodeURIComponent(token)}`,
    'Path=/',
    `Max-Age=${maxAge}`,
    'HttpOnly',
    'Secure',
    'SameSite=None',
  ].join('; ');

  return json(
    req,
    {
      success: true,
      admin: adminSession,
      token,
    },
    200,
    {
      'Set-Cookie': setCookie,
    },
  );
}

async function adminLogout(req: Request) {
  const cookieName = getAdminCookieName();

  const clearCookie = [
    `${cookieName}=`,
    'Path=/',
    'Max-Age=0',
    'HttpOnly',
    'Secure',
    'SameSite=None',
  ].join('; ');

  return json(
    req,
    {
      success: true,
    },
    200,
    {
      'Set-Cookie': clearCookie,
    },
  );
}

async function adminMe(req: Request) {
  const admin = await requireAdmin(req);

  if (!admin) {
    return json(req, { message: '관리자 인증이 필요합니다.' }, 401);
  }

  return json(req, admin);
}

function cleanSearchForPostgrest(value: string) {
  return value.replaceAll(',', ' ').replaceAll('%', '\\%').replaceAll('_', '\\_').trim();
}

async function listAdminLetters(req: Request) {
  const admin = await requireAdmin(req);

  if (!admin) {
    return json(req, { message: '관리자 인증이 필요합니다.' }, 401);
  }

  const url = new URL(req.url);
  const page = Math.max(Number(url.searchParams.get('page') ?? '1'), 1);
  const pageSize = Math.min(Math.max(Number(url.searchParams.get('pageSize') ?? '20'), 1), 100);
  const unreadOnly = url.searchParams.get('unreadOnly') === 'true';
  const search = cleanSearchForPostgrest(url.searchParams.get('search') ?? '');

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('Letter')
    .select('*', { count: 'exact' })
    .order('createdAt', { ascending: false })
    .range(from, to);

  if (unreadOnly) {
    query = query.eq('isRead', false);
  }

  if (search) {
    const pattern = `%${search}%`;
    query = query.or(
      `senderName.ilike.${pattern},title.ilike.${pattern},body.ilike.${pattern}`,
    );
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('Admin letters list error:', JSON.stringify(error, null, 2));
    return json(req, { message: '편지 목록을 불러오지 못했습니다.' }, 500);
  }

  return json(req, {
    items: data ?? [],
    total: count ?? 0,
    page,
    pageSize,
  });
}

async function getAdminLetter(req: Request, id: string) {
  const admin = await requireAdmin(req);

  if (!admin) {
    return json(req, { message: '관리자 인증이 필요합니다.' }, 401);
  }

  const { data, error } = await supabase
    .from('Letter')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Admin letter detail error:', JSON.stringify(error, null, 2));
    return json(req, { message: '편지를 불러오지 못했습니다.' }, 500);
  }

  if (!data) {
    return json(req, { message: 'Letter not found' }, 404);
  }

  return json(req, data);
}

async function markAdminLetterRead(req: Request, id: string) {
  const admin = await requireAdmin(req);

  if (!admin) {
    return json(req, { message: '관리자 인증이 필요합니다.' }, 401);
  }

  const { data, error } = await supabase
    .from('Letter')
    .update({
      isRead: true,
      updatedAt: new Date().toISOString(),
    })
    .eq('id', id)
    .select('id')
    .maybeSingle();

  if (error) {
    console.error('Admin letter mark read error:', JSON.stringify(error, null, 2));
    return json(req, { message: '편지 상태를 변경하지 못했습니다.' }, 500);
  }

  if (!data) {
    return json(req, { message: 'Letter not found' }, 404);
  }

  return json(req, { success: true });
}

async function deleteAdminLetter(req: Request, id: string) {
  const admin = await requireAdmin(req);

  if (!admin) {
    return json(req, { message: '관리자 인증이 필요합니다.' }, 401);
  }

  const { data, error } = await supabase
    .from('Letter')
    .delete()
    .eq('id', id)
    .select('id')
    .maybeSingle();

  if (error) {
    console.error('Admin letter delete error:', JSON.stringify(error, null, 2));
    return json(req, { message: '편지를 삭제하지 못했습니다.' }, 500);
  }

  if (!data) {
    return json(req, { message: 'Letter not found' }, 404);
  }

  return json(req, { success: true });
}

async function keepAlive(req: Request) {
  const { count, error } = await supabase
    .from('Letter')
    .select('id', { count: 'exact', head: true });

  if (error) {
    console.error('Keep alive error:', JSON.stringify(error, null, 2));
    return json(req, { ok: false, message: 'keep-alive failed' }, 500);
  }

  return json(req, {
    ok: true,
    checkedAt: new Date().toISOString(),
    letterCount: count ?? 0,
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(req),
    });
  }

  const route = getRoute(req);
  const routeParts = route.split('/').filter(Boolean);

  try {
    if (req.method === 'GET' && route === '/keep-alive') {
      return keepAlive(req);
    }

    if (req.method === 'POST' && route === '/letters') {
      return createLetter(req);
    }

    if (req.method === 'GET' && route === '/media') {
      return listMedia(req);
    }

    if (req.method === 'GET' && route === '/tracks') {
      return listTracks(req);
    }

    if (req.method === 'GET' && route === '/projects') {
      return listProjects(req);
    }

    if (req.method === 'POST' && route === '/admin/auth/login') {
      return adminLogin(req);
    }

    if (req.method === 'POST' && route === '/admin/auth/logout') {
      return adminLogout(req);
    }

    if (req.method === 'GET' && route === '/admin/me') {
      return adminMe(req);
    }

    if (req.method === 'GET' && route === '/admin/letters') {
      return listAdminLetters(req);
    }

    if (
      routeParts.length === 3 &&
      routeParts[0] === 'admin' &&
      routeParts[1] === 'letters' &&
      req.method === 'GET'
    ) {
      return getAdminLetter(req, routeParts[2]);
    }

    if (
      routeParts.length === 4 &&
      routeParts[0] === 'admin' &&
      routeParts[1] === 'letters' &&
      routeParts[3] === 'read' &&
      req.method === 'PATCH'
    ) {
      return markAdminLetterRead(req, routeParts[2]);
    }

    if (
      routeParts.length === 3 &&
      routeParts[0] === 'admin' &&
      routeParts[1] === 'letters' &&
      req.method === 'DELETE'
    ) {
      return deleteAdminLetter(req, routeParts[2]);
    }

    return json(req, { message: 'Not found' }, 404);
  } catch (error) {
    console.error('Unhandled Edge Function error:', error);

    return json(
      req,
      {
        message: '서버 오류가 발생했습니다.',
      },
      500,
    );
  }
});