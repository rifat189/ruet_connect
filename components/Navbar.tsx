
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Network, Search, Bell, LogOut, LayoutDashboard, User, 
  X, Briefcase, Calendar, UserCheck, MessageSquare, Clock,
  ChevronRight, Sparkles, BellOff, Menu, Layout
} from 'lucide-react';
import { useAuth } from '../App';
import { db } from '../db';
import { AppNotification, User as UserType, Job, Event } from '../types';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  
  const notifRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Search Results
  const [results, setResults] = useState<{
    users: UserType[],
    jobs: Job[],
    events: Event[]
  }>({ users: [], jobs: [], events: [] });

  // Fetch notifications whenever the dropdown opens or user changes
  useEffect(() => {
    if (user) {
      setNotifications(db.getNotifications(user.id));
    } else {
      setNotifications([]);
    }
  }, [user, isNotifOpen]);

  // Handle clicks outside for both Search and Notifications
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (notifRef.current && !notifRef.current.contains(target)) {
        setIsNotifOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Simple Global Search Logic
  useEffect(() => {
    const q = searchQuery.toLowerCase().trim();
    if (q.length > 0) {
      const allUsers = db.getUsers();
      const allJobs = db.getJobs();
      const allEvents = db.getEvents();

      setResults({
        users: allUsers.filter(u => u.name.toLowerCase().includes(q) || u.department.toLowerCase().includes(q) || u.batch.includes(q)).slice(0, 3),
        jobs: allJobs.filter(j => j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q)).slice(0, 3),
        events: allEvents.filter(e => e.title.toLowerCase().includes(q)).slice(0, 3)
      });
    } else {
      setResults({ users: [], jobs: [], events: [] });
    }
  }, [searchQuery]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleResultClick = (path: string) => {
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
    setSearchQuery('');
    navigate(path);
  };

  const markAsRead = (id: string) => {
    db.markNotificationRead(id);
    if (user) setNotifications(db.getNotifications(user.id));
  };

  const clearAll = () => {
    if (user) {
      db.clearAllNotifications(user.id);
      setNotifications([]);
    }
  };

  const navLinks = [
    { label: 'Feed', path: '/feed' },
    { label: 'Network', path: '/network' },
    { label: 'Jobs', path: '/jobs' },
    { label: 'Mentorship', path: '/mentorship' },
    { label: 'Events', path: '/events' },
  ];

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/20 px-4 md:px-12 py-4 flex items-center justify-between backdrop-blur-xl">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="gradient-bg p-2 rounded-xl text-white shadow-md group-hover:scale-105 transition-transform">
            <Network size={20} />
          </div>
          <span className="font-black text-xl tracking-tighter text-slate-900">
            RUET<span className="text-blue-600">Connect</span>
          </span>
        </Link>
      </div>

      {/* Nav Links - Desktop */}
      <div className="hidden lg:flex items-center gap-8">
        {navLinks.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`text-sm font-bold tracking-tight transition-all hover:text-blue-600 ${
              location.pathname === item.path ? 'text-blue-600' : 'text-slate-500'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Simple Search Input */}
        <div className="relative" ref={searchRef}>
          <div className={`flex items-center bg-slate-100/80 rounded-2xl px-3 py-2 transition-all ${isSearchOpen ? 'w-48 md:w-64 ring-2 ring-blue-100 bg-white' : 'w-10 md:w-48'}`}>
            <Search size={18} className="text-slate-400 shrink-0" />
            <input 
              type="text" 
              placeholder="Search..."
              className={`ml-2 bg-transparent outline-none text-sm w-full font-medium placeholder-slate-400 ${!isSearchOpen ? 'hidden md:block' : ''}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchOpen(true)}
            />
          </div>

          {/* Search Results Dropdown */}
          {isSearchOpen && searchQuery.trim().length > 0 && (
            <div className="absolute right-0 mt-3 w-72 md:w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="max-h-96 overflow-y-auto p-2 space-y-4">
                {results.users.length === 0 && results.jobs.length === 0 && results.events.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400 font-bold uppercase tracking-widest">No Results Found</div>
                ) : (
                  <>
                    {results.users.length > 0 && (
                      <div>
                        <h4 className="px-3 py-1 text-[10px] font-black text-slate-300 uppercase tracking-widest">People</h4>
                        {results.users.map(u => (
                          <div key={u.id} onClick={() => handleResultClick(`/profile/${u.id}`)} className="p-3 hover:bg-slate-50 rounded-xl cursor-pointer flex items-center gap-3 transition-colors">
                            <img src={u.avatar} className="w-8 h-8 rounded-lg object-cover" />
                            <div className="text-sm font-bold text-slate-800">{u.name}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    {results.jobs.length > 0 && (
                      <div>
                        <h4 className="px-3 py-1 text-[10px] font-black text-slate-300 uppercase tracking-widest">Jobs</h4>
                        {results.jobs.map(j => (
                          <div key={j.id} onClick={() => handleResultClick(`/jobs`)} className="p-3 hover:bg-slate-50 rounded-xl cursor-pointer flex items-center gap-3 transition-colors">
                            <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center"><Briefcase size={16} /></div>
                            <div className="text-sm font-bold text-slate-800">{j.title}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    {results.events.length > 0 && (
                      <div>
                        <h4 className="px-3 py-1 text-[10px] font-black text-slate-300 uppercase tracking-widest">Events</h4>
                        {results.events.map(e => (
                          <div key={e.id} onClick={() => handleResultClick(`/events`)} className="p-3 hover:bg-slate-50 rounded-xl cursor-pointer flex items-center gap-3 transition-colors">
                            <div className="w-8 h-8 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center"><Calendar size={16} /></div>
                            <div className="text-sm font-bold text-slate-800">{e.title}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Notification Button */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className={`p-2.5 rounded-2xl transition-all relative border border-transparent ${isNotifOpen ? 'bg-blue-50 text-blue-600 border-blue-100' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-black text-slate-900 text-sm tracking-tight">Activity</h3>
                {user && notifications.length > 0 && (
                  <button onClick={clearAll} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-red-500 transition-colors">Clear</button>
                )}
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {!user ? (
                  <div className="p-10 text-center">
                    <Sparkles className="mx-auto text-blue-400 mb-4" size={32} />
                    <p className="text-sm text-slate-600 font-bold mb-4">Login to see alerts</p>
                    <Link to="/auth" onClick={() => setIsNotifOpen(false)} className="px-6 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-100">Sign In</Link>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-10 text-center">
                    <BellOff className="mx-auto text-slate-300 mb-4" size={32} />
                    <p className="text-xs text-slate-400 font-medium">No new notifications</p>
                  </div>
                ) : (
                  notifications.map(n => (
                    <div 
                      key={n.id} 
                      onClick={() => { markAsRead(n.id); if(n.link) navigate(n.link); setIsNotifOpen(false); }}
                      className={`p-4 border-b border-slate-50 flex gap-4 hover:bg-slate-50 transition-colors cursor-pointer ${!n.isRead ? 'bg-blue-50/20' : ''}`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        n.type === 'job' ? 'bg-emerald-50 text-emerald-600' :
                        n.type === 'event' ? 'bg-orange-50 text-orange-600' :
                        'bg-blue-50 text-blue-600'
                      }`}>
                        {n.type === 'job' ? <Briefcase size={18} /> : n.type === 'event' ? <Calendar size={18} /> : n.type === 'post' ? <Layout size={18} /> : <UserCheck size={18} />}
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className={`text-xs font-bold text-slate-900 truncate ${!n.isRead ? 'pr-2' : ''}`}>{n.title}</h4>
                          {!n.isRead && <span className="w-1.5 h-1.5 bg-blue-600 rounded-full shrink-0"></span>}
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{n.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile / Auth Button */}
        {user ? (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <Link to={`/profile/${user.id}`} className="w-9 h-9 rounded-xl overflow-hidden border-2 border-white shadow-sm hover:ring-2 hover:ring-blue-100 transition-all">
              <img src={user.avatar} className="w-full h-full object-cover" />
            </Link>
            <button onClick={logout} className="hidden sm:block p-2 text-slate-400 hover:text-red-500 transition-colors">
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <Link to="/auth" className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-black hover:bg-black transition-all shadow-lg shadow-slate-200 whitespace-nowrap">
            Sign In
          </Link>
        )}
      </div>

      {/* Mobile/Tablet Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-[73px] z-40 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200 lg:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div 
            className="absolute top-0 left-0 w-full max-w-xs h-screen bg-white shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6 flex-grow">
              <div className="pb-6 border-b border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Navigation</p>
                <div className="space-y-1">
                  {navLinks.map((item) => (
                    <Link
                      key={item.label}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between p-4 rounded-2xl font-black text-lg transition-all ${
                        location.pathname === item.path 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      {item.label}
                      <ChevronRight size={20} className={location.pathname === item.path ? 'opacity-100' : 'opacity-20'} />
                    </Link>
                  ))}
                  {user?.role === 'Admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-4 rounded-2xl font-black text-lg text-slate-900 hover:bg-slate-50"
                    >
                      <LayoutDashboard size={20} /> Admin Dashboard
                    </Link>
                  )}
                </div>
              </div>

              {user && (
                <div className="pt-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Account</p>
                  <button 
                    onClick={() => { logout(); setIsMobileMenuOpen(false); navigate('/'); }}
                    className="w-full flex items-center gap-3 p-4 rounded-2xl font-black text-lg text-red-500 hover:bg-red-50 transition-all"
                  >
                    <LogOut size={20} /> Sign Out
                  </button>
                </div>
              )}
            </div>

            <div className="mt-auto pt-6 border-t border-slate-100 text-center">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">RUETConnect v2.5</p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
