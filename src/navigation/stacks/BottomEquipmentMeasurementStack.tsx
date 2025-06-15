import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { EquipmentMeasurementDetailScreen } from '@/screens/measurements/EquipmentMeasurementDetailScreen';
import { EquipmentMeasurementListScreen } from '@/screens/measurements/EquipmentMeasurementListScreen';
import { EquipmentMeasureStackParamList } from '@/types/navigation/NavigationTypes';

const Stack = createNativeStackNavigator<EquipmentMeasureStackParamList>();

export function BottomEquipmentMeasureStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="EquipmentList"
        component={EquipmentMeasurementListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EquipmentDetailScreen"
        component={EquipmentMeasurementDetailScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
