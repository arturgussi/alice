import {useEffect, useState} from 'react';
import {FlatList, TouchableOpacity, View} from 'react-native';
import BleManager, {Peripheral} from 'react-native-ble-manager';

import styles from './DeviceRegister.style';

import BackgroundWrapper from '@components/wrappers/BackgroundWrapperTitle';
import ThemedText from '@components/texts/ThemedText';
import PrimaryButton from '@components/buttons/PrimaryButton';
import {
  checkBluetoothPermissions,
  requestBluetoothPermissions,
  enableBluetooth,
} from '@services/bluetooth/BluetoothManager';
import {
  handleConnectPeripheral,
  handleDisconnectedPeripheral,
  handleUpdateValueForCharacteristic,
  scanDevices,
} from '@services/bluetooth/BluetoothScan';

const DeviceRegisterScreen = () => {
  const [isScanning, setIsScanning] = useState(false);
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

  const handleScanDevices = async () => {
    // Verifica permissões necessárias para Bluetooth
    if (!(await checkBluetoothPermissions())) {
      await requestBluetoothPermissions();
    }

    // Pede para ativar o bluetooth se estiver desativado
    await enableBluetooth();

    // Escaneia os dispositivos que serão populados no handleDiscoverPeripheral
    if (!isScanning) {
      // reset found peripherals before scan
      setPeripherals(new Map<Peripheral['id'], Peripheral>());
      setIsScanning(true);
      await scanDevices();
    }
  };
  const handleStopScan = () => {
    setIsScanning(false);
    console.debug('[handleStopScan] scan is stopped.');
  };

  useEffect(() => {
    const BleManagerStart = async () => {
      try {
        await BleManager.start({showAlert: false, forceLegacy: true})
          .then(() => console.debug('BleManager started.'))
          .catch((error: any) =>
            console.error('BleManager could not be started.', error),
          );
      } catch (error) {
        console.error('Unexpected error starting BleManager.', error);
        return;
      }
    };

    BleManagerStart().catch(console.error);

    const listeners: any[] = [
      BleManager.onDiscoverPeripheral(handleDiscoverPeripheral),
      BleManager.onStopScan(handleStopScan),
      BleManager.onConnectPeripheral(handleConnectPeripheral),
      BleManager.onDidUpdateValueForCharacteristic(
        handleUpdateValueForCharacteristic,
      ),
      BleManager.onDisconnectPeripheral(handleDisconnectedPeripheral),
    ];

    return () => {
      console.debug('[app] main component unmounting. Removing listeners...');
      for (const listener of listeners) {
        listener.remove();
      }
    };
  }, []);

  type itemProps = {
    id: string;
    name: string;
    rssi: number;
  };
  const renderItem = ({item}: {item: itemProps}) => (
    <TouchableOpacity
      style={styles.meterContainer}
      onPress={() => {
        console.log(item.id);
      }}>
      <ThemedText>Name: {item.name || 'N/A'}</ThemedText>
      <ThemedText>ID: {item.id}</ThemedText>
      <ThemedText>RSSI: {item.rssi}</ThemedText>
    </TouchableOpacity>
  );

  return (
    <BackgroundWrapper>
      <View style={styles.container}>
        <ThemedText style={styles.text}>Cadastro de dispositivos</ThemedText>
        <View style={styles.buttonContainer}>
          <PrimaryButton
            title={
              isScanning === false
                ? 'Listar dispositivos bluetooth'
                : 'Scanning'
            }
            onPress={handleScanDevices}
          />
        </View>
        <View>
          <FlatList
            data={Array.from(peripherals.values()).map(peripheral => ({
              id: peripheral.id,
              name: peripheral.name || 'N/A',
              rssi: peripheral.rssi,
            }))}
            contentContainerStyle={{rowGap: 12}}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        </View>
      </View>
    </BackgroundWrapper>
  );
};

export default DeviceRegisterScreen;
