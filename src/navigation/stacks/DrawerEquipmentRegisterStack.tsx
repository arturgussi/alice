import { RouteProp } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import { CustomHeader } from '@components/header/CustomHeader';
import { ThemedColors } from '@constants/Theme.style';
import EquipmentRegisterScreen from '@screens/register/equipment/EquipmentRegisterScreen';
// Importe outras telas se este fluxo de cadastro for mais complexo (ex: Wizard)

export type DrawerEquipmentRegisterStackParamList = {
  MainEquipmentRegister: undefined;
  // EquipmentRegisterStep2: undefined; // Exemplo
};

export type DrawerEqRegisterNavigationProps<
  T extends keyof DrawerEquipmentRegisterStackParamList,
> = NativeStackNavigationProp<DrawerEquipmentRegisterStackParamList, T>;
export type DrawerEqRegisterRouteProps<
  T extends keyof DrawerEquipmentRegisterStackParamList,
> = RouteProp<DrawerEquipmentRegisterStackParamList, T>;

const Stack =
  createNativeStackNavigator<DrawerEquipmentRegisterStackParamList>();

export function DrawerEquipmentRegisterStack() {
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
        name="MainEquipmentRegister"
        component={EquipmentRegisterScreen}
        options={{ title: 'Cadastro de Equipamento' }}
      />
      {/* Adicione mais telas ao fluxo de cadastro aqui, se necessário */}
    </Stack.Navigator>
  );
}
