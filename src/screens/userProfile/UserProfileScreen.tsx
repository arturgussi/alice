import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
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

import ThemedTextInput from '@/components/inputs/ThemedTextInput';
import ThemedText from '@/components/texts/ThemedText';
import BackgroundWrapper from '@/components/wrappers/BackgroundWrapper';
import { ThemedColors } from '@/constants/Theme.style';
import { useAuth } from '@/hooks/useAuth';
import { useTariffs } from '@/hooks/useTariffs';
import { updateExistingUser } from '@/services/api/UserService';
import { UpdateUserApiPayload } from '@/types/api/UserApi';
import PrimaryButton from '@components/buttons/ThemedButton';

import ThemedDeleteButton from '@/components/buttons/ThemedDeleteButton';
import DeleteAccountModal from '@/components/modals/DeleteAccountModal';
import styles from './UserProfileScreen.style';

const UserProfileScreen: React.FC = () => {
  const { appUser, refreshAppUserProfile } = useAuth();

  // Estados do formulário
  const [nome, setNome] = useState(appUser?.displayName || '');
  const [isAneelTariffActive, setIsAneelTariffActive] = useState(
    !!appUser?.idTariff,
  ); // Começa ativo se já tiver idTariff
  const [manualTariff, setManualTariff] = useState(
    String(appUser?.tariff || ''),
  ); // Para o input de tarifa manual
  const [selectedUf, setSelectedUf] = useState<string | undefined>(appUser?.UF);
  const [selectedDistributorId, setSelectedDistributorId] = useState<
    number | undefined
  >(appUser?.idTariff);

  // Hook para buscar os dados dos pickers
  const { ufs, isLoadingUfs, distributors, isLoadingDistributors } =
    useTariffs(selectedUf);

  // Estado de loading para o botão Salvar
  const [isUpdating, setIsUpdating] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);

  // Efeito para preencher o formulário quando o appUser do contexto carregar/mudar
  useEffect(() => {
    if (appUser) {
      setNome(appUser.displayName || '');
      const hasAneelTariff = !!appUser.idTariff; // Verifica se o usuário usa tarifa ANEEL
      setIsAneelTariffActive(hasAneelTariff);
      if (hasAneelTariff) {
        setSelectedUf(appUser.UF);
        setSelectedDistributorId(appUser.idTariff);
        setManualTariff('');
      } else {
        setManualTariff(String(appUser.tariff || ''));
        setSelectedUf(undefined);
        setSelectedDistributorId(undefined);
      }
    }
  }, [appUser]);

  const handleSaveChanges = async () => {
    if (!appUser) {
      Alert.alert('Erro', 'Você precisa estar logado.');
      return;
    }

    let tariff = null;
    let idTariff = null;

    if (isAneelTariffActive) {
      // Modo Tarifa ANEEL
      if (!selectedDistributorId) {
        Alert.alert(
          'Atenção',
          'Por favor, selecione uma UF e uma distribuidora.',
        );
        return;
      }
      idTariff = selectedDistributorId;
    } else {
      // Modo Tarifa Manual
      const tariffValue = parseFloat(manualTariff.replace(',', '.'));
      if (isNaN(tariffValue)) {
        Alert.alert('Atenção', 'Por favor, insira um valor de tarifa válido.');
        return;
      }
      tariff = tariffValue;
    }

    const payload: UpdateUserApiPayload = {
      tarifa: tariff,
      idTarifa: idTariff,
    };

    setIsUpdating(true);
    try {
      await updateExistingUser(appUser.uid, payload);
      await refreshAppUserProfile(); // Atualiza o appUser no contexto com os novos dados
      Alert.alert('Sucesso!', 'Seu perfil foi atualizado.');
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Erro desconhecido';
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
      <ScrollView style={styles.scrollView}>
        <ThemedText style={styles.pageTitle}>Meu Perfil e Tarifa</ThemedText>

        {/* Campo de Nome */}
        <ThemedTextInput
          placeholder="Seu nome"
          value={nome}
          onChangeText={setNome}
        />

        {/* Toggle para Tarifa */}
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
          // --- Campos para Tarifa ANEEL ---
          <>
            <View style={styles.pickerContainer}>
              {isLoadingUfs ? (
                <ActivityIndicator />
              ) : (
                <Picker
                  selectedValue={selectedUf}
                  onValueChange={itemValue => setSelectedUf(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item
                    label="Selecione um Estado (UF)..."
                    value={undefined}
                  />
                  {ufs.map(uf => (
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
                  //enabled={!!selectedUf} // Habilita apenas após selecionar uma UF
                  style={styles.picker}
                >
                  <Picker.Item
                    label="Selecione uma Distribuidora..."
                    value={undefined}
                  />
                  {distributors.map(d => (
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
          // --- Campo para Tarifa Manual ---
          <ThemedTextInput
            placeholder="Digite sua tarifa (ex: 0,75)"
            value={manualTariff}
            onChangeText={setManualTariff}
            keyboardType="numeric"
          />
        )}

        <View style={styles.buttonContainer}>
          {isUpdating ? (
            <ActivityIndicator size="large" />
          ) : (
            <PrimaryButton
              title="Salvar Alterações"
              onPress={handleSaveChanges}
            />
          )}

          <View style={styles.spacer} />

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
