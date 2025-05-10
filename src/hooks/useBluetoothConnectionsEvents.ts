//
// Gerenciamento de eventos de conexão e desconexão com um medidor pelo bluetooth
//

import {useEffect, useState} from 'react';
import BleManager, {Peripheral} from 'react-native-ble-manager';

type useBluetoothConnectionProps = {
  peripheralId: string;
  onConnected?: (peripheral: Peripheral) => void;
};

const useBluetoothConnection = ({
  peripheralId,
  onConnected,
}: useBluetoothConnectionProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<any>(null);
  const [connectedPeripheral, setConnectedPeripheral] =
    useState<Peripheral | null>(null);

  useEffect(() => {
    const connect = async () => {
      setIsConnecting(true);
      try {
        await BleManager.connect(peripheralId);
        const peripheralData = await BleManager.retrieveServices(peripheralId);
        setConnectedPeripheral(peripheralData);
        setIsConnected(true);
        setIsConnecting(false);
        if (onConnected) {
          onConnected(peripheralData);
        }
      } catch (e) {
        setError(e);
        setIsConnecting(false);
        setIsConnected(false);
      }
    };

    if (peripheralId) {
      connect();
    }
  }, [peripheralId, onConnected]);

  return {isConnected, isConnecting, error, connectedPeripheral};
};

export default useBluetoothConnection;
