
import { User, Job, Event } from './types';

export const MOCK_USERS: User[] = [
  {
    id: 'admin_1',
    email: 'admin@ruet.ac.bd',
    password: 'password123',
    name: 'Super Admin',
    role: 'Admin',
    department: 'ICT',
    batch: '2005',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200',
    coverPhoto: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1200',
    bio: 'System Administrator for RUETConnect. Managing the future of our alumni network.',
    skills: ['Management', 'Security', 'Infrastructure'],
    isVerified: true,
    accomplishments: ['RUET Excellence Award 2022'],
    experience: [],
    projects: []
  },
  {
    id: '1',
    email: 'sarah@google.com',
    password: 'password123',
    name: 'Sarah Rahman',
    role: 'Alumni',
    department: 'CSE',
    batch: '2012',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200',
    coverPhoto: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1200',
    company: 'Google',
    position: 'Senior Software Engineer',
    bio: 'Passionate about distributed systems and mentoring young engineers. Currently leading cloud infrastructure projects in Zurich.',
    skills: ['Go', 'Kubernetes', 'Distributed Systems', 'Cloud Architecture'],
    lookingForMentorship: false,
    isVerified: true,
    socialLinks: { linkedin: 'https://linkedin.com', github: 'https://github.com' },
    accomplishments: ['Top 1% Engineer at Google 2023', 'Lead Architect for Google Cloud Core'],
    experience: [{ id: 'exp1', company: 'Google', role: 'Senior Software Engineer', period: '2018 - Present', description: 'Developing high-availability backend services.' }],
    projects: [{ id: 'proj1', title: 'OpenInfra Go SDK', description: 'SDK for multi-cloud resources.', tags: ['Go', 'Cloud'], link: '#' }]
  },
  {
    id: 'mentor_1',
    email: 'faisal@meta.com',
    password: 'password123',
    name: 'Dr. Faisal Karim',
    role: 'Mentor',
    department: 'CSE',
    batch: '2000',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200',
    coverPhoto: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200',
    company: 'Meta',
    position: 'Staff Software Engineer',
    bio: 'Engineering leader with 20+ years in AI. Helping RUETians navigate big tech career paths.',
    skills: ['System Design', 'Scalability', 'Career Coaching', 'AI/ML'],
    isVerified: true,
    experience: [{ id: 'exp_m1', company: 'Meta', role: 'Staff Software Engineer', period: '2015 - Present', description: 'Infrastructure for WhatsApp.' }],
    projects: []
  },
  {
    id: 'user_4',
    email: 'elon@spacex.com',
    name: 'Tanvir Mahtab',
    role: 'Alumni',
    department: 'ME',
    batch: '2008',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200',
    company: 'SpaceX',
    position: 'Propulsion Engineer',
    bio: 'Working on Starship engine development. Excited to help ME students get into aerospace.',
    skills: ['Thermodynamics', 'CFD', 'Aerospace Engineering', 'SolidWorks'],
    isVerified: true,
    projects: [],
    experience: []
  },
  {
    id: 'user_5',
    email: 'jessica@netflix.com',
    name: 'Jessica Ahmed',
    role: 'Alumni',
    department: 'EEE',
    batch: '2015',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200',
    company: 'Netflix',
    position: 'UI Foundations Engineer',
    bio: 'Bridging the gap between EEE fundamentals and modern web engineering.',
    skills: ['React', 'Design Systems', 'Core JS', 'A/B Testing'],
    isVerified: true,
    projects: [],
    experience: []
  },
  {
    id: 'user_6',
    email: 'mark@intel.com',
    name: 'Rashedul Islam',
    role: 'Mentor',
    department: 'ETE',
    batch: '1998',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200&h=200',
    company: 'Intel',
    position: 'Principal VLSI Engineer',
    bio: 'Decades of experience in chip design and hardware architecture.',
    skills: ['VLSI', 'FPGA', 'Verilog', 'Digital Logic'],
    isVerified: true,
    projects: [],
    experience: []
  },
  {
    id: '3',
    email: 'anika@ruet.ac.bd',
    password: 'password123',
    name: 'Anika Tabassum',
    role: 'Student',
    department: 'CSE',
    batch: '2021',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200',
    coverPhoto: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200',
    bio: 'ML Enthusiast. Love exploring computer vision and natural language processing.',
    skills: ['Python', 'PyTorch', 'FastAPI', 'OpenCV'],
    lookingForMentorship: true,
    isVerified: false,
    projects: [{ id: 'proj2', title: 'Bangla OCR System', description: 'Deep learning based OCR for Bangla script.', tags: ['Deep Learning', 'PyTorch'], link: '#' }]
  }
];

export const MOCK_JOBS: Job[] = [
  {
    id: 'j1',
    title: 'Frontend Developer',
    company: 'Pathao',
    location: 'Dhaka, BD',
    type: 'Full-time',
    postedBy: 'Sarah Rahman',
    postedByUserId: '1',
    salary: '80k - 120k BDT',
    description: 'Build high-performance web applications using React and Tailwind CSS.',
    requirements: ['3+ years of React experience', 'Proficiency in TypeScript']
  },
  {
    id: 'j2',
    title: 'Embedded Systems Intern',
    company: 'Brain Station 23',
    location: 'Remote',
    type: 'Internship',
    postedBy: 'Dr. Faisal Karim',
    postedByUserId: 'mentor_1',
    description: 'Work on cutting-edge IoT projects. 3-month paid internship.',
    requirements: ['Microcontrollers knowledge', 'C/C++ programming']
  },
  {
    id: 'j3',
    title: 'Senior DevOps Engineer',
    company: 'Tiger IT',
    location: 'Dhaka, BD',
    type: 'Full-time',
    postedBy: 'Super Admin',
    salary: '150k - 200k BDT',
    description: 'Manage large scale infrastructure and CI/CD pipelines.'
  },
  {
    id: 'j4',
    title: 'Research Assistant (ML)',
    company: 'RUET AI Lab',
    location: 'Rajshahi, BD',
    type: 'Contract',
    postedBy: 'Anika Tabassum',
    description: 'Help develop local language models for regional dialects.'
  }
];

export const MOCK_EVENTS: Event[] = [
  {
    id: 'e1',
    title: 'RUET CSE Reunion 2024',
    date: 'Dec 15, 2024',
    time: '10:00 AM',
    type: 'Reunion',
    location: 'RUET Campus, Rajshahi',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200',
    description: 'The biggest gathering of the year! Open to all batches.',
    organizer: 'CSE Alumni Association',
    interestedCount: 245
  },
  {
    id: 'e2',
    title: 'Global Tech Webinar',
    date: 'Nov 20, 2024',
    time: '8:00 PM',
    type: 'Webinar',
    location: 'Zoom / YouTube Live',
    image: 'https://images.unsplash.com/photo-1505373633560-fa9a1f264654?auto=format&fit=crop&q=80&w=1200',
    description: 'Alumni from Silicon Valley share insights on the future of AI.',
    organizer: 'RUET Career Club',
    interestedCount: 500
  },
  {
    id: 'e3',
    title: 'Inter-Batch Cricket Cup',
    date: 'Jan 05, 2025',
    time: '09:00 AM',
    type: 'Meetup',
    location: 'RUET Central Field',
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=1200',
    interestedCount: 150
  }
];
