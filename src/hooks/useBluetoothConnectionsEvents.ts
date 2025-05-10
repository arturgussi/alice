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
}

interface UseBluetoothConnectionsEventsProps {
  peripheral: Peripheral;
}

const useBluetoothConnectionsEvents = ({
  peripheral,
}: UseBluetoothConnectionsEventsProps): BluetoothConnectionsHookResult => {
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

    // const handleFailToConnect = (peripheralId: string, error: any) => {
    //   if (peripheralId === peripheralId) {
    //     setIsConnected(false);
    //     setError(error);
    //     console.error(`Falha ao conectar com ${peripheralId}:`, error);
    //   }
    // };

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
    // const failToConnectListener = BleManager.addListener(
    //   'BleManagerDidFailToConnect',
    //   handleFailToConnect,
    // );

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

        // navigation.navigate('PeripheralDetails', {
        //   peripheralData: peripheralData,
        // });
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

  return {isConnecting, isConnected, error, connectToDevice};
};

export default useBluetoothConnectionsEvents;

// const connect = async () => {
//   setIsConnecting(true);
//   try {
//     await BleManager.connect(peripheralId);
//     const peripheralData = await BleManager.retrieveServices(peripheralId);
//     setConnectedPeripheral(peripheralData);
//     setIsConnected(true);
//     setIsConnecting(false);
//     if (onConnected) {
//       onConnected(peripheralData);
//     }
//   } catch (e) {
//     setError(e);
//     setIsConnecting(false);
//     setIsConnected(false);
//   }
// };
