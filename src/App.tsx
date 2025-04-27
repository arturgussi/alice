import React, {useEffect} from 'react';
import {SafeAreaView, StyleSheet, NativeModules, Platform} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import EquipmentRegisterScreen from '@screens/register/equipment/EquipmentRegisterScreen';
import {Host} from 'react-native-portalize';

const App = (): React.JSX.Element => {
    useEffect(() => {
        if (Platform.OS === 'android') {
            NativeModules.SplashScreenModule.hide();
        }
    },[]);

  return (
    <GestureHandlerRootView style={styles.view}>
      <Host>
        <SafeAreaView style={styles.view}>
          <EquipmentRegisterScreen />
        </SafeAreaView>
      </Host>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
});

export default App;
