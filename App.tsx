
import React, { useEffect, useState, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Network from './pages/Network';
import Jobs from './pages/Jobs';
import Mentorship from './pages/Mentorship';
import Events from './pages/Events';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import Feed from './pages/Feed';
import { db } from './db';
import { User } from './types';

// --- Scroll Restoration Utility ---
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// --- Auth Context & Provider ---
interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => boolean;
  register: (userData: Omit<User, 'id'>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

// --- Route Guards ---
const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth?mode=login" replace />;
  return <>{children}</>;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (!user || user.role !== 'Admin') return <Navigate to="/" replace />;
  return <>{children}</>;
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.init();
    const authUser = db.getCurrentUser();
    setCurrentUser(authUser);
    setLoading(false);
  }, []);

  const login = (email: string, pass: string) => {
    const user = db.login(email, pass);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const register = (userData: Omit<User, 'id'>) => {
    const user = db.register(userData);
    setCurrentUser(user);
  };

  const logout = () => {
    db.logout();
    setCurrentUser(null);
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user: currentUser, login, register, logout }}>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col selection:bg-blue-100 selection:text-blue-900">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route 
                path="/auth" 
                element={currentUser ? <Navigate to="/" replace /> : <Auth />} 
              />
              <Route path="/feed" element={<Feed />} />
              <Route path="/network" element={<Network />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/mentorship" element={<Mentorship />} />
              <Route path="/events" element={<Events />} />
              <Route path="/profile/:id" element={<Profile />} />

              {/* Admin Protected Routes */}
              <Route 
                path="/admin" 
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } 
              />

              {/* 404 Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
