import {StyleSheet, TouchableOpacity} from 'react-native';
import {Peripheral} from 'react-native-ble-manager';

import ThemedText from '@components/texts/ThemedText';
import {ThemedColors} from '@constants/Theme.style';
import useBluetoothConnectionsEvent from '@hooks/useBluetoothConnectionsEvents';

type MeterButtonProps = {
  peripheral: Peripheral;
};

const MeterButton = ({peripheral}: MeterButtonProps) => {
  const {isConnecting, isConnected, error, connectToDevice} =
    useBluetoothConnectionsEvent({
      peripheral,
    });

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
});

export default MeterButton;
