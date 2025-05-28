import { FirebaseAuthTypes } from '@react-native-firebase/auth';

type FirebaseUserSDK = FirebaseAuthTypes.User;

export interface AppUser {
  // Propriedades do Firebase
  uid: FirebaseUserSDK['uid'];
  email: FirebaseUserSDK['email'];
  displayName: FirebaseUserSDK['displayName'];

  // Propriedades customizadas do backend
  tariff: number;
}
