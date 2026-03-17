import { createContext, useContext, useState, useEffect } from 'react';
import apiClient, { setAccessToken } from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, try to restore session from the httpOnly refresh token cookie
  useEffect(() => {
    apiClient.post('/auth/refresh')
      .then((res) => {
        const newToken = res.data.accessToken;
        setAccessToken(newToken);
        setToken(newToken);
      })
      .catch(() => {
        // No cookie or expired — user needs to log in
      })
      .finally(() => setLoading(false));
  }, []);

  const login = (newToken) => {
    setAccessToken(newToken);
    setToken(newToken);
  };

  const logout = async () => {
    await apiClient.post('/auth/logout').catch(() => {});
    setAccessToken(null);
    setToken(null);
  };

  // Prevent ProtectedRoute from redirecting before the refresh check completes
  if (loading) return null;

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
