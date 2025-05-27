import apiClient from '@api/ApiClient';

import {
  CreateUserPayload,
  UpdateUserPayload,
  UserProfile,
} from '@/types/ApiTypes';

const endpoint = '/usuario';

export const fetchUserById = async (id: string): Promise<UserProfile> => {
  try {
    const response = await apiClient.get<UserProfile>(`${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching equipment ${id}:`, error);
    throw error;
  }
};

export const createNewUser = async (
  payload: CreateUserPayload,
): Promise<UserProfile> => {
  try {
    const response = await apiClient.post<UserProfile>(endpoint, payload);
    return response.data;
  } catch (error) {
    console.error('Error creating equipment:', error);
    throw error;
  }
};

export const updateExistingUser = async (
  id: string,
  payload: UpdateUserPayload,
): Promise<UserProfile> => {
  try {
    const response = await apiClient.put<UserProfile>(
      `${endpoint}/${id}`,
      payload,
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating equipment ${id}:`, error);
    throw error;
  }
};

export const deleteExistingUser = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`${endpoint}/${id}`);
  } catch (error) {
    console.error(`Error deleting equipment ${id}:`, error);
    throw error;
  }
};
