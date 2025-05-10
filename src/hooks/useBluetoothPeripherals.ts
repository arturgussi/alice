import {useState, useEffect} from 'react';
import BleManager, {Peripheral} from 'react-native-ble-manager';

const useBluetoothPeripherals = () => {
  const [isScanning, setIsScanning] = useState(Boolean);
  const [peripherals, setPeripherals] = useState(
    new Map<Peripheral['id'], Peripheral>(),
  );

  const handleDiscoverPeripheral = (peripheral: Peripheral) => {
    if (!peripherals.has(peripheral.id)) {
      if (!peripheral.name) {
        peripheral.name = '';
      }
      setPeripherals(map => {
        return new Map(map.set(peripheral.id, peripheral));
      });
    }
  };

  const handleStopScan = () => {
    setIsScanning(false);
  };

  useEffect(() => {
    const listeners: any[] = [
      BleManager.onDiscoverPeripheral(handleDiscoverPeripheral),
      BleManager.onStopScan(handleStopScan),
    ];

    return () => {
      // Remove listeners from BleManager
      for (const listener of listeners) {
        listener.remove();
      }
    };
  }, []);

  return {isScanning, setIsScanning, peripherals, setPeripherals};
};

export default useBluetoothPeripherals;
