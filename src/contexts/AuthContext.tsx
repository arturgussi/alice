import { FirebaseAuthTypes, getAuth } from '@react-native-firebase/auth';
import axios from 'axios';
import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';

import { BackendUserProfileResponse } from '@/types/api/UserApi';
import { mapToAppUser } from '@/types/mappers/UserMapper';
import { AppUser } from '@/types/models/UserModel';
import { fetchUserById } from '@services/api/UserService';
import { subscribeToAuthChanges } from '@services/auth/Auth';

type FirebaseUserSDK = FirebaseAuthTypes.User;

export interface AuthContextType {
  appUser: AppUser | null;
  isLoadingAuth: boolean;
  authError: string | null;
  isCreatingAccount: boolean;
  setIsCreatingAccount: (isCreating: boolean) => void;
  refreshAppUserProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const _fetchAndSetUserProfile = useCallback(
    async (firebaseUser: FirebaseUserSDK | null) => {
      console.log(
        '1Fetching user profile for:',
        firebaseUser ? firebaseUser.uid : 'no Firebase user',
      );
      setAuthError(null);

      if (firebaseUser) {
        try {
          console.log('Fetch user');
          const backendProfile: BackendUserProfileResponse =
            await fetchUserById(firebaseUser.uid);
          const combinedUser = mapToAppUser(firebaseUser, backendProfile);
          setAppUser(combinedUser);

          if (isCreatingAccount) {
            setIsCreatingAccount(false);
          }
          setIsLoadingAuth(false);
        } catch (error: unknown) {
          let errorMessage = 'Falha ao carregar dados do perfil.';
          let isNotFoundError = false;

          if (axios.isAxiosError(error) && error.response?.status === 404) {
            isNotFoundError = true;
            // Usa a mensagem do erro que fetchUserById já lança para "não encontrado"
            errorMessage =
              error.message || 'Perfil de usuário não encontrado no backend.';
          } else if (error instanceof Error) {
            errorMessage = error.message;
          } else if (typeof error === 'string') {
            errorMessage = error;
          }

          setAuthError(errorMessage);
          setAppUser(null);

          if (isCreatingAccount && isNotFoundError) {
            console.warn(
              '[AuthProvider] Perfil backend não encontrado DURANTE signup. Mantendo isLoadingAuth=true, aguardando refresh.',
            );
          } else {
            // Outros erros, ou 404 fora do fluxo de criação de conta.
            setIsLoadingAuth(false);
          }
        }
      } else {
        // Nenhum usuário Firebase
        setAppUser(null);
        setAuthError(null);
        setIsLoadingAuth(false);
        if (isCreatingAccount) {
          // Reseta se o usuário sumir durante o processo
          setIsCreatingAccount(false);
        }
      }
    },
    [isCreatingAccount, mapToAppUser],
  );

  useEffect(() => {
    setIsLoadingAuth(true);
    const unsubscribe = subscribeToAuthChanges(async fbUser => {
      console.log('2Firebase User Change:', fbUser ? fbUser.uid : 'Logged Out');
      await _fetchAndSetUserProfile(fbUser);
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [_fetchAndSetUserProfile]);

  const refreshAppUserProfile = useCallback(async () => {
    setIsLoadingAuth(true);

    const currentFirebaseUser = getAuth().currentUser;
    await _fetchAndSetUserProfile(currentFirebaseUser);
    console.log(
      '3Firebase User Change:',
      currentFirebaseUser ? currentFirebaseUser.uid : 'Logged Out',
    );
  }, [_fetchAndSetUserProfile]);

  return (
    <AuthContext.Provider
      value={{
        appUser,
        isLoadingAuth,
        authError,
        isCreatingAccount,
        setIsCreatingAccount,
        refreshAppUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
