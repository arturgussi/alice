import { useEffect, useState } from 'react';
import { EventSubscription } from 'react-native';
import BleManager, {
  BleConnectPeripheralEvent,
  BleDisconnectPeripheralEvent,
  BleManagerDidUpdateValueForCharacteristicEvent,
} from 'react-native-ble-manager';

import { ConnectableDevice } from '@/types/models/MeterModel';
import { getErrorMessage, sleep } from '@util';

// O que o hook retorna
interface BluetoothConnectionsHookResult {
  isConnecting: boolean;
  isConnected: boolean;
  error: Error | null;
  wifiStatus: string;
  connectToDevice: () => Promise<void>;
  disconnectFromDevice: () => Promise<void>;
  sendWifiCredentials: (
    wifiSSid: string | undefined,
    wifiPassword: string | undefined,
  ) => Promise<void>;
}

// Props que o hook recebe
interface UseBluetoothConnectionsEventsProps {
  device: ConnectableDevice | null;
}

// Função para converter string para array de bytes UTF-8
const stringToBytes = (str: string): number[] => {
  const bytes: number[] = [];
  for (let i = 0; i < str.length; i++) {
    bytes.push(str.charCodeAt(i));
  }
  return bytes;
};

const useBluetoothConnectionsEvents = ({
  device,
}: UseBluetoothConnectionsEventsProps): BluetoothConnectionsHookResult => {
  // UUIDs das suas características BLE
  const SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
  const SSID_CHARACTERISTIC_UUID = 'a3c157be-a11a-4a06-9c0f-c7e699451c9d';
  const PASSWORD_CHARACTERISTIC_UUID = 'f7a8b92d-8e7a-4d3c-9b1e-5a2f8c3d4e6f';
  const WIFI_STATUS_CHARACTERISTIC_UUID =
    '8b7a3e5c-9d2a-4e6f-a1c3-f0e8d7b1a5c2';

  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [wifiStatus, setWifiStatus] = useState<string>('');

  const updateConnectionState = (
    connecting: boolean,
    connected: boolean,
    errorOccurred: unknown,
  ) => {
    setIsConnecting(connecting);
    setIsConnected(connected);
    if (errorOccurred) {
      setError(
        new Error(
          getErrorMessage(errorOccurred, 'Erro de conexão desconhecido'),
        ),
      );
    } else {
      setError(null);
    }
    if (errorOccurred || !connected) {
      setWifiStatus('');
    }
  };

  useEffect(() => {
    if (!device?.id) {
      updateConnectionState(false, false, null);
      return;
    }

    const deviceId = device.id;

    const handleDeviceConnected = (event: BleConnectPeripheralEvent) => {
      if (event.peripheral === deviceId) {
        updateConnectionState(false, true, null);
      }
    };

    const handleDeviceDisconnected = (event: BleDisconnectPeripheralEvent) => {
      if (event.peripheral === deviceId) {
        updateConnectionState(false, false, null);
      }
    };

    const handleUpdateValueForCharacteristic = (
      event: BleManagerDidUpdateValueForCharacteristicEvent,
    ) => {
      if (
        event.peripheral === deviceId &&
        event.characteristic.toUpperCase() ===
          WIFI_STATUS_CHARACTERISTIC_UUID.toUpperCase()
      ) {
        let response = '';
        if (event.value) {
          response = String.fromCharCode(...new Uint8Array(event.value));
          setWifiStatus(response);
        }
      }
    };

    const listeners: EventSubscription[] = [
      BleManager.onConnectPeripheral(handleDeviceConnected),
      BleManager.onDisconnectPeripheral(handleDeviceDisconnected),
      BleManager.onDidUpdateValueForCharacteristic(
        handleUpdateValueForCharacteristic,
      ),
    ];

    return () => {
      for (const listener of listeners) {
        listener.remove();
      }
    };
  }, [device]);

  const performDeviceConnectionAndSetup = async (deviceId: string) => {
    updateConnectionState(true, false, null);

    await BleManager.connect(deviceId);
    // Aguardar um pouco para garantir que o evento foi processado e os serviços estão prontos.
    await sleep(1500);

    // Revalida o estado da conexão, pois o evento pode não ter disparado ou atualizado o estado a tempo.
    const stillConnected = await BleManager.isPeripheralConnected(deviceId);
    if (!stillConnected) {
      console.warn(
        `[BLEHook] Conexão com ${deviceId} não está ativa após sleep.`,
      );
      throw new Error(
        'Falha ao estabelecer ou manter a conexão com o dispositivo.',
      );
    }

    // Se o evento BleManagerConnectPeripheral não atualizou 'isConnected', força aqui.
    if (!isConnected) {
      updateConnectionState(false, true, null);
    }

    const peripheralData = await BleManager.retrieveServices(deviceId);
    if (peripheralData.characteristics) {
      for (const characteristic of peripheralData.characteristics) {
        if (characteristic.descriptors) {
          for (const descriptor of characteristic.descriptors) {
            try {
              const data = await BleManager.readDescriptor(
                deviceId,
                characteristic.service,
                characteristic.characteristic,
                descriptor.uuid,
              );
              console.debug(
                `[connectPeripheral][${deviceId}] ${characteristic.service} ${characteristic.characteristic} ${descriptor.uuid} descriptor read as:`,
                data,
              );
            } catch (error) {
              updateConnectionState(false, false, error);
              console.error(
                `[connectPeripheral][${deviceId}] failed to retrieve descriptor ${descriptor} for characteristic ${characteristic}:`,
                error,
              );
            }
          }
        }
      }
    }

    await BleManager.startNotification(
      deviceId,
      SERVICE_UUID,
      WIFI_STATUS_CHARACTERISTIC_UUID,
    );
  };

  const connectToDevice = async (): Promise<void> => {
    if (!device?.id) {
      const errMsg = 'Nenhum dispositivo selecionado para conectar.';
      console.warn(`[BLEHook] connectToDevice: ${errMsg}`);
      setError(new Error(errMsg));
      return Promise.reject(new Error(errMsg));
    }
    if (isConnected) {
      return Promise.resolve();
    }
    if (isConnecting) {
      return Promise.reject(new Error('Conexão já em progresso.'));
    }

    try {
      await performDeviceConnectionAndSetup(device.id);
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(
        error,
        'Erro ao conectar e configurar dispositivo.',
      );
      console.error(
        `[BLEHook] Erro final em connectToDevice para ${device.id}:`,
        errorMessage,
        error,
      );
      updateConnectionState(false, false, new Error(errorMessage));
      throw new Error(errorMessage);
    }
  };

  const disconnectFromDevice = async (): Promise<void> => {
    if (!device?.id) {
      console.warn(
        '[BLEHook] disconnectFromDevice chamado sem um dispositivo válido.',
      );
      return;
    }
    if (isConnected || isConnecting) {
      try {
        await BleManager.disconnect(device.id);

        updateConnectionState(false, false, null);
      } catch (e: unknown) {
        const errorMessage = getErrorMessage(e, 'Erro ao desconectar.');
        console.error(
          `[BLEHook] Erro ao desconectar de ${device.id}:`,
          errorMessage,
          e,
        );
        updateConnectionState(false, false, new Error(errorMessage));
        throw new Error(errorMessage);
      }
    } else {
      updateConnectionState(false, false, null);
    }
  };

  const sendWifiCredentials = async (
    wifiSSid: string | undefined,
    wifiPassword: string | undefined,
  ): Promise<void> => {
    if (!device?.id || !isConnected) {
      const msg = `Dispositivo não conectado para enviar credenciais Wi-Fi (ID: ${device?.id}, Conectado: ${isConnected})`;
      console.error(`[BLEHook] ${msg}`);
      throw new Error(msg);
    }
    if (!wifiSSid || !wifiPassword) {
      const msg = 'SSID e Senha do Wi-Fi são obrigatórios.';
      console.error(`[BLEHook] ${msg}`);
      throw new Error(msg);
    }

    try {
      setWifiStatus('0');

      await BleManager.writeWithoutResponse(
        device.id,
        SERVICE_UUID,
        SSID_CHARACTERISTIC_UUID,
        // Transforma a string para base64 e depois para bytes
        stringToBytes(btoa(wifiSSid)),
      );

      await BleManager.writeWithoutResponse(
        device.id,
        SERVICE_UUID,
        PASSWORD_CHARACTERISTIC_UUID,
        stringToBytes(btoa(wifiPassword)),
      );
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(
        error,
        'Falha ao enviar credenciais Wi-Fi.',
      );
      console.error(
        '[BLEHook] Erro ao enviar credenciais Wi-Fi:',
        errorMessage,
        error,
      );
      setWifiStatus('false');
      throw new Error(errorMessage);
    }
  };

  return {
    isConnecting,
    isConnected,
    error,
    wifiStatus,
    connectToDevice,
    disconnectFromDevice,
    sendWifiCredentials,
  };
};

export default useBluetoothConnectionsEvents;
