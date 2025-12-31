
import { User, Job, Event, AppNotification } from './types';
import { MOCK_USERS, MOCK_JOBS, MOCK_EVENTS } from './constants';

const KEYS = {
  USERS: 'ruet_db_users',
  JOBS: 'ruet_db_jobs',
  EVENTS: 'ruet_db_events',
  AUTH_USER: 'ruet_auth_user',
  NOTIFICATIONS: 'ruet_db_notifications'
};

export const db = {
  init: () => {
    const existingUsers = localStorage.getItem(KEYS.USERS);
    if (!existingUsers || !JSON.parse(existingUsers).some((u: any) => u.password)) {
      localStorage.setItem(KEYS.USERS, JSON.stringify(MOCK_USERS));
    }
    if (!localStorage.getItem(KEYS.JOBS)) {
      localStorage.setItem(KEYS.JOBS, JSON.stringify(MOCK_JOBS));
    }
    if (!localStorage.getItem(KEYS.EVENTS)) {
      localStorage.setItem(KEYS.EVENTS, JSON.stringify(MOCK_EVENTS));
    }
    if (!localStorage.getItem(KEYS.NOTIFICATIONS)) {
      const initialNotifications: AppNotification[] = [
        {
          id: 'n1',
          userId: '1',
          title: 'Welcome to RUETConnect!',
          message: 'Explore the network and connect with fellow RUETians.',
          type: 'system',
          timestamp: Date.now() - 3600000,
          isRead: false
        },
        {
          id: 'n2',
          userId: '1',
          title: 'New Job in CSE',
          message: 'Pathao is looking for a Frontend Developer.',
          type: 'job',
          timestamp: Date.now() - 86400000,
          isRead: true,
          link: '/jobs'
        }
      ];
      localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(initialNotifications));
    }
  },

  getUsers: (): User[] => JSON.parse(localStorage.getItem(KEYS.USERS) || '[]'),
  getJobs: (): Job[] => JSON.parse(localStorage.getItem(KEYS.JOBS) || '[]'),
  getEvents: (): Event[] => JSON.parse(localStorage.getItem(KEYS.EVENTS) || '[]'),
  
  getNotifications: (userId?: string): AppNotification[] => {
    const all = JSON.parse(localStorage.getItem(KEYS.NOTIFICATIONS) || '[]') as AppNotification[];
    if (userId) return all.filter(n => n.userId === userId).sort((a, b) => b.timestamp - a.timestamp);
    return all;
  },

  addNotification: (notif: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>) => {
    const all = db.getNotifications();
    const newNotif: AppNotification = {
      ...notif,
      id: `notif_${Date.now()}`,
      timestamp: Date.now(),
      isRead: false
    };
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify([newNotif, ...all]));
    return newNotif;
  },

  markNotificationRead: (id: string) => {
    const all = db.getNotifications();
    const updated = all.map(n => n.id === id ? { ...n, isRead: true } : n);
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(updated));
  },

  clearAllNotifications: (userId: string) => {
    const all = db.getNotifications();
    const filtered = all.filter(n => n.userId !== userId);
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(filtered));
  },

  login: (email: string, pass: string): User | null => {
    const users = db.getUsers();
    const user = users.find(u => 
      u.email?.toLowerCase() === email.toLowerCase() && 
      u.password === pass
    );
    
    if (user) {
      localStorage.setItem(KEYS.AUTH_USER, JSON.stringify(user));
      return user;
    }
    return null;
  },

  register: (user: Omit<User, 'id'>): User => {
    const newUser = db.addUser(user);
    localStorage.setItem(KEYS.AUTH_USER, JSON.stringify(newUser));
    return newUser;
  },

  logout: () => {
    localStorage.removeItem(KEYS.AUTH_USER);
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem(KEYS.AUTH_USER);
    return userStr ? JSON.parse(userStr) : null;
  },

  addJob: (job: Omit<Job, 'id'>) => {
    const jobs = db.getJobs();
    const newJob = { ...job, id: `job_${Date.now()}` };
    const updated = [newJob, ...jobs];
    localStorage.setItem(KEYS.JOBS, JSON.stringify(updated));
    return newJob;
  },

  addEvent: (event: Omit<Event, 'id'>) => {
    const events = db.getEvents();
    const newEvent = { ...event, id: `event_${Date.now()}` };
    const updated = [newEvent, ...events];
    localStorage.setItem(KEYS.EVENTS, JSON.stringify(updated));
    return newEvent;
  },

  addUser: (user: Omit<User, 'id'>): User => {
    const users = db.getUsers();
    const newUser = { ...user, id: `user_${Date.now()}` };
    const updated = [...users, newUser];
    localStorage.setItem(KEYS.USERS, JSON.stringify(updated));
    return newUser;
  },

  updateUser: (updatedUser: User) => {
    const users = db.getUsers();
    const updated = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    localStorage.setItem(KEYS.USERS, JSON.stringify(updated));
    
    const current = db.getCurrentUser();
    if (current && current.id === updatedUser.id) {
      localStorage.setItem(KEYS.AUTH_USER, JSON.stringify(updatedUser));
    }
  },

  deleteJob: (id: string) => {
    const jobs = db.getJobs();
    const updated = jobs.filter(j => j.id !== id);
    localStorage.setItem(KEYS.JOBS, JSON.stringify(updated));
  },

  deleteUser: (id: string) => {
    const users = db.getUsers();
    const updated = users.filter(u => u.id !== id);
    localStorage.setItem(KEYS.USERS, JSON.stringify(updated));
  }
};
