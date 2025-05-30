import {
  BottomTabNavigationProp,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { RouteProp } from '@react-navigation/native';

import { AppBottomTabParamList } from '@/types/navigation/NavigationTypes';
import CustomMenu from '@components/menu/CustomMenu';

import { BottomHomeStack } from '../stacks/BottomHomeStack';
import { BottomMeasurementStack } from '../stacks/BottomMeasurementStack';
import { BottomProfileStack } from '../stacks/BottomProfileStack';

export type AppBottomTabNavigationProps<T extends keyof AppBottomTabParamList> =
  BottomTabNavigationProp<AppBottomTabParamList, T>;

export type AppBottomTabRouteProps<T extends keyof AppBottomTabParamList> =
  RouteProp<AppBottomTabParamList, T>;

const Tab = createBottomTabNavigator<AppBottomTabParamList>();

export function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={props => <CustomMenu {...props} />}
    >
      <Tab.Screen
        name="HomeTabRoute"
        component={BottomHomeStack}
        options={{}}
      />
      <Tab.Screen
        name="MeasurementsTabRoute"
        component={BottomMeasurementStack}
        options={{}}
      />
      <Tab.Screen
        name="ProfileTabRoute"
        component={BottomProfileStack}
        options={{}}
      />
    </Tab.Navigator>
  );
}
