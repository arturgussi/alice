import {ReactNode, createContext, useContext, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';

import {MainNavigator} from './MainNavigator';
import {AuthNavigator} from './AuthNavigator';
import {subscribeToAuthChanges} from '@services/auth/Auth';

interface UserData {
  uid: string;
  email: string | null;
  displayName: string;
}

interface AuthContextType {
  user: UserData | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: {children: ReactNode}) => {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async firebaseUser => {
      if (firebaseUser) {
        if (firebaseUser) {
          const userData: UserData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
          };
          setUser(userData);
        } else {
          setUser(null);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={{user}}>{children}</AuthContext.Provider>;
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
  const isLoggedIn = authContext?.user ?? false;

  return (
    <NavigationContainer>
      {isLoggedIn ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};
