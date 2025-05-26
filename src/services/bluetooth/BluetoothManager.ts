import { Platform } from 'react-native';
import BleManager, { BleState } from 'react-native-ble-manager';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

export const checkBluetoothPermissions = async () => {
  if (Platform.OS === 'android') {
    const apiLevel = Platform.Version;
    if (apiLevel >= 31) {
      // Android 12 and later
      const scanPermission = await check(PERMISSIONS.ANDROID.BLUETOOTH_SCAN);
      const connectPermission = await check(
        PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
      );
      const locationPermission = await check(
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      );
      return (
        scanPermission === RESULTS.GRANTED &&
        connectPermission === RESULTS.GRANTED &&
        locationPermission === RESULTS.GRANTED
      );
    } else {
      console.log('Versão do Android não suportada');
    }
  } else if (Platform.OS === 'ios') {
    const bluetoothPermission = await check(PERMISSIONS.IOS.BLUETOOTH);
    return bluetoothPermission === RESULTS.GRANTED;
  }
  return false;
};

export const requestBluetoothPermissions = async () => {
  let granted = false;
  if (Platform.OS === 'android') {
    const apiLevel = Platform.Version;
    if (apiLevel >= 31) {
      // Android 12 and later
      const scanPermission = await request(PERMISSIONS.ANDROID.BLUETOOTH_SCAN);
      const connectPermission = await request(
        PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
      );
      const locationPermission = await request(
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      );
      granted =
        scanPermission === RESULTS.GRANTED &&
        connectPermission === RESULTS.GRANTED &&
        locationPermission === RESULTS.GRANTED;
    } else {
      console.log('Versão do Android não suportada');
    }
  } else if (Platform.OS === 'ios') {
    const bluetoothPermission = await request(PERMISSIONS.IOS.BLUETOOTH);
    granted = bluetoothPermission === RESULTS.GRANTED;
  }
  return granted;
};

export const enableBluetooth = async () => {
  // Before scaning try to enable bluetooth if not enabled already
  if (
    Platform.OS === 'android' &&
    (await BleManager.checkState()) === BleState.Off
  ) {
    try {
      await BleManager.enableBluetooth().then(() =>
        console.info('Bluetooth is enabled'),
      );
    } catch (e) {
      console.log('Error enabling bluetooth: ', e);
      return false;
    }
  }
};
