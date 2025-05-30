import { RouteProp } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import { CustomHeader } from '@/components/header/CustomHeader';
import { ThemedColors } from '@/constants/Theme.style';
import EquipmentRegisterScreen from '@/screens/register/equipment/EquipmentRegisterScreen';
import { DrawerEquipmentRegisterStackParamList } from '@/types/navigation/NavigationTypes';

export type DrawerEquipmentRegisterNavigationProps<
  T extends keyof DrawerEquipmentRegisterStackParamList,
> = NativeStackNavigationProp<DrawerEquipmentRegisterStackParamList, T>;

export type DrawerEquipmentRegisterRouteProps<
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
        name="EquipmentRegisterForm"
        component={EquipmentRegisterScreen}
      />
    </Stack.Navigator>
  );
}
