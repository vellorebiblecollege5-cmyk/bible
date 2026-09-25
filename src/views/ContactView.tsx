import React, { useState } from 'react';
import { useCollege } from '../context/CollegeContext';
import { COLLEGE_INFO } from '../data/collegeData';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Heart,
  CheckCircle2,
  Train,
  Car,
  Navigation
} from 'lucide-react';

export const ContactView: React.FC = () => {
  const { submitContactMessage } = useCollege();
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [isPrayerRequest, setIsPrayerRequest] = useState(false);
  const [message, setMessage] = useState('');
  const [successNotice, setSuccessNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitContactMessage({
      name,
      email,
      phone,
      subject: subject || (isPrayerRequest ? 'Chapel Prayer Request' : 'General Inquiry'),
      isPrayerRequest,
      message
    });

    setSuccessNotice(true);
    setName('');
    setEmail('');
    setPhone('');
    setSubject('');
    setIsPrayerRequest(false);
    setMessage('');

    setTimeout(() => {
      setSuccessNotice(false);
    }, 6000);
  };

  return (
    <div className="space-y-12 pb-16 font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white py-14 border-b border-amber-600/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
            Get in Touch • Vellore Campus
          </span>
          <h1 className="font-cinzel text-3xl sm:text-5xl font-extrabold tracking-tight">
            Contact & Prayer Support
          </h1>
          <p className="font-serif italic text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            “The prayer of a righteous person is powerful and effective.” — James 5:16
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Campus Information */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-amber-800 font-bold">
                  Campus Headquarters
                </span>
                <h3 className="font-cinzel text-xl font-bold text-slate-900 mt-1">
                  Image of Christ Bible College
                </h3>
                <p className="text-xs text-stone-500">
                  Calvary Hill Campus • Vellore, Tamil Nadu
                </p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-stone-700">
                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Address</span>
                    <p className="text-stone-600 text-xs leading-relaxed mt-0.5">
                      {COLLEGE_INFO.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Phone & WhatsApp</span>
                    <a
                      href="tel:+919500423126"
                      className="text-amber-800 font-bold hover:underline text-xs block mt-0.5"
                    >
                      +91 95004 23126 (ph. 95004 23126)
                    </a>
                    <a
                      href="https://wa.me/919500423126"
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-700 font-semibold hover:underline text-[11px] block mt-0.5"
                    >
                      Click to Chat on WhatsApp
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Official Email</span>
                    <a
                      href={`mailto:${COLLEGE_INFO.email}`}
                      className="text-amber-800 font-semibold hover:underline text-xs"
                    >
                      {COLLEGE_INFO.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Office Visiting Hours</span>
                    <p className="text-stone-600 text-xs mt-0.5">
                      {COLLEGE_INFO.visitingHours}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Travel Directions Guide */}
            <div className="bg-stone-50 p-6 rounded-3xl border border-stone-200 space-y-4">
              <h4 className="font-cinzel text-base font-bold text-slate-900 flex items-center">
                <Navigation className="w-4 h-4 mr-2 text-blue-900" />
                <span>How to Reach Vellore Campus</span>
              </h4>
              <div className="space-y-3 text-xs text-stone-600">
                <div className="flex items-start space-x-2.5">
                  <Train className="w-4 h-4 text-blue-900 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">By Train:</strong> Alight at <strong>Katpadi Junction (KPD)</strong>. The college is located just 2.5 km from the railway station (10 minutes by auto-rickshaw or town bus).
                  </div>
                </div>
                <div className="flex items-start space-x-2.5">
                  <Car className="w-4 h-4 text-amber-800 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">By Bus:</strong> Frequent express buses arrive at Vellore New Bus Stand from Chennai (135 km) and Bengaluru (210 km). Take a local Katpadi route to Calvary Hill junction.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Contact & Prayer Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-10 rounded-3xl border border-stone-200 shadow-xl space-y-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-amber-800 font-bold">
                  Send a Message or Prayer Request
                </span>
                <h3 className="font-cinzel text-2xl font-bold text-slate-900 mt-1">
                  Connect with Our Administrative & Pastoral Team
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Have a question regarding admissions, sponsorships, or need our faculty chapel intercession band to pray for your family or ministry? Send us a note below.
                </p>
              </div>

              {successNotice && (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center space-x-3 text-emerald-800 text-xs sm:text-sm animate-in fade-in duration-200">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
                  <div>
                    <strong>Thank you in Christ!</strong> Your message has been safely received. Our college office and chapel intercessory team will attend to it promptly.
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Prayer Request Toggle */}
                <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Heart className="w-5 h-5 text-amber-700" />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        Is this a Prayer Request?
                      </span>
                      <span className="text-[11px] text-stone-600">
                        Check this so our chapel morning prayer band will uphold your request by name.
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isPrayerRequest}
                    onChange={e => setIsPrayerRequest(e.target.checked)}
                    className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Bro. David / Pastor Paul"
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
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="your.email@gmail.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Mobile / Phone
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+91 94440 00000"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                      placeholder={isPrayerRequest ? 'Prayer for family / health' : 'Inquiry about B.Th admissions'}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Your Message / Prayer Request *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Write your message or prayer petition clearly..."
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-amber-300 font-bold text-xs uppercase tracking-wider shadow-md transition-colors flex items-center justify-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message to College Administration</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
