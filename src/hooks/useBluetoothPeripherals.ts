import { useState, useEffect } from 'react';
import { EventSubscription } from 'react-native';
import BleManager, { Peripheral } from 'react-native-ble-manager';

const useBluetoothPeripherals = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [peripherals, setPeripherals] = useState(
    new Map<Peripheral['id'], Peripheral>(),
  );

  //   Handlers
  const handleDiscoverPeripheral = (peripheral: Peripheral) => {
    if (peripheral.name?.startsWith('ALICE')) {
      setPeripherals(map => {
        if (!map.has(peripheral.id)) {
          const newMap = new Map(map);
          newMap.set(peripheral.id, peripheral);
          return newMap;
        }
        return map;
      });
    }
  };

  const handleStopScan = () => {
    setIsScanning(false);
  };

  //   Main hook function
  useEffect(() => {
    const listeners: EventSubscription[] = [
      BleManager.onDiscoverPeripheral(handleDiscoverPeripheral),
      BleManager.onStopScan(handleStopScan),
    ];

    return () => {
      for (const listener of listeners) {
        listener.remove();
      }
    };
  }, []);

  return { isScanning, setIsScanning, peripherals, setPeripherals };
};

export default useBluetoothPeripherals;
