
import React from 'react';
import { Heart, Github, Linkedin, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="gradient-bg p-1.5 rounded-lg text-white">
              <span className="font-bold text-lg">R</span>
            </div>
            <span className="font-bold text-xl">RUETConnect</span>
          </div>
          <p className="text-slate-500 max-w-sm mb-6 leading-relaxed">
            The official professional network for Rajshahi University of Engineering & Technology. Empowering alumni, guiding students, and growing together.
          </p>
          <div className="flex gap-4">
            {[Linkedin, Twitter, Github].map((Icon, idx) => (
              <a key={idx} href="#" className="p-2 bg-gray-50 rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                <Icon size={20} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-bold text-slate-900 mb-6">Platform</h4>
          <ul className="space-y-4">
            {['Directory', 'Jobs Board', 'Mentorship', 'Events', 'Privacy Policy'].map((item) => (
              <li key={item}><a href="#" className="text-slate-500 hover:text-blue-600 transition-colors text-sm">{item}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-slate-900 mb-6">University</h4>
          <ul className="space-y-4">
            {['Official Website', 'Department News', 'Campus Life', 'Admissions', 'RUET Foundation'].map((item) => (
              <li key={item}><a href="#" className="text-slate-500 hover:text-blue-600 transition-colors text-sm">{item}</a></li>
            ))}
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
        <p>© 2024 RUETConnect. All rights reserved.</p>
        <p className="flex items-center gap-1.5">
          Made with <Heart size={14} className="text-red-400 fill-current" /> by RUET Community
        </p>
      </div>
    </footer>
  );
};

export default Footer;
