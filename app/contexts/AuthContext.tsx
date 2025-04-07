import React, { createContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';
import { User } from '../models/model';

interface AuthContextProps {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

interface AuthContextProviderProps {
  children: ReactNode;
}

const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Example functions, replace with actual logic
  // const login = (userData: User) => {
  //   setUser(userData);
  // };

  // const logout = () => {
  //   setUser(null);
  // };

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider};