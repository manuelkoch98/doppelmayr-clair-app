import React, { createContext, useState, ReactNode } from 'react';

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
}

// Initialize the context with a default token so the app skips the login
// screen and behaves as if the user is already authenticated.
export const AuthContext = createContext<AuthContextType>({
  token: 'DUMMY_TOKEN',
  setToken: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  // Provide a non-null default token so the rest of the application
  // treats the user as logged in immediately.
  const [token, setToken] = useState<string | null>('DUMMY_TOKEN');
  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}
