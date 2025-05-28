import { NavigatorScreenParams } from '@react-navigation/native';

export type StackHomeParamList = {
  Home: undefined;
  EquipmentMeasure: undefined;
  DeviceRegister: undefined;
};

export type StackRegisterParamList = {
  EquipmentRegister: undefined;
};

export type StackProfileParamList = {
  UserProfile: undefined;
};

export type BottomTabParamList = {
  Inicio: NavigatorScreenParams<StackHomeParamList>;
  Cadastro: NavigatorScreenParams<StackRegisterParamList>;
  Perfil: NavigatorScreenParams<StackProfileParamList>;
};

export type DrawerParamList = {
  App: NavigatorScreenParams<BottomTabParamList>;
};
