
import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { StorageKeys } from './types';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(StorageKeys.AUTH) === 'true';
  });

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem(StorageKeys.AUTH, 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(StorageKeys.AUTH);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {isAuthenticated ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
