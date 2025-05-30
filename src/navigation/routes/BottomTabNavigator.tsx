import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { AppBottomTabParamList } from '@/types/navigation/NavigationTypes';
import CustomMenu from '@components/menu/CustomMenu';

import { BottomHomeStack } from '../stacks/BottomHomeStack';
import { BottomMeasurementStack } from '../stacks/BottomMeasurementStack';
import { BottomProfileStack } from '../stacks/BottomProfileStack';

const Tab = createBottomTabNavigator<AppBottomTabParamList>();

export function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={props => <CustomMenu {...props} />}
    >
      <Tab.Screen name="HomeTab" component={BottomHomeStack} options={{}} />
      <Tab.Screen
        name="MeasurementsTab"
        component={BottomMeasurementStack}
        options={{}}
      />
      <Tab.Screen
        name="ProfileTab"
        component={BottomProfileStack}
        options={{}}
      />
    </Tab.Navigator>
  );
}
