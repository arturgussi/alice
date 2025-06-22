// useMeter.ts - Versão Final

import {
  MutateOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  createNewMeter,
  fetchMeters,
  updateExistingEquipmentForMeter,
} from '@/services/api/MeterService';
import {
  CreateMeterApiPayload,
  UpdateMeterApiPayload,
} from '@/types/api/MeterApi';
import { AppMeter } from '@/types/models/MeterModel';

import { useAuth } from './useAuth';

// Tipos para as variáveis das mutations
type CreateVariables = { payload: CreateMeterApiPayload };
// NOVO: Tipo para as variáveis da mutation de atualização
type UpdateVariables = { meterId: string; payload: UpdateMeterApiPayload };

// ALTERADO: A interface de retorno agora tem os tipos corretos para update
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
  updateMeter: (
    variables: UpdateVariables,
    options?: MutateOptions<AppMeter, Error, UpdateVariables, unknown>,
  ) => void;
  isCreatingMeter: boolean;
  isUpdatingMeter: boolean; // Agora será uma variável real
}

export const useMeter = (): UseMeterReturn => {
  const { appUser } = useAuth();
  const currentUserId = appUser?.uid;
  const queryClient = useQueryClient();

  // --- QUERY: Buscar todos os medidores (sem alterações) ---
  const {
    data: meters,
    isLoading: isLoadingMeters,
    isFetching: isFetchingMeters,
    isError: isErrorMeters,
    error: errorMeters,
    refetch,
  } = useQuery<AppMeter[], Error>({
    queryKey: ['meters', currentUserId],
    queryFn: () => {
      if (!currentUserId) return Promise.resolve([]);
      return fetchMeters(currentUserId);
    },
    enabled: !!currentUserId,
  });

  // --- MUTATION: Criar um novo medidor (sem alterações) ---
  const { mutate: createMeter, isPending: isCreatingMeter } = useMutation<
    AppMeter,
    Error,
    CreateVariables
  >({
    mutationFn: variables => createNewMeter(variables.payload),
    onSuccess: () => {
      // Invalida a query de medidores para forçar a atualização da lista
      queryClient.invalidateQueries({ queryKey: ['meters', currentUserId] });
    },
    onError: error => {
      console.error('[useMeter] Erro ao criar medidor:', error.message);
    },
  });

  // NOVO: MUTATION para ATUALIZAR um medidor existente
  const { mutate: updateMeter, isPending: isUpdatingMeter } = useMutation<
    AppMeter,
    Error,
    UpdateVariables
  >({
    mutationFn: variables =>
      updateExistingEquipmentForMeter(variables.meterId, variables.payload),
    onSuccess: () => {
      console.log(
        '[useMeter] Medidor atualizado com sucesso. Invalidando queries...',
      );
      // Invalida a query de medidores para atualizar a lista
      queryClient.invalidateQueries({ queryKey: ['meters', currentUserId] });
      // IMPORTANTE: Também invalida a query do dashboard, pois a associação mudou!
      queryClient.invalidateQueries({ queryKey: ['dashboard', currentUserId] });
    },
    onError: error => {
      console.error('[useMeter] Erro ao atualizar medidor:', error.message);
    },
  });

  // ALTERADO: O objeto de retorno agora inclui a lógica real de atualização
  return {
    meters,
    isLoadingMeters,
    isFetchingMeters,
    isErrorMeters,
    errorMeters,
    refetchMeters: refetch,
    createMeter,
    updateMeter, // A função real do useMutation
    isCreatingMeter,
    isUpdatingMeter, // O estado de pending real
  };
};
