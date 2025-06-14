import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import PrimaryButton from '@/components/buttons/ThemedButton';
import ThemedTextInput from '@/components/inputs/ThemedTextInput';
import ThemedText from '@/components/texts/ThemedText';
import { ThemedColors } from '@/constants/Theme.style';
import { useAuth } from '@/hooks/useAuth';
import useBluetoothConnectionsEvents from '@/hooks/useBluetoothConnectionsEvents';
import { useEquipment } from '@/hooks/useEquipment';
import { useMeter } from '@/hooks/useMeter';
import { CreateMeterApiPayload } from '@/types/api/MeterApi';
import { MeterListItemType } from '@/types/models/MeterModel';
import { getErrorMessage } from '@/Util';

export interface MeterButtonProps {
  item: MeterListItemType;
  onRegistrationSuccess?: (meterId: string) => void;
}

const MeterButton: React.FC<MeterButtonProps> = ({
  item,
  onRegistrationSuccess,
}) => {
  const { appUser } = useAuth();
  const { equipments, isLoadingEquipments } = useEquipment();
  const { createMeter, isCreatingMeter } = useMeter();
  const {
    isConnecting,
    isConnected,
    wifiStatus,
    connectToDevice,
    disconnectFromDevice,
    sendWifiCredentials,
  } = useBluetoothConnectionsEvents({ device: item });

  // --- Estados Locais ---
  const [isWifiModalVisible, setIsWifiModalVisible] = useState(false);
  const [isEquipmentModalVisible, setIsEquipmentModalVisible] = useState(false);
  const [wifiSSID, setWifiSSID] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<
    number | undefined
  >();
  const [isSendingWifi, setIsSendingWifi] = useState(false);
  const [wifiErrorMessage, setWifiErrorMessage] = useState<string | null>(null);

  // --- Orquestrador de Fluxo ---
  useEffect(() => {
    if (item.itemType !== 'discovered' || !isConnected) return;

    if (wifiStatus === 'true') {
      setIsWifiModalVisible(false);
      setIsEquipmentModalVisible(true);
    } else if (wifiStatus === 'false') {
      setWifiErrorMessage(
        'A conexão Wi-Fi falhou. Verifique os dados e tente novamente.',
      );
      setIsWifiModalVisible(true); // Reabre o modal de Wi-Fi para mostrar o erro
    }
  }, [wifiStatus, isConnected, item.itemType]);

  // --- Funções de Ação ---

  const handleConnectAndOpenWifiModal = async () => {
    try {
      if (!isConnected) {
        await connectToDevice();
      }
      setWifiErrorMessage(null); // Limpa erros antigos ao abrir
      setIsWifiModalVisible(true);
    } catch (connectErr: unknown) {
      Alert.alert(
        'Falha na Conexão',
        getErrorMessage(
          connectErr,
          'Não foi possível conectar ao dispositivo.',
        ),
      );
    }
  };

  const handleItemPress = async () => {
    if (item.itemType === 'registered') {
      Alert.alert('Medidor Registrado', 'Reconfigurar o Wi-Fi?', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Reconfigurar', onPress: handleConnectAndOpenWifiModal },
      ]);
      return;
    }

    if (item.isRegistered) {
      Alert.alert(
        'Dispositivo Encontrado',
        `"${item.name}" já está registrado no seu sistema.`,
      );
      return;
    }

    // Se for um item novo, inicia o fluxo de conexão e abre o modal de Wi-Fi
    handleConnectAndOpenWifiModal();
  };

  const handleSendWifi = async () => {
    if (!wifiSSID || !wifiPassword) {
      Alert.alert('Atenção', 'Preencha o nome e a senha do Wi-Fi.');
      return;
    }
    setIsSendingWifi(true);
    setWifiErrorMessage(null);
    try {
      await sendWifiCredentials(wifiSSID, wifiPassword);
      // Fecha o modal e aguarda o useEffect reagir ao status do Wi-Fi
      setIsWifiModalVisible(false);
    } catch (sendError: unknown) {
      Alert.alert('Erro ao Enviar', getErrorMessage(sendError, 'Erro'));
    } finally {
      setIsSendingWifi(false);
    }
  };

  // Salva o medidor no backend
  const handleRegisterAndSave = () => {
    if (!selectedEquipmentId) {
      Alert.alert(
        'Atenção',
        'Por favor, selecione a qual equipamento este medidor pertence.',
      );
      return;
    }
    if (!appUser?.uid) {
      Alert.alert('Erro', 'Usuário não identificado. Faça login novamente.');
      return;
    }

    const payload: CreateMeterApiPayload = {
      macAddress: item.id, // O ID/MAC do dispositivo BLE
      nome: item.name || `Medidor ${item.id.slice(-4)}`,
      idEquipamento: selectedEquipmentId,
      idUsuario: appUser.uid, // Enviando o id do usuário logado
    };

    createMeter(
      { payload },
      {
        onSuccess: () => {
          Alert.alert('Sucesso!', 'O novo medidor foi registrado.');
          onRegistrationSuccess?.(item.id);
          setIsEquipmentModalVisible(false); // Fecha o modal de equipamento
          disconnectFromDevice(); // Desconecta após o sucesso
        },
        onError: error => {
          Alert.alert('Erro no Registro', error.message);
        },
      },
    );
  };

  const closeModalAndDisconnect = () => {
    setIsWifiModalVisible(false);
    setIsEquipmentModalVisible(false);
    if (isConnected) {
      disconnectFromDevice();
    }
  };

  // --- Lógica de UI ---
  const isButtonDisabled =
    (isConnecting || isCreatingMeter) &&
    item.itemType === 'discovered' &&
    !item.isRegistered;

  let bluetoothStatusColor = ThemedColors.text || 'grey';
  let wifiStatusDisplayColor = ThemedColors.text || 'grey';

  if (item.itemType === 'discovered') {
    if (isConnecting) bluetoothStatusColor = 'orange';
    else if (isConnected) bluetoothStatusColor = 'green';
    // else if (connectionError) bluetoothStatusColor = 'red';
  } else if (item.itemType === 'registered') {
    bluetoothStatusColor = ThemedColors.text;
  }

  if (isConnected) {
    if (wifiStatus === 'true') wifiStatusDisplayColor = 'green';
    else if (wifiStatus === '0') wifiStatusDisplayColor = 'orange';
    else if (wifiStatus === 'false') wifiStatusDisplayColor = 'red';
  }

  return (
    <TouchableOpacity
      style={styles.meterContainer}
      onPress={handleItemPress}
      disabled={isButtonDisabled}
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

      <Modal
        animationType="fade"
        transparent={true}
        visible={isWifiModalVisible}
        onRequestClose={closeModalAndDisconnect}
        statusBarTranslucent={true}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
              <View style={styles.modalView}>
                <ThemedText style={styles.modalTitle}>
                  Configurar Wi-Fi do Medidor
                </ThemedText>
                {wifiErrorMessage && (
                  <Text style={styles.statusTextError}>{wifiErrorMessage}</Text>
                )}
                <ThemedTextInput
                  placeholder="Nome da rede Wi-Fi (SSID)"
                  value={wifiSSID}
                  onChangeText={setWifiSSID}
                  autoCapitalize="none"
                />
                <ThemedTextInput
                  placeholder="Senha da rede Wi-Fi"
                  secureTextEntry
                  value={wifiPassword}
                  onChangeText={setWifiPassword}
                  autoCapitalize="none"
                  style={{ marginTop: 10 }}
                />
                <View>
                  {isSendingWifi ? (
                    <ActivityIndicator />
                  ) : (
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                        style={[styles.buttonBase, styles.cancelButton]}
                        onPress={closeModalAndDisconnect}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.buttonTextBase,
                            styles.cancelButtonText,
                          ]}
                        >
                          Cancelar
                        </Text>
                      </TouchableOpacity>
                      <View style={{ width: 10 }} />
                      <PrimaryButton
                        title="Conectar Wi-Fi"
                        onPress={handleSendWifi}
                        disabled={!isConnected}
                      />
                    </View>
                  )}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isEquipmentModalVisible}
        onRequestClose={closeModalAndDisconnect}
        statusBarTranslucent={true}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
              <View style={styles.modalView}>
                <ThemedText style={styles.modalTitle}>
                  Associar Medidor
                </ThemedText>
                <ThemedText style={styles.statusText}>
                  Wi-Fi configurado! Agora, selecione a qual equipamento este
                  medidor pertence.
                </ThemedText>
                {isLoadingEquipments ? (
                  <ActivityIndicator />
                ) : (
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={selectedEquipmentId}
                      onValueChange={id => setSelectedEquipmentId(id)}
                    >
                      <Picker.Item
                        label="Selecione um equipamento..."
                        value={undefined}
                      />
                      {(equipments || []).map(eq => (
                        <Picker.Item
                          key={eq.id}
                          label={eq.name}
                          value={eq.id}
                        />
                      ))}
                    </Picker>
                  </View>
                )}
                <View>
                  {isCreatingMeter ? (
                    <ActivityIndicator />
                  ) : (
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                        style={[styles.buttonBase, styles.cancelButton]}
                        onPress={closeModalAndDisconnect}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.buttonTextBase,
                            styles.cancelButtonText,
                          ]}
                        >
                          Cancelar
                        </Text>
                      </TouchableOpacity>
                      <View style={{ width: 10 }} />
                      <PrimaryButton
                        title="Finalizar Registro"
                        onPress={handleRegisterAndSave}
                        disabled={!selectedEquipmentId}
                      />
                    </View>
                  )}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </TouchableOpacity>
  );
};

// Estilos para o MeterButton e seu modal
const styles = StyleSheet.create({
  meterContainer: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: ThemedColors.placeholder,
    backgroundColor: ThemedColors.background_card,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
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
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: ThemedColors.placeholder,
  },
  portalView: {
    padding: 20,
    paddingTop: 30,
    backgroundColor: ThemedColors.background || ThemedColors.background,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: ThemedColors.text,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: ThemedColors.text,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: ThemedColors.placeholder,
    borderRadius: 8,
    justifyContent: 'center',
  },
  statusText: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
  statusTextSuccess: { color: 'green' },
  statusTextError: { color: 'red' },
  divider: {
    height: 1,
    backgroundColor: ThemedColors.placeholder,
    marginVertical: 25,
  },
  modalOverlay: {
    // Estilo para o fundo opaco
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalView: {
    // Estilo para o card/caixa do popup
    width: '90%',
    maxWidth: 400,
    backgroundColor: ThemedColors.background || 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonBase: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  buttonTextBase: {
    fontSize: 16,
    fontWeight: '500',
  },
  cancelButton: {
    backgroundColor: '#EFEFF4',
  },
  cancelButtonText: {
    color: ThemedColors.text || '#007AFF',
  },
});

export default MeterButton;
