
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../db';
import { User } from '../types';
import { useAuth } from '../App';
import { Search, Filter, MapPin, Building2, UserPlus, Linkedin, Github, GraduationCap, X, Trophy, ArrowRight, User as UserIcon, CheckCircle } from 'lucide-react';

const Network: React.FC = () => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [showToast, setShowToast] = useState<string | null>(null);

  useEffect(() => {
    setUsers(db.getUsers());
  }, []);

  const allSkills = useMemo(() => {
    const skillsSet = new Set<string>();
    users.forEach(user => {
      user.skills?.forEach(skill => skillsSet.add(skill));
    });
    return Array.from(skillsSet).sort();
  }, [users]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.batch.includes(searchTerm) ||
      user.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSkill = selectedSkill ? user.skills?.includes(selectedSkill) : true;
    
    return matchesSearch && matchesSkill;
  });

  const handleConnect = (e: React.MouseEvent, userName: string) => {
    e.stopPropagation();
    if (authUser) {
      db.addNotification({
        userId: authUser.id,
        title: 'Connection Sent',
        message: `You sent a connection request to ${userName}.`,
        type: 'connection'
      });
    }
    setShowToast(`Connection request sent to ${userName}!`);
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleMentorship = (e: React.MouseEvent, userName: string) => {
    e.stopPropagation();
    if (authUser) {
      db.addNotification({
        userId: authUser.id,
        title: 'Mentorship Requested',
        message: `You requested career guidance from ${userName}.`,
        type: 'mentorship'
      });
    }
    setShowToast(`Mentorship request sent to ${userName}!`);
    setTimeout(() => setShowToast(null), 3000);
  };

  const navigateToProfile = (id: string) => {
    navigate(`/profile/${id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 relative">
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

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Network Directory</h1>
          <p className="text-slate-500">Connect with members of the RUET family.</p>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-grow md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search name, batch, or department..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
          <span className="text-sm font-semibold text-slate-400 mr-2 whitespace-nowrap">Popular Skills:</span>
          <button
            onClick={() => setSelectedSkill(null)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap border ${
              selectedSkill === null 
                ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100' 
                : 'bg-white border-gray-100 text-slate-500 hover:border-gray-300'
            }`}
          >
            All Members
          </button>
          {allSkills.map((skill) => (
            <button
              key={skill}
              onClick={() => setSelectedSkill(selectedSkill === skill ? null : skill)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap border flex items-center gap-2 ${
                selectedSkill === skill 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100' 
                  : 'bg-white border-gray-100 text-slate-500 hover:border-gray-300'
              }`}
            >
              {skill}
              {selectedSkill === skill && <X size={14} />}
            </button>
          ))}
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-gray-200">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
            <Search size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No RUETians found</h3>
          <p className="text-slate-500">Try adjusting your search or skill filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredUsers.map((user) => (
            <div 
              key={user.id} 
              onClick={() => navigateToProfile(user.id)}
              className="bg-white rounded-[2rem] border border-gray-100 p-8 hover:shadow-xl transition-all group relative overflow-hidden flex flex-col shadow-sm cursor-pointer"
            >
              {user.lookingForMentorship && (
                <div className="absolute top-0 right-0 bg-violet-600 text-white text-[10px] font-bold px-4 py-1.5 rounded-bl-2xl flex items-center gap-1.5 uppercase tracking-wider z-10">
                  <GraduationCap size={12} />
                  Looking for Mentor
                </div>
              )}
              
              <div className="flex items-start justify-between mb-6">
                <div className="relative">
                  <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-2xl object-cover shadow-inner bg-gray-50 border border-gray-100" />
                  <span className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></span>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                  user.role === 'Alumni' ? 'bg-blue-50 text-blue-600' : 
                  user.role === 'Faculty' ? 'bg-orange-50 text-orange-600' : 
                  'bg-emerald-50 text-emerald-600'
                }`}>
                  {user.role}
                </span>
              </div>

              <div className="flex-grow">
                <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{user.name}</h3>
                <p className="text-slate-500 text-sm mb-4 font-medium">{user.department} • Batch '{user.batch}</p>
              </div>

              <div className="pt-6 border-t border-gray-50 mt-auto">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-2">
                    {user.socialLinks?.linkedin && (
                      <div className="p-2 bg-gray-50 text-slate-400 rounded-xl">
                        <Linkedin size={16} />
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => handleMentorship(e, user.name)}
                      className="p-2 text-violet-600 hover:text-violet-700 hover:bg-violet-50 rounded-xl transition-all active:scale-95 group/mentor"
                      title="Request Mentorship"
                    >
                      <GraduationCap size={18} className="group-hover/mentor:scale-110 transition-transform" />
                    </button>
                    <button 
                      onClick={(e) => handleConnect(e, user.name)}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold text-sm px-4 py-2 hover:bg-blue-50 rounded-xl transition-all active:scale-95"
                    >
                      <UserPlus size={16} />
                      Connect
                    </button>
                  </div>
                </div>
                
                <button 
                  onClick={(e) => { e.stopPropagation(); navigateToProfile(user.id); }}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 group/profile shadow-lg shadow-slate-100 hover:bg-blue-600 active:scale-[0.98] overflow-hidden relative"
                >
                  <div className="flex items-center gap-2 group-hover:translate-x-[-10px] transition-transform duration-300">
                    <UserIcon size={18} />
                    View Full Profile
                  </div>
                  <ArrowRight 
                    size={18} 
                    className="absolute right-8 opacity-0 group-hover:opacity-100 group-hover:translate-x-4 transition-all duration-300" 
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Network;
