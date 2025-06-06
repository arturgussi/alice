import { RouteProp } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import { CustomHeader } from '@/components/header/CustomHeader';
import { ThemedColors } from '@/constants/Theme.style';
import HomeScreen from '@/screens/home/HomeScreen';
import MeterRegisterScreen from '@/screens/register/meter/MeterRegisterScreen';
import { HomeStackParamList } from '@/types/navigation/NavigationTypes';

import { EquipmentStack } from './EquipmentStack';

export type HomeNavigationProps<T extends keyof HomeStackParamList> =
  NativeStackNavigationProp<HomeStackParamList, T>;
export type HomeRouteProps<T extends keyof HomeStackParamList> = RouteProp<
  HomeStackParamList,
  T
>;

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function BottomHomeStack() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        header: () => <CustomHeader navigation={navigation} />,
        contentStyle: {
          backgroundColor: ThemedColors.background,
        },
      })}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen
        name="EquipmentRoute"
        component={EquipmentStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MeterRegisterScreen"
        component={MeterRegisterScreen}
        options={{ title: 'Cadastrar Medidor' }}
      />
    </Stack.Navigator>
  );
}
