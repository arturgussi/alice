import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { NavigationProp } from '@react-navigation/native';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity,
  View,
} from 'react-native';

import PrimaryButton from '@components/buttons/ThemedButton';

import styles from './AccountRegisterScreen.style';

import images from '@/assets/Images';
import ThemedTextInput from '@/components/inputs/ThemedTextInput';
import ThemedText from '@/components/texts/ThemedText';
import BackgroundWrapper from '@/components/wrappers/BackgroundWrapper';
import { AuthStackParamList } from '@/navigation/routes/AuthNavigator';
import { createNewUser } from '@/services/api/UserService';
import { setDisplayName, signUp } from '@/services/auth/Auth';
import { CreateUserPayload } from '@/types/ApiTypes';

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
  const [isLoading, setIsLoading] = useState(false); // Estado para loading

  const handleRegister = async () => {
    // ... (sua lógica de validação e início do setIsLoading) ...
    setIsLoading(true);

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
      console.log('Usuário criado no Firebase Auth:', firebaseUser.uid);

      await setDisplayName(nome);
      console.log('DisplayName atualizado no Firebase para:', nome);

      const backendPayload: CreateUserPayload = {
        id: firebaseUser.uid,
        tariff: 0,
      };
      console.log(
        '[AccountRegisterScreen] Payload para backend:',
        backendPayload,
      );
      await createNewUser(backendPayload);
      console.log('Usuário criado com sucesso no backend.');

      setIsLoading(false);
      Alert.alert('Sucesso!', 'Sua conta foi criada com sucesso.');
      navigation.goBack();
    } catch (e: unknown) {
      // Erro agora é 'unknown'
      setIsLoading(false);
      console.error('Erro no processo de registro:', e);

      let displayMessage = 'Erro desconhecido ao criar conta. Tente novamente.';

      if (typeof e === 'object' && e !== null) {
        const errorObject = e as { code?: string; message?: string }; // Asserção para acessar propriedades comuns

        // Verifica códigos de erro do Firebase Auth
        if (typeof errorObject.code === 'string') {
          switch (errorObject.code) {
            case 'auth/email-already-in-use':
              displayMessage = 'Este endereço de e-mail já está em uso.';
              break;
            case 'auth/invalid-email':
              displayMessage = 'O formato do e-mail é inválido.';
              break;
            case 'auth/weak-password':
              displayMessage = 'A senha é muito fraca (mínimo 6 caracteres).';
              break;
            default:
              // Se for um erro do Firebase com código não listado, usa a mensagem dele se existir
              if (errorObject.message) {
                displayMessage = errorObject.message;
              }
              break;
          }
        } else if (
          typeof errorObject.message === 'string' &&
          errorObject.message
        ) {
          // Para outros erros que têm uma propriedade 'message' (ex: erros da sua API de backend)
          displayMessage = errorObject.message;
        }
      } else if (typeof e === 'string') {
        // Se o erro for apenas uma string
        displayMessage = e;
      }

      Alert.alert('Erro de Registro', displayMessage);
    }
  };

  return (
    <BackgroundWrapper>
      <View style={styles.container}>
        <View style={styles.logoView}>
          <Image source={images.logo} style={styles.logo} />
        </View>
        <ThemedText>Novo usuário</ThemedText>
        <View style={styles.inputContainer}>
          <ThemedTextInput
            placeholder="Digite seu nome"
            autoCapitalize="words"
            keyboardType="default"
            value={nome}
            onChangeText={setNome}
          />
        </View>
        <View style={styles.inputContainer}>
          <ThemedTextInput
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="emailAddress"
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
          {isLoading ? (
            <ActivityIndicator
              size="large"
              // color={ThemedColors.primary}
            />
          ) : (
            <PrimaryButton title="Criar conta" onPress={handleRegister} />
          )}
        </View>
        <View>
          <TouchableOpacity
            style={[styles.touchableOpacity, { marginTop: 20 }]}
            onPress={() => !isLoading && navigation.goBack()} // Desabilita se estiver carregando
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
