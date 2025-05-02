import React, {useState} from 'react';
import {View} from 'react-native';

import styles from './EquipmentRegisterScreen.style';

import BackgroundWrapper from '@components/wrappers/BackgroundWrapperTitle';
import ThemedTextInput from '@components/inputs/ThemedTextInput';
import ThemedText from '@components/texts/ThemedText';
import PrimaryButton from '@components/buttons/PrimaryButton';
import ThemedIconTextInput from '@components/inputs/ThemedIconTextInput';
import ThemedDropdownModal from '@components/inputs/ThemedDropdownModal';

const EquipmentRegisterScreen = () => {
  const [equipmentName, setEquipmentName] = useState('');
  const [equipmentModel, setEquipmentModel] = useState('');
  const [equipmentBrand, setEquipmentBrand] = useState('');
  const [equipmentCode, setEquipmentCode] = useState('');
  const [equipmentVoltage, setEquipmentVoltage] = useState('');

  const handleValueSelected = (value: string) => {
    setEquipmentVoltage(value);
    console.log('Selected value:', value);
  };

  const handleRegister = () => {
    console.log(
      'Register',
      equipmentName,
      equipmentModel,
      equipmentBrand,
      equipmentCode,
      equipmentVoltage,
    );
  };

  const handleTooltip = () => {
    console.log('Tooltip clicked!');
  };

  return (
    <BackgroundWrapper>
      <View style={styles.container}>
        <ThemedText style={styles.text}>Cadastro de equipamento</ThemedText>
        <View style={styles.inputContainer}>
          <ThemedTextInput
            placeholder="Apelido/Nome do equipamento"
            autoCapitalize="none"
            keyboardType="default"
            value={equipmentName}
            onChangeText={setEquipmentName}
          />
        </View>
        <View style={styles.inputContainer}>
          <ThemedTextInput
            placeholder="Modelo"
            autoCapitalize="none"
            keyboardType="default"
            value={equipmentModel}
            onChangeText={setEquipmentModel}
          />
        </View>
        <View style={styles.inputContainer}>
          <ThemedTextInput
            placeholder="Marca"
            autoCapitalize="none"
            keyboardType="default"
            value={equipmentBrand}
            onChangeText={setEquipmentBrand}
          />
        </View>
        <View style={styles.inputContainer}>
          <ThemedIconTextInput
            placeholder="Código do equipamento"
            onIconPress={handleTooltip}
            value={equipmentCode}
            onChangeText={setEquipmentCode}
            iconName="info-circle"
          />
        </View>
        <View style={styles.inputContainer}>
          <ThemedDropdownModal
            value={equipmentVoltage}
            placeholder="Tensão"
            onValueSelected={handleValueSelected}
            options={['110V', '220V']}
          />
        </View>
        <View style={styles.buttonContainer}>
          <PrimaryButton title="Criar conta" onPress={handleRegister} />
        </View>
      </View>
    </BackgroundWrapper>
  );
};

export default EquipmentRegisterScreen;
