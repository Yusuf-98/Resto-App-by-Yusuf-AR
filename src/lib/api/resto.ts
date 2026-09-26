import apiClient from './client';
import type { Restaurant, RestaurantDetail, RestaurantFilter } from '@/types';

export type { Restaurant };

// --- Normalize Response ---
function toArray(data: unknown): Restaurant[] {
  if (!data) return [];
  if (Array.isArray(data)) return data as Restaurant[];
  const d = data as Record<string, unknown>;
  // { data: { recommendations: [] } }
  if (d.data && typeof d.data === 'object') {
    const inner = d.data as Record<string, unknown>;
    if (Array.isArray(inner.recommendations))
      return inner.recommendations as Restaurant[];
    if (Array.isArray(inner.restaurants))
      return inner.restaurants as Restaurant[];
  }
  if (Array.isArray(d.data)) return d.data as Restaurant[];
  if (Array.isArray(d.restaurants)) return d.restaurants as Restaurant[];
  if (Array.isArray(d.recommendations))
    return d.recommendations as Restaurant[];
  if (Array.isArray(d.items)) return d.items as Restaurant[];
  return [];
}

// --- Get Restaurants ---
export async function getRestaurants(
  params?: RestaurantFilter
): Promise<Restaurant[]> {
  const { data } = await apiClient.get('/api/resto', { params });
  const result = toArray(data);
  return result;
}

// --- Get Restaurant By Id ---
export async function getRestaurantById(
  id: string,
  params?: { limitMenu?: number; limitReview?: number }
): Promise<RestaurantDetail> {
  const { data } = await apiClient.get(`/api/resto/${id}`, { params });
  return (
    (data as { data: RestaurantDetail }).data ?? (data as RestaurantDetail)
  );
}

// --- Search Restaurants ---
export async function searchRestaurants(
  q: string,
  params?: { page?: number; limit?: number }
): Promise<Restaurant[]> {
  const { data } = await apiClient.get('/api/resto/search', {
    params: { q, ...params },
  });
  return toArray(data);
}

// --- Get Best Sellers ---
export async function getBestSellers(params?: {
  page?: number;
  limit?: number;
}): Promise<Restaurant[]> {
  const { data } = await apiClient.get('/api/resto/best-seller', { params });
  return toArray(data);
}

// --- Get Recommended ---
export async function getRecommended(params?: {
  page?: number;
  limit?: number;
}): Promise<Restaurant[]> {
  const { data } = await apiClient.get('/api/resto/recommended', { params });
  return toArray(data);
}

// --- Get Nearby ---
export async function getNearby(params?: {
  range?: number;
  limit?: number;
}): Promise<Restaurant[]> {
  const { data } = await apiClient.get('/api/resto/nearby', { params });
  return toArray(data);
}
