import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

import ThemedTextInput from '@/components/inputs/ThemedTextInput';
import { useAuth } from '@/hooks/useAuth';
import { ThemedColors } from '@constants/Theme.style';
import {
  deleteCurrentUserFirebaseAccount,
  reauthenticateCurrentUserWithPassword,
} from '@services/auth/Auth';

interface DeleteAccountModalProps {
  onClose: () => void;
  onAccountDeletedSuccessfully: () => void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  onClose,
  onAccountDeletedSuccessfully,
}) => {
  const { appUser } = useAuth();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirmDelete = async () => {
    if (!password) {
      Alert.alert(
        'Atenção',
        'Por favor, insira sua senha atual para confirmar.',
      );
      return;
    }
    if (!appUser?.uid) {
      Alert.alert(
        'Erro',
        'Não foi possível identificar o usuário para deletar.',
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await reauthenticateCurrentUserWithPassword(password);
      console.log('Reautenticação bem-sucedida.');

      await deleteCurrentUserFirebaseAccount();
      console.log('Conta Firebase deletada.');

      setIsLoading(false);
      Alert.alert('Sucesso', 'Sua conta foi deletada permanentemente.');
      onAccountDeletedSuccessfully();
    } catch (e: unknown) {
      setIsLoading(false);
      let displayMessage = 'Ocorreu um erro ao tentar deletar sua conta.';
      if (e instanceof Error) {
        displayMessage = e.message;
      } else if (typeof e === 'string') {
        displayMessage = e;
      }
      setError(displayMessage);
      Alert.alert('Erro na Deleção', displayMessage);
      console.error('Processo de deleção de conta falhou:', e);
    }
  };

  return (
    <View style={styles.modalView}>
      <Text style={styles.modalTitle}>Confirmar Deleção de Conta</Text>
      <Text style={styles.modalMessage}>
        Esta ação é irreversível e todos os seus dados serão perdidos. Para
        continuar, por favor, insira sua senha atual.
      </Text>
      <ThemedTextInput
        placeholder="Sua senha atual"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
        style={styles.inputField}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={'#007AFF'} />
          <Text style={styles.loaderText}>Processando...</Text>
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.buttonBase, styles.cancelButton]}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={[styles.buttonTextBase, styles.cancelButtonText]}>
              Cancelar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.buttonBase, styles.deleteButton]}
            onPress={handleConfirmDelete}
            activeOpacity={0.7}
          >
            <Text style={[styles.buttonTextBase, styles.deleteButtonText]}>
              Deletar Conta
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  modalView: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: ThemedColors.background_card || 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
    color: ThemedColors.text || '#1C1C1E',
  },
  modalMessage: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 24,
    color: ThemedColors.text || '#3C3C43',
    lineHeight: 22,
  },
  inputField: {
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 14,
  },
  loaderContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loaderText: {
    marginTop: 12,
    fontSize: 14,
    color: ThemedColors.text,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
  },
  buttonBase: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  buttonTextBase: {
    fontSize: 16,
    fontWeight: '500',
  },
  cancelButton: {
    backgroundColor: '#EFEFF4',
  },
  cancelButtonText: {
    color: ThemedColors.text || '#007AFF',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  deleteButtonText: {
    color: '#FFFFFF',
  },
});

export default DeleteAccountModal;
