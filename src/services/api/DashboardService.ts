import apiClient from '@/api/ApiClient';
import {
  ResumoEquipamentosResponse,
  ResumoGeralResponse,
} from '@/types/components/Dashboard';

export const fetchResumoGeral = async (
  userId: string | undefined,
  mes?: string,
): Promise<ResumoGeralResponse> => {
  try {
    const params = mes ? { mes } : {};

    console.log(
      `[DashboardService] EXECUTANDO fetchResumoGeral com params:`,
      params,
    );

    const response = await apiClient.get<ResumoGeralResponse>(
      `/medicao/resumo-geral/${userId}?mes=${mes}`,
    );
    return response.data;
  } catch (error) {
    console.error('API Error: Erro ao buscar resumo geral:', error);
    throw error;
  }
};

export const fetchResumoEquipamentos = async (
  userId: string | undefined,
  mes?: string,
): Promise<ResumoEquipamentosResponse> => {
  try {
    const params = mes ? { mes } : {};
    console.log(
      `[DashboardService] EXECUTANDO fetchResumoEquipamentos com params:`,
      params,
    );
    const response = await apiClient.get<ResumoEquipamentosResponse>(
      `/medicao/resumo-equipamento/${userId}`,
    );

    return response.data;
  } catch (error) {
    console.error('API Error: Erro ao buscar resumo de equipamentos:', error);
    throw error;
  }
};
