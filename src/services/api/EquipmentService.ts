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
): Promise<EquipmentAnalytics> => {
  console.log(
    `[Service] Buscando dados FALSOS para ${equipmentId} no período ${period}`,
  );
  await new Promise(resolve => setTimeout(resolve, 500));

  const labels =
    period === '7d'
      ? ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom']
      : ['S1', 'S2', 'S3', 'S4'];

  // Cria os dados para as barras (consumo por intervalo)
  const barData: DataPoint[] = labels.map(label => ({
    label,
    value: Math.random() * 20,
  }));

  // Cria os dados para a linha (consumo acumulado)
  let accumulatedValue = 0;
  const lineData: DataPoint[] = barData.map(item => {
    accumulatedValue += item.value;
    return { label: item.label, value: accumulatedValue };
  });

  return {
    kpis: {
      totalConsumption: accumulatedValue,
      totalCost: accumulatedValue * 0.95, // Exemplo de cálculo de custo
      avgDailyCost: (accumulatedValue * 0.95) / labels.length,
      monthlyProjection: ((accumulatedValue * 0.95) / labels.length) * 30,
    },
    chartData: {
      barData, // Array simples para as barras
      lineData, // Array simples para a linha
    },
  };
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
