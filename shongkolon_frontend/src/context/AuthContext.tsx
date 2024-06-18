'use client';

import React, {
  useState,
  useEffect,
  ReactNode,
  createContext,
  useContext,
} from 'react';
import { User } from '../types';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  authToken: string;
  autoLogin: () => void;
  login: () => void;
  logout: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to access context
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthContextProvider');
  }
  return context;
};

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string>('');

  const login = () => {
    setIsLoggedIn(true);
  };
  const logout = () => {
    setIsLoggedIn(false);
    removeStoredItems();
    setUser(null);
    setAuthToken('');
    router.push('/login');
  };

  //auto login if there is a token stored
  const autoLogin = () => {
    try {
      const token = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('auth_user');
      if (token && storedUser) {
        console.log('auto');
        setAuthToken(token);
        setUser(JSON.parse(storedUser));
        login();
      } else {
        logout();
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    autoLogin();
  }, []);

  //remove stored items
  const removeStoredItems = async () => {
    try {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    } catch (e) {
      console.log(e);
    }
  };

  const contextValue: AuthContextType = {
    isLoggedIn,
    user,
    authToken,
    autoLogin,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export { AuthContext, useAuth };
