import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useAuthStore } from '@/store/auth.store';
import apiClient, { type ApiError } from './client';

// --- Fetch Mock ---
const fetchMock = vi.fn();

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status });
}

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
  useAuthStore.setState({ token: null, user: null, isAuthenticated: false });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('apiClient', () => {
  it('builds the query string and skips empty params', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ ok: true }));
    await apiClient.get('/api/resto', {
      params: { limit: 24, category: undefined, q: null },
    });

    const url = new URL(fetchMock.mock.calls[0][0]);
    expect(url.pathname).toBe('/api/resto');
    expect(url.searchParams.get('limit')).toBe('24');
    expect(url.searchParams.has('category')).toBe(false);
    expect(url.searchParams.has('q')).toBe(false);
  });

  it('sends the bearer token when logged in', async () => {
    useAuthStore.setState({ token: 'abc123' });
    fetchMock.mockResolvedValue(jsonResponse({}));
    await apiClient.get('/api/cart');

    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe(
      'Bearer abc123'
    );
  });

  it('sends JSON bodies with a JSON content type', async () => {
    fetchMock.mockResolvedValue(jsonResponse({}));
    await apiClient.post('/api/cart', { menuId: 1 });

    const init = fetchMock.mock.calls[0][1];
    expect(init.headers['Content-Type']).toBe('application/json');
    expect(init.body).toBe(JSON.stringify({ menuId: 1 }));
  });

  it('leaves the content type to the browser for FormData', async () => {
    fetchMock.mockResolvedValue(jsonResponse({}));
    const form = new FormData();
    form.append('name', 'Yusuf');
    await apiClient.put('/api/auth/profile', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    const init = fetchMock.mock.calls[0][1];
    expect(init.headers['Content-Type']).toBeUndefined();
    expect(init.body).toBe(form);
  });

  it('returns the parsed body as data', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ data: [1, 2] }));
    const { data } = await apiClient.get('/api/cart');
    expect(data).toEqual({ data: [1, 2] });
  });

  it('throws an error that keeps the status and body', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ message: 'Bad input' }, 400));

    const error = (await apiClient
      .post('/api/order/checkout', {})
      .catch((e) => e)) as ApiError;
    expect(error.response?.status).toBe(400);
    expect(error.response?.data).toEqual({ message: 'Bad input' });
  });

  it('logs the user out on a 401', async () => {
    useAuthStore.setState({ token: 'abc', isAuthenticated: true });
    fetchMock.mockResolvedValue(jsonResponse({ message: 'Unauthorized' }, 401));

    await apiClient.get('/api/cart').catch(() => undefined);
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().token).toBeNull();
  });
});
