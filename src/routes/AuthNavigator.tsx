import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import AuthScreen from '@screens/authentication/AuthScreen';
import AccountRegisterScreen from '@screens/register/account/AccountRegisterScreen';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{headerShown: false}}>
      <AuthStack.Screen name="Login" component={AuthScreen} />
      <AuthStack.Screen name="Register" component={AccountRegisterScreen} />
    </AuthStack.Navigator>
  );
}
