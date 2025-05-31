import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { fetchMeters } from '@/services/api/MeterService';
import { AppMeter } from '@/types/models/MeterModel';

import { useAuth } from './useAuth';

export interface UseMeterReturn {
  meters: AppMeter[] | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: Error | null;
  refetchMeters: () => Promise<UseQueryResult<AppMeter[], Error>>;
}

export const useMeter = (): UseMeterReturn => {
  const { appUser } = useAuth();
  const currentUserId = appUser?.uid;

  const queryResult = useQuery<
    AppMeter[],
    Error,
    AppMeter[],
    (string | undefined)[]
  >({
    queryKey: ['meters', currentUserId],

    queryFn: async () => {
      if (!currentUserId) {
        console.warn(
          '[useMeter] queryFn chamada sem currentUserId. Retornando array vazio.',
        );
        return [];
      }
      return fetchMeters(currentUserId);
    },

    enabled: !!currentUserId,
  });

  return {
    meters: queryResult.data,
    isLoading: queryResult.isLoading,
    isFetching: queryResult.isFetching,
    isError: queryResult.isError,
    error: queryResult.error,
    refetchMeters: queryResult.refetch,
  };
};
