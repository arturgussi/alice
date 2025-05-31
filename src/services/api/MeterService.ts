import axios, { AxiosError } from 'axios';

import {
  CreateMeterApiPayload,
  UpdateMeterApiPayload,
} from '@/types/api/MeterApi';
import { AppMeter } from '@/types/models/MeterModel';
import apiClient from '@api/ApiClient';

const endpoint = '/medidor';

export const fetchMeters = async (userId: string): Promise<AppMeter[]> => {
  if (!userId) {
    console.warn(
      '[MeterService] fetchMeters chamado sem userId. Retornando array vazio.',
    );
    return Promise.resolve([]);
  }

  try {
    const response = await apiClient.get<AppMeter[]>(endpoint, {
      params: {
        idUsuario: userId,
      },
    });

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

export const fetchMeterById = async (id: string): Promise<AppMeter> => {
  try {
    const response = await apiClient.get<AppMeter>(`${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching meter ${id}:`, error);
    throw error;
  }
};

export const createNewMeter = async (
  payload: CreateMeterApiPayload,
): Promise<AppMeter> => {
  try {
    const response = await apiClient.post<AppMeter>(endpoint, payload);
    return response.data;
  } catch (error) {
    console.error('Error creating meter:', error);
    throw error;
  }
};

export const updateExistingEquipment = async (
  id: string,
  payload: UpdateMeterApiPayload,
): Promise<AppMeter> => {
  try {
    const response = await apiClient.put<AppMeter>(
      `${endpoint}/${id}`,
      payload,
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating meter ${id}:`, error);
    throw error;
  }
};

export const deleteExistingEquipment = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`${endpoint}/${id}`);
  } catch (error) {
    console.error(`Error deleting meter ${id}:`, error);
    throw error;
  }
};
