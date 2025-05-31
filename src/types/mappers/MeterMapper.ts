import { BackendMeterResponse, CreateMeterApiPayload } from '../api/MeterApi';
import { AppMeter } from '../models/MeterModel';

/**
 * Mapeia os dados de um medidor
 * para o payload esperado pela API de criação de medidores no backend.
 *
 * @param appMeter Objeto Meter do APP
 * @returns O payload para a API de criação de medidores.
 */
export const mapToCreateUserApiPayload = (
  appMeter: AppMeter,
): CreateMeterApiPayload => {
  return {
    idUsuario: appMeter.userUid,
    nome: appMeter.name,
    macAddress: appMeter.macAddress,
    idEquipamento: appMeter.equipmentId,
  };
};

/**
 * Mapeia a resposta do perfil do backend
 * para criar o objeto AppMeter completo usado no frontend.
 *
 * @param backendProfile A resposta da sua API contendo dados customizados do usuário (como 'tarifa').
 * @returns Um objeto AppUser completo.
 */
export const mapToAppUser = (
  backendProfile: BackendMeterResponse,
): AppMeter => {
  return {
    id: backendProfile.id.toString(),
    userUid: backendProfile.idUsuario,
    name: backendProfile.nome,
    macAddress: backendProfile.macAddress,
    equipmentId: backendProfile.idEquipamento,
  };
};
