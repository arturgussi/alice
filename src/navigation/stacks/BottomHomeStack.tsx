import { RouteProp } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import { CustomHeader } from '@/components/header/CustomHeader';
import { ThemedColors } from '@/constants/Theme.style';
import HomeScreen from '@/screens/home/HomeScreen';
import { BottomHomeStackParamList } from '@/types/navigation/NavigationTypes';

export type BottomHomeNavigationProps<
  T extends keyof BottomHomeStackParamList,
> = NativeStackNavigationProp<BottomHomeStackParamList, T>;

export type BottomHomeRouteProps<T extends keyof BottomHomeStackParamList> =
  RouteProp<BottomHomeStackParamList, T>;

const Stack = createNativeStackNavigator<BottomHomeStackParamList>();

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
    </Stack.Navigator>
  );
}
