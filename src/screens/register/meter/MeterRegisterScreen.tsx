import {useEffect, useRef, useState} from 'react';
import {FlatList, View} from 'react-native';
import BleManager, {Peripheral} from 'react-native-ble-manager';

import styles from './MeterRegister.style';

import BackgroundWrapper from '@components/wrappers/BackgroundWrapperTitle';
import ThemedText from '@components/texts/ThemedText';
import PrimaryButton from '@components/buttons/PrimaryButton';
import {
  checkBluetoothPermissions,
  requestBluetoothPermissions,
  enableBluetooth,
} from '@services/bluetooth/BluetoothManager';
import {scanDevices} from '@services/bluetooth/BluetoothUtils';
import MeterButton from '@components/buttons/MeterButton';
import useBluetoothPeripherals from '@hooks/useBluetoothPeripherals';
import {Portal} from 'react-native-portalize';
import {Modalize} from 'react-native-modalize';
import ThemedTextInput from '@components/inputs/ThemedTextInput';

declare module 'react-native-ble-manager' {
  interface Peripheral {
    connected?: boolean;
    connecting?: boolean;
  }
}

const DeviceRegisterScreen = () => {
  const {isScanning, setIsScanning, peripherals, setPeripherals} =
    useBluetoothPeripherals();

  const handleScanDevices = async () => {
    if (!isScanning) {
      // Verifica permissões necessárias para Bluetooth
      if (!(await checkBluetoothPermissions())) {
        await requestBluetoothPermissions();
      }

      // Ativar o bluetooth se estiver desativado
      await enableBluetooth();

      // Escaneia os dispositivos que serão populados no handleDiscoverPeripheral
      setPeripherals(new Map<Peripheral['id'], Peripheral>());
      setIsScanning(true);
      await scanDevices();
    }
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
  }, []);

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
              ...peripheral,
              name: peripheral.name || 'N/A',
            }))}
            contentContainerStyle={{rowGap: 12}}
            keyExtractor={item => item.id}
            renderItem={({item}) => <MeterButton peripheral={item} />}
          />
        </View>
      </View>
    </BackgroundWrapper>
  );
};

export default DeviceRegisterScreen;
