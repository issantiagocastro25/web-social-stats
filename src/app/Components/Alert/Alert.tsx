// components/Alert.tsx
import React from 'react';
import styles from './Alert.module.css';

type AlertProps = {
  type?: 'info' | 'success' | 'warning' | 'error';
  message: string;
  onClose: () => void;
};

const Alert: React.FC<AlertProps> = ({ type = 'info', message, onClose }) => {
  const alertType = styles[type] || styles.info;

  return (
    <div className={`${styles.alert} ${alertType}`}>
        {message}
        <button onClick={onClose} className={styles.closeButton} aria-label="Close Alert">&times;</button>
    </div>
  );
};

export default Alert;
