
import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { User, Job, Event } from '../types';
import { 
  Users, Briefcase, Calendar, ShieldCheck, 
  Trash2, UserPlus, CheckCircle, XCircle, Search, Filter, Plus 
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'jobs' | 'events'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setUsers(db.getUsers());
    setJobs(db.getJobs());
    setEvents(db.getEvents());
  }, []);

  const handleDeleteUser = (id: string) => {
    if (confirm("Are you sure? This action is permanent.")) {
      db.deleteUser(id);
      setUsers(db.getUsers());
    }
  };

  const handleVerifyUser = (user: User) => {
    const updated = { ...user, isVerified: !user.isVerified };
    db.updateUser(updated);
    setUsers(db.getUsers());
  };

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-12">
        <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg">
          <ShieldCheck size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Admin Command Center</h1>
          <p className="text-slate-500">Manage the community, content, and security.</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        {[
          { icon: Users, label: 'Total Members', value: users.length, color: 'bg-blue-500' },
          { icon: Briefcase, label: 'Active Jobs', value: jobs.length, color: 'bg-emerald-500' },
          { icon: Calendar, label: 'Upcoming Events', value: events.length, color: 'bg-violet-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-6">
            <div className={`w-12 h-12 ${stat.color} text-white rounded-xl flex items-center justify-center`}>
              <stat.icon size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
        <div className="flex border-b border-gray-100">
          {(['users', 'jobs', 'events'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-5 text-sm font-bold capitalize transition-all border-b-2 ${
                activeTab === tab 
                  ? 'text-blue-600 border-blue-600 bg-blue-50/50' 
                  : 'text-slate-400 border-transparent hover:text-slate-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-8">
          <div className="flex justify-between items-center mb-8 gap-4">
             <div className="relative flex-grow max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder={`Search ${activeTab}...`} 
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-100"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             {/* Plus icon was missing from lucide-react imports */}
             <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all">
               <Plus size={18} /> Add New
             </button>
          </div>

          {activeTab === 'users' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <th className="pb-4 pl-4">Member</th>
                    <th className="pb-4">Role</th>
                    <th className="pb-4">Department</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4 pr-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="group hover:bg-gray-50/50 transition-all">
                      <td className="py-4 pl-4">
                        <div className="flex items-center gap-3">
                          <img src={user.avatar} className="w-10 h-10 rounded-xl object-cover" />
                          <div>
                            <div className="font-bold text-slate-900 text-sm">{user.name}</div>
                            <div className="text-[10px] text-slate-400 font-medium">Joined Oct 2024</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                          user.role === 'Admin' ? 'bg-slate-900 text-white' : 
                          user.role === 'Mentor' ? 'bg-violet-100 text-violet-600' :
                          user.role === 'Company' ? 'bg-orange-100 text-orange-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4 text-sm text-slate-600">{user.department}</td>
                      <td className="py-4">
                        <button 
                          onClick={() => handleVerifyUser(user)}
                          className={`flex items-center gap-1.5 font-bold text-[10px] ${
                            user.isVerified ? 'text-emerald-500' : 'text-slate-300'
                          }`}
                        >
                          {user.isVerified ? <CheckCircle size={14} /> : <XCircle size={14} />}
                          {user.isVerified ? 'Verified' : 'Unverified'}
                        </button>
                      </td>
                      <td className="py-4 pr-4 text-right">
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab !== 'users' && (
            <div className="py-12 text-center">
              <p className="text-slate-400">Management for {activeTab} is coming soon in the next update!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
