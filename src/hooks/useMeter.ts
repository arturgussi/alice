import {
  MutateOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { createNewMeter, fetchMeters } from '@/services/api/MeterService';
import { CreateMeterApiPayload } from '@/types/api/MeterApi';
import { AppMeter } from '@/types/models/MeterModel';

import { useAuth } from './useAuth';

type CreateVariables = { payload: CreateMeterApiPayload };

export interface UseMeterReturn {
  meters: AppMeter[] | undefined;
  isLoadingMeters: boolean;
  isFetchingMeters: boolean;
  isErrorMeters: boolean;
  errorMeters: Error | null;
  refetchMeters: () => void;
  createMeter: (
    variables: CreateVariables,
    options?: MutateOptions<AppMeter, Error, CreateVariables, unknown>,
  ) => void;
  isCreatingMeter: boolean;
}

export const useMeter = (): UseMeterReturn => {
  const { appUser } = useAuth();
  const currentUserId = appUser?.uid;
  const queryClient = useQueryClient();

  const {
    data: meters,
    isLoading: isLoadingMeters,
    isFetching: isFetchingMeters,
    isError: isErrorMeters,
    error: errorMeters,
    refetch,
  } = useQuery<AppMeter[], Error>({
    queryKey: ['meters', currentUserId], // Chave de cache
    queryFn: () => {
      if (!currentUserId) return [];
      return fetchMeters(currentUserId);
    },
    enabled: !!currentUserId,
  });

  // --- MUTATION: Criar um novo medidor ---
  const { mutate: createMeter, isPending: isCreatingMeter } = useMutation<
    AppMeter,
    Error,
    CreateVariables
  >({
    mutationFn: variables => createNewMeter(variables.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meters', currentUserId] });
    },
    onError: error => {
      console.error('[useMeter] Erro ao criar medidor:', error.message);
    },
  });

  return {
    meters,
    isLoadingMeters,
    isFetchingMeters,
    isErrorMeters,
    errorMeters,
    refetchMeters: refetch,
    createMeter,
    isCreatingMeter,
  };
};
