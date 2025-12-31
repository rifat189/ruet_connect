
import { User, Job, Event, AppNotification, Post, Comment } from './types';
import { MOCK_USERS, MOCK_JOBS, MOCK_EVENTS } from './constants';

const KEYS = {
  USERS: 'ruet_db_users',
  JOBS: 'ruet_db_jobs',
  EVENTS: 'ruet_db_events',
  POSTS: 'ruet_db_posts',
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
    if (!localStorage.getItem(KEYS.POSTS)) {
      const initialPosts: Post[] = [
        {
          id: 'p1',
          userId: '1',
          userName: 'Sarah Rahman',
          userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200',
          userRole: 'Alumni',
          content: 'Just finished a great tech talk about Cloud Infrastructure! It was amazing to see so many RUETians interested in distributed systems. 🚀 #RUETPride #CloudComputing',
          timestamp: Date.now() - 3600000 * 5,
          media: [{ type: 'image', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600' }],
          likes: 42,
          likedBy: [],
          comments: [
            {
              id: 'c1',
              userId: 'mentor_1',
              userName: 'Dr. Faisal Karim',
              userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200',
              content: 'Excellent talk, Sarah! The future of backend is definitely in distributed systems.',
              timestamp: Date.now() - 3600000 * 4
            }
          ]
        },
        {
          id: 'p2',
          userId: 'mentor_1',
          userName: 'Dr. Faisal Karim',
          userRole: 'Mentor',
          userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200',
          content: 'Remember students: the foundation of engineering is curiosity. Keep asking "why". My office hours are open for mentorship sessions this Saturday.',
          timestamp: Date.now() - 3600000 * 24,
          likes: 156,
          likedBy: [],
          comments: []
        }
      ];
      localStorage.setItem(KEYS.POSTS, JSON.stringify(initialPosts));
    }
    if (!localStorage.getItem(KEYS.NOTIFICATIONS)) {
      const initialNotifications: AppNotification[] = [
        {
          id: 'n_mentorship_demo',
          userId: '1',
          title: 'New Mentorship Request',
          message: 'Anika Tabassum (CSE 21) wants to connect for career guidance in ML.',
          type: 'mentorship',
          timestamp: Date.now() - 1000 * 60 * 5,
          isRead: false,
          link: '/mentorship'
        },
        {
          id: 'n_demo',
          userId: '1',
          title: 'Career Update',
          message: 'Your senior, Rashedul Islam (ETE 98), just posted a new career milestone at Intel.',
          type: 'post',
          timestamp: Date.now() - 1000 * 60 * 30,
          isRead: false,
          link: '/network'
        }
      ];
      localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(initialNotifications));
    }
  },

  getUsers: (): User[] => JSON.parse(localStorage.getItem(KEYS.USERS) || '[]'),
  getJobs: (): Job[] => JSON.parse(localStorage.getItem(KEYS.JOBS) || '[]'),
  getEvents: (): Event[] => JSON.parse(localStorage.getItem(KEYS.EVENTS) || '[]'),
  getPosts: (): Post[] => JSON.parse(localStorage.getItem(KEYS.POSTS) || '[]').sort((a: Post, b: Post) => b.timestamp - a.timestamp),
  
  getNotifications: (userId?: string): AppNotification[] => {
    const all = JSON.parse(localStorage.getItem(KEYS.NOTIFICATIONS) || '[]') as AppNotification[];
    if (userId) return all.filter(n => n.userId === userId).sort((a, b) => b.timestamp - a.timestamp);
    return all;
  },

  addPost: (post: Omit<Post, 'id' | 'timestamp' | 'likes' | 'comments' | 'likedBy'>) => {
    const all = db.getPosts();
    const newPost: Post = {
      ...post,
      id: `post_${Date.now()}`,
      timestamp: Date.now(),
      likes: 0,
      likedBy: [],
      comments: []
    };
    localStorage.setItem(KEYS.POSTS, JSON.stringify([newPost, ...all]));
    return newPost;
  },

  likePost: (postId: string, userId: string) => {
    const all = db.getPosts();
    const postIndex = all.findIndex(p => p.id === postId);
    if (postIndex === -1) return;

    const post = all[postIndex];
    const userIndex = post.likedBy.indexOf(userId);

    if (userIndex === -1) {
      post.likedBy.push(userId);
      post.likes += 1;
    } else {
      post.likedBy.splice(userIndex, 1);
      post.likes -= 1;
    }

    localStorage.setItem(KEYS.POSTS, JSON.stringify(all));
    return post;
  },

  addComment: (postId: string, comment: Omit<Comment, 'id' | 'timestamp'>) => {
    const all = db.getPosts();
    const postIndex = all.findIndex(p => p.id === postId);
    if (postIndex === -1) return;

    const newComment: Comment = {
      ...comment,
      id: `comment_${Date.now()}`,
      timestamp: Date.now()
    };

    all[postIndex].comments.push(newComment);
    localStorage.setItem(KEYS.POSTS, JSON.stringify(all));
    return newComment;
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
