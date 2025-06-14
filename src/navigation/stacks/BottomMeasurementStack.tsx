import { RouteProp } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import { CustomHeader } from '@/components/header/CustomHeader';
import { ThemedColors } from '@/constants/Theme.style';
import { EquipmentDetailScreen } from '@/screens/measurements/MeasurementDetailScreen';
import { MeasurementListScreen } from '@/screens/measurements/MeasurementListScreen';
import { MeasurementStackParamList } from '@/types/navigation/NavigationTypes';

export type BottomMeasurementNavigationProps<
  T extends keyof MeasurementStackParamList,
> = NativeStackNavigationProp<MeasurementStackParamList, T>;

export type BottomMeasurementRouteProps<
  T extends keyof MeasurementStackParamList,
> = RouteProp<MeasurementStackParamList, T>;

const Stack = createNativeStackNavigator<MeasurementStackParamList>();

export function BottomMeasurementStack() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        header: () => <CustomHeader navigation={navigation} />,
        contentStyle: {
          backgroundColor: ThemedColors.background,
        },
      })}
    >
      <Stack.Screen name="MeasurementList" component={MeasurementListScreen} />
      <Stack.Screen
        name="MeasurementDetail"
        component={EquipmentDetailScreen}
      />
    </Stack.Navigator>
  );
}
