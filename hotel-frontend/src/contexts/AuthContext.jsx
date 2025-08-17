// src/contexts/AuthContext.js
import { createContext, useContext } from 'react';

export const AuthContext = createContext(null);

// Handy hook so you don’t have to import useContext everywhere
export function useAuth() {
  return useContext(AuthContext);
}
