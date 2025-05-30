import { NavigatorScreenParams } from '@react-navigation/native';

// Stacks individuais
export type BottomHomeStackParamList = {
  HomeMain: undefined;
};

export type BottomMeasurementStackParamList = {
  MeasurementList: undefined;
  MeasurementDetail: { measurementId: string };
};

export type BottomProfileStackParamList = {
  UserProfileView: undefined;
  // EditProfile: undefined;
};

export type DrawerEquipmentRegisterStackParamList = {
  EquipmentRegisterForm: undefined;
};

export type DrawerMeterRegisterStackParamList = {
  MeterRegisterForm: undefined;
};

// BottomTabNavigator
export type AppBottomTabParamList = {
  HomeTabRoute: NavigatorScreenParams<BottomHomeStackParamList>;
  MeasurementsTabRoute: NavigatorScreenParams<BottomMeasurementStackParamList>;
  ProfileTabRoute: NavigatorScreenParams<BottomProfileStackParamList>;
};

// DrawerNavigator
export type MainAppDrawerParamList = {
  // Rota que renderiza o BottomTabNavigator: Home, Measurements, Profile
  AppBottomTabRouteGroup: NavigatorScreenParams<AppBottomTabParamList>;

  // Rotas para Stacks dedicadas do Drawer
  EquipmentRegisterRoute: NavigatorScreenParams<DrawerEquipmentRegisterStackParamList>;
  MeterRegisterRoute: NavigatorScreenParams<DrawerMeterRegisterStackParamList>;
};
