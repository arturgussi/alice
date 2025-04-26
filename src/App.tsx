import React, { StrictMode } from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import RegisterScreen from './screens/register/account/RegisterScreen';

const App = (): React.JSX.Element => {
  return (
    <StrictMode>
      <React.Fragment>
        <SafeAreaView style={styles.safeAreaView}>
          <RegisterScreen />
        </SafeAreaView>
      </React.Fragment>
    </StrictMode>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
});

export default App;
