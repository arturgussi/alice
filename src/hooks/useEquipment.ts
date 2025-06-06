import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { fetchEquipments } from '@/services/api/EquipmentService';
import { BackendEquipmentResponse } from '@/types/api/EquipmentApi';
import { mapApiResponseListToAppEquipmentList } from '@/types/mappers/EquipmentMapper';
import { AppEquipment } from '@/types/models/EquipmentModel';

import { useAuth } from './useAuth';

export interface UseEquipmentReturn {
  equipments: AppEquipment[] | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: Error | null;
  refetchEquipments: () => Promise<UseQueryResult<AppEquipment[], Error>>;
}

export const useEquipment = (): UseEquipmentReturn => {
  const { appUser } = useAuth();
  const currentUserId = appUser?.uid;

  const queryResult = useQuery<
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

  return {
    equipments: queryResult.data,
    isLoading: queryResult.isLoading,
    isFetching: queryResult.isFetching,
    isError: queryResult.isError,
    error: queryResult.error,
    refetchEquipments: queryResult.refetch,
  };
};
