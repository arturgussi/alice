import { NavigationProp } from '@react-navigation/native';
import { useState } from 'react';
import {
  Alert,
  Keyboard,
  Modal,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import DeleteAccountModal from '@/components/modals/DeleteAccountModal';
import { useAuth } from '@/hooks/useAuth';
import PrimaryButton from '@components/buttons/ThemedButton';
import ThemedDeleteButton from '@components/buttons/ThemedDeleteButton';
import ThemedIconTextInput from '@components/inputs/ThemedIconTextInput';
import ThemedTextInput from '@components/inputs/ThemedTextInput';
import ThemedText from '@components/texts/ThemedText';
import BackgroundWrapperTitle from '@components/wrappers/BackgroundWrapper';
import { updateAccountData } from '@services/auth/Auth';

import styles from './UserProfileScreen.style';

type UserProfileNavigationProp = NavigationProp<'Profile'>;

interface UserProfileProps {
  navigation: UserProfileNavigationProp;
}

const UserProfileScreen = ({ navigation }: UserProfileProps) => {
  const { appUser } = useAuth();

  const [nome, setNome] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleRegister = async () => {
    if (!password || !confirmPassword || !nome) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    try {
      updateAccountData(nome, password);

      Alert.alert('Sucesso', 'Dados alterados com sucesso!');
    } catch (error: unknown) {
      let message = 'Erro ao alterar dados da conta.';

      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        typeof (error as { code?: unknown }).code === 'string'
      ) {
        const code = (error as { code: string }).code;
        if (code === 'auth/email-already-in-use') {
          message = 'Este email já está em uso.';
        } else if (code === 'auth/invalid-email') {
          message = 'Email inválido.';
        } else if (code === 'auth/weak-password') {
          message = 'A senha deve ter pelo menos 6 caracteres.';
        }
      }

      Alert.alert('Erro', message);
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleAccountDeleted = () => {
    handleCloseModal();
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'ATENÇÃO',
      'Você deseja excluir sua conta e todos os dados salvos nela?',
      [
        {
          text: 'Cancelar',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Deletar',
          onPress: () => setIsModalVisible(true),
          style: 'destructive',
        },
      ],
      { cancelable: true },
    );
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <BackgroundWrapperTitle>
      <View style={styles.container}>
        <View>
          <ThemedText style={styles.text}>Dados da conta</ThemedText>
        </View>
        <ThemedText>email: {appUser?.email}</ThemedText>
        <View style={[styles.inputContainer, { marginTop: 12 }]}>
          <ThemedTextInput
            placeholder="Digite seu nome"
            autoCapitalize="words"
            keyboardType="default"
            value={nome}
            onChangeText={setNome}
          />
        </View>
        <View style={styles.inputContainer}>
          <ThemedIconTextInput
            placeholder="Senha"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            iconName="eye"
            onIconPress={toggleShowPassword}
          />
        </View>
        <View style={styles.inputContainer}>
          <ThemedIconTextInput
            placeholder="Confirmar senha"
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            iconName="eye"
            onIconPress={toggleShowConfirmPassword}
          />
        </View>
        <View style={styles.buttonContainer}>
          <PrimaryButton title="Salvar" onPress={handleRegister} />
        </View>
        {/* Spacer */}
        <View style={{ flex: 1, height: 0 }} />
        <View style={styles.buttonContainer}>
          <ThemedDeleteButton
            title="Deletar conta"
            onPress={handleDeleteAccount}
          />
        </View>

        <Modal
          animationType="fade"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => {
            handleCloseModal();
          }}
          statusBarTranslucent={true}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalOverlay}>
              <View style={styles.centeredModalContentView}>
                <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
                  <DeleteAccountModal
                    onClose={handleCloseModal}
                    onAccountDeletedSuccessfully={handleAccountDeleted}
                  />
                </TouchableWithoutFeedback>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </BackgroundWrapperTitle>
  );
};

export default UserProfileScreen;
