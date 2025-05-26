import { RouteProp } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import { CustomHeader } from '@components/header/CustomHeader';
import { ThemedColors } from '@constants/Theme.style';
import UserProfileScreen from '@screens/userProfile/UserProfileScreen';

export type StackProfileParamList = {
  UserProfileView: undefined; // Nome específico
};

export type TabProfileNavigationProps<T extends keyof StackProfileParamList> =
  NativeStackNavigationProp<StackProfileParamList, T>;
export type TabProfileRouteProps<T extends keyof StackProfileParamList> =
  RouteProp<StackProfileParamList, T>;

const Stack = createNativeStackNavigator<StackProfileParamList>();

export function TabProfileStack() {
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
        name="UserProfileView"
        component={UserProfileScreen}
        options={{ title: 'Meu Perfil' }}
      />
    </Stack.Navigator>
  );
}
