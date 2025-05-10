import BleManager, {
  BleDisconnectPeripheralEvent,
  BleManagerDidUpdateValueForCharacteristicEvent,
  BleScanCallbackType,
  BleScanMatchMode,
  BleScanMode,
} from 'react-native-ble-manager';

const SECONDS_TO_SCAN_FOR = 30;
const SERVICE_UUIDS: string[] = [];
const ALLOW_DUPLICATES = false;

// Handlers do bluetooth

export const handleConnectPeripheral = (event: any) => {
  console.log(`[handleConnectPeripheral][${event.peripheral}] connected.`);
};

export const handleUpdateValueForCharacteristic = (
  data: BleManagerDidUpdateValueForCharacteristicEvent,
) => {
  console.debug(
    `[handleUpdateValueForCharacteristic] received data from '${data.peripheral}' with characteristic='${data.characteristic}' and value='${data.value}'`,
  );
};

export const handleDisconnectedPeripheral = (
  event: BleDisconnectPeripheralEvent,
) => {
  console.debug(
    `[handleDisconnectedPeripheral][${event.peripheral}] disconnected.`,
  );
  //   setPeripherals(map => {
  //     let p = map.get(event.peripheral);
  //     if (p) {
  //       p.connected = false;
  //       return new Map(map.set(event.peripheral, p));
  //     }
  //     return map;
  //   });
};

const startScan = async () => {
  if ((await BleManager.isScanning()) === false) {
    // reset found peripherals before scan
    // setPeripherals(new Map<Peripheral['id'], Peripheral>());

    try {
      console.debug('[startScan] starting scan...');
      //   setIsScanning(true);
      BleManager.scan(SERVICE_UUIDS, SECONDS_TO_SCAN_FOR, ALLOW_DUPLICATES, {
        matchMode: BleScanMatchMode.Sticky,
        scanMode: BleScanMode.LowLatency,
        callbackType: BleScanCallbackType.AllMatches,
      })
        .then(() => {
          console.debug('[startScan] scan promise returned successfully.');
        })
        .catch((err: any) => {
          console.error('[startScan] ble scan returned in error', err);
        });
    } catch (error) {
      console.error('[startScan] ble scan error thrown', error);
    }
  }
};

export const scanDevices = async () => {
  await startScan();
};
