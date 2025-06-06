import {
  MutateOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  createNewEquipment,
  deleteExistingEquipment,
  fetchEquipments,
  updateExistingEquipment,
} from '@/services/api/EquipmentService';
import {
  BackendEquipmentResponse,
  CreateEquipmentApiPayload,
  UpdateEquipmentApiPayload,
} from '@/types/api/EquipmentApi';
import { mapApiResponseListToAppEquipmentList } from '@/types/mappers/EquipmentMapper';
import { AppEquipment } from '@/types/models/EquipmentModel';

import { useAuth } from './useAuth';

type CreateVariables = { payload: CreateEquipmentApiPayload };
type UpdateVariables = { id: string; payload: UpdateEquipmentApiPayload };
type DeleteVariables = { equipmentId: string };

export interface UseEquipmentReturn {
  equipments: AppEquipment[] | undefined;
  isLoadingEquipments: boolean;
  isFetchingEquipments: boolean;
  isErrorEquipments: boolean;
  errorEquipments: Error | null;
  refetchEquipments: () => void;
  createEquipment: (
    variables: CreateVariables,
    options?: MutateOptions<void, Error, CreateVariables, unknown>,
  ) => void;
  isCreatingEquipment: boolean;
  updateEquipment: (
    variables: UpdateVariables,
    options?: MutateOptions<void, Error, UpdateVariables, unknown>,
  ) => void;
  isUpdatingEquipment: boolean;
  deleteEquipment: (
    variables: DeleteVariables,
    options?: MutateOptions<void, Error, DeleteVariables, unknown>,
  ) => void;
  isDeletingEquipment: boolean;
}

export const useEquipment = (): UseEquipmentReturn => {
  const { appUser } = useAuth();
  const currentUserId = appUser?.uid;
  const queryClient = useQueryClient();

  // --- QUERY: Buscar a lista de equipamentos com `select` ---
  const {
    data: equipments,
    isLoading: isLoadingEquipments,
    isFetching: isFetchingEquipments,
    isError: isErrorEquipments,
    error: errorEquipments,
    refetch,
  } = useQuery<
    BackendEquipmentResponse[],
    Error,
    AppEquipment[],
    (string | undefined)[]
  >({
    queryKey: ['equipments', currentUserId],

    queryFn: () => {
      if (!currentUserId) return [];
      return fetchEquipments(currentUserId);
    },

    select: (apiData: BackendEquipmentResponse[]) => {
      console.log(
        '[useEquipment] Mapeando dados da API para o modelo do App...',
      );
      return mapApiResponseListToAppEquipmentList(apiData);
    },

    enabled: !!currentUserId,
  });

  // --- MUTATIONS (permanecem como antes, já estavam corretas) ---
  const { mutate: createEquipment, isPending: isCreatingEquipment } =
    useMutation<void, Error, CreateVariables>({
      mutationFn: variables => createNewEquipment(variables.payload),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['equipments', currentUserId],
        });
      },
      onError: error => {
        console.error(
          '[useEquipment] Erro ao criar equipamento:',
          error.message,
        );
      },
    });

  const { mutate: updateEquipment, isPending: isUpdatingEquipment } =
    useMutation<void, Error, UpdateVariables>({
      mutationFn: variables =>
        updateExistingEquipment(variables.id, variables.payload),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['equipments', currentUserId],
        });
      },
    });

  const { mutate: deleteEquipment, isPending: isDeletingEquipment } =
    useMutation<void, Error, DeleteVariables>({
      mutationFn: variables => deleteExistingEquipment(variables.equipmentId),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['equipments', currentUserId],
        });
      },
    });

  return {
    equipments,
    isLoadingEquipments,
    isFetchingEquipments,
    isErrorEquipments,
    errorEquipments,
    refetchEquipments: refetch,
    createEquipment,
    isCreatingEquipment,
    updateEquipment,
    isUpdatingEquipment,
    deleteEquipment,
    isDeletingEquipment,
  };
};
