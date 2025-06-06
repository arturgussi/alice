import {
  BackendEquipmentResponse,
  CreateEquipmentApiPayload,
  UpdateEquipmentApiPayload,
} from '@/types/api/EquipmentApi';
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
