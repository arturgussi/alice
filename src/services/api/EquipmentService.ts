import axios, { AxiosError } from 'axios';

import {
  CreateEquipmentApiPayload,
  UpdateEquipmentApiPayload,
} from '@/types/api/EquipmentApi';
import { AppEquipment } from '@/types/models/EquipmentModel';
import apiClient from '@api/ApiClient';

const endpoint = '/equipamento';

export const fetchEquipments = async (
  userId: string,
): Promise<AppEquipment[]> => {
  if (!userId) {
    console.warn(
      '[EquipmentService] fetchEquipments chamado sem userId. Retornando array vazio.',
    );
    return Promise.resolve([]);
  }

  try {
    const response = await apiClient.get<AppEquipment[]>(
      `${endpoint}?idUsuario=${userId}`,
    );

    console.log(userId);
    console.log(response);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error('Status Code:', axiosError.response?.status);
      console.error(
        'Resposta de Erro do Backend:',
        JSON.stringify(axiosError.response?.data, null, 2),
      );
      console.error('URL da Requisição:', axiosError.config?.url);
      console.error(
        'Parâmetros da Requisição:',
        JSON.stringify(axiosError.config?.params, null, 2),
      );
    } else {
      console.error('Erro não-Axios:', (error as Error).message);
    }

    throw error; // Re-lança para ser tratado pelo React Query
  }
};

export const fetchEquipmentById = async (id: string): Promise<AppEquipment> => {
  try {
    const response = await apiClient.get<AppEquipment>(`${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching equipment ${id}:`, error);
    throw error;
  }
};

export const createNewEquipment = async (
  payload: CreateEquipmentApiPayload,
): Promise<AppEquipment> => {
  try {
    const response = await apiClient.post<AppEquipment>(endpoint, payload);
    return response.data;
  } catch (error) {
    console.error('Error creating equipment:', error);
    throw error;
  }
};

export const updateExistingEquipment = async (
  id: string,
  payload: UpdateEquipmentApiPayload,
): Promise<AppEquipment> => {
  try {
    const response = await apiClient.put<AppEquipment>(
      `${endpoint}/${id}`,
      payload,
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating equipment ${id}:`, error);
    throw error;
  }
};

export const deleteExistingEquipment = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`${endpoint}/${id}`);
  } catch (error) {
    console.error(`Error deleting equipment ${id}:`, error);
    throw error;
  }
};
