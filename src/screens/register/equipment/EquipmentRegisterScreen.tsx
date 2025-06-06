import { useState } from 'react';
import { Alert, View } from 'react-native';

import { useAuth } from '@/hooks/useAuth';
import { createNewEquipment } from '@/services/api/EquipmentService';
import { CreateEquipmentApiPayload } from '@/types/api/EquipmentApi';
import { mapToCreateEquipmentApiPayload } from '@/types/mappers/EquipmentMapper';
import { AppEquipment } from '@/types/models/EquipmentModel';
import PrimaryButton from '@components/buttons/ThemedButton';
import ThemedTextInput from '@components/inputs/ThemedTextInput';
import ThemedText from '@components/texts/ThemedText';
import BackgroundWrapper from '@components/wrappers/BackgroundWrapper';

import styles from './EquipmentRegisterScreen.style';

const EquipmentRegisterScreen = () => {
  const { appUser } = useAuth();

  const [equipmentName, setEquipmentName] = useState('');
  const [equipmentModel, setEquipmentModel] = useState('');
  const [equipmentBrand, setEquipmentBrand] = useState('');

  const handleRegister = async () => {
    // Verifica se usuário está logado
    if (!appUser) {
      throw Error('Usuário não logado');
    }

    if (!equipmentName) {
      Alert.alert('Atenção', 'Nome é obrigatório.');
      return;
    }

    // Cria o objeto AppEquipment e transforma para a API
    const appEquipment: AppEquipment = {
      id: '',
      userUid: appUser?.uid,
      name: equipmentName,
      model: equipmentModel,
      brand: equipmentBrand,
    };

    const equipmentPayload: CreateEquipmentApiPayload =
      mapToCreateEquipmentApiPayload(appEquipment);

    // Cria novo equipamento no backend
    await createNewEquipment(equipmentPayload);
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
            placeholder="Marca"
            autoCapitalize="none"
            keyboardType="default"
            value={equipmentBrand}
            onChangeText={setEquipmentBrand}
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
        <View style={styles.buttonContainer}>
          <PrimaryButton title="Criar equipamento" onPress={handleRegister} />
        </View>
      </View>
    </BackgroundWrapper>
  );
};

export default EquipmentRegisterScreen;
