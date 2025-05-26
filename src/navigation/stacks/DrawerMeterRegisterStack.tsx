import { RouteProp } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import { CustomHeader } from '@components/header/CustomHeader';
import { ThemedColors } from '@constants/Theme.style';
import MeterRegisterScreen from '@screens/register/meter/MeterRegisterScreen'; // Ajuste o caminho se necessário

export type DrawerMeterRegisterStackParamList = {
  MainMeterRegister: undefined;
};

export type DrawerDevRegisterNavigationProps<
  T extends keyof DrawerMeterRegisterStackParamList,
> = NativeStackNavigationProp<DrawerMeterRegisterStackParamList, T>;
export type DrawerDevRegisterRouteProps<
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
      <Stack.Screen
        name="MainMeterRegister"
        component={MeterRegisterScreen}
        options={{ title: 'Cadastro de Dispositivo' }}
      />
    </Stack.Navigator>
  );
}
