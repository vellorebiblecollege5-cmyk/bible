import React, { useState } from 'react';
import { useCollege } from '../context/CollegeContext';
import { EventItem } from '../types';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Share2
} from 'lucide-react';

export const EventsView: React.FC = () => {
  const { events } = useCollege();
  const [selectedEventForRsvp, setSelectedEventForRsvp] = useState<EventItem | null>(null);
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpEmail, setRsvpEmail] = useState('');
  const [rsvpPhone, setRsvpPhone] = useState('');
  const [rsvpSuccess, setRsvpSuccess] = useState(false);

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRsvpSuccess(true);
    setTimeout(() => {
      setRsvpSuccess(false);
      setSelectedEventForRsvp(null);
      setRsvpName('');
      setRsvpEmail('');
      setRsvpPhone('');
    }, 3000);
  };

  return (
    <div className="space-y-12 pb-16 font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white py-14 border-b border-amber-600/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
            Conferences, Seminars & Chapel
          </span>
          <h1 className="font-cinzel text-3xl sm:text-5xl font-extrabold tracking-tight">
            Events & Conventions
          </h1>
          <p className="font-serif italic text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            “Let us not give up meeting together, but encourage one another” — Hebrews 10:25
          </p>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map(ev => (
            <div
              key={ev.id}
              className="bg-white rounded-3xl border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group hover:border-amber-400"
            >
              <div>
                {/* Event Image */}
                <div className="h-52 w-full overflow-hidden relative">
                  <img
                    src={ev.image}
                    alt={ev.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-900/90 text-amber-300 border border-amber-500/30">
                    {ev.category}
                  </span>
                </div>

                {/* Event Details */}
                <div className="p-6 space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center text-xs font-bold text-amber-800">
                      <Calendar className="w-4 h-4 mr-1.5 flex-shrink-0" />
                      <span>{ev.date}</span>
                    </div>
                    <h3 className="font-cinzel text-lg font-bold text-slate-900 group-hover:text-blue-900 transition-colors leading-snug">
                      {ev.title}
                    </h3>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    {ev.description}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-stone-100 text-xs text-stone-600">
                    <div className="flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-2 text-stone-400 flex-shrink-0" />
                      <span>{ev.time}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-2 text-stone-400 flex-shrink-0" />
                      <span>{ev.location}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="w-3.5 h-3.5 mr-2 text-stone-400 flex-shrink-0" />
                      <span className="truncate">{ev.speaker}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] text-emerald-700 font-semibold flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Open to Public & Pastors
                </span>
                <button
                  onClick={() => setSelectedEventForRsvp(ev)}
                  className="px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-amber-300 font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  Register / RSVP
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RSVP Modal */}
      {selectedEventForRsvp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-stone-200">
            <div className="bg-slate-950 text-white p-6 flex items-center justify-between border-b border-amber-600/30">
              <div>
                <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
                  Event Registration
                </span>
                <h3 className="font-cinzel text-lg font-bold text-white mt-1 line-clamp-1">
                  {selectedEventForRsvp.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEventForRsvp(null)}
                className="text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {rsvpSuccess ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-2xl font-bold">
                  ✓
                </div>
                <h4 className="font-cinzel text-lg font-bold text-slate-900">
                  Registration Confirmed!
                </h4>
                <p className="text-xs text-stone-600">
                  We look forward to welcoming you at Image of Christ Bible College, Vellore. A confirmation has been sent to your email.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={rsvpName}
                    onChange={e => setRsvpName(e.target.value)}
                    placeholder="Pastor / Brother / Sister"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={rsvpEmail}
                    onChange={e => setRsvpEmail(e.target.value)}
                    placeholder="delegate@gmail.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={rsvpPhone}
                    onChange={e => setRsvpPhone(e.target.value)}
                    placeholder="+91 94440 00000"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setSelectedEventForRsvp(null)}
                    className="text-xs font-semibold text-stone-500 hover:text-stone-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
                  >
                    Confirm Attendance
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
