import { RouteProp } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import { CustomHeader } from '@/components/header/CustomHeader';
import { ThemedColors } from '@/constants/Theme.style';
import UserProfileScreen from '@/screens/userProfile/UserProfileScreen';
import { ProfileStackParamList } from '@/types/navigation/NavigationTypes';

export type BottomProfileNavigationProps<
  T extends keyof ProfileStackParamList,
> = NativeStackNavigationProp<ProfileStackParamList, T>;

export type BottomProfileRouteProps<T extends keyof ProfileStackParamList> =
  RouteProp<ProfileStackParamList, T>;

const Stack = createNativeStackNavigator<ProfileStackParamList>();

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
