import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
} from '@react-navigation/bottom-tabs';
import { NavigatorScreenParams, RouteProp } from '@react-navigation/native';

import CustomMenu from '@components/menu/CustomMenu'; // Seu menu de abas personalizado

// Importe as STACKS para cada aba
import {
  StackRegisterParamList,
  TabRegisterStack,
} from '../stacks/TabEquipmentRegisterStack';
import { TabHomeStack, StackHomeParamList } from '../stacks/TabHomeStack';
import {
  TabProfileStack,
  StackProfileParamList,
} from '../stacks/TabProfileStack';

export type BottomTabParamList = {
  Inicio: NavigatorScreenParams<StackHomeParamList>;
  Cadastro: NavigatorScreenParams<StackRegisterParamList>;
  Perfil: NavigatorScreenParams<StackProfileParamList>;
};

// Props de navegação para uso nas telas dentro do BottomTab (menos comum de precisar)
export type BottomTabNavigationProps<T extends keyof BottomTabParamList> =
  BottomTabNavigationProp<BottomTabParamList, T>;
export type BottomTabRouteProps<T extends keyof BottomTabParamList> = RouteProp<
  BottomTabParamList,
  T
>;

const Tab = createBottomTabNavigator<BottomTabParamList>();

export function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={props => <CustomMenu {...props} />}
    >
      <Tab.Screen name="Inicio" component={TabHomeStack} />
      <Tab.Screen name="Cadastro" component={TabRegisterStack} />
      <Tab.Screen name="Perfil" component={TabProfileStack} />
    </Tab.Navigator>
  );
}
