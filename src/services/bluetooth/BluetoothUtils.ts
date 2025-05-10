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

const startScan = async () => {
  if ((await BleManager.isScanning()) === false) {
    try {
      console.debug('[startScan] starting scan...');

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
