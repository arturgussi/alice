import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  Image,
} from 'react-native';

import styles from './AuthScreen.style';

import images from '@assets/Images';
import BackgroundWrapper from '@components/container/BackgroundWrapper';
import ThemedTextInput from '@components/inputs/ThemedTextInput';
import ThemedText from '@components/texts/ThemedText';
import PrimaryButton from '@components/buttons/PrimaryButton';

const AuthScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Login', email, password);
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
          onPress={() => console.log('Navegar para cadastro')}>
          <ThemedText style={styles.text}>Novo usuário</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.touchableOpacity}
          onPress={() => console.log('Navegar para recuperar senha')}>
          <ThemedText style={styles.text}>Esqueci minha senha</ThemedText>
        </TouchableOpacity>
      </View>
    </BackgroundWrapper>
  );
};

export default AuthScreen;
