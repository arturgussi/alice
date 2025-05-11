import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Peripheral} from 'react-native-ble-manager';

import ThemedText from '@components/texts/ThemedText';
import {ThemedColors} from '@constants/Theme.style';
import useBluetoothConnectionsEvent from '@hooks/useBluetoothConnectionsEvents';
import {useRef, useState} from 'react';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import PrimaryButton from './PrimaryButton';
import ThemedTextInput from '@components/inputs/ThemedTextInput';

type MeterButtonProps = {
  peripheral: Peripheral;
};

const MeterButton = ({peripheral}: MeterButtonProps) => {
  const [wifiSSID, setWifiSSID] = useState<string | undefined>();
  const [wifiPassword, setWifiPassword] = useState<string | undefined>();

  const onDeviceConnected = () => {
    modalizeRef.current?.open();
  };

  const handleSendWifiCredencials = async () => {
    await sendWifiCredentials(wifiSSID, wifiPassword);
    modalizeRef.current?.close();
  };

  const {
    isConnecting,
    isConnected,
    error,
    connectToDevice,
    sendWifiCredentials,
  } = useBluetoothConnectionsEvent({
    peripheral,
    onDeviceConnected,
  });
  const modalizeRef = useRef<Modalize>(null);

  return (
    <TouchableOpacity
      style={styles.meterContainer}
      onPress={connectToDevice}
      disabled={isConnecting}>
      <ThemedText>Name: {peripheral.name || 'N/A'}</ThemedText>
      <ThemedText>ID: {peripheral.id}</ThemedText>
      <ThemedText>RSSI: {peripheral.rssi}</ThemedText>
      {isConnecting && (
        <ThemedText style={{color: 'orange'}}>Conectando...</ThemedText>
      )}
      {isConnected && (
        <ThemedText style={{color: 'green'}}> Conectado! </ThemedText>
      )}
      {error && (
        <ThemedText style={{color: 'red'}}> Erro ao se conectar! </ThemedText>
      )}
      <Portal>
        <Modalize ref={modalizeRef} adjustToContentHeight>
          <View style={styles.portal}>
            <ThemedText style={{textAlign: 'center'}}>
              Conectar ALICE na rede WiFi
            </ThemedText>
            <View style={styles.inputContainer}>
              <ThemedTextInput
                placeholder="Nome da rede WiFI"
                autoCapitalize="none"
                keyboardType="default"
                value={wifiSSID}
                onChangeText={setWifiSSID}
              />
            </View>
            <View style={styles.inputContainer}>
              <ThemedTextInput
                placeholder="Senha"
                autoCapitalize="none"
                keyboardType="default"
                value={wifiPassword}
                onChangeText={setWifiPassword}
              />
            </View>
            <View style={styles.buttonContainer}>
              <PrimaryButton
                title="Enviar dados Wifi"
                onPress={handleSendWifiCredencials}
              />
            </View>
          </View>
        </Modalize>
      </Portal>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  meterContainer: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: ThemedColors.placeholder,
  },
  portal: {
    padding: 12,
    backgroundColor: ThemedColors.background,
  },
  inputContainer: {
    height: 50,
    marginVertical: 8,
  },
  buttonContainer: {
    marginVertical: 14,
  },
});

export default MeterButton;
