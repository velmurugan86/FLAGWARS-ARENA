import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const AuthContext = createContext({});

function decodeToken(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) base64 += '=';
    const payload = JSON.parse(atob(base64));
    if (payload.exp && payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    const payload = decodeToken(token);
    if (!payload) {
      localStorage.removeItem('token');
      setUser(null);
      setLoading(false);
      return;
    }

    setUser({
      username: payload.username,
      userId: payload.userId,
      isAdmin: payload.isAdmin || false,
    });
    setLoading(false);
  }, [location.pathname]);

  const login = (token) => {
    const payload = decodeToken(token);
    if (!payload) throw new Error('Invalid token format');
    localStorage.setItem('token', token);
    setUser({
      username: payload.username,
      userId: payload.userId,
      isAdmin: payload.isAdmin || false,
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
