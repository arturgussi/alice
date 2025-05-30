import { RouteProp } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import { CustomHeader } from '@/components/header/CustomHeader';
import { ThemedColors } from '@/constants/Theme.style';
import MeterRegisterScreen from '@/screens/register/meter/MeterRegisterScreen';
import { DrawerMeterRegisterStackParamList } from '@/types/navigation/NavigationTypes';

export type DrawerMeterRegisterNavigationProps<
  T extends keyof DrawerMeterRegisterStackParamList,
> = NativeStackNavigationProp<DrawerMeterRegisterStackParamList, T>;

export type DrawerMeterRegisterRouteProps<
  T extends keyof DrawerMeterRegisterStackParamList,
> = RouteProp<DrawerMeterRegisterStackParamList, T>;

const Stack = createNativeStackNavigator<DrawerMeterRegisterStackParamList>();

export function DrawerMeterRegisterStack() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        header: () => <CustomHeader navigation={navigation} />,
        contentStyle: {
          backgroundColor: ThemedColors.background,
        },
      })}
    >
      <Stack.Screen name="MeterRegisterForm" component={MeterRegisterScreen} />
    </Stack.Navigator>
  );
}
