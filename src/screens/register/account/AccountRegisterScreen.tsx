import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { NavigationProp } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity,
  View,
} from 'react-native';

import images from '@/assets/Images';
import ThemedTextInput from '@/components/inputs/ThemedTextInput';
import ThemedText from '@/components/texts/ThemedText';
import BackgroundWrapper from '@/components/wrappers/BackgroundWrapper';
import { ThemedColors } from '@/constants/Theme.style';
import { useAuth } from '@/hooks/useAuth';
import { AuthStackParamList } from '@/navigation/routes/AuthNavigator';
import { createNewUser } from '@/services/api/UserService';
import { setDisplayName, signUp } from '@/services/auth/Auth';
import { CreateUserApiPayload } from '@/types/api/UserApi';
import { mapToCreateUserApiPayload } from '@/types/mappers/UserMapper';
import PrimaryButton from '@components/buttons/ThemedButton';

import styles from './AccountRegisterScreen.style';

type AccountRegisterNavigationProp = NavigationProp<
  AuthStackParamList,
  'Register'
>;

interface AccountRegisterProps {
  navigation: AccountRegisterNavigationProp;
}

const AccountRegisterScreen: React.FC<AccountRegisterProps> = ({
  navigation,
}) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { refreshAppUserProfile, setIsCreatingAccount } = useAuth();

  const handleRegister = async () => {
    if (!nome.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Atenção', 'As senhas não coincidem.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Atenção', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setIsLoading(true);
    setIsCreatingAccount(true);

    try {
      const userCredential: FirebaseAuthTypes.UserCredential = await signUp(
        email,
        password,
      );
      const firebaseUser = userCredential.user;

      if (!firebaseUser) {
        throw new Error(
          'Falha ao obter informações do usuário após o registro no Firebase.',
        );
      }

      await setDisplayName(nome);

      const backendPayload: CreateUserApiPayload =
        mapToCreateUserApiPayload(firebaseUser);
      await createNewUser(backendPayload);
      await refreshAppUserProfile();
    } catch (e: unknown) {
      let displayMessage = 'Erro desconhecido ao criar conta. Tente novamente.';

      if (e instanceof Error) {
        displayMessage = e.message;
      } else if (typeof e === 'string') {
        displayMessage = e;
      }

      Alert.alert('Erro de Registro', displayMessage);
      setIsCreatingAccount(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <BackgroundWrapper>
        <View style={[styles.container, styles.fullScreenLoadingContainer]}>
          <ActivityIndicator
            size="large"
            color={ThemedColors.text || '#007AFF'}
          />
          <ThemedText style={styles.fullScreenLoadingText}>
            Criando sua conta e configurando tudo...
          </ThemedText>
        </View>
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper>
      <View style={styles.container}>
        <View style={styles.logoView}>
          <Image source={images.logo} style={styles.logo} />
        </View>
        <ThemedText style={styles.screenTitle}>Novo usuário</ThemedText>
        <View style={styles.inputContainer}>
          <ThemedTextInput
            placeholder="Digite seu nome"
            autoCapitalize="words"
            value={nome}
            onChangeText={setNome}
          />
        </View>
        <View style={styles.inputContainer}>
          <ThemedTextInput
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.inputContainer}>
          <ThemedTextInput
            placeholder="Senha (mín. 6 caracteres)"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <View style={styles.inputContainer}>
          <ThemedTextInput
            placeholder="Confirmar senha"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>
        <View style={styles.buttonContainer}>
          <PrimaryButton title="Criar conta" onPress={handleRegister} />
        </View>
        <View>
          <TouchableOpacity
            style={[styles.touchableOpacity, { marginTop: 20 }]}
            onPress={() => navigation.goBack()}
            disabled={isLoading}
          >
            <ThemedText style={styles.text}>Já possui uma conta?</ThemedText>
            <ThemedText style={styles.text}>Login</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </BackgroundWrapper>
  );
};

export default AccountRegisterScreen;
