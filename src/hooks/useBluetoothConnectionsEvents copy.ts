import {useEffect, useState} from 'react';
import BleManager, {
  BleConnectPeripheralEvent,
  BleDisconnectPeripheralEvent,
  BleManagerDidUpdateValueForCharacteristicEvent,
} from 'react-native-ble-manager';

type useBluetoothConnectionsEventProps = {
  peripheralId: string;
};

const useBluetoothConnectionsEvent = ({
  peripheralId,
}: useBluetoothConnectionsEventProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<any>(null);

  // Handlers
  const handleConnectPeripheral = (event: BleConnectPeripheralEvent) => {
    console.log(`[handleConnectPeripheral][${event.peripheral}] connected.`);
    setIsConnected(true);
  };

  const handleDisconnectedPeripheral = (
    event: BleDisconnectPeripheralEvent,
  ) => {
    console.debug(
      `[handleDisconnectedPeripheral][${event.peripheral}] disconnected.`,
    );
    setIsConnected(false);
  };

  const handleUpdateValueForCharacteristic = (
    data: BleManagerDidUpdateValueForCharacteristicEvent,
  ) => {
    console.debug(
      `[handleUpdateValueForCharacteristic] received data from '${data.peripheral}' with characteristic='${data.characteristic}' and value='${data.value}'`,
    );
  };

  // Main hook functions
  useEffect(() => {
    if (!peripheralId) {
      return;
    }

    const listeners: any[] = [
      BleManager.onConnectPeripheral(handleConnectPeripheral),
      BleManager.onDidUpdateValueForCharacteristic(
        handleUpdateValueForCharacteristic,
      ),
      BleManager.onDisconnectPeripheral(handleDisconnectedPeripheral),
    ];

    return () => {
      for (const listener of listeners) {
        listener.remove();
      }
    };

    // connect();
  }, [peripheralId]);

  //   return {isConnected, isConnecting, error, connectedPeripheral};
  return {isConnected, isConnecting, error};
};

export default useBluetoothConnectionsEvent;
