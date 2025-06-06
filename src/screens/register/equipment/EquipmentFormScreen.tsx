import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';

import { ThemedColors } from '@/constants/Theme.style';
import { useAuth } from '@/hooks/useAuth';
import { useEquipment } from '@/hooks/useEquipment';
import {
  CreateEquipmentApiPayload,
  UpdateEquipmentApiPayload,
} from '@/types/api/EquipmentApi';
import { EquipmentStackParamList } from '@/types/navigation/NavigationTypes';
import PrimaryButton from '@components/buttons/ThemedButton';
import ThemedTextInput from '@components/inputs/ThemedTextInput';
import ThemedText from '@components/texts/ThemedText';
import BackgroundWrapper from '@components/wrappers/BackgroundWrapper';

import styles from './EquipmentScreen.style';

type EquipmentFormScreenRouteProp = RouteProp<
  EquipmentStackParamList,
  'EquipmentFormScreen'
>;

const EquipmentFormScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<EquipmentFormScreenRouteProp>();

  const existingEquipment = route.params?.equipment;
  const isEditMode = !!existingEquipment;

  const { appUser } = useAuth();
  const {
    createEquipment,
    isCreatingEquipment,
    updateEquipment,
    isUpdatingEquipment,
  } = useEquipment();

  const [equipmentName, setEquipmentName] = useState(
    existingEquipment?.name || '',
  );
  const [equipmentModel, setEquipmentModel] = useState(
    existingEquipment?.model || '',
  );
  const [equipmentBrand, setEquipmentBrand] = useState(
    existingEquipment?.brand || '',
  );

  useEffect(() => {
    navigation.setOptions({
      title: isEditMode ? 'Editar Equipamento' : 'Novo Equipamento',
    });
  }, [isEditMode, navigation]);

  const handleSave = () => {
    if (!appUser) {
      Alert.alert('Erro', 'Você precisa estar logado.');
      return;
    }
    if (!equipmentName.trim()) {
      Alert.alert('Atenção', 'O nome do equipamento é obrigatório.');
      return;
    }

    if (isEditMode) {
      const updatePayload: UpdateEquipmentApiPayload = {
        nome: equipmentName,
        marca: equipmentBrand,
        modelo: equipmentModel,
      };
      updateEquipment(
        { id: existingEquipment.id, payload: updatePayload },
        {
          onSuccess: () => {
            navigation.goBack();
          },
          onError: error => Alert.alert('Erro ao Atualizar', error.message),
        },
      );
    } else {
      const createPayload: CreateEquipmentApiPayload = {
        nome: equipmentName,
        marca: equipmentBrand,
        modelo: equipmentModel,
        idUsuario: appUser.uid,
      };
      createEquipment(
        { payload: createPayload },
        {
          onSuccess: () => {
            navigation.goBack();
          },
          onError: error => Alert.alert('Erro ao Criar', error.message),
        },
      );
    }
  };

  const isSaving = isCreatingEquipment || isUpdatingEquipment;

  return (
    <BackgroundWrapper>
      <View style={styles.container}>
        <ThemedText style={styles.text}>
          {isEditMode ? 'Editar Equipamento' : 'Novo Equipamento'}
        </ThemedText>

        <View style={styles.inputContainer}>
          <ThemedTextInput
            placeholder="Apelido/Nome do equipamento"
            value={equipmentName}
            onChangeText={setEquipmentName}
          />
        </View>
        <View style={styles.inputContainer}>
          <ThemedTextInput
            placeholder="Marca"
            value={equipmentBrand}
            onChangeText={setEquipmentBrand}
          />
        </View>
        <View style={styles.inputContainer}>
          <ThemedTextInput
            placeholder="Modelo"
            value={equipmentModel}
            onChangeText={setEquipmentModel}
          />
        </View>

        <View style={styles.buttonContainer}>
          {isSaving ? (
            <ActivityIndicator size="large" color={ThemedColors.text} />
          ) : (
            <PrimaryButton
              title={isEditMode ? 'Salvar Alterações' : 'Criar Equipamento'}
              onPress={handleSave}
            />
          )}
        </View>
      </View>
    </BackgroundWrapper>
  );
};

export default EquipmentFormScreen;
