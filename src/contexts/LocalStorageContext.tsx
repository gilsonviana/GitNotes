import React, { createContext, useContext, ReactNode } from 'react';
import { storageService, LocalStorageService } from '../services/localStorage.service';

interface LocalStorageContextType {
  storage: LocalStorageService;
}

const LocalStorageContext = createContext<LocalStorageContextType | undefined>(undefined);

export const LocalStorageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <LocalStorageContext.Provider value={{ storage: storageService }}>
      {children}
    </LocalStorageContext.Provider>
  );
};

export const useLocalStorage = (): LocalStorageService => {
  const context = useContext(LocalStorageContext);
  if (!context) {
    throw new Error('useLocalStorage must be used within a LocalStorageProvider');
  }
  return context.storage;
};
