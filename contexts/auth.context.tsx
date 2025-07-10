import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BaseBackendService} from '@services/backend/concrete/base.backend.sevice';

// AuthContext'in arayüzü
interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  rememberUser: (user: string) => void;
  getUserMail: () => Promise<string | null>;
}

// AuthContext'i oluştur
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider bileşeni
const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [token, setToken] = useState<string | null>(null);
  // Token'ı yerel depolamadan yükle
  useEffect(() => {}, []);

  const login = (token: string) => {
    setToken(token);
    BaseBackendService.setToken(token);
  };
  const logout = () => {
    setToken(null);
    BaseBackendService.setToken(null);
  };
  const rememberUser = (userMail: string) => {
    AsyncStorage.setItem('userMail', userMail);
  };
  const getUserMail = async () => {
    return await AsyncStorage.getItem('userMail');
  };
  return (
    <AuthContext.Provider
      value={{token, login, logout, rememberUser, getUserMail}}>
      {children}
    </AuthContext.Provider>
  );
};

// AuthContext'i kullanmak için bir kanca
const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export {AuthProvider, useAuthContext};
