import { RouteProp } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import { CustomHeader } from '@components/header/CustomHeader';
import { ThemedColors } from '@constants/Theme.style';
import HomeScreen from '@screens/home/HomeScreen';
import MeterRegisterScreen from '@screens/register/meter/MeterRegisterScreen';

export type StackHomeParamList = {
  Home: undefined;
  EquipmentMeasure: { equipmentId: string };
  MeterRegister: undefined;
};

export type TabHomeNavigationProps<T extends keyof StackHomeParamList> =
  NativeStackNavigationProp<StackHomeParamList, T>;
export type TabHomeRouteProps<T extends keyof StackHomeParamList> = RouteProp<
  StackHomeParamList,
  T
>;

const Stack = createNativeStackNavigator<StackHomeParamList>();

export function TabHomeStack() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        header: () => <CustomHeader navigation={navigation} />,
        contentStyle: {
          backgroundColor: ThemedColors.background,
        },
      })}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Início' }}
      />
      <Stack.Screen
        name="EquipmentMeasure"
        component={MeterRegisterScreen}
        options={{ title: 'Medir Equipamento' }}
      />
      <Stack.Screen
        name="MeterRegister"
        component={MeterRegisterScreen}
        options={{ title: 'Cadastrar Medidor' }}
      />
    </Stack.Navigator>
  );
}
