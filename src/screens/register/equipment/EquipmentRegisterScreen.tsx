import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';

import { ThemedColors } from '@/constants/Theme.style';
import { useAuth } from '@/hooks/useAuth';
import { useEquipment } from '@/hooks/useEquipment';
import { CreateEquipmentApiPayload } from '@/types/api/EquipmentApi';
import { HomeStackParamList } from '@/types/navigation/NavigationTypes';
import PrimaryButton from '@components/buttons/ThemedButton';
import ThemedTextInput from '@components/inputs/ThemedTextInput';
import ThemedText from '@components/texts/ThemedText';
import BackgroundWrapper from '@components/wrappers/BackgroundWrapper';

import screenStyles from './EquipmentRegisterScreen.style';

type EquipmentRegisterScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'EquipmentRegisterScreen'
>;

const EquipmentRegisterScreen: React.FC = () => {
  const navigation = useNavigation<EquipmentRegisterScreenNavigationProp>();
  const { appUser } = useAuth();
  const { createEquipment, isCreatingEquipment } = useEquipment();

  const [equipmentName, setEquipmentName] = useState('');
  const [equipmentModel, setEquipmentModel] = useState('');
  const [equipmentBrand, setEquipmentBrand] = useState('');

  const handleRegisterEquipment = () => {
    // 1. Validações
    if (!appUser) {
      Alert.alert(
        'Erro de Autenticação',
        'Você precisa estar logado para criar um equipamento.',
      );
      return;
    }
    if (!equipmentName.trim()) {
      Alert.alert('Atenção', 'O nome do equipamento é um campo obrigatório.');
      return;
    }

    const newEquipmentPayload: CreateEquipmentApiPayload = {
      nome: equipmentName,
      marca: equipmentBrand,
      modelo: equipmentModel,
      idUsuario: appUser.uid,
    };

    createEquipment(
      { payload: newEquipmentPayload },
      {
        onSuccess: () => {
          Alert.alert(
            'Sucesso!',
            `O equipamento "${equipmentName}" foi criado.`,
            [{ text: 'OK', onPress: () => navigation.goBack() }],
          );
        },
        onError: error => {
          console.error(
            '[EquipmentRegisterScreen] Erro ao criar equipamento:',
            error,
          );
          Alert.alert(
            'Erro',
            error.message || 'Não foi possível criar o equipamento.',
          );
        },
      },
    );
  };

  return (
    <BackgroundWrapper>
      <View style={screenStyles.container}>
        <ThemedText style={screenStyles.text}>
          Cadastro de Equipamento
        </ThemedText>

        <View style={screenStyles.inputContainer}>
          <ThemedTextInput
            placeholder="Apelido/Nome do equipamento (ex: Ar da Sala)"
            autoCapitalize="words"
            returnKeyType="next"
            value={equipmentName}
            onChangeText={setEquipmentName}
          />
        </View>
        <View style={screenStyles.inputContainer}>
          <ThemedTextInput
            placeholder="Marca (ex: Samsung)"
            autoCapitalize="words"
            returnKeyType="next"
            value={equipmentBrand}
            onChangeText={setEquipmentBrand}
          />
        </View>
        <View style={screenStyles.inputContainer}>
          <ThemedTextInput
            placeholder="Modelo (ex: Inverter WindFree)"
            autoCapitalize="sentences"
            returnKeyType="done"
            value={equipmentModel}
            onChangeText={setEquipmentModel}
            onSubmitEditing={handleRegisterEquipment}
          />
        </View>
        <View style={screenStyles.buttonContainer}>
          {isCreatingEquipment ? (
            <ActivityIndicator size="large" color={ThemedColors.text} />
          ) : (
            <PrimaryButton
              title="Criar Equipamento"
              onPress={handleRegisterEquipment}
            />
          )}
        </View>
      </View>
    </BackgroundWrapper>
  );
};

export default EquipmentRegisterScreen;
