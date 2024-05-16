import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Attempt to load user from local storage on component mount
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const login = (token, user) => {
    setUser(user);

    // Save user data to local storage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  };
  
  const logout = () => {
    setUser(null);

    // Remove user data from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const isAuthenticated = () => {
    // Check if the user is authenticated (you may need to modify this based on your specific logic)
    return user !== null;
  };

  const clearLocalStorage = () => {
    // Remove all user data from local storage
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, clearLocalStorage }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
