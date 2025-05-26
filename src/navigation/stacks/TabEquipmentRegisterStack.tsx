import { RouteProp } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import { CustomHeader } from '@components/header/CustomHeader';
import { ThemedColors } from '@constants/Theme.style';
import EquipmentRegisterScreen from '@screens/register/equipment/EquipmentRegisterScreen';

export type StackRegisterParamList = {
  TabEquipmentRegister: undefined; // Nome específico para evitar conflito se houver outra tela de registro
};

export type TabRegisterNavigationProps<T extends keyof StackRegisterParamList> =
  NativeStackNavigationProp<StackRegisterParamList, T>;
export type TabRegisterRouteProps<T extends keyof StackRegisterParamList> =
  RouteProp<StackRegisterParamList, T>;

const Stack = createNativeStackNavigator<StackRegisterParamList>();

export function TabRegisterStack() {
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
        name="TabEquipmentRegister"
        component={EquipmentRegisterScreen}
        options={{ title: 'Cadastrar Equipamento' }}
      />
    </Stack.Navigator>
  );
}
