import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { fetchEquipments } from '@/services/api/EquipmentService';
import { Equipment } from '@/types/models/AppModels';

import { useAuth } from './useAuth';

export interface UseEquipmentReturn {
  equipments: Equipment[] | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: Error | null;
  refetchEquipments: () => Promise<UseQueryResult<Equipment[], Error>>;
}

export const useEquipment = (): UseEquipmentReturn => {
  const { appUser } = useAuth();
  const currentUserId = appUser?.uid;

  const queryResult = useQuery<
    Equipment[],
    Error,
    Equipment[],
    (string | undefined)[]
  >({
    queryKey: ['equipments', currentUserId],

    queryFn: async () => {
      if (!currentUserId) {
        console.warn(
          '[useEquipment] queryFn chamada sem currentUserId. Retornando array vazio.',
        );
        return [];
      }
      return fetchEquipments(currentUserId);
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
