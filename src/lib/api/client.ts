import { useAuthStore } from '@/store/auth.store';

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'https://be-restaurant-production.up.railway.app';
const TIMEOUT_MS = 15000;

// --- Types ---
interface RequestConfig {
  params?: object;
  headers?: Record<string, string>;
}

export interface ApiError extends Error {
  response?: { status: number; data: unknown };
}

// --- Request ---
async function request<T>(
  method: string,
  url: string,
  body?: unknown,
  config: RequestConfig = {}
): Promise<{ data: T }> {
  const target = new URL(url, BASE_URL);
  for (const [key, value] of Object.entries(config.params ?? {})) {
    if (value !== undefined && value !== null) {
      target.searchParams.set(key, String(value));
    }
  }

  const headers: Record<string, string> = { ...config.headers };
  const token = useAuthStore.getState().token;
  if (token) headers.Authorization = `Bearer ${token}`;

  let payload: BodyInit | undefined;
  if (body instanceof FormData) {
    delete headers['Content-Type'];
    payload = body;
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(target.toString(), {
      method,
      headers,
      body: payload,
      signal: controller.signal,
    });
    const text = await res.text();
    let data: unknown = text;
    try {
      data = text ? JSON.parse(text) : undefined;
    } catch {
      data = text;
    }

    if (!res.ok) {
      if (res.status === 401) useAuthStore.getState().logout();
      const error: ApiError = new Error(
        `Request failed with status ${res.status}`
      );
      error.response = { status: res.status, data };
      throw error;
    }
    return { data: data as T };
  } finally {
    clearTimeout(timer);
  }
}

// --- API Client ---
const apiClient = {
  get: <T = unknown>(url: string, config?: RequestConfig) =>
    request<T>('GET', url, undefined, config),
  post: <T = unknown>(url: string, body?: unknown, config?: RequestConfig) =>
    request<T>('POST', url, body, config),
  put: <T = unknown>(url: string, body?: unknown, config?: RequestConfig) =>
    request<T>('PUT', url, body, config),
  delete: <T = unknown>(url: string, config?: RequestConfig) =>
    request<T>('DELETE', url, undefined, config),
};

export default apiClient;
