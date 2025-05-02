import React, {useState} from 'react';
import {View, TouchableOpacity, Image} from 'react-native';
import {NavigationProp} from '@react-navigation/native';

import styles from './AccountRegisterScreen.style';

import images from '@assets/Images';
import BackgroundWrapper from '@components/wrappers/BackgroundWrapper';
import ThemedTextInput from '@components/inputs/ThemedTextInput';
import ThemedText from '@components/texts/ThemedText';
import PrimaryButton from '@components/buttons/PrimaryButton';
import {AuthStackParamList} from '@routes/AuthNavigator';

type AccountRegisterNavigationProp = NavigationProp<
  AuthStackParamList,
  'Register'
>;

interface AccountRegisterProps {
  navigation: AccountRegisterNavigationProp;
}

const AccountRegisterScreen = ({navigation}: AccountRegisterProps) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    console.log('Register', nome, email, password);
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
            placeholder="Senha"
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
            style={[styles.touchableOpacity, {marginTop: 20}]}
            onPress={() => navigation.goBack()}>
            <ThemedText style={styles.text}>Já possui uma conta?</ThemedText>
            <ThemedText style={styles.text}>Login</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </BackgroundWrapper>
  );
};

export default AccountRegisterScreen;
