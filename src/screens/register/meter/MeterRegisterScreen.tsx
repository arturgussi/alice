import { useEffect, useMemo } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import BleManager, { Peripheral } from 'react-native-ble-manager';
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

import styles from './MeterRegister.style';

declare module 'react-native-ble-manager' {
  interface Peripheral {
    connected?: boolean;
    connecting?: boolean;
  }
}

const MeterRegisterScreen: React.FC = () => {
  const { meters, isLoading: isLoadingMeters, refetchMeters } = useMeter();
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

  const handleRegistrationSuccess = (
    registeredDevice: AppMeter | Peripheral,
  ) => {
    console.log(
      `[MeterRegisterScreen] Dispositivo ${registeredDevice.id} registrado com sucesso. Atualizando listas.`,
    );
    refetchMeters();

    setPeripherals(prev => {
      const newMap = new Map(prev);
      newMap.delete(registeredDevice.id);
      return newMap;
    });
    // Opcional: parar o scan se um dispositivo foi registrado com sucesso
    if (isScanning) {
      BleManager.stopScan().then(() => setIsScanning(false));
    }
  };

  // Prepara a lista de dispositivos descobertos para o FlatList
  const discoveredItems = useMemo((): MeterListItemType[] => {
    const metersMap = new Map((meters || []).map(m => [m.id, m]));
    return Array.from(peripherals.values()).map(p => ({
      ...p,
      name: p.name || 'Dispositivo Desconhecido',
      itemType: 'discovered',
      isRegistered: metersMap.has(p.id),
    }));
  }, [peripherals, meters]);

  const registeredItems = useMemo((): MeterListItemType[] => {
    return (meters || []).map((meter: AppMeter) => ({
      ...meter,
      id: meter.id,
      name: meter.name || `Medidor ${meter.macAddress || meter.id.slice(-4)}`,
      itemType: 'registered',
    }));
  }, [meters]);

  return (
    <BackgroundWrapper>
      <ScrollView
        // style={styles.scrollView}
        // contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <ThemedText>Cadastro de Medidores</ThemedText>

          {/* Lista de dispositivos JÁ CADASTRADOS no backend */}
          <View style={localStyles.listSection}>
            <ThemedText style={localStyles.listHeader}>
              Meus Medidores
            </ThemedText>
            {isLoadingMeters ? (
              <ActivityIndicator
                size="small"
                color={ThemedColors.text}
                style={localStyles.centeredMessage}
              />
            ) : registeredItems.length === 0 ? (
              <ThemedText style={localStyles.emptyListText}>
                Nenhum medidor registrado.
              </ThemedText>
            ) : (
              <View style={{ rowGap: 12 }}>
                {registeredItems.map(item => (
                  <MeterButton
                    key={item.id}
                    item={item}
                    onRegistrationSuccess={handleRegistrationSuccess}
                  />
                ))}
              </View>
            )}
          </View>

          {/* Botão e Lista para SCAN de dispositivos Bluetooth */}
          <View style={localStyles.listSection}>
            <ThemedText style={localStyles.listHeader}>
              Procurar Novos Medidores
            </ThemedText>
            <View style={styles.buttonContainer}>
              <PrimaryButton
                title={
                  isScanning ? 'Procurando...' : 'Iniciar Procura Bluetooth'
                }
                onPress={handleScanDevices}
              />
            </View>

            {isScanning && discoveredItems.length === 0 && (
              <View style={localStyles.centeredMessage}>
                <ActivityIndicator size="small" color={ThemedColors.text} />
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
              // Usar View em vez de FlatList se não for scrollável
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

// Adicione estes estilos ao seu MeterRegister.style.ts ou defina-os aqui
const localStyles = StyleSheet.create({
  listSection: {
    marginBottom: 30, // Mais espaço entre seções
    width: '100%',
  },
  listHeader: {
    fontSize: 18,
    fontWeight: '600', // Um pouco mais de destaque
    marginBottom: 15,
    color: ThemedColors.text, // Usar cores do tema
  },
  emptyListText: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: ThemedColors.text,
    paddingVertical: 15,
    fontSize: 15,
  },
  centeredMessage: {
    // Para alinhar ActivityIndicator e texto
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
  },
});

export default MeterRegisterScreen;
