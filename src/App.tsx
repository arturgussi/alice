import React, { StrictMode } from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import AuthScreen from './screens/authentication/AuthScreen';

const App = (): React.JSX.Element => {
  return (
    <StrictMode>
      <React.Fragment>
        <SafeAreaView style={styles.safeAreaView}>
          <AuthScreen />
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
