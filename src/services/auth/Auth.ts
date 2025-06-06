import type { FirebaseAuthTypes } from '@react-native-firebase/auth';
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  deleteUser as firebaseDeleteUser,
  signOut as firebaseSignOut,
  updatePassword as firebaseUpdatePassword,
  updateProfile as firebaseUpdateProfile,
  getAuth,
  onAuthStateChanged,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
} from '@react-native-firebase/auth';

// const authInstance = getAuth(getApp());
const authInstance = getAuth();

/**
 * Realiza o login do usuário com e-mail e senha.
 */
export const signIn = async (
  email: string,
  password: string,
): Promise<FirebaseAuthTypes.UserCredential> => {
  console.log('[AuthService] Tentando login...');
  try {
    const userCredential = await signInWithEmailAndPassword(
      authInstance,
      email,
      password,
    );
    console.log('[AuthService] Login bem-sucedido:', userCredential.user.uid);
    return userCredential;
  } catch (e: unknown) {
    console.error('[AuthService] Falha no login:', e);
    let errorMessage = 'Falha ao fazer login. Verifique suas credenciais.';
    if (typeof e === 'object' && e !== null && 'code' in e) {
      const firebaseError = e as { code: string; message: string };
      switch (firebaseError.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          errorMessage = 'E-mail ou senha inválidos.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'O formato do e-mail é inválido.';
          break;
        case 'auth/too-many-requests':
          errorMessage =
            'Muitas tentativas de login. Tente novamente mais tarde.';
          break;
        default:
          errorMessage = firebaseError.message || errorMessage;
          break;
      }
    } else if (e instanceof Error) {
      errorMessage = e.message;
    }
    throw new Error(errorMessage);
  }
};

/**
 * Cria uma nova conta de usuário com e-mail e senha.
 */
export const signUp = async (
  email: string,
  password: string,
): Promise<FirebaseAuthTypes.UserCredential> => {
  console.log('[AuthService] Tentando criar nova conta...');
  try {
    const userCredential = await createUserWithEmailAndPassword(
      authInstance,
      email,
      password,
    );
    console.log(
      '[AuthService] Conta criada com sucesso:',
      userCredential.user.uid,
    );
    return userCredential;
  } catch (e: unknown) {
    console.error('[AuthService] Falha ao criar conta:', e);
    let errorMessage = 'Falha ao criar conta. Tente novamente.';
    if (typeof e === 'object' && e !== null && 'code' in e) {
      const firebaseError = e as { code: string; message: string };
      switch (firebaseError.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Este endereço de e-mail já está em uso.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'O formato do e-mail é inválido.';
          break;
        case 'auth/weak-password':
          errorMessage = 'A senha é muito fraca (mínimo 6 caracteres).';
          break;
        default:
          errorMessage = firebaseError.message || errorMessage;
          break;
      }
    } else if (e instanceof Error) {
      errorMessage = e.message;
    }
    throw new Error(errorMessage);
  }
};

/**
 * Desloga o usuário atual.
 */
export const signOff = async (): Promise<void> => {
  console.log('[AuthService] Tentando deslogar...');
  try {
    await firebaseSignOut(authInstance);
    console.log('[AuthService] Usuário deslogado com sucesso.');
  } catch (e: unknown) {
    console.error('[AuthService] Falha ao deslogar:', e);
    let errorMessage = 'Ocorreu um erro ao tentar deslogar.';
    if (e instanceof Error) {
      errorMessage = e.message;
      console.error(errorMessage);
    }
  }
};

/**
 * Inscreve-se a mudanças no estado de autenticação do usuário.
 * @param callback Função a ser chamada quando o estado de autenticação mudar.
 * @returns Uma função para cancelar a inscrição (unsubscribe).
 */
export const subscribeToAuthChanges = (
  callback: (user: FirebaseAuthTypes.User | null) => void,
): (() => void) => {
  console.log('[AuthService] Inscrevendo-se a mudanças de autenticação.');
  return onAuthStateChanged(authInstance, callback);
};

/**
 * Define o nome de exibição (displayName) do usuário logado.
 * @param name O novo nome de exibição.
 */
export const setDisplayName = async (name: string): Promise<void> => {
  const user = authInstance.currentUser;
  if (!user) {
    console.error(
      '[AuthService] Nenhum usuário logado para definir displayName.',
    );
    throw new Error('Usuário não autenticado.');
  }
  console.log(`[AuthService] Tentando atualizar displayName para: ${name}`);
  try {
    await firebaseUpdateProfile(user, { displayName: name });
    console.log('[AuthService] DisplayName atualizado com sucesso.');
  } catch (e: unknown) {
    console.error('[AuthService] Falha ao atualizar displayName:', e);
    let errorMessage = 'Falha ao atualizar o nome de exibição.';
    if (e instanceof Error) {
      errorMessage = e.message;
    }
    throw new Error(errorMessage);
  }
};

/**
 * Atualiza o nome de exibição E a senha do usuário logado.
 * As operações são sequenciais; se a atualização do nome falhar, a da senha não é tentada.
 * Lança um erro em caso de falha.
 * @param name O novo nome de exibição.
 * @param newPassword A nova senha (deve ter no mínimo 6 caracteres).
 */
export const updateAccountData = async (
  name: string,
  newPassword: string,
): Promise<void> => {
  // 1. Validação dos inputs no início
  if (!name.trim()) {
    throw new Error('O nome de exibição não pode estar em branco.');
  }
  if (!newPassword || newPassword.length < 6) {
    throw new Error(
      'A nova senha é obrigatória e deve ter pelo menos 6 caracteres.',
    );
  }

  // Pega o usuário uma vez
  const user = authInstance.currentUser;
  if (!user) {
    throw new Error('Usuário não autenticado para atualização de dados.');
  }

  // 2. Envolve ambas as operações em um único try...catch
  try {
    // Passo A: Atualizar o nome
    console.log(`[AuthService] Tentando atualizar displayName para: ${name}`);

    await setDisplayName(name);
    console.log('[AuthService] DisplayName atualizado com sucesso.');

    // Passo B: Atualizar a senha
    console.log('[AuthService] Tentando atualizar a senha...');
    await firebaseUpdatePassword(user, newPassword);
    console.log('[AuthService] Senha atualizada com sucesso.');
  } catch (e: unknown) {
    // 3. O catch agora captura erros de QUALQUER uma das operações
    console.error('[AuthService] Falha ao atualizar dados da conta:', e);

    let errorMessage = 'Falha ao atualizar os dados da conta.';
    if (e instanceof Error) {
      errorMessage = e.message;
    }

    // Se o erro tem um 'code' (típico do Firebase), podemos ser mais específicos
    if (typeof e === 'object' && e !== null && 'code' in e) {
      const firebaseError = e as { code: string; message: string };
      switch (firebaseError.code) {
        case 'auth/requires-recent-login':
          errorMessage =
            'Esta operação é sensível e requer login recente. Por favor, reautentique-se.';
          break;
        case 'auth/weak-password':
          errorMessage = 'A nova senha é muito fraca.';
          break;
      }
    }

    // Lança um novo erro com a mensagem final tratada
    throw new Error(errorMessage);
  }
};

/**
 * Reautentica o usuário atual com a senha fornecida.
 * @param password A senha atual do usuário.
 */
export const reauthenticateCurrentUserWithPassword = async (
  password: string,
): Promise<void> => {
  const user = authInstance.currentUser;

  if (!user || !user.email) {
    console.error(
      '[AuthService] Usuário não encontrado ou sem e-mail para reautenticação.',
    );
    throw new Error(
      'Não foi possível reautenticar. Usuário ou e-mail não disponível.',
    );
  }

  const credential = EmailAuthProvider.credential(user.email, password);

  try {
    await reauthenticateWithCredential(user, credential);
    console.log('[AuthService] Usuário reautenticado com sucesso.');
  } catch (e: unknown) {
    console.error('[AuthService] Falha na reautenticação:', e);
    let errorMessage =
      'Falha ao reautenticar. Verifique sua senha e tente novamente.';
    if (typeof e === 'object' && e !== null && 'code' in e) {
      const firebaseError = e as { code: string; message: string };
      switch (firebaseError.code) {
        case 'auth/wrong-password':
          errorMessage = 'Senha incorreta. Por favor, tente novamente.';
          break;
        case 'auth/user-mismatch':
          errorMessage =
            'As credenciais fornecidas não correspondem ao usuário logado.';
          break;
        case 'auth/too-many-requests':
          errorMessage =
            'Muitas tentativas malsucedidas. Tente novamente mais tarde.';
          break;
        default:
          errorMessage = firebaseError.message || errorMessage;
          break;
      }
    } else if (e instanceof Error) {
      errorMessage = e.message;
    } else if (typeof e === 'string') {
      errorMessage = e;
    }
    throw new Error(errorMessage);
  }
};

/**
 * Deleta a conta do usuário atualmente logado no Firebase Authentication.
 */
export const deleteCurrentUserFirebaseAccount = async (): Promise<void> => {
  const user = authInstance.currentUser;

  if (!user) {
    console.error('[AuthService] Nenhum usuário logado para deletar a conta.');
    throw new Error('Nenhum usuário logado encontrado.');
  }

  try {
    await firebaseDeleteUser(user);
    console.log(
      '[AuthService] Conta do usuário deletada do Firebase com sucesso.',
    );
  } catch (e: unknown) {
    console.error('[AuthService] Falha ao deletar conta do Firebase:', e);
    let errorMessage =
      'Não foi possível deletar sua conta do Firebase no momento.';
    if (typeof e === 'object' && e !== null && 'code' in e) {
      const firebaseError = e as { code: string; message: string };
      switch (firebaseError.code) {
        case 'auth/requires-recent-login':
          errorMessage =
            'Esta operação é sensível e requer autenticação recente. Por favor, reautentique-se e tente novamente.';
          break;
        default:
          errorMessage = firebaseError.message || errorMessage;
          break;
      }
    } else if (e instanceof Error) {
      errorMessage = e.message;
    } else if (typeof e === 'string') {
      errorMessage = e;
    }
    throw new Error(errorMessage);
  }
};
