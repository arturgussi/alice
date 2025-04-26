import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import EquipmentRegisterScreen from '@screens/register/equipment/EquipmentRegisterScreen';
import {Host} from 'react-native-portalize';

const App = (): React.JSX.Element => {
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
