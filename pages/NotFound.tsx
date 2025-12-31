
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Ghost } from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-blue-100 rounded-full blur-3xl opacity-50 animate-pulse"></div>
        <div className="relative w-32 h-32 bg-white rounded-3xl border border-gray-100 shadow-xl flex items-center justify-center text-blue-600">
          <Ghost size={64} strokeWidth={1.5} />
        </div>
      </div>
      
      <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
        Lost in the <span className="text-blue-600">Network?</span>
      </h1>
      <p className="text-slate-500 text-lg max-w-md mb-10 leading-relaxed">
        The page you are looking for doesn't exist or has been moved to a different coordinate.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          onClick={() => navigate('/')}
          className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Home size={20} />
          Back to Home
        </button>
        <button 
          onClick={() => navigate(-1)}
          className="px-8 py-4 bg-white text-slate-600 border border-gray-200 rounded-2xl font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft size={20} />
          Go Back
        </button>
      </div>
      
      <p className="mt-16 text-xs font-bold text-slate-300 uppercase tracking-widest">Error Code: 404</p>
    </div>
  );
};

export default NotFound;
