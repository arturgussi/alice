import { NavigationProp } from '@react-navigation/native';
import { useState } from 'react';
import { View, TouchableOpacity, Image, Alert } from 'react-native';

import images from '@assets/Images';
import PrimaryButton from '@components/buttons/ThemedButton';
import ThemedTextInput from '@components/inputs/ThemedTextInput';
import ThemedText from '@components/texts/ThemedText';
import BackgroundWrapper from '@components/wrappers/BackgroundWrapper';
import { AuthStackParamList } from 'src/navigation/routes/AuthNavigator';
import { signIn } from '@services/auth/Auth';

import styles from './AuthScreen.style';

type AuthScreenNavigationProp = NavigationProp<AuthStackParamList, 'Login'>;

interface AuthScreenProps {
  navigation: AuthScreenNavigationProp;
}

const AuthScreen = ({ navigation }: AuthScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signIn(email, password);
    } catch (error: unknown) {
      let message = 'Erro ao autenticar.';
      if (typeof error === 'object' && error !== null && 'code' in error) {
        const code = (error as { code: string }).code;
        if (code === 'auth/user-not-found') {
          message = 'Usuário não encontrado.';
        } else if (code === 'auth/wrong-password') {
          message = 'Senha incorreta.';
        } else if (code === 'auth/invalid-email') {
          message = 'Email inválido.';
        }
      }
      Alert.alert('Erro', message);
    }
  };

  const navigateRegisterPage = () => {
    navigation.navigate('Register');
  };

  return (
    <BackgroundWrapper>
      <View style={styles.container}>
        <View style={styles.logoView}>
          <Image source={images.logo} style={styles.logo} />
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
            placeholder="Senha"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <View style={styles.buttonContainer}>
          <PrimaryButton title="Entrar" onPress={handleLogin} />
        </View>
        <TouchableOpacity
          style={styles.touchableOpacity}
          onPress={navigateRegisterPage}
        >
          <ThemedText style={styles.text}>Novo usuário</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.touchableOpacity}
          onPress={() => console.log('Navegar para recuperar senha')}
        >
          <ThemedText style={styles.text}>Esqueci minha senha</ThemedText>
        </TouchableOpacity>
      </View>
    </BackgroundWrapper>
  );
};

export default AuthScreen;
