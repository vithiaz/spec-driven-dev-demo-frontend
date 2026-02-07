/**
 *  requirements: [successful-login-flow, failed-login-error-handling]
 *  scenarios: [login-success-valid-credentials, login-failure-invalid-credentials]
 */

'use client';

import { createContext, useContext, useCallback, ReactNode } from 'react';

interface ToastContextType {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warn: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warn') => {
    // Simple console-based toast for now - can be replaced with actual toast component
    console.log(`[${type.toUpperCase()}] ${message}`);

    // Dispatch custom event for toast display
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('toast', {
          detail: { message, type },
        })
      );
    }
  }, []);

  const success = useCallback((message: string) => showToast(message, 'success'), [showToast]);
  const error = useCallback((message: string) => showToast(message, 'error'), [showToast]);
  const info = useCallback((message: string) => showToast(message, 'info'), [showToast]);
  const warn = useCallback((message: string) => showToast(message, 'warn'), [showToast]);

  return (
    <ToastContext.Provider value={{ success, error, info, warn }}>{children}</ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
