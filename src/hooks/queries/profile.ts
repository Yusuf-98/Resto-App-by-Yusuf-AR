import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as authApi from '@/lib/api/auth';
import { queryKeys } from './keys';

// --- Get Profile ---
export function useProfile() {
  return useQuery({
    queryKey: queryKeys.profile(),
    queryFn: authApi.getProfile,
    staleTime: 1000 * 60 * 10,
  });
}

// --- Update Profile ---
export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.profile() }),
  });
}
