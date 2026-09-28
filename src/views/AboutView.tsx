import React, { useState, useEffect } from 'react';
import { useCollege, ActivePage } from '../context/CollegeContext';
import { COLLEGE_INFO, COLLEGE_JOURNEY, DOCTRINAL_ARTICLES, INITIAL_FACULTY } from '../data/collegeData';
import {
  Compass,
  History,
  Shield,
  Users,
  Award,
  BookOpen,
  CheckCircle2,
  MapPin,
  ChevronRight,
  Phone,
  Mail,
  GraduationCap
} from 'lucide-react';

import officialLogo from '../assets/images/icbc_vellore_official_logo_1790438854633.jpg';
import graduationPhoto from '../assets/images/icbc_graduation_1790324006996.jpg';
import classroomPhoto from '../assets/images/icbc_classroom_1790324037922.jpg';

export const AboutView: React.FC = () => {
  const { activePage, setActivePage, faculty, collegeLogo } = useCollege();
  const principal = faculty.find(f => f.id === 'fac-1') || faculty[0] || INITIAL_FACULTY[0];
  
  // Determine sub-tab from context or default
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'vision' | 'leadership' | 'faith'>('overview');

  useEffect(() => {
    if (activePage === 'about-history') setActiveTab('history');
    else if (activePage === 'about-vision') setActiveTab('vision');
    else if (activePage === 'about-leadership') setActiveTab('leadership');
    else setActiveTab('overview');
  }, [activePage]);

  return (
    <div className="space-y-12 pb-16 font-sans">
      {/* Header Banner */}
      <div className="bg-[#0a1426] text-white py-14 border-b border-amber-600/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
            About Our Institution • Since 2020
          </span>
          <h1 className="font-cinzel text-3xl sm:text-5xl font-extrabold tracking-tight">
            Image of Christ Bible College
          </h1>
          <p className="font-serif italic text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            “Equipping Lives Through the Word of God” • Vellore, Tamil Nadu
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-2 border-b border-stone-200 pb-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all flex items-center cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#0f2444] text-amber-300 shadow-md'
                : 'text-stone-600 hover:text-slate-900 hover:bg-stone-100'
            }`}
          >
            <Compass className="w-4 h-4 mr-1.5" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all flex items-center cursor-pointer ${
              activeTab === 'history'
                ? 'bg-[#0f2444] text-amber-300 shadow-md'
                : 'text-stone-600 hover:text-slate-900 hover:bg-stone-100'
            }`}
          >
            <History className="w-4 h-4 mr-1.5" />
            <span>Our Journey</span>
          </button>

          <button
            onClick={() => setActiveTab('vision')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all flex items-center cursor-pointer ${
              activeTab === 'vision'
                ? 'bg-[#0f2444] text-amber-300 shadow-md'
                : 'text-stone-600 hover:text-slate-900 hover:bg-stone-100'
            }`}
          >
            <Shield className="w-4 h-4 mr-1.5" />
            <span>Vision & Mission</span>
          </button>

          <button
            onClick={() => setActiveTab('leadership')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all flex items-center cursor-pointer ${
              activeTab === 'leadership'
                ? 'bg-[#0f2444] text-amber-300 shadow-md'
                : 'text-stone-600 hover:text-slate-900 hover:bg-stone-100'
            }`}
          >
            <Users className="w-4 h-4 mr-1.5" />
            <span>Leadership</span>
          </button>

          <button
            onClick={() => setActiveTab('faith')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all flex items-center cursor-pointer ${
              activeTab === 'faith'
                ? 'bg-[#0f2444] text-amber-300 shadow-md'
                : 'text-stone-600 hover:text-slate-900 hover:bg-stone-100'
            }`}
          >
            <BookOpen className="w-4 h-4 mr-1.5" />
            <span>Statement of Faith</span>
          </button>
        </div>
      </div>

      {/* Main Content Area based on Tab */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-12 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <span className="text-xs uppercase tracking-widest text-amber-800 font-bold">
                  Who We Are
                </span>
                <h2 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-[#0f2444] leading-tight">
                  Image of Christ Bible College • Vellore
                </h2>
                <div className="space-y-3 text-sm text-stone-700 leading-relaxed font-sans">
                  <p className="font-serif italic text-base text-slate-800 border-l-3 border-amber-600 pl-4 py-1">
                    “Image of Christ Bible College is committed to providing accessible and transformative biblical education. We aim to raise strong believers who are rooted in God’s Word and prepared to serve effectively in ministry and society.”
                  </p>
                  <p>
                    Established in January 2020, Image of Christ Bible College is founded on the divine mission of <strong>John 17:18</strong>: <em>“Just as You sent Me into the world, I also have sent them into the world.”</em>
                  </p>
                  <p>
                    Our core vision is to teach and disciple individuals, especially in rural communities, through the Scriptures, shaping their lives so they may become instruments of spiritual revival in the nation.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="p-4 rounded-xl bg-stone-100 border border-stone-200">
                    <div className="font-cinzel text-xl font-bold text-[#0f2444]">2020</div>
                    <div className="text-xs text-stone-600">Established in January</div>
                  </div>
                  <div className="p-4 rounded-xl bg-stone-100 border border-stone-200">
                    <div className="font-cinzel text-xl font-bold text-amber-800">John 17:18</div>
                    <div className="text-xs text-stone-600">Foundational Mandate</div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 flex justify-center">
                <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-amber-500/40 max-w-sm">
                  <img
                    src={collegeLogo || officialLogo}
                    alt="Image of Christ Bible College Official Crest Seal"
                    referrerPolicy="no-referrer"
                    onError={e => {
                      (e.currentTarget as HTMLImageElement).src = officialLogo;
                    }}
                    className="w-full h-auto object-contain bg-white"
                  />
                  <div className="bg-[#0f2444] text-white p-3 text-center">
                    <p className="text-xs text-amber-300 font-cinzel font-semibold">
                      Official Seal of Image of Christ Bible College Vellore
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links to sub-aspects */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div
                onClick={() => setActiveTab('history')}
                className="p-6 rounded-2xl bg-white border border-stone-200 hover:border-amber-400 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                <History className="w-8 h-8 text-amber-600 mb-3" />
                <h4 className="font-cinzel text-base font-bold text-slate-900 group-hover:text-blue-900 flex items-center justify-between">
                  <span>Our Journey Since 2020</span>
                  <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform" />
                </h4>
                <p className="text-xs text-stone-600 mt-2">
                  From 13 online students in 2020 to graduations in Kanyakumari, Nagercoil, and our Vellore campus.
                </p>
              </div>

              <div
                onClick={() => setActiveTab('vision')}
                className="p-6 rounded-2xl bg-white border border-stone-200 hover:border-amber-400 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                <Shield className="w-8 h-8 text-[#0f2444] mb-3" />
                <h4 className="font-cinzel text-base font-bold text-slate-900 group-hover:text-blue-900 flex items-center justify-between">
                  <span>Vision & Mission</span>
                  <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform" />
                </h4>
                <p className="text-xs text-stone-600 mt-2">
                  John 17:18 mission, rural community discipleship, and shaping revival catalysts.
                </p>
              </div>

              <div
                onClick={() => setActiveTab('leadership')}
                className="p-6 rounded-2xl bg-white border border-stone-200 hover:border-amber-400 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                <Users className="w-8 h-8 text-emerald-700 mb-3" />
                <h4 className="font-cinzel text-base font-bold text-slate-900 group-hover:text-blue-900 flex items-center justify-between">
                  <span>Principal & Leadership</span>
                  <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform" />
                </h4>
                <p className="text-xs text-stone-600 mt-2">
                  Meet {principal.name} ({principal.role}).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: History & Journey */}
        {activeTab === 'history' && (
          <div className="space-y-8 animate-in fade-in duration-200 max-w-4xl mx-auto">
            <div className="text-center space-y-2">
              <span className="text-xs uppercase tracking-widest text-amber-800 font-bold">
                Chronicles of Grace Since 2020
              </span>
              <h2 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-[#0f2444]">
                The Journey of Image of Christ Bible College
              </h2>
            </div>

            <div className="space-y-6">
              {COLLEGE_JOURNEY.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-6 rounded-2xl border transition-all ${
                    item.highlight
                      ? 'bg-amber-50/60 border-amber-300 shadow-xs'
                      : 'bg-white border-stone-200 shadow-xs'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/80 pb-3 mb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#0f2444] text-amber-300 w-fit">
                      {item.year}
                    </span>
                    {item.location && (
                      <span className="text-xs font-semibold text-stone-600 flex items-center">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-amber-600" />
                        {item.location}
                      </span>
                    )}
                  </div>
                  <h3 className="font-cinzel text-lg font-bold text-[#0f2444]">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mt-2">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Photo Collage of Graduations and Lectures */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
              <div className="rounded-2xl overflow-hidden shadow-md border-2 border-stone-200">
                <img
                  src={graduationPhoto}
                  alt="Convocation Ceremony at Kalluvilai & Nagercoil"
                  className="w-full h-56 object-cover"
                />
                <div className="p-3 bg-[#0f2444] text-white text-xs text-center font-medium">
                  Graduation Convocation Ceremony
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden shadow-md border-2 border-stone-200">
                <img
                  src={classroomPhoto}
                  alt="Interactive Theological Training"
                  className="w-full h-56 object-cover"
                />
                <div className="p-3 bg-[#0f2444] text-white text-xs text-center font-medium">
                  Classroom & Field Ministry Training
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Vision & Mission */}
        {activeTab === 'vision' && (
          <div className="space-y-10 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Vision Card */}
              <div className="bg-[#0f2444] text-white p-8 rounded-3xl shadow-xl space-y-4 border border-blue-900">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-2xl border border-amber-500/40">
                  📖
                </div>
                <h3 className="font-cinzel text-2xl font-bold text-amber-300">
                  Our Vision
                </h3>
                <p className="text-sm text-slate-200 leading-relaxed font-serif italic text-base">
                  “Established in January 2020, Image of Christ Bible College is founded on the mission of John 17:18 — to reach people with the Word of God and equip them for His purpose. Our vision is to teach and disciple individuals, especially in rural communities, through the Scriptures, shaping their lives so they may become instruments of spiritual revival in the nation.”
                </p>
              </div>

              {/* Who We Are & Mission Card */}
              <div className="bg-gradient-to-br from-amber-900 to-amber-950 text-white p-8 rounded-3xl shadow-xl space-y-4 border border-amber-700/50">
                <div className="w-12 h-12 rounded-xl bg-white/20 text-amber-300 flex items-center justify-center font-bold text-2xl">
                  🎯
                </div>
                <h3 className="font-cinzel text-2xl font-bold text-white">
                  Who We Are
                </h3>
                <p className="text-sm text-amber-100 leading-relaxed font-serif italic text-base">
                  “Image of Christ Bible College is committed to providing accessible and transformative biblical education. We aim to raise strong believers who are rooted in God’s Word and prepared to serve effectively in ministry and society.”
                </p>
                <ul className="text-xs text-amber-200 space-y-2 font-sans pt-2">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Deep biblical foundation accessible to rural and urban candidates alike.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Holistic discipleship focused on Christlikeness and spiritual holiness.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Equipping leaders for apostolic harvest and nationwide spiritual revival.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Foundational Pillars */}
            <div className="space-y-6 pt-4">
              <h3 className="font-cinzel text-xl font-bold text-[#0f2444] text-center">
                Our Four Foundational Pillars
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs text-center space-y-2">
                  <div className="w-10 h-10 mx-auto rounded-full bg-blue-50 text-[#0f2444] flex items-center justify-center font-bold text-lg">
                    1
                  </div>
                  <h4 className="font-bold text-sm text-[#0f2444]">Biblical Education</h4>
                  <p className="text-xs text-slate-600">Deepen your knowledge of God’s infallible Word with reverent exegesis.</p>
                </div>

                <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs text-center space-y-2">
                  <div className="w-10 h-10 mx-auto rounded-full bg-amber-50 text-amber-800 flex items-center justify-center font-bold text-lg">
                    2
                  </div>
                  <h4 className="font-bold text-sm text-[#0f2444]">Discipleship</h4>
                  <p className="text-xs text-slate-600">Grow in personal faith, integrity, and the humble likeness of Christ.</p>
                </div>

                <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs text-center space-y-2">
                  <div className="w-10 h-10 mx-auto rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-lg">
                    3
                  </div>
                  <h4 className="font-bold text-sm text-[#0f2444]">Rural Outreach</h4>
                  <p className="text-xs text-slate-600">Reaching rural communities and villages with transformative biblical truth.</p>
                </div>

                <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs text-center space-y-2">
                  <div className="w-10 h-10 mx-auto rounded-full bg-purple-50 text-purple-800 flex items-center justify-center font-bold text-lg">
                    4
                  </div>
                  <h4 className="font-bold text-sm text-[#0f2444]">Nationwide Revival</h4>
                  <p className="text-xs text-slate-600">Raising strong, Spirit-filled servant-leaders for a lasting national revival.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Leadership */}
        {activeTab === 'leadership' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="text-center space-y-2">
              <span className="text-xs uppercase tracking-widest text-amber-800 font-bold">
                College Leadership & Faculty
              </span>
              <h2 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-[#0f2444]">
                Principal, President & Faculty
              </h2>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              {faculty.map(member => (
                <div key={member.id} className="bg-white rounded-3xl border border-stone-200 p-8 shadow-sm space-y-5">
                  <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                    <div className="w-28 h-28 rounded-full overflow-hidden border-3 border-amber-500 flex-shrink-0 shadow-md bg-white p-1">
                      <img
                        src={member.photo || collegeLogo || officialLogo}
                        referrerPolicy="no-referrer"
                        onError={e => {
                          (e.currentTarget as HTMLImageElement).src = collegeLogo || officialLogo;
                        }}
                        alt={member.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900">
                          {member.department}
                        </span>
                        {member.yearsOfExperience > 0 && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-900 border border-blue-200">
                            {member.yearsOfExperience}+ Years Experience
                          </span>
                        )}
                        {member.degrees && (
                          <span className="text-xs text-stone-500 font-semibold">
                            • {member.degrees}
                          </span>
                        )}
                      </div>
                      <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[#0f2444]">
                        {member.name}
                      </h3>
                      <p className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                        {member.role}
                      </p>
                      {member.almaMater && (
                        <p className="text-xs text-stone-500">
                          Alma Mater: {member.almaMater}
                        </p>
                      )}
                      <p className="text-xs text-stone-600 leading-relaxed">
                        {member.bio}
                      </p>
                      <div className="pt-2 flex flex-wrap justify-center sm:justify-start gap-4 text-xs font-semibold text-[#0f2444]">
                        <a href={`tel:${(member.phone || '+919500423126').replace(/\s+/g, '')}`} className="flex items-center hover:text-amber-700">
                          <Phone className="w-3.5 h-3.5 mr-1 text-amber-600" />
                          <span>ph. {member.phone || '95004 23126'}</span>
                        </a>
                        <a href={`mailto:${member.email || 'icbc.vellore@gmail.com'}`} className="flex items-center hover:text-amber-700">
                          <Mail className="w-3.5 h-3.5 mr-1 text-amber-600" />
                          <span>{member.email || 'icbc.vellore@gmail.com'}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                  {(member.subjects?.length > 0 || member.quote) && (
                    <div className="pt-4 border-t border-stone-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {member.subjects?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 items-center">
                          {member.subjects.map((sub, sIdx) => (
                            <span
                              key={sIdx}
                              className="px-2.5 py-1 rounded-lg bg-[#faf8f5] border border-stone-200 text-stone-800 text-[11px] font-medium"
                            >
                              {sub}
                            </span>
                          ))}
                        </div>
                      )}
                      {member.quote && (
                        <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-xs italic font-serif text-amber-950">
                          {member.quote}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Statement of Faith */}
        {activeTab === 'faith' && (
          <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
            <div className="text-center space-y-2 mb-8">
              <span className="text-xs uppercase tracking-widest text-amber-800 font-bold">
                Doctrinal Confession
              </span>
              <h2 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-[#0f2444]">
                Statement of Faith
              </h2>
              <p className="text-xs text-stone-600">
                Our confession aligns firmly with classical historic evangelical orthodoxy.
              </p>
            </div>

            <div className="space-y-4">
              {DOCTRINAL_ARTICLES.map((doc, idx) => (
                <div key={idx} className="p-5 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-1.5">
                  <h4 className="font-cinzel text-sm sm:text-base font-bold text-[#0f2444]">
                    Article {doc.number}: {doc.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-sans">
                    {doc.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
