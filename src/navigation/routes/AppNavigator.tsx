import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { ThemedColors } from '@/constants/Theme.style';
import { useAuth } from '@/hooks/useAuth';

import { AuthNavigator } from './AuthNavigator';
import { MainAppDrawer } from './MainAppDrawer';

export const AppNavigator = () => {
  const { appUser, isLoadingAuth, isCreatingAccount } = useAuth();

  if (isLoadingAuth) {
    // Enquanto verifica o estado de autenticação, mostra um indicador de carregamento
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={ThemedColors.text} />
        <Text style={[styles.loadingText, { color: ThemedColors.text }]}>
          {isCreatingAccount
            ? 'Finalizando criação da conta...'
            : 'Verificando login...'}
        </Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {appUser ? <MainAppDrawer /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: ThemedColors.background,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
});
