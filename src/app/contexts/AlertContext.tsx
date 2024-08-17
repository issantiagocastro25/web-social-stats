// context/AlertContext.tsx
"use client";

import React, { createContext, useState, useContext, ReactNode } from 'react';
import Alert from '../Components/Alert/Alert';

type AlertContextType = {
  showAlert: (message: string, type?: 'info' | 'success' | 'warning' | 'error', duration?: number) => void;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<{ id: number; message: string; type: string }[]>([]);

  const showAlert = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info', duration: number = 5000) => {
    const id = Date.now();
    setAlerts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    }, duration);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <div style={{ position: 'fixed', top: 10, right: 10, zIndex: 1000 }}>
        {alerts.map((alert) => (
          <Alert
            key={alert.id}
            type={alert.type as 'info' | 'success' | 'warning' | 'error'}
            message={alert.message}
            onClose={() => setAlerts((prev) => prev.filter((a) => a.id !== alert.id))}
          />
        ))}
      </div>
    </AlertContext.Provider>
  );
};
