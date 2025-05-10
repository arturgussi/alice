import {StyleSheet, TouchableOpacity} from 'react-native';
import {Peripheral} from 'react-native-ble-manager';

import ThemedText from '@components/texts/ThemedText';
import {ThemedColors} from '@constants/Theme.style';

type MeterButtonProps = {
  peripheral: Peripheral;
  onConnect: (peripheral: Peripheral) => void;
  isConnecting?: boolean;
  isConnected?: boolean;
  error?: boolean;
};

const MeterButton = ({
  peripheral,
  onConnect,
  isConnecting,
  isConnected,
  error,
}: MeterButtonProps) => {
  return (
    <TouchableOpacity
      style={styles.meterContainer}
      onPress={() => onConnect(peripheral)}>
      <ThemedText>Name: {peripheral.name || 'N/A'}</ThemedText>
      <ThemedText>ID: {peripheral.id}</ThemedText>
      <ThemedText>RSSI: {peripheral.rssi}</ThemedText>
      {isConnecting ? <ThemedText> Conectando... </ThemedText> : false}
      {isConnected ? <ThemedText> Conectado! </ThemedText> : false}
      {error ? <ThemedText> Erro ao se conectar! </ThemedText> : false}
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
