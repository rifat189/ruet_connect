
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../db';
import { useAuth } from '../App';
import { Job, User } from '../types';
import { 
  Briefcase, MapPin, DollarSign, Clock, Search, ChevronRight, X, Plus, 
  ShieldAlert, CheckCircle, Info, Loader2, User as UserIcon, 
  ArrowUpRight, LogIn, FileText, Target, Building2, Sparkles, BrainCircuit
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

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
  
  // AI Compatibility State
  const [aiScore, setAiScore] = useState<number | null>(null);
  const [aiReason, setAiReason] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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

  // Trigger AI Analysis when a job is selected
  useEffect(() => {
    if (selectedJob && user) {
      analyzeCompatibility(selectedJob, user);
    } else {
      setAiScore(null);
      setAiReason(null);
    }
  }, [selectedJob, user]);

  const analyzeCompatibility = async (job: Job, currentUser: User) => {
    setIsAnalyzing(true);
    setAiScore(null);
    setAiReason(null);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        User Profile:
        Skills: ${currentUser.skills?.join(', ') || 'Not specified'}
        Bio: ${currentUser.bio}
        Recent Experience: ${JSON.stringify(currentUser.experience?.slice(0, 2) || [])}
        
        Job Posting:
        Title: ${job.title}
        Company: ${job.company}
        Requirements: ${job.requirements?.join(', ') || 'Not specified'}
        Description: ${job.description || 'General engineering role'}
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: "You are an AI talent scout for RUET. Evaluate how well this candidate fits the job. Return a JSON object with 'score' (number 0-100) and 'reason' (concise 1-sentence explanation of why they are a good match or what is missing). Be encouraging but realistic.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              reason: { type: Type.STRING }
            },
            required: ["score", "reason"]
          }
        }
      });

      const result = JSON.parse(response.text || '{}');
      setAiScore(result.score);
      setAiReason(result.reason);
    } catch (error) {
      console.error("AI Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    const posterId = user?.id || 'anonymous';
    db.addJob({ 
      ...newJob, 
      postedBy: user?.name || 'Anonymous', 
      postedByUserId: posterId,
      requirements: ['Strong analytical skills', 'Relevant engineering background'] 
    });
    
    setJobs(db.getJobs());
    setShowPostModal(false);
    triggerToast('Job posted successfully!', 'success');
  };

  const handleApply = (e: React.MouseEvent | React.FormEvent, job: Job) => {
    if (e) e.stopPropagation();
    if (!user) {
      triggerToast('Please log in to apply.', 'error');
      return;
    }

    if (appliedJobs.has(job.id)) return;
    
    setApplyingId(job.id);
    setTimeout(() => {
      setAppliedJobs(prev => new Set(prev).add(job.id));
      setApplyingId(null);
      triggerToast('Application sent!', 'success');
    }, 1500);
  };

  const triggerToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setShowToast({ message, type });
    setTimeout(() => setShowToast(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Toast */}
      {showToast && (
        <div className="fixed top-24 right-8 z-[150] animate-in fade-in slide-in-from-right-4">
          <div className={`${
            showToast.type === 'success' ? 'bg-slate-900 border-emerald-500/30' : 'bg-slate-900 border-slate-700'
          } text-white px-6 py-4 rounded-2xl shadow-2xl border flex items-center gap-3 backdrop-blur-xl`}>
            <CheckCircle className={showToast.type === 'success' ? 'text-emerald-500' : 'text-blue-500'} size={20} />
            <p className="font-medium text-sm">{showToast.message}</p>
          </div>
        </div>
      )}

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-700 rounded-[2.5rem] p-12 text-white mb-16 relative overflow-hidden shadow-xl">
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-1/4 translate-y-1/4">
          <Briefcase size={400} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Find Your Next Leap.</h1>
          <p className="text-blue-100 text-lg mb-10 font-medium">Exclusive opportunities for RUETians, shared directly by our global alumni network.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300" size={20} />
              <input
                type="text"
                placeholder="Search job titles or companies..."
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-white/40 font-medium text-sm text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {user && ['Alumni', 'Mentor', 'Company', 'Admin'].includes(user.role) && (
              <button 
                onClick={() => setShowPostModal(true)}
                className="px-8 py-4 bg-white text-indigo-700 rounded-2xl font-black text-sm hover:scale-105 transition-transform shadow-lg whitespace-nowrap"
              >
                Post Job
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-6">
          <h2 className="text-2xl font-black text-slate-900 px-2">Recent Postings</h2>
          {filteredJobs.map((job) => (
            <div 
              key={job.id} 
              onClick={() => setSelectedJob(job)}
              className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:border-indigo-200 hover:shadow-xl transition-all cursor-pointer shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex gap-6">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                    <Building2 size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">{job.title}</h3>
                    <p className="text-slate-600 font-bold mb-3">{job.company}</p>
                    <div className="flex flex-wrap gap-4">
                      <span className="flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-widest">
                        <MapPin size={14} className="text-indigo-500" /> {job.location}
                      </span>
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[9px] font-black uppercase tracking-widest">
                        {job.type}
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={(e) => handleApply(e, job)}
                  className={`px-8 py-3.5 rounded-2xl font-black text-sm transition-all ${
                    appliedJobs.has(job.id) ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-900 text-white hover:bg-indigo-600'
                  }`}
                >
                  {appliedJobs.has(job.id) ? 'Applied' : 'Details'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <aside className="lg:col-span-4 space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
              <Sparkles size={20} className="text-indigo-600" /> Career Growth
            </h3>
            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">
              Connect with alumni who have posted these roles to get an internal referral and increase your chances.
            </p>
            <button className="w-full py-4 bg-indigo-50 text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-100 transition-colors">
              Request Referral Guide
            </button>
          </div>
        </aside>
      </div>

      {/* JOB DETAIL MODAL */}
      {selectedJob && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 sm:p-12">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in" onClick={() => setSelectedJob(null)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl flex flex-col max-h-[75vh] animate-in zoom-in slide-in-from-bottom-8 overflow-hidden">
            
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl border border-slate-100 flex items-center justify-center text-indigo-600 shadow-sm">
                  <Building2 size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight leading-none">{selectedJob.title}</h2>
                  <p className="text-sm text-slate-500 font-bold mt-1">{selectedJob.company}</p>
                </div>
              </div>
              <button onClick={() => setSelectedJob(null)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 overflow-y-auto custom-scrollbar flex-grow space-y-8">
              {/* AI Compatibility Card */}
              <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-[2rem] p-8 border border-indigo-100/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                  <BrainCircuit size={80} />
                </div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-sm tracking-tight">AI Fit Analysis</h3>
                    <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">Powered by Gemini AI</p>
                  </div>
                </div>

                {isAnalyzing ? (
                  <div className="flex items-center gap-4">
                    <div className="h-2 flex-grow bg-indigo-200/50 rounded-full overflow-hidden">
                       <div className="h-full bg-indigo-500 w-1/3 animate-[shimmer_2s_infinite]"></div>
                    </div>
                    <span className="text-xs font-black text-indigo-400">Scanning Profile...</span>
                  </div>
                ) : aiScore !== null ? (
                  <div className="flex items-center gap-6">
                    <div className="relative w-16 h-16 shrink-0">
                       <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="16" fill="none" className="stroke-indigo-100" strokeWidth="3" />
                          <circle cx="18" cy="18" r="16" fill="none" className="stroke-indigo-600" strokeWidth="3" strokeDasharray={`${aiScore}, 100`} />
                       </svg>
                       <div className="absolute inset-0 flex items-center justify-center text-sm font-black text-slate-900">{aiScore}%</div>
                    </div>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed italic">"{aiReason}"</p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">Analysis requires a signed-in profile with skills listed.</p>
                )}
              </div>

              {/* Job Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <FileText size={14} className="text-indigo-500" /> Description
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed font-medium">
                    {selectedJob.description || "Exciting engineering role with focus on modern tech stacks and collaborative environment."}
                  </p>
                </section>
                <section>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <Target size={14} className="text-indigo-500" /> Key Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.requirements?.map((req, i) => (
                      <span key={i} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold text-slate-600">
                        {req}
                      </span>
                    )) || <span className="text-xs text-slate-400">No specific skills listed</span>}
                  </div>
                </section>
              </div>

              {/* BOTTOM INSIGHTS SECTION */}
              <section className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Info size={12} className="text-slate-400" /> Logistics & Poster
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Salary</span>
                    <span className="text-xs font-black text-slate-700">{selectedJob.salary || 'Negotiable'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Poster</span>
                    <span className="text-xs font-black text-slate-700 truncate">{selectedJob.postedBy}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Location</span>
                    <span className="text-xs font-black text-slate-700 truncate">{selectedJob.location}</span>
                  </div>
                </div>
              </section>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-100 bg-white flex items-center justify-between shrink-0">
               <button onClick={() => setSelectedJob(null)} className="text-xs font-black text-slate-400 uppercase tracking-widest px-4 hover:text-slate-900 transition-colors">
                 Dismiss
               </button>
               <button 
                onClick={(e) => handleApply(e, selectedJob)}
                disabled={appliedJobs.has(selectedJob.id)}
                className={`px-10 py-4 rounded-2xl font-black text-sm transition-all shadow-lg ${
                  appliedJobs.has(selectedJob.id) ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-900 text-white hover:bg-indigo-600'
                }`}
               >
                 {appliedJobs.has(selectedJob.id) ? 'Application Sent' : 'Apply Now'}
               </button>
            </div>
          </div>
        </div>
      )}

      {/* POST JOB MODAL */}
      {showPostModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowPostModal(false)}></div>
          <div className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-2xl p-10 animate-in zoom-in">
            <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Post New Opportunity</h2>
            <form onSubmit={handlePostJob} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <input required className="px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-100" placeholder="Title" value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} />
                <input required className="px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-100" placeholder="Company" value={newJob.company} onChange={e => setNewJob({...newJob, company: e.target.value})} />
              </div>
              <input required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-100" placeholder="Location" value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} />
              <textarea required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:ring-4 focus:ring-indigo-100 h-32 resize-none" placeholder="Description" value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})} />
              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-grow py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">Publish</button>
                <button type="button" onClick={() => setShowPostModal(false)} className="px-10 py-5 bg-slate-100 text-slate-500 rounded-[1.5rem] font-black hover:bg-slate-200 transition-all">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;
