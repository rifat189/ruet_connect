
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../db';
import { useAuth } from '../App';
import { Job } from '../types';
import { Briefcase, MapPin, DollarSign, Clock, Search, ChevronRight, X, Plus, ShieldAlert, CheckCircle, Info, Loader2, User as UserIcon, ArrowUpRight, LogIn } from 'lucide-react';

const Jobs: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time' as Job['type'],
    postedBy: user?.name || 'Anonymous',
    salary: '',
    description: ''
  });

  useEffect(() => {
    setJobs(db.getJobs());
  }, []);

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.requirements?.some(req => req.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    const posterId = user?.id || 'anonymous';
    db.addJob({ 
      ...newJob, 
      postedBy: user?.name || 'Anonymous', 
      postedByUserId: posterId,
      requirements: ['Enthusiasm for tech', 'RUET affiliation'] 
    });
    
    // Notify Admin or followers (Simulated)
    db.addNotification({
      userId: posterId,
      title: 'Job Posted Successfully',
      message: `Your role for ${newJob.title} at ${newJob.company} is now live.`,
      type: 'job',
      link: '/jobs'
    });

    setJobs(db.getJobs());
    setShowPostModal(false);
    setNewJob({ title: '', company: '', location: '', type: 'Full-time', postedBy: user?.name || 'Anonymous', salary: '', description: '' });
  };

  const handleApply = (e: React.MouseEvent, job: Job) => {
    e.stopPropagation();
    
    if (!user) {
      triggerToast('Please log in to apply for this position.', 'error');
      setTimeout(() => navigate('/auth?mode=login'), 1500);
      return;
    }

    if (appliedJobs.has(job.id)) return;
    
    setApplyingId(job.id);
    setTimeout(() => {
      setAppliedJobs(prev => new Set(prev).add(job.id));
      setApplyingId(null);
      
      // Create user notification
      db.addNotification({
        userId: user.id,
        title: 'Application Received',
        message: `Your application for ${job.title} at ${job.company} was sent.`,
        type: 'job',
        link: '/jobs'
      });

      triggerToast('Application sent successfully! Good luck.', 'success');
    }, 1500);
  };

  const triggerToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setShowToast({ message, type });
    setTimeout(() => setShowToast(null), 3000);
  };

  const canPostJob = user && ['Admin', 'Alumni', 'Mentor', 'Company'].includes(user.role);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {showToast && (
        <div className="fixed top-24 right-8 z-[110] animate-in fade-in slide-in-from-right-4 duration-300">
          <div className={`${
            showToast.type === 'success' ? 'bg-slate-900 border-emerald-500/30' : 
            showToast.type === 'error' ? 'bg-red-900 border-red-500/30' : 'bg-slate-900'
          } text-white px-6 py-4 rounded-2xl shadow-2xl border flex items-center gap-3 backdrop-blur-xl`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              showToast.type === 'success' ? 'bg-emerald-500' : 
              showToast.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
            }`}>
              {showToast.type === 'success' ? <CheckCircle size={16} /> : 
               showToast.type === 'error' ? <LogIn size={16} /> : <Info size={16} />}
            </div>
            <p className="font-medium text-sm">{showToast.message}</p>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-[2.5rem] p-12 text-white mb-16 relative overflow-hidden shadow-xl shadow-blue-200">
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-1/4 translate-y-1/4 pointer-events-none">
          <Briefcase size={400} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl font-extrabold mb-4 leading-tight">Career Growth Starts Here.</h1>
          <p className="text-blue-100 text-lg mb-8">Exclusive jobs and internships handpicked for the RUET community.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            {canPostJob ? (
              <button 
                onClick={() => setShowPostModal(true)}
                className="px-8 py-4 bg-white text-blue-600 rounded-2xl font-bold hover:scale-105 transition-transform flex items-center gap-2 justify-center"
              >
                <Plus size={20} />
                Post an Opportunity
              </button>
            ) : (
              <div className="px-6 py-4 bg-blue-700/30 border border-blue-500/30 rounded-2xl flex items-center gap-3 text-sm text-blue-100 italic">
                <ShieldAlert size={18} />
                Posting is reserved for Alumni & Companies
              </div>
            )}
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300" size={20} />
              <input
                type="text"
                placeholder="Search jobs, skills..."
                className="w-full pl-12 pr-4 py-4 bg-blue-700/50 border border-blue-500 rounded-2xl placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">
            {searchTerm ? `Search results for "${searchTerm}"` : 'Recent Opportunities'}
          </h2>
          
          {filteredJobs.length === 0 ? (
            <div className="p-12 text-center bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 shadow-sm">
                <Search size={24} />
              </div>
              <p className="text-slate-500 font-medium">No jobs found matching your criteria.</p>
              <button onClick={() => setSearchTerm('')} className="mt-4 text-blue-600 font-bold hover:underline">Clear search</button>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div 
                key={job.id} 
                onClick={() => setSelectedJob(job)}
                className="group bg-white p-8 rounded-[2.5rem] border border-gray-100 hover:border-blue-200 hover:shadow-2xl transition-all cursor-pointer relative shadow-sm"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="flex gap-6">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 border border-blue-100 group-hover:scale-110 transition-transform flex-shrink-0">
                      <Briefcase size={32} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          job.type === 'Internship' ? 'bg-violet-50 text-violet-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                          {job.type}
                        </span>
                      </div>
                      <p className="text-slate-600 font-bold mb-4">{job.company}</p>
                      
                      <div className="flex flex-wrap gap-4 mb-6">
                        <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                          <MapPin size={14} />
                          {job.location}
                        </div>
                        {job.salary && (
                          <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs bg-emerald-50 px-3 py-1 rounded-lg">
                            <DollarSign size={14} />
                            {job.salary}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex md:flex-col gap-3">
                    <button 
                      onClick={(e) => handleApply(e, job)}
                      disabled={applyingId === job.id || appliedJobs.has(job.id)}
                      className={`min-w-[140px] px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                        appliedJobs.has(job.id)
                        ? 'bg-emerald-50 text-emerald-600 cursor-default border border-emerald-100 shadow-none'
                        : 'bg-slate-900 text-white hover:bg-blue-600 hover:scale-105 active:scale-95 shadow-lg shadow-slate-200'
                      }`}
                    >
                      {applyingId === job.id ? <Loader2 size={16} className="animate-spin" /> : 
                       appliedJobs.has(job.id) ? <><CheckCircle size={16} /> Applied</> : 'Apply Now'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <aside className="space-y-8">
          <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <h3 className="text-2xl font-bold mb-4 relative z-10">Job Alerts</h3>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed relative z-10">
              Get notified immediately when a batchmate or senior posts a job matching your expertise.
            </p>
            <div className="space-y-4 relative z-10">
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-5 py-4 bg-slate-800 border border-slate-700 rounded-2xl placeholder-slate-500 outline-none focus:border-blue-500 transition-colors"
              />
              <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/20">
                Enable Smart Alerts
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Jobs;
