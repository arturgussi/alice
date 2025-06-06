import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { CustomHeader } from '@/components/header/CustomHeader';
import { ThemedColors } from '@/constants/Theme.style';
import EquipmentManagementScreen from '@/screens/register/equipment/EquipmentManagementScreen';
import EquipmentRegisterScreen from '@/screens/register/equipment/EquipmentFormScreen';
import { EquipmentStackParamList } from '@/types/navigation/NavigationTypes';

// import EquipmentEditScreen from '@/screens/equipment/EquipmentEditScreen'; // Crie esta tela

const Stack = createNativeStackNavigator<EquipmentStackParamList>();

export function EquipmentStack() {
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
        name="EquipmentManagementScreen"
        component={EquipmentManagementScreen}
        options={{ title: 'Gerenciar Equipamentos' }}
      />
      <Stack.Screen
        name="EquipmentFormScreen"
        component={EquipmentRegisterScreen}
        options={{ title: 'Cadastrar Equipamento' }}
      />
    </Stack.Navigator>
  );
}
