
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { db } from '../db';
import { useAuth } from '../App';
import { User, Project, Experience, Post } from '../types';
import { 
  Linkedin, Github, Twitter, Globe, GraduationCap, MapPin, 
  Building2, Trophy, Briefcase, Plus, X, Edit3, Save, Camera,
  ExternalLink, Calendar, Trash2, ShieldCheck, UserPlus, CheckCircle,
  Layout, Link as LinkIcon, Code, Heart, MessageSquare, Sparkles
} from 'lucide-react';

const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [showAllPosts, setShowAllPosts] = useState(false);

  const isOwner = authUser?.id === id;

  useEffect(() => {
    const users = db.getUsers();
    const foundUser = users.find(u => u.id === id);
    if (foundUser) {
      setProfileUser(foundUser);
      setEditedUser(JSON.parse(JSON.stringify(foundUser)));
      
      const allPosts = db.getPosts();
      setUserPosts(allPosts.filter(p => p.userId === id));
    }
  }, [id]);

  const handleSave = () => {
    if (editedUser) {
      db.updateUser(editedUser);
      setProfileUser(editedUser);
      setIsEditing(false);
      triggerToast('Profile updated successfully!');
    }
  };

  const triggerToast = (message: string) => {
    setShowToast(message);
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleConnect = () => {
    triggerToast(`Connection request sent to ${profileUser?.name}!`);
  };

  const handleMentorshipRequest = () => {
    triggerToast(`Mentorship request sent to ${profileUser?.name}!`);
  };

  const addItem = (field: 'skills' | 'accomplishments') => {
    if (editedUser) {
      const currentList = editedUser[field] || [];
      setEditedUser({
        ...editedUser,
        [field]: [...currentList, field === 'skills' ? 'New Skill' : 'New Accomplishment']
      });
    }
  };

  const removeItem = (field: 'skills' | 'accomplishments', index: number) => {
    if (editedUser) {
      const currentList = [...(editedUser[field] || [])];
      currentList.splice(index, 1);
      setEditedUser({ ...editedUser, [field]: currentList });
    }
  };

  const updateListItem = (field: 'skills' | 'accomplishments', index: number, value: string) => {
    if (editedUser) {
      const currentList = [...(editedUser[field] || [])];
      currentList[index] = value;
      setEditedUser({ ...editedUser, [field]: currentList });
    }
  };

  const addExperience = () => {
    if (editedUser) {
      const newExp: Experience = {
        id: `e_${Date.now()}`,
        company: '',
        role: '',
        period: '',
        description: ''
      };
      setEditedUser({
        ...editedUser,
        experience: [newExp, ...(editedUser.experience || [])]
      });
    }
  };

  const addProject = () => {
    if (editedUser) {
      const newProject: Project = {
        id: `p_${Date.now()}`,
        title: '',
        description: '',
        tags: []
      };
      setEditedUser({
        ...editedUser,
        projects: [newProject, ...(editedUser.projects || [])]
      });
    }
  };

  const removeProject = (projId: string) => {
    if (editedUser) {
      setEditedUser({
        ...editedUser,
        projects: (editedUser.projects || []).filter(p => p.id !== projId)
      });
    }
  };

  if (!profileUser) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-slate-400">User Not Found</h2>
        <button onClick={() => navigate('/network')} className="mt-4 text-blue-600 font-bold hover:underline">Back to Network</button>
      </div>
    );
  }

  const profile = isEditing ? editedUser! : profileUser;
  const displayedPosts = showAllPosts ? userPosts : userPosts.slice(0, 2);

  return (
    <div className="pb-24 relative bg-slate-50/50">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-24 right-8 z-[100] animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <CheckCircle size={16} />
            </div>
            <p className="font-medium text-sm">{showToast}</p>
          </div>
        </div>
      )}

      {/* Cover Photo */}
      <div className="relative h-64 md:h-96 w-full overflow-hidden bg-slate-200">
        <img 
          src={profile.coverPhoto || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1200'} 
          className="w-full h-full object-cover"
          alt="Cover"
        />
        {isEditing && (
          <div className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center gap-4 p-4">
            <div className="glass p-8 rounded-[2.5rem] w-full max-w-xl border border-white/20">
              <div className="flex items-center gap-3 mb-4 text-white">
                <Camera size={20} />
                <h3 className="font-bold">Cover Photo Settings</h3>
              </div>
              <input 
                type="text" 
                className="w-full bg-white/20 text-white placeholder-white/50 border border-white/30 rounded-2xl px-6 py-4 outline-none focus:bg-white/30 transition-all shadow-inner"
                placeholder="Paste high-quality image URL..."
                value={editedUser?.coverPhoto || ''}
                onChange={(e) => setEditedUser({...editedUser!, coverPhoto: e.target.value})}
              />
              <p className="text-white/40 text-[10px] mt-3 ml-2 font-medium uppercase tracking-widest">Supports PNG, JPG, or WebP</p>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4 relative">
        {/* Profile Header Card */}
        <div className="relative -mt-20 md:-mt-32 mb-12">
          <div className="bg-white rounded-[3rem] shadow-2xl p-8 md:p-14 border border-slate-100 flex flex-col md:flex-row gap-10 items-center md:items-start transition-all">
            <div className="relative group flex-shrink-0">
              <img 
                src={profile.avatar} 
                className="w-44 h-44 md:w-56 md:h-56 rounded-[2.5rem] object-cover border-8 border-white shadow-2xl bg-white"
                alt={profile.name}
              />
              {isEditing && (
                <div className="absolute inset-0 rounded-[2.5rem] bg-slate-900/60 flex flex-col items-center justify-center p-6 backdrop-blur-sm">
                  <div className="bg-white/10 p-3 rounded-2xl mb-3">
                    <Camera className="text-white" size={24} />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Avatar URL"
                    className="w-full text-xs px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/50 border border-white/10 outline-none focus:bg-white/30 transition-all"
                    value={editedUser?.avatar || ''}
                    onChange={(e) => setEditedUser({...editedUser!, avatar: e.target.value})}
                  />
                </div>
              )}
            </div>

            <div className="flex-grow text-center md:text-left space-y-6 pt-6 md:pt-10">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {isEditing ? (
                  <div className="flex flex-col gap-4 w-full">
                    <div className="flex items-center gap-4">
                      <input 
                        className="text-4xl font-black text-slate-900 bg-slate-50 border-b-4 border-blue-500 px-4 py-2 w-full max-w-xl outline-none rounded-t-2xl"
                        value={editedUser?.name || ''}
                        placeholder="Your Full Name"
                        onChange={(e) => setEditedUser({...editedUser!, name: e.target.value})}
                      />
                      <select 
                        className="px-6 py-3 rounded-2xl text-sm font-black bg-blue-50 text-blue-700 outline-none border-2 border-blue-100 hover:border-blue-200 transition-all cursor-pointer"
                        value={editedUser?.role}
                        onChange={(e) => setEditedUser({...editedUser!, role: e.target.value as any})}
                      >
                        <option value="Alumni">Alumni</option>
                        <option value="Student">Student</option>
                        <option value="Faculty">Faculty</option>
                        <option value="Mentor">Mentor</option>
                        <option value="Company">Company</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight flex items-center gap-4 tracking-tighter">
                      {profile.name}
                      {profile.isVerified && <ShieldCheck className="text-blue-500 drop-shadow-sm" size={32} />}
                    </h1>
                    <span className={`self-center md:self-auto px-6 py-2 rounded-2xl text-xs font-black uppercase tracking-widest ${
                      profile.role === 'Alumni' ? 'bg-blue-50 text-blue-600' : 
                      profile.role === 'Mentor' ? 'bg-violet-50 text-violet-600' :
                      profile.role === 'Company' ? 'bg-orange-50 text-orange-600' :
                      'bg-emerald-50 text-emerald-600'
                    }`}>
                      {profile.role}
                    </span>
                  </>
                )}
              </div>

              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Academic Credentials</label>
                    <div className="flex gap-3">
                      <input className="bg-white border border-slate-200 px-4 py-3 rounded-xl text-sm w-full outline-none focus:ring-2 focus:ring-blue-100 font-medium" placeholder="Dept (e.g. CSE)" value={editedUser?.department} onChange={e => setEditedUser({...editedUser!, department: e.target.value})} />
                      <input className="bg-white border border-slate-200 px-4 py-3 rounded-xl text-sm w-32 outline-none focus:ring-2 focus:ring-blue-100 font-medium" placeholder="Batch" value={editedUser?.batch} onChange={e => setEditedUser({...editedUser!, batch: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Professional Status</label>
                    <div className="flex gap-3">
                      <input className="bg-white border border-slate-200 px-4 py-3 rounded-xl text-sm w-full outline-none focus:ring-2 focus:ring-blue-100 font-medium" placeholder="Position" value={editedUser?.position} onChange={e => setEditedUser({...editedUser!, position: e.target.value})} />
                      <input className="bg-white border border-slate-200 px-4 py-3 rounded-xl text-sm w-full outline-none focus:ring-2 focus:ring-blue-100 font-medium" placeholder="Company" value={editedUser?.company} onChange={e => setEditedUser({...editedUser!, company: e.target.value})} />
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-slate-500 text-xl font-medium tracking-tight">
                  <span className="text-slate-900 font-bold">{profile.department}</span> • Batch '{profile.batch} 
                  {profile.company && (
                    <span className="text-slate-400 font-normal"> • {profile.position} at <span className="text-slate-600 font-semibold">{profile.company}</span></span>
                  )}
                </p>
              )}
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                {isEditing ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full pt-4">
                    <div className="relative">
                      <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" size={16} />
                      <input 
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] outline-none focus:ring-2 focus:ring-blue-100 font-medium" 
                        placeholder="LinkedIn Profile URL"
                        value={editedUser?.socialLinks?.linkedin || ''}
                        onChange={(e) => setEditedUser({...editedUser!, socialLinks: {...editedUser!.socialLinks, linkedin: e.target.value}})}
                      />
                    </div>
                    <div className="relative">
                      <Github className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-900" size={16} />
                      <input 
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] outline-none focus:ring-2 focus:ring-blue-100 font-medium" 
                        placeholder="GitHub Username URL"
                        value={editedUser?.socialLinks?.github || ''}
                        onChange={(e) => setEditedUser({...editedUser!, socialLinks: {...editedUser!.socialLinks, github: e.target.value}})}
                      />
                    </div>
                    <div className="relative">
                      <Twitter className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" size={16} />
                      <input 
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] outline-none focus:ring-2 focus:ring-blue-100 font-medium" 
                        placeholder="Twitter Username"
                        value={editedUser?.socialLinks?.twitter || ''}
                        onChange={(e) => setEditedUser({...editedUser!, socialLinks: {...editedUser!.socialLinks, twitter: e.target.value}})}
                      />
                    </div>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={16} />
                      <input 
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] outline-none focus:ring-2 focus:ring-blue-100 font-medium" 
                        placeholder="Personal Website URL"
                        value={editedUser?.socialLinks?.website || ''}
                        onChange={(e) => setEditedUser({...editedUser!, socialLinks: {...editedUser!.socialLinks, website: e.target.value}})}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-3 pt-4">
                    {profile.socialLinks?.linkedin && (
                      <a href={profile.socialLinks.linkedin} target="_blank" className="flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-700 rounded-2xl hover:bg-blue-100 transition-all font-bold text-xs shadow-sm shadow-blue-100/50">
                        <Linkedin size={16} /> LinkedIn
                      </a>
                    )}
                    {profile.socialLinks?.github && (
                      <a href={profile.socialLinks.github} target="_blank" className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl hover:bg-black transition-all font-bold text-xs shadow-lg shadow-slate-200">
                        <Github size={16} /> GitHub
                      </a>
                    )}
                    {profile.socialLinks?.website && (
                      <a href={profile.socialLinks.website} target="_blank" className="flex items-center gap-2 px-6 py-3 bg-emerald-50 text-emerald-700 rounded-2xl hover:bg-emerald-100 transition-all font-bold text-xs shadow-sm shadow-emerald-100/50">
                        <Globe size={16} /> Portfolio
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4 flex-shrink-0 min-w-[220px]">
              {isOwner ? (
                !isEditing ? (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="px-8 py-4 bg-blue-600 text-white rounded-[1.5rem] font-black flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 active:scale-95"
                  >
                    <Edit3 size={20} /> Edit Profile
                  </button>
                ) : (
                  <div className="space-y-3">
                    <button 
                      onClick={handleSave}
                      className="w-full px-8 py-4 bg-emerald-600 text-white rounded-[1.5rem] font-black flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-100 animate-in fade-in slide-in-from-top-2"
                    >
                      <Save size={20} /> Save Changes
                    </button>
                    <button 
                      onClick={() => {setIsEditing(false); setEditedUser(profileUser);}}
                      className="w-full px-8 py-4 bg-slate-100 text-slate-500 rounded-[1.5rem] font-black flex items-center justify-center gap-3 hover:bg-slate-200 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                )
              ) : (
                <div className="space-y-4">
                  <button 
                    onClick={handleConnect}
                    className="w-full px-8 py-4 bg-blue-600 text-white rounded-[1.5rem] font-black flex items-center justify-center gap-3 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-blue-200"
                  >
                    <UserPlus size={20} /> Connect
                  </button>
                  <button 
                    onClick={handleMentorshipRequest}
                    className="w-full px-8 py-4 bg-white text-slate-900 border-2 border-slate-100 rounded-[1.5rem] font-black flex items-center justify-center gap-3 hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all shadow-sm"
                  >
                    <GraduationCap size={20} /> Get Mentorship
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-10">
            <section className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-sm hover:shadow-xl transition-shadow group">
              <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <Layout size={20} className="text-blue-600" />
                About Me
              </h3>
              {isEditing ? (
                <textarea 
                  className="w-full h-48 p-5 bg-slate-50 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-100 border border-slate-100 resize-none leading-relaxed font-medium transition-all"
                  value={editedUser?.bio || ''}
                  onChange={(e) => setEditedUser({...editedUser!, bio: e.target.value})}
                  placeholder="Share your RUET journey, professional aspirations, or fun facts..."
                />
              ) : (
                <p className="text-slate-500 leading-relaxed font-medium italic">"{profile.bio}"</p>
              )}
            </section>

            <section className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                  <Code size={20} className="text-blue-600" />
                  Expertise
                </h3>
                {isEditing && (
                  <button onClick={() => addItem('skills')} className="text-blue-600 hover:bg-blue-50 p-2 rounded-xl transition-colors">
                    <Plus size={22} />
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2.5">
                {profile.skills?.map((skill, i) => (
                  <div key={i} className="group relative">
                    {isEditing ? (
                      <div className="flex items-center bg-blue-50 rounded-xl overflow-hidden border border-blue-100 pr-2">
                        <input 
                          className="px-4 py-2 bg-transparent text-blue-700 text-[10px] font-black uppercase tracking-widest outline-none w-28"
                          value={skill}
                          onChange={(e) => updateListItem('skills', i, e.target.value)}
                        />
                        <button onClick={() => removeItem('skills', i)} className="text-blue-300 hover:text-red-500 transition-colors">
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <span className="px-4 py-2 bg-blue-50 text-blue-600 text-[10px] font-black rounded-xl uppercase tracking-widest border border-blue-100/50">
                        {skill}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                  <Trophy size={20} className="text-blue-600" />
                  Milestones
                </h3>
                {isEditing && (
                  <button onClick={() => addItem('accomplishments')} className="text-blue-600 hover:bg-blue-50 p-2 rounded-xl transition-colors">
                    <Plus size={22} />
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {profile.accomplishments?.map((acc, i) => (
                  <div key={i} className="flex gap-4 group/item">
                    {isEditing ? (
                      <div className="flex-grow flex items-center gap-3">
                        <input 
                          className="flex-grow px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium outline-none focus:ring-4 focus:ring-blue-100"
                          value={acc}
                          onChange={(e) => updateListItem('accomplishments', i, e.target.value)}
                        />
                        <button onClick={() => removeItem('accomplishments', i)} className="text-slate-300 hover:text-red-500 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2.5 flex-shrink-0" />
                        <p className="text-slate-600 font-medium text-sm leading-relaxed">{acc}</p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Posts Section */}
            <section>
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-black text-slate-900 flex items-center gap-4 tracking-tighter">
                  <Sparkles className="text-blue-600" size={32} /> Recent Activity
                </h2>
                {userPosts.length > 2 && (
                  <button 
                    onClick={() => setShowAllPosts(!showAllPosts)} 
                    className="text-blue-600 font-black text-xs hover:underline uppercase tracking-widest"
                  >
                    {showAllPosts ? 'Show Less' : `See All Posts (${userPosts.length})`}
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {userPosts.length === 0 ? (
                  <div className="p-16 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                    <p className="text-slate-400 font-bold italic">No posts shared by this user yet.</p>
                  </div>
                ) : (
                  displayedPosts.map((post) => (
                    <div key={post.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
                      <p className="text-slate-600 font-medium leading-relaxed mb-6 line-clamp-3">{post.content}</p>
                      {post.media && post.media.length > 0 && (
                        <div className="rounded-2xl overflow-hidden mb-6 h-48">
                          <img src={post.media[0].url} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                        <div className="flex items-center gap-6">
                          <span className="flex items-center gap-1.5 text-slate-400 text-xs font-bold"><Heart size={16} /> {post.likes}</span>
                          {/* Fix: Render the length of the comments array instead of the array itself to avoid TypeScript error */}
                          <span className="flex items-center gap-1.5 text-slate-400 text-xs font-bold"><MessageSquare size={16} /> {post.comments.length}</span>
                        </div>
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{new Date(post.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Experience Section */}
            <section>
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-black text-slate-900 flex items-center gap-4 tracking-tighter">
                  <Briefcase className="text-blue-600" size={32} /> Career Timeline
                </h2>
                {isEditing && (
                  <button onClick={addExperience} className="px-6 py-3 bg-blue-600 text-white rounded-[1.25rem] font-black text-xs flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                    <Plus size={18} /> Log Experience
                  </button>
                )}
              </div>
              
              <div className="space-y-10">
                {profile.experience?.length === 0 && !isEditing ? (
                  <div className="p-16 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                    <p className="text-slate-400 font-bold italic">No career logs available yet.</p>
                  </div>
                ) : (
                  profile.experience?.map((exp, idx) => (
                    <div key={exp.id} className="relative pl-10 before:content-[''] before:absolute before:left-0 before:top-3 before:bottom-0 before:w-1 before:bg-slate-100 group">
                      <div className="absolute left-[-6px] top-3 w-4 h-4 rounded-full bg-blue-600 border-4 border-white shadow-sm transition-transform group-hover:scale-125"></div>
                      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 hover:border-blue-200 transition-all shadow-sm hover:shadow-2xl">
                        {isEditing ? (
                          <div className="space-y-6">
                            <div className="flex justify-between gap-4">
                              <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Job Role</label>
                                  <input 
                                    className="w-full font-bold text-lg text-slate-900 bg-slate-50 border border-slate-100 px-5 py-3 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100" 
                                    placeholder="e.g. Lead Developer"
                                    value={exp.role} 
                                    onChange={(e) => {
                                      const list = [...editedUser!.experience!];
                                      list[idx].role = e.target.value;
                                      setEditedUser({...editedUser!, experience: list});
                                    }}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Institution</label>
                                  <input 
                                    className="w-full font-bold text-blue-600 bg-slate-50 border border-slate-100 px-5 py-3 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100" 
                                    placeholder="e.g. Google Switzerland"
                                    value={exp.company} 
                                    onChange={(e) => {
                                      const list = [...editedUser!.experience!];
                                      list[idx].company = e.target.value;
                                      setEditedUser({...editedUser!, experience: list});
                                    }}
                                  />
                                </div>
                              </div>
                              <button onClick={() => {
                                  const list = editedUser!.experience!.filter(e => e.id !== exp.id);
                                  setEditedUser({...editedUser!, experience: list});
                                }} className="self-start mt-8 p-3 text-slate-300 hover:text-red-500 transition-colors">
                                <Trash2 size={22} />
                              </button>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Period & Contribution</label>
                              <div className="flex gap-4">
                                <input 
                                  className="w-48 bg-slate-50 border border-slate-100 px-5 py-3 rounded-2xl text-sm font-bold outline-none" 
                                  placeholder="2020 - Present"
                                  value={exp.period}
                                  onChange={(e) => {
                                    const list = [...editedUser!.experience!];
                                    list[idx].period = e.target.value;
                                    setEditedUser({...editedUser!, experience: list});
                                  }}
                                />
                                <textarea 
                                  className="flex-grow bg-slate-50 border border-slate-100 p-5 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-100 resize-none h-32 font-medium"
                                  placeholder="Describe your core responsibilities and major wins..."
                                  value={exp.description}
                                  onChange={(e) => {
                                    const list = [...editedUser!.experience!];
                                    list[idx].description = e.target.value;
                                    setEditedUser({...editedUser!, experience: list});
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                              <div>
                                <h4 className="text-2xl font-black text-slate-900 tracking-tight">{exp.role}</h4>
                                <p className="text-blue-600 font-bold text-lg">{exp.company}</p>
                              </div>
                              <span className="text-[10px] font-black bg-slate-100 px-5 py-2 rounded-full text-slate-500 flex items-center gap-2 uppercase tracking-widest border border-slate-200/50">
                                <Calendar size={14} className="text-blue-400" /> {exp.period}
                              </span>
                            </div>
                            <p className="text-slate-500 text-base leading-relaxed font-medium">{exp.description}</p>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Projects Section */}
            <section>
               <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-black text-slate-900 flex items-center gap-4 tracking-tighter">
                  <Layout size={32} className="text-blue-600" /> Showcase Projects
                </h2>
                {isEditing && (
                  <button onClick={addProject} className="px-6 py-3 bg-slate-900 text-white rounded-[1.25rem] font-black text-xs flex items-center gap-2 hover:bg-black transition-all shadow-xl shadow-slate-200">
                    <Plus size={18} /> New Project
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {profile.projects?.length === 0 && !isEditing ? (
                  <div className="md:col-span-2 p-16 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                    <p className="text-slate-400 font-bold italic">No projects showcased yet.</p>
                  </div>
                ) : (
                  profile.projects?.map((project, idx) => (
                    <div key={project.id} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 hover:border-blue-200 hover:shadow-2xl transition-all group flex flex-col shadow-sm">
                      {isEditing ? (
                        <div className="space-y-4 h-full flex flex-col">
                          <div className="flex justify-between gap-3">
                             <input 
                              className="w-full font-black text-xl text-slate-900 bg-slate-50 border border-slate-100 px-5 py-3 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100" 
                              placeholder="Project Title"
                              value={project.title} 
                              onChange={(e) => {
                                const list = [...editedUser!.projects!];
                                list[idx].title = e.target.value;
                                setEditedUser({...editedUser!, projects: list});
                              }}
                            />
                            <button onClick={() => removeProject(project.id)} className="p-2 text-slate-300 hover:text-red-500">
                              <Trash2 size={20} />
                            </button>
                          </div>
                          <textarea 
                            className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl text-sm font-medium outline-none focus:ring-4 focus:ring-blue-100 resize-none h-28"
                            placeholder="A brief pitch about the project..."
                            value={project.description}
                            onChange={(e) => {
                              const list = [...editedUser!.projects!];
                              list[idx].description = e.target.value;
                              setEditedUser({...editedUser!, projects: list});
                            }}
                          />
                          <div className="relative mt-auto pt-4">
                            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input 
                              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold outline-none" 
                              placeholder="Live Link or Repo URL"
                              value={project.link || ''}
                              onChange={(e) => {
                                const list = [...editedUser!.projects!];
                                list[idx].link = e.target.value;
                                setEditedUser({...editedUser!, projects: list});
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-4 mb-6">
                             <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100 group-hover:scale-110 transition-transform">
                                <Code size={24} />
                             </div>
                             <h4 className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">{project.title}</h4>
                          </div>
                          <p className="text-slate-500 font-medium text-base mb-8 flex-grow leading-relaxed">{project.description}</p>
                          <div className="flex items-center justify-between mt-auto">
                            <div className="flex flex-wrap gap-2">
                              {project.tags?.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-widest rounded-lg">{tag}</span>
                              ))}
                            </div>
                            {project.link && (
                              <a href={project.link} target="_blank" className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                                <ExternalLink size={20} />
                              </a>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
