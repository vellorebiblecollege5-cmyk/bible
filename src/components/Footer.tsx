import React, { useState } from 'react';
import { useCollege, ActivePage } from '../context/CollegeContext';
import { COLLEGE_INFO } from '../data/collegeData';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Heart,
  Shield,
  ArrowRight,
  CheckCircle2,
  Download,
  BookOpen
} from 'lucide-react';

import officialLogo from '../assets/images/icbc_vellore_official_logo_1790438854633.jpg';

export const Footer: React.FC = () => {
  const { setActivePage, collegeLogo } = useCollege();
  const [subscribedEmail, setSubscribedEmail] = useState('');
  const [subscribedSuccess, setSubscribedSuccess] = useState(false);

  const navigateTo = (page: ActivePage) => {
    setActivePage(page);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (subscribedEmail) {
      setSubscribedSuccess(true);
      setSubscribedEmail('');
      setTimeout(() => setSubscribedSuccess(false), 5000);
    }
  };

  return (
    <footer className="bg-[#0a1426] text-slate-300 font-sans border-t-4 border-amber-600">
      {/* Upper Footer: Scripture Quote Banner */}
      <div className="bg-[#0f2444] py-8 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1">
            <span className="text-amber-400 font-cinzel text-xs uppercase tracking-widest font-semibold flex items-center justify-center md:justify-start gap-2">
              <span>✦</span> Biblical Mandate • John 17:18 <span>✦</span>
            </span>
            <p className="text-base sm:text-lg text-slate-100 font-serif italic max-w-3xl">
              {COLLEGE_INFO.scriptureVerse}
            </p>
          </div>
          <button
            onClick={() => navigateTo('admissions-application')}
            className="flex-shrink-0 px-6 py-3 rounded-full bg-[#d97706] hover:bg-[#b45309] text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center cursor-pointer"
          >
            <span>Apply for Admissions</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Brand & About */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-amber-400/80 bg-white flex-shrink-0 shadow">
                <img
                  src={collegeLogo || officialLogo}
                  alt="Image of Christ Bible College Vellore Official Seal"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = officialLogo;
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-cinzel text-lg font-bold text-white tracking-wide">
                  IMAGE OF CHRIST
                </h4>
                <p className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
                  Bible College • Vellore • Since 2020
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              Established in January 2020 in Vellore, Tamil Nadu. Founded on the mission of John 17:18 — to reach people with the Word of God and equip them for His purpose, shaping lives for nationwide spiritual revival.
            </p>

            <div className="pt-2 text-xs text-slate-400 space-y-2">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <span>{COLLEGE_INFO.address}</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <a href={`tel:${COLLEGE_INFO.phonePrimary}`} className="text-amber-300 hover:underline font-semibold">
                  ph. {COLLEGE_INFO.phoneDisplay} ({COLLEGE_INFO.phonePrimary})
                </a>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <a href={`mailto:${COLLEGE_INFO.email}`} className="text-amber-300 hover:underline">
                  {COLLEGE_INFO.email}
                </a>
              </div>
              <div className="flex items-center space-x-2.5">
                <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>{COLLEGE_INFO.visitingHours}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Academic Programs */}
          <div className="space-y-3">
            <h5 className="font-cinzel text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              Academic Courses
            </h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => navigateTo('courses-bth')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center"
                >
                  <ArrowRight className="w-3 h-3 mr-1.5 text-amber-500/70" />
                  Bachelor of Theology (B.Th)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('courses-mdiv')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center"
                >
                  <ArrowRight className="w-3 h-3 mr-1.5 text-amber-500/70" />
                  Master of Divinity (M.Div)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('courses-cert')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center"
                >
                  <ArrowRight className="w-3 h-3 mr-1.5 text-amber-500/70" />
                  Certificate in Biblical Studies
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('courses-short')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center"
                >
                  <ArrowRight className="w-3 h-3 mr-1.5 text-amber-500/70" />
                  Expository Preaching Clinic
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('courses-short')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center"
                >
                  <ArrowRight className="w-3 h-3 mr-1.5 text-amber-500/70" />
                  Biblical Greek & Hebrew
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('courses-short')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center"
                >
                  <ArrowRight className="w-3 h-3 mr-1.5 text-amber-500/70" />
                  Pastoral Care & Counseling
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Admissions & Student Life */}
          <div className="space-y-3">
            <h5 className="font-cinzel text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              Admissions & Students
            </h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => navigateTo('admissions-application')}
                  className="hover:text-amber-400 transition-colors text-left text-amber-300 font-semibold flex items-center"
                >
                  <ArrowRight className="w-3 h-3 mr-1.5 text-amber-400" />
                  Online Application Form
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('admissions-eligibility')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center"
                >
                  <ArrowRight className="w-3 h-3 mr-1.5 text-amber-500/70" />
                  Eligibility & Qualifications
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('admissions-fees')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center"
                >
                  <ArrowRight className="w-3 h-3 mr-1.5 text-amber-500/70" />
                  Fee Structure & Financial Aid
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('students-login')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center"
                >
                  <ArrowRight className="w-3 h-3 mr-1.5 text-amber-500/70" />
                  Student Portal & Grades
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('students-materials')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center"
                >
                  <ArrowRight className="w-3 h-3 mr-1.5 text-amber-500/70" />
                  Lecture Notes & E-Library
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('students-notices')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center"
                >
                  <ArrowRight className="w-3 h-3 mr-1.5 text-amber-500/70" />
                  Academic Notices & Exams
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Prayer Fellowship & Prospectus */}
          <div className="space-y-4">
            <h5 className="font-cinzel text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              Prayer & Bulletin
            </h5>
            <p className="text-xs text-slate-400">
              Receive our monthly prayer circular, theological articles, and campus mission reports.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                required
                value={subscribedEmail}
                onChange={e => setSubscribedEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="w-full py-2 px-3 rounded-lg bg-blue-900 hover:bg-blue-800 text-amber-400 font-bold text-xs uppercase tracking-wider transition-colors border border-amber-500/30"
              >
                Join Prayer Circle
              </button>
              {subscribedSuccess && (
                <p className="text-[11px] text-emerald-400 flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  Thank you! You are now subscribed to ICBC Prayer Fellowship.
                </p>
              )}
            </form>

            <div className="pt-2">
              <button
                onClick={() => navigateTo('downloads')}
                className="w-full py-2.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-medium border border-slate-700 flex items-center justify-center space-x-2 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-amber-500" />
                <span>Download Prospectus 2026</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 text-xs text-slate-400">
          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-3">
            <div>
              © {new Date().getFullYear()} Image of Christ Bible College (ICBC), Vellore, Tamil Nadu. All rights reserved.
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button onClick={() => navigateTo('about')} className="text-amber-400 hover:underline cursor-pointer">
                Statement of Faith
              </button>
              <span>|</span>
              <button onClick={() => navigateTo('contact')} className="hover:text-amber-400 cursor-pointer">
                Contact Office
              </button>
              <span>|</span>
              <button onClick={() => navigateTo('downloads')} className="hover:text-amber-400 cursor-pointer">
                Forms & Syllabi
              </button>
              <span>|</span>
              <button onClick={() => navigateTo('login-user')} className="text-slate-300 hover:text-amber-400 cursor-pointer">
                User Login
              </button>
              <span>|</span>
              <button onClick={() => navigateTo('login-admin')} className="text-slate-300 hover:text-amber-400 cursor-pointer">
                Admin Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
