import {
  DefaultOptions,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  NativeModules,
  Platform,
  StatusBar,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Host } from 'react-native-portalize';

import { ThemedColors } from './constants/Theme.style';
import { AuthProvider } from './contexts/AuthContext';
import { AppNavigator } from './navigation/routes/AppNavigator';

const queryClientDefaultOptions: DefaultOptions = {
  queries: {
    retry: 0,
  },
  mutations: {
    retry: 0,
  },
};

const queryClient = new QueryClient({
  defaultOptions: queryClientDefaultOptions,
});

const App = (): React.JSX.Element => {
  useEffect(() => {
    if (Platform.OS === 'android') {
      NativeModules.SplashScreenModule.hide();
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={styles.view}>
        <Host>
          <SafeAreaView style={styles.view}>
            <StatusBar
              backgroundColor={ThemedColors.backgroundSubmenu}
              barStyle={'dark-content'}
              translucent={Platform.OS === 'android' ? false : true}
            />
            <AuthProvider>
              <AppNavigator />
            </AuthProvider>
          </SafeAreaView>
        </Host>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
});

export default App;
