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

export interface UnifiedMeterDevice {
  keyId: string; // ID estável para keys do React (o MAC Address)
  macAddress: string; // Acesso GARANTIDO e CONSISTENTE ao MAC Address
  name: string | undefined;
  isRegistered: boolean;
  itemType: 'discovered' | 'registered';
  rssi?: number; // Opcional, pois só existe em Peripherals
  originalId: string; // O ID original (interno do AppMeter ou MAC do Peripheral)
  originalItem: MeterListItemType; // Referência ao item original para hooks
}
