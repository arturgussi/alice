import {useState} from 'react';
import {View, Alert} from 'react-native';

import styles from './UserProfileScreen.style';

import ThemedTextInput from '@components/inputs/ThemedTextInput';
import ThemedText from '@components/texts/ThemedText';
import PrimaryButton from '@components/buttons/ThemedButton';
import {useAuth} from '@routes/AppNavigator';
import ThemedIconTextInput from '@components/inputs/ThemedIconTextInput';
import BackgroundWrapperTitle from '@components/wrappers/BackgroundWrapperTitle';
import {deleteAccount, updateAccountData} from '@services/auth/Auth';
import ThemedDeleteButton from '@components/buttons/ThemedDeleteButton';

// type UserProfileNavigationProp = NavigationProp<
//   AuthStackParamList,
//   'Register'
// >;

interface UserProfileProps {
  navigation: any; //UserProfileNavigationProp;
}

const UserProfileScreen = ({navigation}: UserProfileProps) => {
  const {user} = useAuth();
  const [nome, setNome] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

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
    } catch (error: any) {
      let message = 'Erro ao alterar dados da conta.';

      if (error.code === 'auth/email-already-in-use') {
        message = 'Este email já está em uso.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Email inválido.';
      } else if (error.code === 'auth/weak-password') {
        message = 'A senha deve ter pelo menos 6 caracteres.';
      }

      Alert.alert('Erro', message);
    }
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
          onPress: () => deleteAccount(),
          style: 'destructive',
        },
      ],
      {cancelable: true},
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
        <ThemedText>email: {user?.email}</ThemedText>
        <View style={[styles.inputContainer, {marginTop: 12}]}>
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
        <View style={{flex: 1, height: 0}} />
        <View style={styles.buttonContainer}>
          <ThemedDeleteButton
            title="Deletar conta"
            onPress={handleDeleteAccount}
          />
        </View>
      </View>
    </BackgroundWrapperTitle>
  );
};

export default UserProfileScreen;
