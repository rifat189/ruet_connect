
import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { useAuth } from '../App';
import { Event } from '../types';
import { Calendar, MapPin, Clock, ArrowRight, Plus, X, Info, CheckCircle, Users, Share2, Loader2, Search } from 'lucide-react';

const Events: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [interestedIds, setInterestedIds] = useState<Set<string>>(new Set());
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<string | null>(null);

  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    type: 'Meetup' as Event['type'],
    location: '',
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=600',
    description: '',
    organizer: user?.name || 'RUET Community'
  });

  useEffect(() => {
    setEvents(db.getEvents());
  }, []);

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    db.addEvent({
      ...newEvent,
      organizer: user?.name || 'RUET Community',
      interestedCount: 0
    });
    setEvents(db.getEvents());
    setShowModal(false);
    setNewEvent({ title: '', date: '', time: '', type: 'Meetup', location: '', image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=600', description: '', organizer: user?.name || 'RUET Community' });
  };

  const handleInterested = (e: React.MouseEvent, eventId: string) => {
    e.stopPropagation();
    if (interestedIds.has(eventId)) return;

    setLoadingId(eventId);
    // Simulate registration
    setTimeout(() => {
      setInterestedIds(prev => new Set(prev).add(eventId));
      setLoadingId(null);
      triggerToast('You are now registered for this event!');
    }, 1200);
  };

  const triggerToast = (message: string) => {
    setShowToast(message);
    setTimeout(() => setShowToast(null), 3000);
  };

  const canCreateEvent = user && ['Admin', 'Faculty'].includes(user.role);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-24 right-8 z-[110] animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <CheckCircle size={16} />
            </div>
            <p className="font-medium text-sm">{showToast}</p>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6 bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
        <div className="text-center md:text-left flex-grow">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Community Events</h1>
          <div className="relative max-w-xl mb-4 md:mb-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Filter events by title, location, or type..."
              className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 transition-all font-medium text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        {canCreateEvent ? (
          <button 
            onClick={() => setShowModal(true)}
            className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 flex-shrink-0"
          >
            <Plus size={20} />
            Post New Event
          </button>
        ) : (
          <div className="flex items-center gap-2 px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-slate-400 text-sm font-semibold italic flex-shrink-0">
            <Info size={18} />
            Postings managed by Admins
          </div>
        )}
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-slate-200">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
            <Calendar size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No matching events</h3>
          <p className="text-slate-500">Try adjusting your filters or search keywords.</p>
          <button onClick={() => setSearchTerm('')} className="mt-4 text-blue-600 font-bold hover:underline">Clear all filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {filteredEvents.map((event) => (
            <div 
              key={event.id} 
              onClick={() => setSelectedEvent(event)}
              className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 flex flex-col md:flex-row shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 cursor-pointer"
            >
              <div className="md:w-2/5 relative overflow-hidden h-64 md:h-auto">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 left-4">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold shadow-lg uppercase tracking-wider ${
                    event.type === 'Reunion' ? 'bg-orange-500 text-white' : 
                    event.type === 'Webinar' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
                  }`}>
                    {event.type}
                  </span>
                </div>
              </div>
              <div className="md:w-3/5 p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">{event.title}</h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-slate-500">
                      <Calendar size={16} className="text-blue-500" />
                      <span className="text-xs font-bold">{event.date}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500">
                      <Clock size={16} className="text-blue-500" />
                      <span className="text-xs font-bold">{event.time}</span>
                    </div>
                    <div className="flex items-start gap-3 text-slate-500">
                      <MapPin size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
                      <span className="text-xs font-bold line-clamp-1">{event.location}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-50 pt-6">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => (
                        <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Attendee${event.id}${i}`} className="w-7 h-7 rounded-full border-2 border-white bg-slate-100" />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      +{event.interestedCount || 0} Interested
                    </span>
                  </div>
                  <div className="flex gap-2">
                     <button 
                      onClick={(e) => handleInterested(e, event.id)}
                      disabled={loadingId === event.id || interestedIds.has(event.id)}
                      className={`p-2.5 rounded-xl transition-all active:scale-90 ${
                        interestedIds.has(event.id) 
                        ? 'bg-emerald-50 text-emerald-600' 
                        : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white'
                      }`}
                     >
                      {loadingId === event.id ? <Loader2 size={20} className="animate-spin" /> : 
                       interestedIds.has(event.id) ? <CheckCircle size={20} /> : <ArrowRight size={20} />}
                     </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal logic remains identical... */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedEvent(null)}></div>
          <div className="relative bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="relative h-64 sm:h-80 overflow-hidden">
              <img src={selectedEvent.image} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
              <button 
                onClick={() => setSelectedEvent(null)}
                className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-sm transition-colors"
              >
                <X size={24} />
              </button>
              <div className="absolute bottom-8 left-10 right-10">
                <span className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 inline-block">
                  {selectedEvent.type}
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">{selectedEvent.title}</h2>
              </div>
            </div>
            
            <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="md:col-span-2 space-y-8">
                <section>
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">About Event</h4>
                  <p className="text-slate-600 leading-relaxed text-lg">
                    {selectedEvent.description || "Join us for this exciting event hosted by our community. We'll be discussing the latest trends, networking with fellow RUETians, and building stronger professional bonds."}
                  </p>
                </section>

                <div className="flex items-center gap-4 bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-gray-100">
                    <Users size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Organized By</p>
                    <p className="font-extrabold text-slate-800">{selectedEvent.organizer || "RUET Community"}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <Calendar size={12} className="text-blue-400" /> Date
                    </p>
                    <p className="font-bold">{selectedEvent.date}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <Clock size={12} className="text-blue-400" /> Time
                    </p>
                    <p className="font-bold">{selectedEvent.time}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <MapPin size={12} className="text-blue-400" /> Location
                    </p>
                    <p className="font-bold text-sm leading-snug">{selectedEvent.location}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-gray-100 bg-white flex flex-col sm:flex-row gap-4">
              <button 
                onClick={(e) => handleInterested(e, selectedEvent.id)}
                disabled={loadingId === selectedEvent.id || interestedIds.has(selectedEvent.id)}
                className={`flex-grow py-5 rounded-[1.5rem] font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                  interestedIds.has(selectedEvent.id)
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-100'
                }`}
              >
                {loadingId === selectedEvent.id ? <Loader2 size={24} className="animate-spin" /> : 
                 interestedIds.has(selectedEvent.id) ? (
                   <><CheckCircle size={24} /> Registered</>
                 ) : (
                   'Count Me In!'
                 )}
              </button>
              <button 
                onClick={() => setSelectedEvent(null)}
                className="p-5 bg-gray-50 text-slate-400 rounded-[1.5rem] hover:bg-gray-100 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
