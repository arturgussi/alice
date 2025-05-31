import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Peripheral } from 'react-native-ble-manager';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import {
  AppMeter,
  ConnectableDevice,
  MeterListItemType,
} from '@/types/models/MeterModel';
import { getErrorMessage } from '@/Util';
import PrimaryButton from '@components/buttons/ThemedButton';
import ThemedTextInput from '@components/inputs/ThemedTextInput';
import ThemedText from '@components/texts/ThemedText';
import { ThemedColors } from '@constants/Theme.style';
import useBluetoothConnectionsEvent from '@hooks/useBluetoothConnectionsEvents';

export interface MeterButtonProps {
  item: MeterListItemType;
  onRegistrationSuccess?: (meter: AppMeter | Peripheral) => void;
}

// Placeholder para a função de salvar no backend - Você precisará implementar isso!
// import { registerNewMeter } from '@/services/api/MeterService'; // Exemplo
const registerNewMeterInBackend = async (deviceData: {
  id: string;
  name?: string;
  serialNumber?: string /* outros campos */;
}) => {
  console.log('[MeterButton] Simulating backend registration for:', deviceData);
  // return registerNewMeter({ bleId: deviceData.id, friendlyName: deviceData.name, ... });
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simula chamada de API
  // throw new Error("Falha simulada ao registrar no backend"); // Para testar erro
  return { ...deviceData, registeredDate: new Date().toISOString() }; // Simula resposta
};

const MeterButton: React.FC<MeterButtonProps> = ({
  item,
  onRegistrationSuccess,
}) => {
  const [wifiSSID, setWifiSSID] = useState<string>('');
  const [wifiPassword, setWifiPassword] = useState<string>('');
  const [isRegisteringOnBackend, setIsRegisteringOnBackend] = useState(false);

  const deviceToConnect: ConnectableDevice = {
    id: item.id,
    name: item.name || 'Dispositivo',
  };

  const {
    isConnecting,
    isConnected,
    error: connectionError,
    wifiStatus, // "", "0" (pending), "true" (success), "false" (fail)
    connectToDevice,
    disconnectFromDevice,
    sendWifiCredentials,
  } = useBluetoothConnectionsEvent({
    device: deviceToConnect,
  });
  const modalizeRef = useRef<Modalize>(null);

  // Efeito para registrar no backend após sucesso do Wi-Fi para um NOVO dispositivo
  useEffect(() => {
    if (
      item.itemType === 'discovered' &&
      isConnected &&
      !item.isRegistered &&
      !isRegisteringOnBackend &&
      wifiStatus === 'true'
    ) {
      const registerAsync = async () => {
        console.log(
          `[MeterButton] Wi-Fi conectado para novo dispositivo ${item.id}. Registrando no backend...`,
        );
        setIsRegisteringOnBackend(true);
        try {
          // Adapte os dados que você envia para o backend aqui
          const meterDataToRegister = {
            id: item.id, // MAC Address / BLE ID
            name: item.name || `Medidor ${item.id.slice(-4)}`,
            // Você pode querer adicionar mais campos aqui, ex: equipamentoId se selecionado antes
          };
          await registerNewMeterInBackend(meterDataToRegister);
          Alert.alert(
            'Sucesso',
            `${meterDataToRegister.name} configurado e registrado com sucesso!`,
          );
          onRegistrationSuccess?.(item); // Notifica o pai que o registro foi bem-sucedido
          modalizeRef.current?.close();
        } catch (regError: unknown) {
          const errorMsg =
            regError instanceof Error
              ? regError.message
              : 'Erro desconhecido ao registrar medidor.';
          Alert.alert('Falha no Registro Backend', errorMsg);
          console.error(
            '[MeterButton] Erro ao registrar medidor no backend:',
            regError,
          );
          // Opcional: Tentar desconectar ou limpar o estado do Wi-Fi se o registro no backend falhar
          // setWifiStatus('false'); // Indica que o processo geral falhou
        } finally {
          setIsRegisteringOnBackend(false);
        }
      };
      registerAsync();
    }
  }, [wifiStatus]);

  const handleItemPress = async () => {
    if (item.itemType === 'discovered' && item.isRegistered) {
      Alert.alert(
        'Dispositivo Encontrado',
        `"${item.name || item.id}" já está registrado.`,
      );
      return;
    }

    if (
      item.itemType === 'registered' ||
      (item.itemType === 'discovered' && !isConnected && !isConnecting)
    ) {
      Alert.alert(
        item.itemType === 'registered'
          ? 'Medidor Registrado'
          : 'Novo Dispositivo',
        `Conectar a "${item.name || item.id}" para configurar o Wi-Fi?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text:
              item.itemType === 'registered'
                ? 'Reconfigurar Wi-Fi'
                : 'Conectar e Configurar',
            onPress: async () => {
              try {
                await connectToDevice();
                modalizeRef.current?.open();
              } catch (connectErr: unknown) {
                const errorMessage = getErrorMessage(
                  connectErr,
                  'Não foi possível conectar ao dispositivo.',
                );
                Alert.alert('Falha na Conexão', errorMessage);
              }
            },
          },
        ],
      );
    } else if (item.itemType === 'discovered' && isConnected) {
      modalizeRef.current?.open();
    }
  };

  const handleSendWifiCredentialsWithLoading = async () => {
    if (!wifiSSID || !wifiPassword) {
      Alert.alert('Atenção', 'Preencha o nome da rede e a senha do Wi-Fi.');
      return;
    }
    try {
      await sendWifiCredentials(wifiSSID, wifiPassword);
    } catch (sendError: unknown) {
      const errorMessage = getErrorMessage(
        sendError,
        'Falha ao enviar credenciais.',
      );
      Alert.alert('Erro ao Enviar Wi-Fi', errorMessage);
    }
  };

  // Lógica de cores dos status (como antes, mas usando ThemedColors)
  let bluetoothStatusColor = ThemedColors.text;
  let wifiStatusDisplayColor = ThemedColors.text;

  if (item.itemType === 'discovered') {
    if (isConnecting) bluetoothStatusColor = 'orange';
    else if (isConnected) bluetoothStatusColor = 'green';
    else if (connectionError) bluetoothStatusColor = 'red';
  } else if (item.itemType === 'registered') {
    bluetoothStatusColor = 'blue';
  }

  // Status do Wi-Fi (mais complexo porque vem de notificação)
  if (isConnected || item.itemType === 'registered') {
    if (wifiStatus === 'true') wifiStatusDisplayColor = 'green';
    else if (wifiStatus === '0') wifiStatusDisplayColor = 'orange';
    else if (wifiStatus === 'false') wifiStatusDisplayColor = 'red';
  }

  return (
    <TouchableOpacity
      style={styles.meterContainer}
      onPress={handleItemPress}
      disabled={
        (isConnecting || isRegisteringOnBackend) &&
        item.itemType === 'discovered' &&
        !item.isRegistered
      }
    >
      <ThemedText style={styles.meterName}>
        {item.name || 'Dispositivo Sem Nome'}
      </ThemedText>
      <ThemedText style={styles.meterId}>ID: {item.id}</ThemedText>

      {item.itemType === 'discovered' && typeof item.rssi === 'number' && (
        <ThemedText style={styles.meterRssi}>RSSI: {item.rssi}</ThemedText>
      )}

      <View style={styles.statusIconsContainer}>
        <FontAwesomeIcon
          name={'bluetooth-b'}
          size={18}
          color={bluetoothStatusColor}
        />
        <FontAwesomeIcon
          name={'wifi'}
          size={18}
          color={wifiStatusDisplayColor}
          style={{ marginLeft: 10 }}
        />
      </View>

      {/* Modal para credenciais Wi-Fi */}
      <Portal>
        <Modalize
          ref={modalizeRef}
          adjustToContentHeight
          onClosed={() => {
            // Se fechar o modal e estava conectado a um dispositivo descoberto, desconecta
            if (
              item.itemType === 'discovered' &&
              isConnected &&
              !isRegisteringOnBackend
            ) {
              disconnectFromDevice();
            }
            setIsRegisteringOnBackend(false);
          }}
        >
          <View style={styles.portalView}>
            <ThemedText style={styles.modalTitle}>
              Conectar {item.name || 'Dispositivo'} na Rede Wi-Fi
            </ThemedText>
            <View style={styles.inputModalContainer}>
              <ThemedTextInput
                placeholder="Nome da rede Wi-Fi (SSID)"
                value={wifiSSID}
                onChangeText={setWifiSSID}
                autoCapitalize="none"
              />
            </View>
            <View style={styles.inputModalContainer}>
              <ThemedTextInput
                placeholder="Senha da rede Wi-Fi"
                secureTextEntry
                value={wifiPassword}
                onChangeText={setWifiPassword}
                autoCapitalize="none"
              />
            </View>
            <View style={styles.buttonModalContainer}>
              {isRegisteringOnBackend || wifiStatus === '0' ? (
                <ActivityIndicator size="small" color={ThemedColors.text} />
              ) : (
                <PrimaryButton
                  title="Enviar Credenciais Wi-Fi"
                  onPress={handleSendWifiCredentialsWithLoading}
                />
              )}
            </View>
            {/* Feedback do status do Wi-Fi no modal */}
            {wifiStatus === '0' && (
              <ThemedText style={styles.statusText}>
                Enviando/Conectando Wi-Fi...
              </ThemedText>
            )}
            {wifiStatus === 'true' && (
              <ThemedText style={[styles.statusText, { color: 'green' }]}>
                Wi-Fi Configurado! Registrando...
              </ThemedText>
            )}
            {wifiStatus === 'false' && (
              <ThemedText style={[styles.statusText, { color: 'red' }]}>
                Falha na conexão Wi-Fi.
              </ThemedText>
            )}
            <View style={{ height: 40 }} />
          </View>
        </Modalize>
      </Portal>
    </TouchableOpacity>
  );
};

// Seus estilos (adicione os novos se necessário)
const styles = StyleSheet.create({
  meterContainer: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: ThemedColors.text || ThemedColors.placeholder,
    backgroundColor: ThemedColors.background_card || 'white',
  },
  meterName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: ThemedColors.text,
    marginBottom: 4,
  },
  meterId: {
    fontSize: 12,
    color: ThemedColors.text,
    marginBottom: 8,
  },
  meterRssi: {
    fontSize: 12,
    color: ThemedColors.text,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  statusIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
  },
  portalView: {
    padding: 20,
    backgroundColor:
      ThemedColors.background_submenu1 || ThemedColors.background,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: ThemedColors.text,
  },
  inputModalContainer: { marginVertical: 10 },
  buttonModalContainer: { marginVertical: 20 },
  statusText: { marginTop: 10, textAlign: 'center', fontSize: 14 },
});

export default MeterButton;
