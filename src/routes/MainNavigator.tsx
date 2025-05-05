import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {BottomNavigator} from './BottomNavigator';
import PlaceRegisterScreen from '@screens/register/device/DeviceRegisterScreen';
import EquipmentRegisterScreen from '@screens/register/equipment/EquipmentRegisterScreen';

type MainStackParamList = {
  MainTabs: undefined;
  PlaceRegister: undefined;
  EquipmentRegister: undefined;
};

const MainStack = createNativeStackNavigator<MainStackParamList>();

export function MainNavigator() {
  return (
    <MainStack.Navigator>
      <MainStack.Screen
        name="MainTabs"
        component={BottomNavigator}
        options={{headerShown: false}}
      />
      <MainStack.Screen
        name="PlaceRegister"
        component={PlaceRegisterScreen}
        options={{headerShown: false}}
      />
      <MainStack.Screen
        name="EquipmentRegister"
        component={EquipmentRegisterScreen}
        options={{headerShown: false}}
      />
    </MainStack.Navigator>
  );
}
