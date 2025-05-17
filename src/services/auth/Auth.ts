import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';

export const signIn = (email: string, password: string) => {
  return auth().signInWithEmailAndPassword(email, password);
};

export const signUp = (email: string, password: string) => {
  return auth().createUserWithEmailAndPassword(email, password);
};

export const setDisplayName = (user: FirebaseAuthTypes.User, name: string) => {
  return auth().currentUser?.updateProfile({displayName: name});
};

export const signOff = () => {
  return auth().signOut();
};

export const subscribeToAuthChanges = (callback: (user: any) => void) => {
  console.log(auth);
  return auth().onAuthStateChanged(callback);
};
