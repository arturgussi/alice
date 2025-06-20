import React, { useEffect, useMemo } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import BleManager from 'react-native-ble-manager';
import { ScrollView } from 'react-native-gesture-handler';

import MeterButton from '@/components/buttons/MeterButton';
import ThemedText from '@/components/texts/ThemedText';
import BackgroundWrapper from '@/components/wrappers/BackgroundWrapper';
import { ThemedColors } from '@/constants/Theme.style';
import useBluetoothPeripherals from '@/hooks/useBluetoothPeripherals';
import { useMeter } from '@/hooks/useMeter';
import {
  checkBluetoothPermissions,
  enableBluetooth,
  requestBluetoothPermissions,
} from '@/services/bluetooth/BluetoothManager';
import { scanDevices } from '@/services/bluetooth/BluetoothUtils';
import { AppMeter, MeterListItemType } from '@/types/models/MeterModel';
import { getErrorMessage } from '@/Util';
import PrimaryButton from '@components/buttons/ThemedButton';

import screenStyles from './MeterRegister.style';

declare module 'react-native-ble-manager' {
  interface Peripheral {
    connected?: boolean;
    connecting?: boolean;
  }
}

const MeterRegisterScreen: React.FC = () => {
  const { meters, isLoadingMeters, refetchMeters } = useMeter();
  const { isScanning, setIsScanning, peripherals, setPeripherals } =
    useBluetoothPeripherals();

  const handleScanDevices = async () => {
    if (isScanning) return;
    try {
      if (!(await checkBluetoothPermissions())) {
        const permissionsGranted = await requestBluetoothPermissions();
        if (!permissionsGranted) {
          Alert.alert(
            'Permissão Necessária',
            'A permissão de Bluetooth é necessária para escanear dispositivos.',
          );
          return;
        }
      }
      await enableBluetooth();
      setPeripherals(new Map());
      setIsScanning(true);
      console.log('[MeterRegisterScreen] Iniciando scan...');
      await scanDevices();
    } catch (error: unknown) {
      console.error('[MeterRegisterScreen] Erro ao iniciar scan:', error);
      const errorMessage = getErrorMessage(
        error,
        'Não foi possível iniciar a busca por dispositivos.',
      );
      Alert.alert('Erro no Scan', errorMessage);
      setIsScanning(false);
    }
  };

  useEffect(() => {
    const bleManagerStart = async () => {
      try {
        await BleManager.start({ showAlert: false });
        console.debug('[MeterRegisterScreen] BleManager iniciado.');
      } catch (error) {
        console.error(
          '[MeterRegisterScreen] Erro inesperado ao iniciar BleManager.',
          error,
        );
      }
    };
    bleManagerStart().catch(console.error);
  }, []);

  const handleRegistrationSuccess = (registeredMacAddress: string) => {
    console.log(
      `[MeterRegisterScreen] Dispositivo ${registeredMacAddress} registrado. Atualizando listas.`,
    );
    refetchMeters();
    setPeripherals(prev => {
      const newMap = new Map(prev);
      newMap.delete(registeredMacAddress);
      return newMap;
    });
    if (isScanning) {
      BleManager.stopScan().then(() => setIsScanning(false));
    }
  };

  const discoveredItems = useMemo((): MeterListItemType[] => {
    const registeredMacAddresses = new Set(
      (meters || []).map(m => m.macAddress),
    );

    return Array.from(peripherals.values()).map(p => ({
      ...p,
      name: p.name || 'Dispositivo Desconhecido',
      itemType: 'discovered',
      isRegistered: registeredMacAddresses.has(p.id),
    }));
  }, [peripherals, meters]);

  const registeredItems = useMemo((): (AppMeter & {
    itemType: 'registered';
  })[] => {
    return (meters || []).map((meter: AppMeter) => ({
      ...meter,
      itemType: 'registered',
    }));
  }, [meters]);

  console.log(registeredItems);

  return (
    <BackgroundWrapper>
      <ScrollView
        contentContainerStyle={screenStyles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={screenStyles.container}>
          <ThemedText style={screenStyles.text}>
            Cadastro de Medidores
          </ThemedText>

          <View style={localStyles.listSection}>
            <ThemedText style={localStyles.listHeader}>
              Meus Medidores
            </ThemedText>
            {isLoadingMeters ? (
              <ActivityIndicator style={localStyles.centeredMessage} />
            ) : registeredItems.length === 0 ? (
              <ThemedText style={localStyles.emptyListText}>
                Nenhum medidor registrado.
              </ThemedText>
            ) : (
              <View style={{ rowGap: 12 }}>
                {registeredItems.map(item => (
                  <MeterButton key={item.id} item={item} />
                ))}
              </View>
            )}
          </View>

          <View style={screenStyles.container} />

          <View style={localStyles.listSection}>
            <ThemedText style={localStyles.listHeader}>
              Procurar Novos Medidores
            </ThemedText>
            <View style={screenStyles.buttonContainer}>
              <PrimaryButton
                title={
                  isScanning ? 'Procurando...' : 'Iniciar Procura Bluetooth'
                }
                onPress={handleScanDevices}
                disabled={isScanning}
              />
            </View>
            {isScanning && discoveredItems.length === 0 && (
              <View style={localStyles.centeredMessage}>
                <ActivityIndicator />
                <ThemedText style={{ marginLeft: 10 }}>
                  Procurando dispositivos...
                </ThemedText>
              </View>
            )}
            {!isScanning && discoveredItems.length === 0 && (
              <ThemedText style={localStyles.emptyListText}>
                Nenhum novo dispositivo encontrado na varredura.
              </ThemedText>
            )}
            {discoveredItems.length > 0 && (
              <View style={{ rowGap: 12 }}>
                {discoveredItems.map(item => (
                  <MeterButton
                    key={item.id}
                    item={item}
                    onRegistrationSuccess={handleRegistrationSuccess}
                  />
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </BackgroundWrapper>
  );
};

const localStyles = StyleSheet.create({
  listSection: { marginBottom: 30, width: '100%' },
  listHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: ThemedColors.text,
  },
  emptyListText: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: ThemedColors.text,
    paddingVertical: 15,
    fontSize: 15,
  },
  centeredMessage: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
  },
});

export default MeterRegisterScreen;
