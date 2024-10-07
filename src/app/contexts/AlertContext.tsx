'use client';
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
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

type AlertType = {
  id: number;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isVisible: boolean;
};

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<AlertType[]>([]);

  const showAlert = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info', duration: number = 5000) => {
    const id = Date.now();
    setAlerts((prev) => [...prev, { id, message, type, isVisible: false }]);

    // Set isVisible to true after a short delay to trigger the enter animation
    setTimeout(() => {
      setAlerts((prev) =>
        prev.map((alert) => (alert.id === id ? { ...alert, isVisible: true } : alert))
      );
    }, 10);

    // Remove the alert after the specified duration
    setTimeout(() => {
      setAlerts((prev) =>
        prev.map((alert) => (alert.id === id ? { ...alert, isVisible: false } : alert))
      );
      // Remove the alert from the DOM after the exit animation
      setTimeout(() => {
        setAlerts((prev) => prev.filter((alert) => alert.id !== id));
      }, 300); // This should match the duration of the exit animation
    }, duration);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col items-end space-y-2">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`transition-all duration-300 ease-in-out ${
              alert.isVisible
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-full'
            }`}
          >
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => {
                setAlerts((prev) =>
                  prev.map((a) => (a.id === alert.id ? { ...a, isVisible: false } : a))
                );
                setTimeout(() => {
                  setAlerts((prev) => prev.filter((a) => a.id !== alert.id));
                }, 300);
              }}
            />
          </div>
        ))}
      </div>
    </AlertContext.Provider>
  );
};

export default AlertProvider;