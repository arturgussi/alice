import { FirebaseAuthTypes } from '@react-native-firebase/auth';

import {
  BackendUserProfileResponse,
  CreateUserApiPayload,
} from '../api/UserApi';
import { AppUser } from '../models/UserModel';

/**
 * Mapeia os dados de um usuário Firebase e informações adicionais (como nome do formulário)
 * para o payload esperado pela API de criação de usuário no backend.
 *
 * @param firebaseUser O objeto User do Firebase.
 * @param initialTariff A tarifa inicial para o novo usuário.
 * @returns O payload para a API de criação de usuário.
 */
export const mapToCreateUserApiPayload = (
  firebaseUser: FirebaseAuthTypes.User,
  initialTariff: number = 0,
): CreateUserApiPayload => {
  return {
    id: firebaseUser.uid,
    tarifa: initialTariff,
  };
};

/**
 * Mapeia/Combina os dados de um usuário Firebase e a resposta do perfil do backend
 * para criar o objeto AppUser completo usado no frontend.
 *
 * @param firebaseUser O objeto User do Firebase.
 * @param backendProfile A resposta da sua API contendo dados customizados do usuário (como 'tarifa').
 * @returns Um objeto AppUser completo.
 */
export const mapToAppUser = (
  firebaseUser: FirebaseAuthTypes.User,
  backendProfile: BackendUserProfileResponse,
): AppUser => {
  if (firebaseUser.uid !== backendProfile.id) {
    console.warn(
      `IDs não correspondem: Firebase UID é ${firebaseUser.uid}, Backend ID é ${backendProfile.id}`,
    );
  }

  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName || null,
    tariff: backendProfile.tarifa,
  };
};
