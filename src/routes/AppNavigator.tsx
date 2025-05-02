import {createContext, useContext, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';

import {MainNavigator} from './MainNavigator';
import {AuthNavigator} from './AuthNavigator';

interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Tenta carregar o estado de login persisted ao iniciar o app
    const loadAuthStatus = async () => {
      //   const token = await AsyncStorage.getItem('authToken');
      const token = '';
      if (token) {
        setIsLoggedIn(true);
      }
    };

    loadAuthStatus();
  }, []);

  const setAuth = (loggedIn: boolean) => {
    setIsLoggedIn(loggedIn);
    // Persista o estado de login (ex: salvar/remover token)
    console.log('isLoggedIn: ', isLoggedIn);
    if (loggedIn) {
      //   AsyncStorage.setItem('authToken', 'dummyToken');
      console.log('Token saved');
    } else {
      //   AsyncStorage.removeItem('authToken');
      console.log('Token removed');
    }
  };

  return (
    <AuthContext.Provider value={{isLoggedIn, setIsLoggedIn: setAuth}}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AppNavigator = () => {
  const authContext = useContext(AuthContext);
  const isLoggedIn = authContext?.isLoggedIn ?? false;

  return (
    <NavigationContainer>
      {isLoggedIn ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};
