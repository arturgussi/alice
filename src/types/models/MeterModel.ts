import { Peripheral } from 'react-native-ble-manager';

export interface AppMeter {
  id: string;
  userUid: string;
  name: string;
  macAddress: string;
  equipmentId: number;
}

// Interface usada para deixar a conexão do bluetooth mais genérica,
// tanto para Peripheral quanto AppMeter
export interface ConnectableDevice {
  id: string;
  name?: string;
}

export type MeterListItemType =
  | (Peripheral & { itemType: 'discovered'; isRegistered?: boolean })
  | (AppMeter & { itemType: 'registered' });
