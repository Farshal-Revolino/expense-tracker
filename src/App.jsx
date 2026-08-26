import { useState, useEffect } from 'react';
import { ToastProvider } from './components/ui/Toast';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Categories from './pages/Categories';
import Wallets from './pages/Wallets';
import Budgets from './pages/Budgets';
import SavingsGoals from './pages/SavingsGoals';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

function getStoredUser() {
  try {
    const raw = localStorage.getItem('fintrack_user');
    return raw ? JSON.parse(raw) : null;
  } catch (_) { return null; }
}

function getStoredTheme() {
  try {
    const raw = localStorage.getItem('fintrack_theme');
    if (raw) return raw;
  } catch (_) { /* ignore */ }
  return 'dark';
}

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

function App() {
  const [user, setUser] = useState(getStoredUser);
  const [theme, setTheme] = useState(getStoredTheme);
  const [authView, setAuthView] = useState(user ? 'dashboard' : 'login');
  const [currentTab, setCurrentTab] = useState('dashboard');

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem('fintrack_theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('fintrack_user', JSON.stringify(userData));
    setAuthView('dashboard');
  };
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('fintrack_user');
    setAuthView('login');
    setCurrentTab('dashboard');
  };

  if (authView === 'login') {
    return (
      <ToastProvider>
        <Login onLogin={handleLogin} onSwitchToRegister={() => setAuthView('register')} />
      </ToastProvider>
    );
  }

  if (authView === 'register') {
    return (
      <ToastProvider>
        <Register onRegister={handleLogin} onSwitchToLogin={() => setAuthView('login')} />
      </ToastProvider>
    );
  }

  const pages = {
    dashboard: <Dashboard setCurrentTab={setCurrentTab} user={user} />,
    transactions: <Transactions />,
    categories: <Categories />,
    wallets: <Wallets />,
    budgets: <Budgets />,
    savings: <SavingsGoals />,
    reports: <Reports />,
    settings: <Settings />,
  };

  return (
    <ToastProvider>
      <Layout currentTab={currentTab} setCurrentTab={setCurrentTab} onLogout={handleLogout} user={user} theme={theme} toggleTheme={toggleTheme}>
        {pages[currentTab] || <Dashboard setCurrentTab={setCurrentTab} user={user} />}
      </Layout>
    </ToastProvider>
  );
}

export default App;
