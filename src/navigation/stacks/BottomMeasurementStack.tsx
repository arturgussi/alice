import { RouteProp } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import { CustomHeader } from '@/components/header/CustomHeader';
import { ThemedColors } from '@/constants/Theme.style';
import { MeasurementDetailScreen } from '@/screens/measurements/MeasurementDetailScreen';
import { MeasurementListScreen } from '@/screens/measurements/MeasurementListScreen';
import { BottomMeasurementStackParamList } from '@/types/navigation/NavigationTypes';

export type BottomMeasurementNavigationProps<
  T extends keyof BottomMeasurementStackParamList,
> = NativeStackNavigationProp<BottomMeasurementStackParamList, T>;

export type BottomMeasurementRouteProps<
  T extends keyof BottomMeasurementStackParamList,
> = RouteProp<BottomMeasurementStackParamList, T>;

const Stack = createNativeStackNavigator<BottomMeasurementStackParamList>();

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
        component={MeasurementDetailScreen}
      />
    </Stack.Navigator>
  );
}
