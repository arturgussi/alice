import {sleep} from '@util';
import {useState, useEffect} from 'react';
import BleManager, {
  BleConnectPeripheralEvent,
  BleDisconnectPeripheralEvent,
  BleManagerDidUpdateValueForCharacteristicEvent,
  Peripheral,
} from 'react-native-ble-manager';

interface BluetoothConnectionsHookResult {
  isConnecting: boolean;
  isConnected: boolean;
  error: any;
  connectToDevice: () => Promise<void>;
  sendWifiCredentials: (
    wifiSSid: string | null | undefined,
    wifiPassword: string | null | undefined,
  ) => Promise<void>;
}

interface UseBluetoothConnectionsEventsProps {
  peripheral: Peripheral;
  onDeviceConnected: () => void;
}

const useBluetoothConnectionsEvents = ({
  peripheral,
  onDeviceConnected,
}: UseBluetoothConnectionsEventsProps): BluetoothConnectionsHookResult => {
  const SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
  const SSID_CHARACTERISTIC_UUID = 'a3c157be-a11a-4a06-9c0f-c7e699451c9d';
  const PASSWORD_CHARACTERISTIC_UUID = 'f7a8b92d-8e7a-4d3c-9b1e-5a2f8c3d4e6f';

  const [isConnecting, setIsConnecting] = useState<any>(null);
  const [isConnected, setIsConnected] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  const atualizaConexao = (
    connecting: boolean,
    connected: boolean,
    error: any,
  ) => {
    peripheral.connecting = connecting;
    peripheral.connected = connected;

    setIsConnecting(connecting);
    setIsConnected(connected);
    setError(error);
  };

  useEffect(() => {
    if (!peripheral.id) {
      return;
    }

    const handleDisconnected = (event: BleConnectPeripheralEvent) => {
      if (event.peripheral === peripheral.id) {
        atualizaConexao(false, false, null);
        console.log(`Dispositivo ${peripheral.id} desconectado.`);
      }
    };

    const handleConnected = (event: BleDisconnectPeripheralEvent) => {
      if (event.peripheral === peripheral.id) {
        atualizaConexao(false, true, null);
        console.log(`Dispositivo ${peripheral.id} conectado.`);
      }
    };

    const handleUpdateValueForCharacteristic = (
      data: BleManagerDidUpdateValueForCharacteristicEvent,
    ) => {
      console.debug(
        `[handleUpdateValueForCharacteristic] received data from '${data.peripheral}' with characteristic='${data.characteristic}' and value='${data.value}'`,
      );
    };

    const listeners: any[] = [
      BleManager.onConnectPeripheral(handleConnected),
      BleManager.onDidUpdateValueForCharacteristic(
        handleUpdateValueForCharacteristic,
      ),
      BleManager.onDisconnectPeripheral(handleDisconnected),
    ];

    return () => {
      for (const listener of listeners) {
        listener.remove();
      }
    };
  }, [peripheral]);

  const connectPeripheral = async (peripheral: Peripheral) => {
    try {
      if (peripheral) {
        // Informa que está iniciando tentativa de conexão com o periférico
        atualizaConexao(true, false, null);

        // Inicia conexãi
        await BleManager.connect(peripheral.id);
        console.debug(`[connectPeripheral][${peripheral.id}] connected.`);

        // Informa que está conectado
        atualizaConexao(false, true, null);

        // Antes de capturar os serviços, espera a conexão terminar de ser realizada apropriadamente
        await sleep(1000);

        /* Test read current RSSI value, retrieve services first */
        const peripheralData = await BleManager.retrieveServices(peripheral.id);
        console.debug(
          `[connectPeripheral][${peripheral.id}] retrieved peripheral services`,
          peripheralData,
        );

        // Lê RSSI do periférico
        const rssi = await BleManager.readRSSI(peripheral.id);
        console.debug(
          `[connectPeripheral][${peripheral.id}] retrieved current RSSI value: ${rssi}.`,
        );

        // Recebe dados do periférico
        if (peripheralData.characteristics) {
          for (const characteristic of peripheralData.characteristics) {
            if (characteristic.descriptors) {
              for (const descriptor of characteristic.descriptors) {
                try {
                  let data = await BleManager.readDescriptor(
                    peripheral.id,
                    characteristic.service,
                    characteristic.characteristic,
                    descriptor.uuid,
                  );
                  console.debug(
                    `[connectPeripheral][${peripheral.id}] ${characteristic.service} ${characteristic.characteristic} ${descriptor.uuid} descriptor read as:`,
                    data,
                  );
                } catch (error) {
                  atualizaConexao(false, false, error);
                  console.error(
                    `[connectPeripheral][${peripheral.id}] failed to retrieve descriptor ${descriptor} for characteristic ${characteristic}:`,
                    error,
                  );
                }
              }
            }
          }
        }

        // Atualiza RSSI do periférico
        peripheral.rssi = rssi;

        // Chama função recebida por parâmetro para trigger depois da conexão com dispositivo
        onDeviceConnected();
      }
    } catch (error) {
      atualizaConexao(false, false, error);
    }
  };

  const connectToDevice = async (): Promise<void> => {
    // Se for o mesmo periférico, desconecta
    if (peripheral && peripheral.connected) {
      try {
        await BleManager.disconnect(peripheral.id);
      } catch (error) {
        atualizaConexao(false, false, error);
      }
    }
    // Se não for, conecta
    else {
      await connectPeripheral(peripheral);
    }
  };

  const sendWifiCredentials = async (
    wifiSSid: string | null | undefined,
    wifiPassword: string | null | undefined,
  ): Promise<void> => {
    const stringToBytes = (str: string): number[] => {
      const bytes: number[] = [];
      for (let i = 0; i < str.length; i++) {
        bytes.push(str.charCodeAt(i));
      }
      return bytes;
    };

    if (wifiSSid && wifiPassword) {
      try {
        await BleManager.writeWithoutResponse(
          peripheral.id,
          SERVICE_UUID,
          SSID_CHARACTERISTIC_UUID,
          stringToBytes(btoa(wifiSSid)),
        );
        console.log('SSID enviado com sucesso!');
        BleManager.write;
        await BleManager.writeWithoutResponse(
          peripheral.id,
          SERVICE_UUID,
          PASSWORD_CHARACTERISTIC_UUID,
          stringToBytes(btoa(wifiPassword)),
        );
        console.log('Senha enviada com sucesso!');
      } catch (error) {
        console.error('Erro ao enviar credenciais:', error);
      }
    }
  };

  return {
    isConnecting,
    isConnected,
    error,
    connectToDevice,
    sendWifiCredentials,
  };
};

export default useBluetoothConnectionsEvents;
