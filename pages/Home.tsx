
import React from 'react';
import { ArrowRight, Users, Briefcase, GraduationCap, Calendar, Sparkles, TrendingUp, Globe } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

const FeatureCard: React.FC<{ icon: any, title: string, desc: string, color: string }> = ({ icon: Icon, title, desc, color }) => (
  <div className="p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
    <div className={`w-16 h-16 rounded-[1.5rem] ${color} flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform duration-500`}>
      <Icon size={32} />
    </div>
    <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{title}</h3>
    <p className="text-slate-500 leading-relaxed text-sm font-medium">{desc}</p>
  </div>
);

const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCTAAction = () => {
    if (user) {
      navigate(`/profile/${user.id}`);
    } else {
      navigate('/auth?mode=signup');
    }
  };

  return (
    <div className="space-y-32 pb-32">
      {/* Hero Section */}
      <section className="relative px-4 pt-20 md:pt-32 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Dynamic Background Element */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-blue-100/40 rounded-full blur-[120px] -z-10 opacity-70"></div>

        <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-blue-50/80 text-blue-700 rounded-full text-xs font-black uppercase tracking-widest mb-10 border border-blue-100/50 backdrop-blur-sm shadow-sm animate-in fade-in slide-in-from-top-4 duration-700">
          <Sparkles size={14} />
          <span>The Official RUET Alumni Network</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-10 leading-[1] tracking-tighter">
          Connect. Guide. <br />
          <span className="gradient-text">Grow Together.</span>
        </h1>

        <p className="text-xl md:text-2xl text-slate-500 max-w-2xl mb-14 leading-relaxed font-medium">
          The central hub for RUETians to bridge the gap between academic brilliance and professional mastery.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 mb-24">
          <button 
            onClick={() => navigate('/network')}
            className="px-10 py-5 gradient-bg text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-blue-200 flex items-center gap-3 hover:scale-105 active:scale-95 transition-all"
          >
            Explore Directory <ArrowRight size={22} />
          </button>
          <Link to="/jobs" className="px-10 py-5 bg-white text-slate-900 border-2 border-slate-100 rounded-[2rem] font-black text-lg hover:bg-slate-50 transition-all flex items-center justify-center shadow-sm">
            Find Opportunities
          </Link>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 w-full max-w-5xl py-16 px-8 bg-white/50 backdrop-blur-xl rounded-[3rem] border border-white/40 shadow-xl">
          {[
            { label: 'Global Alumni', value: '25k+', icon: Globe },
            { label: 'Fortune 500 Engineers', value: '1.5k+', icon: Briefcase },
            { label: 'Career Mentors', value: '400+', icon: GraduationCap },
            { label: 'Growth Rating', value: '98%', icon: TrendingUp },
          ].map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="text-slate-400 mb-2">
                <stat.icon size={20} />
              </div>
              <div className="text-4xl font-black text-slate-900 mb-1 tracking-tight">{stat.value}</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Ecosystem for Excellence</h2>
          <p className="text-slate-500 text-lg font-medium max-w-xl mx-auto">Tailored professional modules designed exclusively for our RUET community.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={Users}
            title="Professional Directory"
            desc="Locate batchmates and seniors across every continent with our verified global identity system."
            color="bg-blue-600"
          />
          <FeatureCard
            icon={Briefcase}
            title="Jobs & Internships"
            desc="Access high-tier roles shared internally by alumni at Google, Meta, and leading tech giants."
            color="bg-emerald-600"
          />
          <FeatureCard
            icon={GraduationCap}
            title="Expert Mentorship"
            desc="One-on-one strategic career guidance from established industry leaders who graduated from your lab."
            color="bg-violet-600"
          />
          <FeatureCard
            icon={Calendar}
            title="Exclusive Events"
            desc="From local reunions to international tech webinars, stay sync with everything RUET."
            color="bg-orange-600"
          />
        </div>
      </section>

      {/* High-Impact CTA */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="bg-slate-900 rounded-[4rem] p-16 md:p-24 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[80px]"></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">Ready to Reconnect?</h2>
            <p className="text-slate-400 text-xl mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
              The RUET legacy is built by those who look back and lift others. Join your batch today.
            </p>
            <div className="flex justify-center">
              <button 
                onClick={handleCTAAction}
                className="px-12 py-5 bg-white text-slate-900 rounded-[2rem] font-black text-xl hover:bg-slate-100 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-black/40"
              >
                {user ? 'View Dashboard' : 'Create Your Profile'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
