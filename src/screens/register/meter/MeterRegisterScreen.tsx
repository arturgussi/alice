import {useEffect} from 'react';
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
import {
  scanDevices,
  handleConnectPeripheral,
  handleDisconnectedPeripheral,
  handleUpdateValueForCharacteristic,
} from '@services/bluetooth/BluetoothHandlers';
import MeterButton from '@components/buttons/MeterButton';
import {sleep} from '@util';
import useBluetoothPeripherals from '@hooks/useBluetoothPeripherals';

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
    // Verifica permissões necessárias para Bluetooth
    if (!(await checkBluetoothPermissions())) {
      await requestBluetoothPermissions();
    }

    // Ativar o bluetooth se estiver desativado
    await enableBluetooth();

    // Escaneia os dispositivos que serão populados no handleDiscoverPeripheral
    if (!isScanning) {
      setPeripherals(new Map<Peripheral['id'], Peripheral>());
      setIsScanning(true);
      await scanDevices();
    }
  };

  const connectPeripheral = async (peripheral: Peripheral) => {
    try {
      if (peripheral) {
        setPeripherals(map => {
          let p = map.get(peripheral.id);
          if (p) {
            p.connecting = true;
            return new Map(map.set(p.id, p));
          }
          return map;
        });

        await BleManager.connect(peripheral.id);
        console.debug(`[connectPeripheral][${peripheral.id}] connected.`);

        setPeripherals(map => {
          let p = map.get(peripheral.id);
          if (p) {
            p.connecting = false;
            p.connected = true;
            return new Map(map.set(p.id, p));
          }
          return map;
        });

        // before retrieving services, it is often a good idea to let bonding & connection finish properly
        await sleep(1000);

        /* Test read current RSSI value, retrieve services first */
        const peripheralData = await BleManager.retrieveServices(peripheral.id);
        console.debug(
          `[connectPeripheral][${peripheral.id}] retrieved peripheral services`,
          peripheralData,
        );

        setPeripherals(map => {
          let p = map.get(peripheral.id);
          if (p) {
            return new Map(map.set(p.id, p));
          }
          return map;
        });

        const rssi = await BleManager.readRSSI(peripheral.id);
        console.debug(
          `[connectPeripheral][${peripheral.id}] retrieved current RSSI value: ${rssi}.`,
        );

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
                  console.error(
                    `[connectPeripheral][${peripheral.id}] failed to retrieve descriptor ${descriptor} for characteristic ${characteristic}:`,
                    error,
                  );
                }
              }
            }
          }
        }

        setPeripherals(map => {
          let p = map.get(peripheral.id);
          if (p) {
            p.rssi = rssi;
            return new Map(map.set(p.id, p));
          }
          return map;
        });

        // navigation.navigate('PeripheralDetails', {
        //   peripheralData: peripheralData,
        // });
      }
    } catch (error) {}
  };

  const togglePeripheralConnection = async (peripheral: Peripheral) => {
    if (peripheral && peripheral.connected) {
      try {
        await BleManager.disconnect(peripheral.id);
      } catch (error) {}
    } else {
      await connectPeripheral(peripheral);
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
  }, []);

  const renderPeripheral = ({item}: {item: Peripheral}) => (
    <MeterButton peripheral={item} onConnect={togglePeripheralConnection} />
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
              ...peripheral,
              name: peripheral.name || 'N/A',
            }))}
            contentContainerStyle={{rowGap: 12}}
            renderItem={renderPeripheral}
            keyExtractor={item => item.id}
          />
        </View>
      </View>
    </BackgroundWrapper>
  );
};

export default DeviceRegisterScreen;
