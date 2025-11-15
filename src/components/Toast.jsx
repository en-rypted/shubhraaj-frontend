import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  }, [toast]);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {toast.show && (
        <div className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-lg z-50 ${
          toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
        } text-white animate-fade-in-up`}>
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
