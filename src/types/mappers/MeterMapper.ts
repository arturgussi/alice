import { BackendMeterResponse, CreateMeterApiPayload } from '../api/MeterApi';
import {
  AppMeter,
  MeterListItemType,
  UnifiedMeterDevice,
} from '../models/MeterModel';

/**
 * Mapeia os dados de um medidor
 * para o payload esperado pela API de criação de medidores no backend.
 *
 * @param appMeter Objeto Meter do APP
 * @returns O payload para a API de criação de medidores.
 */
export const mapToCreateMeterApiPayload = (
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
export const mapToAppMeter = (
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

export function toUnifiedMeterDevice(
  item: MeterListItemType,
): UnifiedMeterDevice {
  if (item.itemType === 'registered') {
    // Caso: AppMeter (registrado)
    return {
      keyId: item.macAddress,
      macAddress: item.macAddress,
      name: item.name,
      isRegistered: true,
      itemType: 'registered',
      originalId: item.id,
      originalItem: item,
    };
  } else {
    // Caso: Peripheral (descoberto)
    return {
      keyId: item.id, // O 'id' do Peripheral é o MAC
      macAddress: item.id,
      name: item.name,
      // 'isRegistered' é uma propriedade que você adiciona externamente
      isRegistered: item.isRegistered ?? false,
      itemType: 'discovered',
      rssi: item.rssi, // Repassamos o RSSI
      originalId: item.id,
      originalItem: item,
    };
  }
}
