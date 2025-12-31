
export interface Project {
  id: string;
  title: string;
  description: string;
  link?: string;
  tags?: string[];
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
}

export type UserRole = 'Admin' | 'Alumni' | 'Student' | 'Faculty' | 'Mentor' | 'Company';

export interface User {
  id: string;
  email?: string;
  password?: string;
  name: string;
  role: UserRole;
  department: string;
  batch: string;
  avatar: string;
  coverPhoto?: string;
  company?: string;
  position?: string;
  bio: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    website?: string;
  };
  skills?: string[];
  lookingForMentorship?: boolean;
  accomplishments?: string[];
  projects?: Project[];
  experience?: Experience[];
  isVerified?: boolean;
  connections?: string[];
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: number;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userRole: UserRole;
  content: string;
  timestamp: number;
  media?: {
    type: 'image' | 'video';
    url: string;
  }[];
  likes: number;
  likedBy: string[]; // Track user IDs who liked the post
  comments: Comment[];
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Internship' | 'Contract';
  postedBy: string;
  postedByUserId?: string;
  salary?: string;
  description?: string;
  requirements?: string[];
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'Webinar' | 'Meetup' | 'Reunion';
  location: string;
  image: string;
  description?: string;
  organizer?: string;
  interestedCount?: number;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'connection' | 'job' | 'event' | 'system' | 'mentorship' | 'post';
  timestamp: number;
  isRead: boolean;
  link?: string;
}

export interface MentorshipSession {
  id: string;
  mentorId: string;
  topic: string;
  status: 'Open' | 'Closed';
}
