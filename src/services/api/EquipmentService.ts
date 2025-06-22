import {
  BackendEquipmentResponse,
  CreateEquipmentApiPayload,
  UpdateEquipmentApiPayload,
} from '@/types/api/EquipmentApi';
import { DataPoint, EquipmentAnalytics } from '@/types/components/chart';
import { extractApiErrorMessage } from '@/Util';
import apiClient from '@api/ApiClient';

const endpoint = '/equipamento';

export const fetchEquipments = async (
  userId: string,
): Promise<BackendEquipmentResponse[]> => {
  if (!userId) {
    console.warn(
      '[EquipmentService] fetchEquipments chamado sem userId. Retornando array vazio.',
    );
    return Promise.resolve([]);
  }

  try {
    const response = await apiClient.get<BackendEquipmentResponse[]>(
      `${endpoint}?idUsuario=${userId}`,
    );

    return response.data;
  } catch (e: unknown) {
    const errorMessage = extractApiErrorMessage(
      e,
      `Falha ao buscar equipamentos.`,
    );

    throw new Error(errorMessage);
  }
};

export const fetchEquipmentAnalytics = async (
  equipmentId: string,
  period: string,
  startDate: Date,
  endDate: Date,
): Promise<EquipmentAnalytics> => {
  console.log(
    `[Service] Buscando dados REAIS para ${equipmentId} de ${startDate} a ${endDate}`,
  );

  try {
    // 1. Faz a chamada GET para o seu backend Node-RED
    const response = await apiClient.get(`/medicao/${equipmentId}`, {
      params: {
        period, // ex: 'weeks'
        startDate, // ex: '2025-06-16T03:00:00.000Z'
        endDate, // ex: '2025-07-23T03:00:00.000Z'
      },
    });

    // 2. A resposta da API já contém os kpis e o barData
    const apiData = response.data;

    // 3. A lógica para calcular a linha de consumo acumulado permanece no frontend.
    //    Isso é eficiente e mantém o backend focado em entregar os dados brutos.
    let accumulatedValue = 0;
    const lineData: DataPoint[] = (apiData.chartData.barData || []).map(
      (item: DataPoint) => {
        accumulatedValue += item.value;
        return { label: item.label, value: accumulatedValue };
      },
    );

    // 4. Retorna o objeto final no formato que a tela espera
    return {
      kpis: apiData.kpis,
      chartData: {
        barData: apiData.chartData.barData,
        lineData: lineData, // Adicionamos o lineData calculado
      },
    };
  } catch (error: unknown) {
    console.error(
      '[Service] Erro ao buscar dados de análise do equipamento:',
      error,
    );
    const errorMessage = extractApiErrorMessage(
      error,
      `Falha ao buscar medições do equipamento ${equipmentId}.`,
    );

    throw new Error(errorMessage);
  }
};

export const fetchEquipmentById = async (
  id: string,
): Promise<BackendEquipmentResponse> => {
  try {
    const response = await apiClient.get<BackendEquipmentResponse>(
      `${endpoint}/${id}`,
    );
    return response.data;
  } catch (e: unknown) {
    const errorMessage = extractApiErrorMessage(
      e,
      `Falha ao buscar equipamento ${id}.`,
    );

    throw new Error(errorMessage);
  }
};

export const createNewEquipment = async (
  payload: CreateEquipmentApiPayload,
): Promise<void> => {
  try {
    await apiClient.post<BackendEquipmentResponse>(endpoint, payload);
  } catch (e: unknown) {
    const errorMessage = extractApiErrorMessage(
      e,
      `Falha ao criar equipamento.`,
    );

    throw new Error(errorMessage);
  }
};

export const updateExistingEquipment = async (
  id: string,
  payload: UpdateEquipmentApiPayload,
): Promise<void> => {
  try {
    await apiClient.put<BackendEquipmentResponse>(`${endpoint}/${id}`, payload);
  } catch (e: unknown) {
    const errorMessage = extractApiErrorMessage(
      e,
      `Falha ao atualizar equipamento ${id}.`,
    );

    throw new Error(errorMessage);
  }
};

export const deleteExistingEquipment = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`${endpoint}/${id}`);
  } catch (e: unknown) {
    const errorMessage = extractApiErrorMessage(
      e,
      `Falha ao deletar equipamento ${id}.`,
    );

    throw new Error(errorMessage);
  }
};
