import {
  BackendEquipmentResponse,
  CreateEquipmentApiPayload,
} from '../api/EquipmentApi';
import { AppEquipment } from '../models/EquipmentModel';

/**
 * Mapeia os dados de um equipamento
 * para o payload esperado pela API de criação de equipamentos no backend.
 *
 * @param appEquipment Objeto Meter do APP
 * @returns O payload para a API de criação de equipamentos.
 */
export const mapToCreateEquipmentApiPayload = (
  appEquipment: AppEquipment,
): CreateEquipmentApiPayload => {
  return {
    idUsuario: appEquipment.userUid,
    nome: appEquipment.name,
    marca: appEquipment.brand,
    modelo: appEquipment.model,
  };
};

/**
 * Mapeia a resposta do perfil do backend
 * para criar o objeto AppEquipment completo usado no frontend.
 *
 * @param backendProfile A resposta da sua API contendo dados.
 * @returns Um objeto AppEquipment completo.
 */
export const mapToAppEquipment = (
  backendProfile: BackendEquipmentResponse,
): AppEquipment => {
  return {
    id: backendProfile.id,
    userUid: backendProfile.idUsuario,
    name: backendProfile.nome,
    brand: backendProfile.marca,
    model: backendProfile.modelo,
  };
};
