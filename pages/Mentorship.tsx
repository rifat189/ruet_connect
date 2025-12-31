
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Sparkles, MessageCircle, Star, Search, CheckCircle, Loader2, BrainCircuit, Wand2, X } from 'lucide-react';
import { useAuth } from '../App';
import { db } from '../db';
import { User } from '../types';
import { GoogleGenAI, Type } from "@google/genai";

interface AIMatch {
  userId: string;
  reason: string;
}

const Mentorship: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [mentors, setMentors] = useState<User[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMatches, setAiMatches] = useState<(AIMatch & { mentor: User })[]>([]);
  const [showToast, setShowToast] = useState<string | null>(null);

  useEffect(() => {
    const allUsers = db.getUsers();
    const featured = allUsers.filter(u => u.role === 'Mentor' || (u.role === 'Alumni' && u.experience && u.experience.length > 0));
    setMentors(featured);
  }, []);

  const handleAIMatch = async () => {
    if (!prompt.trim()) return;
    setAiLoading(true);
    setAiMatches([]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const mentorsData = mentors.map(m => ({
        id: m.id,
        name: m.name,
        company: m.company,
        position: m.position,
        skills: m.skills,
        bio: m.bio
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `User Career Goal: "${prompt}"\n\nAvailable Mentor Database: ${JSON.stringify(mentorsData)}`,
        config: {
          systemInstruction: "You are a senior career consultant for RUET engineering students. Analyze the user's goal and pick the top 3 best matching mentors. Provide a one-sentence reason for each match focusing on professional synergy. Return ONLY JSON.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                userId: { type: Type.STRING },
                reason: { type: Type.STRING }
              },
              required: ["userId", "reason"]
            }
          }
        }
      });

      const matches: AIMatch[] = JSON.parse(response.text || '[]');
      const enrichedMatches = matches
        .map(match => {
          const mentor = mentors.find(m => m.id === match.userId);
          return mentor ? { ...match, mentor } : null;
        })
        .filter((m): m is (AIMatch & { mentor: User }) => m !== null);

      setAiMatches(enrichedMatches);
    } catch (error) {
      console.error("AI Matching failed:", error);
      triggerToast("AI Service temporarily unavailable. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  const triggerToast = (message: string) => {
    setShowToast(message);
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleBookSession = (e: React.MouseEvent, mentor: User) => {
    e.stopPropagation();
    if (!user) {
      triggerToast('Please sign in to book a session.');
      setTimeout(() => navigate('/auth?mode=login'), 1500);
      return;
    }
    setLoadingId(mentor.id);
    setTimeout(() => {
      db.addNotification({
        userId: user.id,
        title: 'Mentorship Requested',
        message: `Your request for a session with ${mentor.name} has been sent.`,
        type: 'mentorship',
        link: `/profile/${mentor.id}`
      });
      setLoadingId(null);
      triggerToast(`Session request sent to ${mentor.name}!`);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {showToast && (
        <div className="fixed top-24 right-8 z-[110] animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 backdrop-blur-xl">
            <CheckCircle className="text-emerald-500" size={18} />
            <p className="font-medium text-sm">{showToast}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-12 items-center mb-24">
        <div className="lg:w-1/2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-violet-50 text-violet-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-violet-100">
            <GraduationCap size={14} /> Professional Growth
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight tracking-tighter">
            Learn from the <span className="text-violet-600 text-glow">Experts Who’ve Walked the Path.</span>
          </h1>
          <p className="text-slate-500 text-lg mb-10 leading-relaxed font-medium">
            Connect with accomplished alumni at Tesla, Google, Meta and more. Bridge the gap between engineering theory and industrial reality.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => document.getElementById('featured-mentors')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-violet-600 text-white rounded-2xl font-black shadow-xl shadow-violet-100 hover:scale-105 active:scale-95 transition-all"
            >
              Browse Mentors
            </button>
            <button className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-black hover:bg-slate-50 transition-colors">
              Become a Mentor
            </button>
          </div>
        </div>
        
        <div className="lg:w-1/2 relative">
          <div className="glass p-10 rounded-[3rem] shadow-2xl relative z-10 border border-white/50 backdrop-blur-3xl overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <BrainCircuit size={160} />
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-violet-100 text-violet-600 rounded-2xl flex items-center justify-center shadow-inner">
                <Sparkles size={24} />
              </div>
              <div>
                <h3 className="font-black text-slate-900 tracking-tight">AI Career Match</h3>
                <p className="text-[10px] font-bold text-violet-500 uppercase tracking-widest">Powered by Gemini 2.5</p>
              </div>
            </div>
            <p className="text-sm text-slate-500 mb-6 font-medium leading-relaxed">Describe your dream career. Our AI will analyze our verified mentor base to find your perfect synergy.</p>
            <div className="relative mb-6">
              <textarea
                className="w-full h-32 p-6 bg-slate-50 border border-slate-200 rounded-[2rem] outline-none focus:ring-4 focus:ring-violet-100 text-sm resize-none font-medium placeholder-slate-300 transition-all"
                placeholder="e.g. I want to build rockets at SpaceX or work on propulsion systems..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              {prompt && !aiLoading && (
                <button onClick={() => setPrompt('')} className="absolute top-4 right-4 p-1 text-slate-300 hover:text-red-500 transition-colors">
                  <X size={16} />
                </button>
              )}
            </div>
            <button 
              onClick={handleAIMatch}
              disabled={aiLoading || !prompt.trim()}
              className="w-full py-5 bg-slate-900 text-white rounded-[1.75rem] font-black text-sm hover:bg-violet-600 transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {aiLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Analyzing Database...
                </>
              ) : (
                <>
                  <Wand2 size={20} className="group-hover:rotate-12 transition-transform" />
                  Match Me with Mentors
                </>
              )}
            </button>
          </div>
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-violet-200/40 rounded-full blur-3xl -z-0 animate-pulse"></div>
          <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-blue-200/40 rounded-full blur-3xl -z-0"></div>
        </div>
      </div>

      {/* AI Results Section */}
      {aiMatches.length > 0 && (
        <div className="mb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-violet-600 text-white rounded-xl flex items-center justify-center">
                <BrainCircuit size={20} />
              </div>
              <h2 className="text-2xl font-black text-slate-900">Personalized Matches</h2>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {aiMatches.map((match) => (
                <div key={match.userId} className="bg-violet-50/50 p-8 rounded-[2.5rem] border-2 border-violet-100 flex flex-col hover:shadow-lg transition-all">
                  <div className="flex items-center gap-4 mb-6">
                    <img src={match.mentor.avatar} className="w-14 h-14 rounded-xl object-cover border-2 border-white shadow-sm" />
                    <div>
                      <h4 className="font-black text-slate-900">{match.mentor.name}</h4>
                      <p className="text-[10px] font-black text-violet-600 uppercase tracking-widest">{match.mentor.company}</p>
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl mb-6 flex-grow border border-violet-100/50">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <Sparkles size={12} className="text-violet-500" /> AI Insight
                    </p>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed italic">"{match.reason}"</p>
                  </div>
                  <button 
                    onClick={() => navigate(`/profile/${match.mentor.id}`)}
                    className="w-full py-4 bg-white text-violet-600 rounded-xl font-black text-xs hover:bg-violet-600 hover:text-white transition-all border border-violet-200"
                  >
                    View Profile
                  </button>
                </div>
              ))}
           </div>
        </div>
      )}

      {/* Main Directory */}
      <div className="scroll-mt-24" id="featured-mentors">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Mentor Directory</h2>
          <span className="text-slate-400 font-bold text-sm bg-slate-50 px-4 py-2 rounded-full border border-slate-100">{mentors.length} Verified Professionals</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mentors.map((mentor) => (
            <div 
              key={mentor.id} 
              onClick={() => navigate(`/profile/${mentor.id}`)}
              className="group bg-white p-8 rounded-[2.5rem] border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col shadow-sm"
            >
              <div className="flex items-center gap-5 mb-8">
                <div className="relative">
                  <img src={mentor.avatar} className="w-20 h-20 rounded-2xl object-cover shadow-md border-4 border-white group-hover:scale-105 transition-transform" />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-xl group-hover:text-violet-600 transition-colors">{mentor.name}</h4>
                  <p className="text-xs text-slate-500 font-bold mb-1">{mentor.position || 'Professional'}</p>
                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{mentor.company || 'RUET Alumni'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6 mb-6 pb-6 border-b border-slate-50">
                <div className="flex items-center gap-1.5 text-amber-500">
                  <Star size={16} fill="currentColor" />
                  <span className="text-sm font-black">5.0</span>
                </div>
                <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Verified Expert</div>
              </div>

              <div className="flex flex-wrap gap-2 mb-8 flex-grow">
                {(mentor.skills || ['Engineering', 'Strategy']).slice(0, 3).map(skill => (
                  <span key={skill} className="px-3 py-1.5 bg-violet-50 text-violet-600 text-[10px] font-black rounded-xl uppercase tracking-widest">
                    {skill}
                  </span>
                ))}
              </div>

              <button 
                onClick={(e) => handleBookSession(e, mentor)}
                disabled={loadingId === mentor.id}
                className={`w-full py-4 rounded-[1.25rem] font-black text-sm transition-all flex items-center justify-center gap-2 active:scale-95 ${
                  loadingId === mentor.id 
                    ? 'bg-slate-50 text-slate-400' 
                    : 'bg-slate-900 text-white hover:bg-violet-600 shadow-lg shadow-slate-100'
                }`}
              >
                {loadingId === mentor.id ? <Loader2 size={20} className="animate-spin" /> : <><MessageCircle size={18} /> Book a Session</>}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Mentorship;
