import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Modal,
  ScrollView,
  Switch,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import PrimaryButton from '@/components/buttons/ThemedButton';
import ThemedIconTextInput from '@/components/inputs/ThemedIconTextInput';
import ThemedTextInput from '@/components/inputs/ThemedTextInput';
import DeleteAccountModal from '@/components/modals/DeleteAccountModal';
import ThemedText from '@/components/texts/ThemedText';
import BackgroundWrapper from '@/components/wrappers/BackgroundWrapper';
import { ThemedColors } from '@/constants/Theme.style';
import { useAuth } from '@/hooks/useAuth';
import { useTariffs } from '@/hooks/useTariffs';
import { updateExistingUser } from '@/services/api/UserService';
import { UpdateUserApiPayload } from '@/types/api/UserApi';
import { ProfileStackParamList } from '@/types/navigation/NavigationTypes';
import { updateAccountData } from '@services/auth/Auth';

import styles from './UserProfileScreen.style';

// Tipagem para a prop de navegação, para segurança e autocompletar
type UserProfileScreenNavigationProp = NativeStackNavigationProp<
  ProfileStackParamList,
  'UserProfileView'
>;

const UserProfileScreen: React.FC = () => {
  const navigation = useNavigation<UserProfileScreenNavigationProp>();
  const { appUser, refreshAppUserProfile } = useAuth();

  // --- Estados do Formulário ---
  const [nome, setNome] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangePasswordActive, setIsChangePasswordActive] = useState(false);
  const [isAneelTariffActive, setIsAneelTariffActive] = useState(false);
  const [manualTariff, setManualTariff] = useState('');
  const [selectedUf, setSelectedUf] = useState<string | undefined>();
  const [selectedDistributorId, setSelectedDistributorId] = useState<
    number | undefined
  >();

  // --- Estados de Controle da UI ---
  const { ufs, isLoadingUfs, distributors, isLoadingDistributors } =
    useTariffs(selectedUf);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Efeito para preencher o formulário com os dados do usuário quando a tela carrega
  useEffect(() => {
    if (appUser) {
      setNome(appUser.displayName || '');

      const hasAneelTariff = !!appUser.idTariff;
      setIsAneelTariffActive(hasAneelTariff);

      if (hasAneelTariff) {
        setSelectedUf(appUser.UF);
        setSelectedDistributorId(appUser.idTariff);
        setManualTariff('');
      } else {
        setManualTariff(String(appUser.tariff || ''));
      }
    }
  }, [appUser]);

  // Função unificada para salvar todas as alterações
  const handleSaveChanges = async () => {
    if (!appUser) {
      Alert.alert('Erro', 'Você precisa estar logado para salvar alterações.');
      return;
    }

    // Validações
    if (!nome.trim()) {
      Alert.alert('Atenção', 'O nome é obrigatório.');
      return;
    }
    if (isChangePasswordActive) {
      if (password && password !== confirmPassword) {
        Alert.alert('Atenção', 'As novas senhas não coincidem.');
        return;
      }
      if (password && password.length < 6) {
        Alert.alert(
          'Atenção',
          'A nova senha deve ter pelo menos 6 caracteres.',
        );
        return;
      }
    }

    setIsUpdating(true);
    try {
      // 1. Atualiza dados de autenticação no Firebase (Nome e Senha, se fornecida)
      await updateAccountData(nome, password || undefined);

      // 2. Prepara e atualiza dados customizados no seu backend (Tarifa)
      let backendPayload: UpdateUserApiPayload;
      if (isAneelTariffActive) {
        if (!selectedDistributorId) {
          Alert.alert(
            'Atenção',
            'Por favor, selecione uma UF e uma distribuidora.',
          );
          setIsUpdating(false);
          return;
        }
        backendPayload = { idTarifa: selectedDistributorId, tarifa: null };
      } else {
        const tariffValue = parseFloat(manualTariff.replace(',', '.'));
        if (isNaN(tariffValue)) {
          Alert.alert(
            'Atenção',
            'Por favor, insira um valor de tarifa válido.',
          );
          setIsUpdating(false);
          return;
        }
        backendPayload = { tarifa: tariffValue, idTarifa: null };
      }

      await updateExistingUser(appUser.uid, backendPayload);

      // 3. Atualiza o estado global do appUser para refletir todas as mudanças
      await refreshAppUserProfile();

      Alert.alert('Sucesso!', 'Seu perfil foi atualizado.');
      setPassword(''); // Limpa os campos de senha por segurança
      setConfirmPassword('');
    } catch (e: unknown) {
      const message =
        e instanceof Error
          ? e.message
          : 'Erro desconhecido ao salvar o perfil.';
      Alert.alert('Erro ao Salvar', message);
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
    <BackgroundWrapper>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <ThemedText style={styles.pageTitle}>Meu Perfil</ThemedText>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <ThemedText style={{ textAlign: 'center', marginBottom: 20 }}>
              E-mail: {appUser?.email}
            </ThemedText>
            <FontAwesomeIcon
              name={'trash'}
              size={20}
              color={'red'}
              onPress={handleDeleteAccount}
            />
          </View>
          <ThemedText style={styles.sectionTitle}>Dados Pessoais</ThemedText>
          <View style={styles.inputContainer}>
            <ThemedTextInput
              placeholder="Seu nome"
              value={nome}
              onChangeText={setNome}
            />
          </View>

          <View style={styles.toggleContainer}>
            <Switch
              value={isChangePasswordActive}
              onValueChange={setIsChangePasswordActive}
              thumbColor={ThemedColors.text}
              trackColor={{ false: '#767577', true: ThemedColors.lightPurple }}
            />
            <ThemedText>Alterar senha</ThemedText>
          </View>
          <View style={styles.inputContainer}>
            <ThemedIconTextInput
              placeholder="Nova Senha"
              editable={isChangePasswordActive}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              iconName={showPassword ? 'eye-slash' : 'eye'}
              onIconPress={() => setShowPassword(!showPassword)}
            />
          </View>
          <View style={styles.inputContainer}>
            <ThemedIconTextInput
              placeholder="Confirmar nova senha"
              editable={isChangePasswordActive}
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              iconName={showConfirmPassword ? 'eye-slash' : 'eye'}
              onIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          </View>

          <ThemedText style={styles.sectionTitle}>
            Configuração de Tarifa
          </ThemedText>
          <View style={styles.toggleContainer}>
            <Switch
              value={isAneelTariffActive}
              onValueChange={setIsAneelTariffActive}
              thumbColor={ThemedColors.text}
              trackColor={{ false: '#767577', true: ThemedColors.lightPurple }}
            />
            <ThemedText>Usar tarifa da ANEEL</ThemedText>
          </View>

          {isAneelTariffActive ? (
            <>
              <View style={styles.pickerContainer}>
                {isLoadingUfs ? (
                  <ActivityIndicator />
                ) : (
                  <Picker
                    selectedValue={selectedUf}
                    onValueChange={itemValue => {
                      setSelectedUf(itemValue);
                    }}
                    style={styles.picker}
                  >
                    <Picker.Item label="Selecione uma UF..." value={null} />
                    {(ufs || []).map(uf => (
                      <Picker.Item key={uf.uf} label={uf.uf} value={uf.uf} />
                    ))}
                  </Picker>
                )}
              </View>
              <View style={styles.pickerContainer}>
                {isLoadingDistributors ? (
                  <ActivityIndicator />
                ) : (
                  <Picker
                    selectedValue={selectedDistributorId}
                    onValueChange={itemValue =>
                      setSelectedDistributorId(itemValue)
                    }
                    // enabled={!!selectedUf}
                    style={styles.picker}
                  >
                    <Picker.Item
                      label="Selecione uma Distribuidora..."
                      value={null}
                    />
                    {(distributors || []).map(d => (
                      <Picker.Item
                        key={d.id}
                        label={d.distribuidora}
                        value={d.id}
                      />
                    ))}
                  </Picker>
                )}
              </View>
            </>
          ) : (
            <View style={styles.inputContainer}>
              <ThemedTextInput
                placeholder="Digite sua tarifa (ex: 0,95)"
                value={manualTariff}
                onChangeText={setManualTariff}
                keyboardType="numeric"
              />
            </View>
          )}

          <View style={styles.buttonContainer}>
            {isUpdating ? (
              <ActivityIndicator size="large" color={ThemedColors.text} />
            ) : (
              <PrimaryButton
                title="Salvar Alterações"
                onPress={handleSaveChanges}
              />
            )}
          </View>

          <Modal
            animationType="fade"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={handleCloseModal}
            statusBarTranslucent={true}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.modalOverlay}>
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
      </ScrollView>
    </BackgroundWrapper>
  );
};

export default UserProfileScreen;
