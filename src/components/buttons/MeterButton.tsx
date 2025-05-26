import { useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Peripheral } from 'react-native-ble-manager';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import PrimaryButton from '@components/buttons/ThemedButton';
import ThemedTextInput from '@components/inputs/ThemedTextInput';
import ThemedText from '@components/texts/ThemedText';
import { ThemedColors } from '@constants/Theme.style';
import useBluetoothConnectionsEvent from '@hooks/useBluetoothConnectionsEvents';

type MeterButtonProps = {
  peripheral: Peripheral;
};

const MeterButton = ({ peripheral }: MeterButtonProps) => {
  const [wifiSSID, setWifiSSID] = useState<string | undefined>();
  const [wifiPassword, setWifiPassword] = useState<string | undefined>();
  const {
    isConnecting,
    isConnected,
    error,
    wifiStatus,
    connectToDevice,
    sendWifiCredentials,
  } = useBluetoothConnectionsEvent({
    peripheral,
  });
  const modalizeRef = useRef<Modalize>(null);

  const handleSendWifiCredencials = async () => {
    sendWifiCredentials(wifiSSID, wifiPassword).then(() => {
      modalizeRef.current?.close();
    });
  };

  const handleConnectToDevice = () => {
    connectToDevice().then(() => {
      modalizeRef.current?.open();
    });
  };

  let bluetoothStatusColor = 'transparent';
  if (isConnecting) {
    bluetoothStatusColor = 'orange';
  } else if (isConnected) {
    bluetoothStatusColor = 'green';
  } else if (error != undefined) {
    bluetoothStatusColor = 'red';
  }

  let wifiStatusColor = 'transparent';
  if (isConnected) {
    if (wifiStatus == '') {
      wifiStatusColor = 'gray';
    } else if (wifiStatus == '0') {
      wifiStatusColor = 'orange';
    } else if (wifiStatus == 'true') {
      wifiStatusColor = 'green';
    } else if (wifiStatus == 'false') {
      wifiStatusColor = 'red';
    }
  }

  return (
    <TouchableOpacity
      style={styles.meterContainer}
      onPress={handleConnectToDevice}
      disabled={isConnecting}
    >
      <ThemedText>Name: {peripheral.name || 'N/A'}</ThemedText>
      <ThemedText>ID: {peripheral.id}</ThemedText>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          marginTop: 16,
        }}
      >
        <FontAwesomeIcon
          name={'bluetooth'}
          style={{ color: bluetoothStatusColor }}
        />
        <FontAwesomeIcon
          name={'wifi'}
          style={{ color: wifiStatusColor, marginLeft: 8 }}
        />
      </View>

      <Portal>
        <Modalize ref={modalizeRef} adjustToContentHeight>
          <View style={styles.portal}>
            <ThemedText style={{ textAlign: 'center' }}>
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
