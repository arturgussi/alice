import {getApp} from '@react-native-firebase/app';
import {getAuth} from '@react-native-firebase/auth';

const auth = getAuth(getApp());

export const signIn = (email: string, password: string) => {
  return auth.signInWithEmailAndPassword(email, password);
};

export const signUp = (email: string, password: string) => {
  return auth.createUserWithEmailAndPassword(email, password);
};

export const signOff = () => {
  return auth.signOut();
};

export const subscribeToAuthChanges = (callback: (user: any) => void) => {
  return auth.onAuthStateChanged(callback);
};

export const setDisplayName = (name: string) => {
  return auth.currentUser?.updateProfile({displayName: name});
};

export const updateAccountData = (name: string, newPassord: string) => {
  setDisplayName(name);

  return auth.currentUser?.updatePassword(newPassord);
};

export const deleteAccount = () => {
  return auth.currentUser?.delete();
};
