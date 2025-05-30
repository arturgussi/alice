import { NavigatorScreenParams } from '@react-navigation/native';

// Telas/Fluxos de Cadastro (podem ser apenas as telas de formulário ou stacks aninhadas se forem multi-passo)
// Por simplicidade, vamos assumir que são telas únicas por enquanto.
// Se forem fluxos complexos, você pode definir ParamLists separadas para eles e usar NavigatorScreenParams.
// export type EquipmentRegisterNavParamList = { EquipmentRegisterForm: undefined; EquipmentRegisterStep2: undefined; };
// export type MeterRegisterNavParamList = { MeterRegisterForm: undefined; };

// Stacks para as Abas do BottomTabNavigator
export type HomeStackParamList = {
  HomeMain: undefined;
  // Telas que não estão no BottomTabNavigator mas devem mostrar ele devem ficar aqui
  EquipmentRegisterScreen: undefined;
  MeterRegisterScreen: undefined;
};

export type MeasurementStackParamList = {
  MeasurementList: undefined;
  MeasurementDetail: { measurementId: string };
};

export type ProfileStackParamList = {
  UserProfileView: undefined;
  // EditProfile?: undefined;
};

// BottomTabNavigator ParamList
export type AppBottomTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  MeasurementsTab: NavigatorScreenParams<MeasurementStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

export type MainAppDrawerParamList = {
  AppTabsContainer: NavigatorScreenParams<AppBottomTabParamList>;
  // Telas que devem esconder o BottomTabNavigator deve ficar aqui
};
