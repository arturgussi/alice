import { DistributorApiResponse, UFApiResponse } from '@/types/api/TarrifApi';
import { extractApiErrorMessage } from '@/Util';
import apiClient from '@api/ApiClient';

/**
 * Busca a lista de UFs (estados) disponíveis que possuem tarifas ANEEL.
 * @returns Uma Promise com um array de strings (ex: ['SP', 'RJ', 'PR']).
 */
export const fetchAvailableUfs = async (): Promise<UFApiResponse[]> => {
  const endpoint = '/tarifa/ufs';
  try {
    const response = await apiClient.get<UFApiResponse[]>(endpoint);
    return response.data;
  } catch (e: unknown) {
    const errorMessage = extractApiErrorMessage(e, 'Falha ao buscar estados.');
    throw new Error(errorMessage);
  }
};

/**
 * Busca as distribuidoras de energia para uma UF específica.
 * @param uf A sigla do estado (ex: 'SP').
 * @returns Uma Promise com um array de objetos de distribuidora.
 */
export const fetchDistributorsByUf = async (
  uf: string,
): Promise<DistributorApiResponse[]> => {
  const endpoint = `/tarifa/distribuidoras?uf=${uf}`;
  try {
    const response = await apiClient.get<DistributorApiResponse[]>(endpoint);
    return response.data;
  } catch (e: unknown) {
    const errorMessage = extractApiErrorMessage(
      e,
      'Falha ao buscar distribuidoras.',
    );
    throw new Error(errorMessage);
  }
};
