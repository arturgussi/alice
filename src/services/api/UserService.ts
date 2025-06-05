import axios, { AxiosError } from 'axios';

import {
  BackendUserProfileResponse,
  CreateUserApiPayload,
  UpdateUserApiPayload,
} from '@/types/api/UserApi';
import apiClient from '@api/ApiClient';

const endpoint = '/usuario';

/**
 * Busca os dados do perfil do usuário do backend pelo ID (Firebase UID).
 */
export const fetchUserById = async (
  id: string,
): Promise<BackendUserProfileResponse> => {
  const operation = `fetchUserById (ID: ${id})`;
  console.log(`[UserService] Iniciando: ${operation} em ${endpoint}`);
  try {
    const response = await apiClient.get<BackendUserProfileResponse[]>(
      `${endpoint}/${id}`,
    );
    const userProfilesArray = response.data;

    console.log(
      `[UserService] Resposta crua do backend para ${operation}:`,
      userProfilesArray,
    );

    if (Array.isArray(userProfilesArray)) {
      if (userProfilesArray.length > 0) {
        console.log(
          `[UserService] Sucesso: ${operation}. Perfil encontrado:`,
          userProfilesArray[0],
        );
        return userProfilesArray[0];
      } else {
        console.warn(
          `[UserService] ${operation}: Usuário não encontrado no backend (API retornou array vazio).`,
        );
        // Lança um erro para ser tratado pelo AuthProvider como se fosse um 404.
        throw new Error(
          `Perfil de usuário com ID ${id} não encontrado no backend.`,
        );
      }
    } else {
      // A resposta não foi um array. Isso é um erro de formato.
      console.error(
        `[UserService] ${operation}: Formato de resposta inesperado do backend. Esperava um array, recebeu:`,
        userProfilesArray,
      );
      throw new Error(
        'Formato de resposta inesperado ao buscar perfil do usuário.',
      );
    }
  } catch (e: unknown) {
    console.error(`[UserService] Erro em ${operation}:`, e);
    let errorMessage = `Falha ao buscar usuário ${id}.`;

    if (axios.isAxiosError(e)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const axiosError = e as AxiosError<any>;
      if (axiosError.response?.status === 404) {
        errorMessage = `Usuário com ID ${id} não encontrado no backend (API retornou 404).`;
      } else {
        errorMessage =
          axiosError.response?.data?.message ||
          axiosError.response?.data?.error ||
          axiosError.message ||
          errorMessage;
      }
      console.error(
        `  Status: ${axiosError.response?.status}, Detalhes: ${JSON.stringify(axiosError.response?.data)}`,
      );
    } else if (e instanceof Error) {
      errorMessage = e.message;
    } else if (typeof e === 'string') {
      errorMessage = e;
    }

    throw new Error(errorMessage);
  }
};

/**
 * Cria um novo registro de usuário no backend.
 */
export const createNewUser = async (
  payload: CreateUserApiPayload,
): Promise<BackendUserProfileResponse> => {
  const operation = 'createNewUser';
  console.log(`[UserService] Iniciando: ${operation}`, payload);
  try {
    const response = await apiClient.post<BackendUserProfileResponse>(
      endpoint,
      payload,
    );
    console.log(`[UserService] Sucesso: ${operation}`, response.data);
    return response.data;
  } catch (e: unknown) {
    console.error(`[UserService] Erro em ${operation}:`, e);
    let errorMessage = 'Falha ao criar novo usuário.';
    if (axios.isAxiosError(e)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const axiosError = e as AxiosError<any>;
      errorMessage =
        axiosError.response?.data?.message ||
        axiosError.response?.data?.error ||
        axiosError.message ||
        errorMessage;
      console.error(
        `  Status: ${axiosError.response?.status}, Detalhes: ${JSON.stringify(axiosError.response?.data)}`,
      );
    } else if (e instanceof Error) {
      errorMessage = e.message;
    }
    throw new Error(errorMessage);
  }
};

/**
 * Atualiza um registro de usuário existente no backend.
 */
export const updateExistingUser = async (
  id: string,
  payload: UpdateUserApiPayload,
): Promise<BackendUserProfileResponse> => {
  const operation = `updateExistingUser (ID: ${id})`;
  console.log(`[UserService] Iniciando: ${operation}`, payload);
  try {
    const response = await apiClient.put<BackendUserProfileResponse>(
      `${endpoint}`,
      payload,
    );
    console.log(`[UserService] Sucesso: ${operation}`, response.data);
    return response.data;
  } catch (e: unknown) {
    console.error(`[UserService] Erro em ${operation}:`, e);
    let errorMessage = `Falha ao atualizar usuário ${id}.`;
    if (axios.isAxiosError(e)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const axiosError = e as AxiosError<any>;
      errorMessage =
        axiosError.response?.data?.message ||
        axiosError.response?.data?.error ||
        axiosError.message ||
        errorMessage;
      console.error(
        `  Status: ${axiosError.response?.status}, Detalhes: ${JSON.stringify(axiosError.response?.data)}`,
      );
    } else if (e instanceof Error) {
      errorMessage = e.message;
    }
    throw new Error(errorMessage);
  }
};
