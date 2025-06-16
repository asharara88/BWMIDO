import { createContext, useContext, useState } from 'react';
import { ErrorObject } from '../utils/errorHandling';

interface ErrorContextType {
  errors: ErrorObject[];
  addError: (error: ErrorObject) => void;
  clearErrors: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export function ErrorProvider({ children }: { children: React.ReactNode }) {
  const [errors, setErrors] = useState<ErrorObject[]>([]);

  const addError = (error: ErrorObject) => {
    setErrors((prev) => [...prev, error]);
  };

  const clearErrors = () => setErrors([]);

  return (
    <ErrorContext.Provider value={{ errors, addError, clearErrors }}>
      {children}
    </ErrorContext.Provider>
  );
}

export function useError() {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
}

export { ErrorContext };
