import { NavigatorScreenParams } from '@react-navigation/native';

export type StackHomeParamList = {
  Home: undefined;
  EquipmentMeasure: undefined; // Verifique o componente para esta tela (veja próxima seção)
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

// Atualize DrawerParamList
// A tela 'App' do Drawer renderiza o BottomTabNavigator
export type DrawerParamList = {
  App: NavigatorScreenParams<BottomTabParamList>;
  // Adicione outras telas de nível superior do drawer aqui, se houver
};
