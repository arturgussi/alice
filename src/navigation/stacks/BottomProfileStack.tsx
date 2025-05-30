import { RouteProp } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import { CustomHeader } from '@/components/header/CustomHeader';
import { ThemedColors } from '@/constants/Theme.style';
import UserProfileScreen from '@/screens/userProfile/UserProfileScreen';
import { BottomProfileStackParamList } from '@/types/navigation/NavigationTypes';

export type BottomProfileNavigationProps<
  T extends keyof BottomProfileStackParamList,
> = NativeStackNavigationProp<BottomProfileStackParamList, T>;

export type BottomProfileRouteProps<
  T extends keyof BottomProfileStackParamList,
> = RouteProp<BottomProfileStackParamList, T>;

const Stack = createNativeStackNavigator<BottomProfileStackParamList>();

export function BottomProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        header: () => <CustomHeader navigation={navigation} />,
        contentStyle: {
          backgroundColor: ThemedColors.background,
        },
      })}
    >
      <Stack.Screen name="UserProfileView" component={UserProfileScreen} />
    </Stack.Navigator>
  );
}
