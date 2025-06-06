import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import {
  Alert,
  Keyboard,
  Modal,
  TouchableWithoutFeedback,
  View,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import DeleteAccountModal from '@/components/modals/DeleteAccountModal';
import { ThemedColors } from '@/constants/Theme.style';
import { useAuth } from '@/hooks/useAuth';
import { ProfileStackParamList } from '@/types/navigation/NavigationTypes';
import PrimaryButton from '@components/buttons/ThemedButton';
import ThemedDeleteButton from '@components/buttons/ThemedDeleteButton';
import ThemedIconTextInput from '@components/inputs/ThemedIconTextInput';
import ThemedTextInput from '@components/inputs/ThemedTextInput';
import ThemedText from '@components/texts/ThemedText';
import BackgroundWrapperTitle from '@components/wrappers/BackgroundWrapper';
import { updateAccountData } from '@services/auth/Auth';

import originalStyles from './UserProfileScreen.style';

// Tipagem para a prop de navegação
type UserProfileNavigationProp = NavigationProp<
  ProfileStackParamList,
  'UserProfileView'
>;

const UserProfileScreen: React.FC = () => {
  const navigation = useNavigation<UserProfileNavigationProp>();
  const { appUser, refreshAppUserProfile } = useAuth();

  const [nome, setNome] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const [isUpdating, setIsUpdating] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (appUser) {
      setNome(appUser.displayName || '');
    }
  }, [appUser]);

  const handleUpdate = async () => {
    // Validações
    if (!nome.trim()) {
      Alert.alert('Atenção', 'O nome é obrigatório.');
      return;
    }
    if (password && password !== confirmPassword) {
      Alert.alert('Atenção', 'As novas senhas não coincidem.');
      return;
    }
    if (password && password.length < 6) {
      Alert.alert('Atenção', 'A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setIsUpdating(true);

    try {
      await updateAccountData(nome, password);

      await refreshAppUserProfile();

      Alert.alert('Sucesso', 'Seus dados foram alterados com sucesso!');
      setPassword('');
      setConfirmPassword('');
    } catch (e: unknown) {
      let message = 'Erro ao alterar dados da conta.';
      if (e instanceof Error) {
        message = e.message;
      }
      Alert.alert('Erro', message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCloseModal = () => setIsModalVisible(false);
  const handleAccountDeleted = () => setIsModalVisible(false);

  const handleDeleteAccount = () => {
    Alert.alert(
      'DELETAR CONTA',
      'Você tem certeza que deseja excluir sua conta permanentemente? Esta ação é irreversível.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          onPress: () => setIsModalVisible(true),
          style: 'destructive',
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <BackgroundWrapperTitle>
      <View style={originalStyles.container}>
        <View>
          <ThemedText style={originalStyles.text}>Dados da conta</ThemedText>
        </View>
        <ThemedText>E-mail: {appUser?.email}</ThemedText>

        <View style={[originalStyles.inputContainer, { marginTop: 20 }]}>
          <ThemedTextInput
            placeholder="Digite seu nome"
            autoCapitalize="words"
            value={nome}
            onChangeText={setNome}
          />
        </View>

        <View style={originalStyles.inputContainer}>
          <ThemedIconTextInput
            placeholder="Nova Senha"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            iconName={showPassword ? 'eye-slash' : 'eye'}
            onIconPress={() => setShowPassword(!showPassword)}
          />
        </View>
        <View style={originalStyles.inputContainer}>
          <ThemedIconTextInput
            placeholder="Confirmar nova senha"
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            iconName={showConfirmPassword ? 'eye-slash' : 'eye'}
            onIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
          />
        </View>

        <View style={originalStyles.buttonContainer}>
          {isUpdating ? (
            <ActivityIndicator size="large" color={ThemedColors.text} />
          ) : (
            <PrimaryButton title="Salvar Alterações" onPress={handleUpdate} />
          )}
        </View>

        <View style={localStyles.spacer} />

        <View style={originalStyles.buttonContainer}>
          <ThemedDeleteButton
            title="Deletar conta"
            onPress={handleDeleteAccount}
          />
        </View>

        <Modal
          animationType="fade"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={handleCloseModal}
          statusBarTranslucent={true}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={originalStyles.modalOverlay}>
              <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
                <DeleteAccountModal
                  onClose={handleCloseModal}
                  onAccountDeletedSuccessfully={handleAccountDeleted}
                />
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </BackgroundWrapperTitle>
  );
};

const localStyles = StyleSheet.create({
  passwordInstruction: {
    fontSize: 12,
    color: ThemedColors.text,
    textAlign: 'center',
    marginBottom: 10,
  },
  spacer: {
    flex: 1,
  },
});

export default UserProfileScreen;
