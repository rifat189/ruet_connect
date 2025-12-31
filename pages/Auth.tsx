
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../App';
import { UserRole } from '../types';
import { Network, ArrowRight, Mail, Lock, User, Eye, EyeOff, ShieldCheck } from 'lucide-react';

const Auth: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register } = useAuth();
  
  const queryParams = new URLSearchParams(location.search);
  const initialMode = queryParams.get('mode') === 'signup' ? false : true;

  const [isLogin, setIsLogin] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('Student');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const mode = queryParams.get('mode');
    if (mode === 'signup') setIsLogin(false);
    if (mode === 'login') setIsLogin(true);
  }, [location.search]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      if (isLogin) {
        if (login(email, password)) {
          navigate('/');
        } else {
          setError('Invalid email or password. Hint: Try admin@ruet.ac.bd / password123');
        }
      } else {
        register({
          name,
          role,
          email,
          password, // Store password on registration
          department: 'General',
          batch: '2024',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
          bio: `Hi, I am ${name}, a proud RUETian!`,
          skills: [],
          accomplishments: [],
          experience: [],
          projects: []
        });
        navigate('/');
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden bg-slate-50">
      {/* Dynamic Background */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[120px] -z-10 translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-100/40 rounded-full blur-[100px] -z-10 -translate-x-1/3 translate-y-1/3"></div>

      <div className="w-full max-w-[1000px] glass rounded-[3rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-white/40">
        
        {/* Visual Brand Panel */}
        <div className="lg:w-[45%] bg-slate-900 p-10 md:p-16 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-600/30 via-transparent to-indigo-900/40 pointer-events-none"></div>
          
          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-3 mb-16 group">
              <div className="gradient-bg p-2.5 rounded-2xl text-white shadow-xl group-hover:scale-110 transition-transform">
                <Network size={28} />
              </div>
              <span className="font-black text-2xl tracking-tighter">RUET<span className="text-blue-400">Connect</span></span>
            </Link>
            
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-extrabold leading-[1.15] tracking-tight">
                {isLogin ? "Welcome back to the family." : "Join our world-class community."}
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
                Empowering RUETians through collaboration, mentorship, and career excellence.
              </p>
            </div>
          </div>

          <div className="relative z-10 pt-10">
             <div className="flex -space-x-3 mb-6">
                {[1,2,3,4,5].map(i => (
                  <img key={i} src={`https://i.pravatar.cc/150?u=ruet${i}`} className="w-12 h-12 rounded-2xl border-2 border-slate-900 shadow-xl object-cover" />
                ))}
                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-xs font-bold shadow-xl border-2 border-slate-900">+20k</div>
             </div>
             <p className="text-sm text-slate-500 font-semibold flex items-center gap-2">
               <ShieldCheck size={16} className="text-blue-400" />
               Trusted by engineers worldwide.
             </p>
          </div>
        </div>

        {/* Action Panel */}
        <div className="lg:w-[55%] p-10 md:p-16 bg-white/40 backdrop-blur-md">
          <div className="mb-10">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
              {isLogin ? "Sign In" : "Create Account"}
            </h1>
            <p className="text-slate-500 font-medium">
              {isLogin ? "New here?" : "Already a member?"}{" "}
              <button 
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                className="text-blue-600 font-bold hover:text-blue-700 transition-colors"
              >
                {isLogin ? "Join the network" : "Log in to your account"}
              </button>
            </p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50/80 border border-red-100 rounded-2xl text-red-600 text-sm font-semibold flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2.5 ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      required
                      type="text" 
                      className="w-full pl-14 pr-6 py-4.5 bg-white border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-sm placeholder-slate-300"
                      placeholder="e.g. S.M. Abdullah"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2.5 ml-1">Select Role</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Student', 'Alumni', 'Mentor', 'Company'].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r as any)}
                        className={`py-3.5 rounded-2xl text-sm font-bold border-2 transition-all ${
                          role === r 
                            ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-200' 
                            : 'bg-white border-slate-50 text-slate-500 hover:border-slate-200'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2.5 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  required
                  type="email" 
                  className="w-full pl-14 pr-6 py-4.5 bg-white border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-sm placeholder-slate-300"
                  placeholder="name@ruet.ac.bd"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2.5 ml-1">Security Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  required
                  type={showPassword ? "text" : "password"} 
                  className="w-full pl-14 pr-14 py-4.5 bg-white border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-sm placeholder-slate-300"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <button type="button" className="text-sm text-blue-600 font-bold hover:underline transition-all">Forgot password?</button>
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-blue-200 hover:bg-blue-700 hover:scale-[1.01] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 mt-6"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  {isLogin ? "Sign In" : "Create My Profile"}
                  <ArrowRight size={22} />
                </>
              )}
            </button>
          </form>
          
          <p className="mt-10 text-center text-slate-400 text-xs font-medium">
            By continuing, you agree to the RUETConnect <span className="underline">Terms of Service</span> and <span className="underline">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
