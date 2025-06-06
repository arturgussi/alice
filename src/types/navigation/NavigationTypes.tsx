import { NavigatorScreenParams } from '@react-navigation/native';

import { AppEquipment } from '../models/EquipmentModel';

export type HomeStackParamList = {
  HomeMain: undefined;
  // Telas que não estão no BottomTabNavigator mas devem mostrar ele devem ficar aqui
  EquipmentRoute: NavigatorScreenParams<EquipmentStackParamList>;
  MeterRegisterScreen: undefined;
};

export type MeasurementStackParamList = {
  MeasurementList: undefined;
  MeasurementDetail: { measurementId: string };
};

export type EquipmentStackParamList = {
  EquipmentManagementScreen: undefined;
  EquipmentFormScreen: { equipment?: AppEquipment };
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
