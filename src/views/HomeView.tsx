import React from 'react';
import { useCollege } from '../context/CollegeContext';
import { COLLEGE_INFO, COLLEGE_JOURNEY, INITIAL_FACULTY } from '../data/collegeData';
import {
  BookOpen,
  GraduationCap,
  Calendar,
  ArrowRight,
  Shield,
  Users,
  Award,
  CheckCircle,
  MapPin,
  Clock,
  Globe,
  Flame,
  Phone,
  MessageSquare,
  Sparkles,
  Layers,
  Monitor,
  Building,
  Check
} from 'lucide-react';

import heroBanner from '../assets/images/icbc_campus_building_1790394522586.jpg';
import officialLogo from '../assets/images/icbc_vellore_official_logo_1790438854633.jpg';
import graduationPhoto from '../assets/images/icbc_graduation_1790324006996.jpg';
import classroomPhoto from '../assets/images/icbc_classroom_1790324037922.jpg';

export const HomeView: React.FC = () => {
  const {
    setActivePage,
    courses,
    faculty,
    notices,
    events,
    gallery,
    setSelectedCourseForApply,
    collegeLogo
  } = useCollege();

  const principal = faculty.find(f => f.id === 'fac-1') || faculty[0] || INITIAL_FACULTY[0];

  const handleApplyCourse = (courseId: string) => {
    setSelectedCourseForApply(courseId);
    setActivePage('admissions-application');
  };

  return (
    <div className="font-sans text-slate-800 bg-white">
      {/* 1. HERO SECTION - FEATURING CAMPUS BUILDING */}
      <section className="relative overflow-hidden min-h-[580px] lg:min-h-[640px] flex items-center bg-slate-900">
        {/* Background Image: Image of Christ Bible College Campus Building */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroBanner}
            alt="Image of Christ Bible College Campus Building"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle directional gradient overlay for text legibility on the left while keeping the campus building visible */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-white/15 lg:to-transparent"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-6">
              {/* College Title */}
              <div>
                <span className="text-xs uppercase tracking-widest text-amber-700 font-bold block mb-1">
                  Vellore, Tamil Nadu • Since 2020
                </span>
                <h1 className="font-cinzel text-3xl sm:text-5xl lg:text-6xl font-black text-[#0f2444] tracking-tight leading-[1.1]">
                  Image of Christ <br />
                  <span className="text-[#132c54]">Bible College</span>
                </h1>
              </div>

              {/* Subtitle */}
              <p className="font-serif italic text-xl sm:text-2xl text-slate-700 font-medium">
                Equipping Lives Through the Word of God
              </p>

              {/* Scripture Quote Box */}
              <div className="border-l-3 border-amber-600 pl-4 py-1 space-y-1">
                <p className="font-serif italic text-base sm:text-lg text-slate-800 leading-snug">
                  “Just as You sent Me into the world, <br />
                  I also have sent them into the world.”
                </p>
                <p className="text-xs font-semibold text-amber-800 tracking-wider uppercase font-sans">
                  John 17:18
                </p>
              </div>

              {/* Motto Pillars */}
              <div className="pt-1">
                <p className="text-xs sm:text-sm font-bold tracking-widest text-[#0f2444] uppercase font-sans">
                  TRANSFORMING LIVES <span className="text-amber-600 px-1.5 font-normal">|</span> REACHING NATIONS <span className="text-amber-600 px-1.5 font-normal">|</span> BUILDING REVIVAL
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-3">
                <button
                  onClick={() => setActivePage('admissions-application')}
                  className="px-7 py-3.5 rounded-full bg-[#d97706] hover:bg-[#b45309] text-white font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition-all flex items-center group active:scale-95 cursor-pointer"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => setActivePage('courses')}
                  className="px-6 py-3.5 rounded-full bg-white/90 hover:bg-white text-[#0f2444] font-bold text-sm border border-slate-300 hover:border-slate-400 shadow-sm transition-all flex items-center active:scale-95 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 mr-2 text-[#0f2444]" />
                  <span>Explore Courses</span>
                </button>
              </div>
            </div>

            {/* Right Column: Clear Unobstructed Campus Building Photo Showcase */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/95 bg-white group">
                <img
                  src={heroBanner}
                  alt="Image of Christ Bible College Building"
                  referrerPolicy="no-referrer"
                  className="w-full h-[280px] sm:h-[360px] lg:h-[400px] object-cover object-center group-hover:scale-102 transition-transform duration-500"
                />
                <div className="bg-[#0f2444] text-white px-4 py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <Building className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span className="font-cinzel font-bold tracking-wider uppercase">
                      Image of Christ Bible College Campus
                    </span>
                  </div>
                  <span className="text-amber-300 font-semibold hidden sm:inline">
                    Vellore, Tamil Nadu
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FOUR PILLARS FEATURE STRIP - IDENTICAL TO REFERENCE */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Pillar 1 */}
            <div className="flex flex-col items-center text-center space-y-2 p-2 group">
              <div className="w-12 h-12 flex items-center justify-center text-[#1b3563] group-hover:scale-110 transition-transform">
                <BookOpen className="w-9 h-9 stroke-[1.75]" />
              </div>
              <h3 className="font-sans font-bold text-base text-[#0f2444]">
                Biblical Education
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-[220px]">
                Deepen your knowledge of God’s Word with faithful hermeneutics.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="flex flex-col items-center text-center space-y-2 p-2 group">
              <div className="w-12 h-12 flex items-center justify-center text-[#1b3563] group-hover:scale-110 transition-transform">
                <Users className="w-9 h-9 stroke-[1.75]" />
              </div>
              <h3 className="font-sans font-bold text-base text-[#0f2444]">
                Discipleship
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-[220px]">
                Grow in faith, personal holiness, and Christlike character.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="flex flex-col items-center text-center space-y-2 p-2 group">
              <div className="w-12 h-12 flex items-center justify-center text-[#1b3563] group-hover:scale-110 transition-transform">
                <Globe className="w-9 h-9 stroke-[1.75]" />
              </div>
              <h3 className="font-sans font-bold text-base text-[#0f2444]">
                Rural Outreach
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-[220px]">
                Reaching rural communities with the life-giving Gospel.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="flex flex-col items-center text-center space-y-2 p-2 group">
              <div className="w-12 h-12 flex items-center justify-center text-[#1b3563] group-hover:scale-110 transition-transform">
                <Flame className="w-9 h-9 stroke-[1.75]" />
              </div>
              <h3 className="font-sans font-bold text-base text-[#0f2444]">
                Nationwide Revival
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-[220px]">
                Raising kingdom servant-leaders for a greater spiritual awakening.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THREE-COLUMN SHOWCASE: OUR VISION | OUR JOURNEY | OUR PROGRAMS */}
      <section className="py-16 bg-[#faf8f5] border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* COLUMN 1: OUR VISION (lg:col-span-4) */}
            <div className="lg:col-span-4 bg-white rounded-2xl p-7 border border-stone-200 shadow-sm flex flex-col justify-between h-full relative overflow-hidden group">
              <div className="space-y-4 relative z-10">
                <div className="inline-block border-b-2 border-amber-500 pb-1">
                  <h2 className="font-cinzel text-2xl font-bold text-[#0f2444]">
                    Our Vision
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Established in January 2020, Image of Christ Bible College is founded on the mission of <strong>John 17:18</strong> — to reach people with the Word of God and equip them for His purpose.
                </p>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Our vision is to teach and disciple individuals, especially in rural communities, through the Scriptures, shaping their lives so they may become instruments of spiritual revival in the nation.
                </p>
              </div>

              <div className="pt-6 relative z-10">
                <button
                  onClick={() => setActivePage('about-vision')}
                  className="px-5 py-2.5 rounded-lg bg-[#0f2444] hover:bg-[#1b3563] text-white text-xs font-semibold tracking-wider transition-all flex items-center group/btn active:scale-95 cursor-pointer"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Watermark Holy Bible background subtle decoration */}
              <div className="absolute -bottom-6 -right-6 w-36 h-36 opacity-5 pointer-events-none text-slate-900">
                <BookOpen className="w-full h-full" />
              </div>
            </div>

            {/* COLUMN 2: OUR JOURNEY WITH STACKED PHOTOS (lg:col-span-4) */}
            <div className="lg:col-span-4 bg-white rounded-2xl p-7 border border-stone-200 shadow-sm flex flex-col justify-between h-full">
              <div className="space-y-4">
                <div className="inline-block border-b-2 border-amber-500 pb-1">
                  <h2 className="font-cinzel text-2xl font-bold text-[#0f2444]">
                    Our Journey
                  </h2>
                </div>

                {/* Timeline Items */}
                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-amber-300">
                  {/* 2020 */}
                  <div className="relative">
                    <span className="absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-amber-600 bg-amber-100"></span>
                    <h4 className="font-bold text-xs text-[#0f2444] uppercase tracking-wide">
                      2020 — Genesis
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Started with online C.Th classes (13 students enrolled).
                    </p>
                  </div>

                  {/* First Graduation */}
                  <div className="relative">
                    <span className="absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-amber-600 bg-amber-100"></span>
                    <h4 className="font-bold text-xs text-[#0f2444] uppercase tracking-wide">
                      First Graduation
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Held at Kalluvilai, Kanyakumari.
                    </p>
                  </div>

                  {/* Second Graduation */}
                  <div className="relative">
                    <span className="absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-amber-600 bg-amber-100"></span>
                    <h4 className="font-bold text-xs text-[#0f2444] uppercase tracking-wide">
                      Second Graduation
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Conducted at Christian Association Church, Nagercoil.
                    </p>
                  </div>

                  {/* 2026 */}
                  <div className="relative">
                    <span className="absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-amber-600 bg-amber-500"></span>
                    <h4 className="font-bold text-xs text-amber-700 uppercase tracking-wide">
                      2026 — Present Growth
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Expanded to include in-person classes along with online programs & Vellore campus.
                    </p>
                  </div>
                </div>

                {/* Stacked Real Photo Cards matching layout */}
                <div className="pt-3 flex items-center justify-center relative h-36">
                  {/* Photo 1: Graduation */}
                  <div className="absolute left-2 w-44 rounded-lg overflow-hidden shadow-md border-2 border-white -rotate-3 transition-transform hover:rotate-0 hover:z-20 hover:scale-105 duration-300">
                    <img
                      src={graduationPhoto}
                      alt="ICBC Convocation Graduation"
                      className="w-full h-24 object-cover"
                    />
                    <div className="bg-slate-900 text-white text-[9px] font-medium py-1 px-2 text-center truncate">
                      Convocation Ceremony
                    </div>
                  </div>

                  {/* Photo 2: Classroom */}
                  <div className="absolute right-2 w-44 rounded-lg overflow-hidden shadow-md border-2 border-white rotate-3 z-10 transition-transform hover:rotate-0 hover:z-20 hover:scale-105 duration-300">
                    <img
                      src={classroomPhoto}
                      alt="ICBC Theological Classroom Training"
                      className="w-full h-24 object-cover"
                    />
                    <div className="bg-[#0f2444] text-white text-[9px] font-medium py-1 px-2 text-center truncate">
                      Theological Lecture & Study
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMN 3: OUR PROGRAMS (lg:col-span-4) */}
            <div className="lg:col-span-4 bg-white rounded-2xl p-7 border border-stone-200 shadow-sm flex flex-col justify-between h-full">
              <div className="space-y-4">
                <div className="inline-block border-b-2 border-amber-500 pb-1">
                  <h2 className="font-cinzel text-2xl font-bold text-[#0f2444]">
                    Our Programs
                  </h2>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  We offer flexible learning options to make biblical education accessible to everyone.
                </p>

                {/* Course List with Icons */}
                <div className="space-y-2.5 text-xs text-slate-700">
                  {courses.map(course => (
                    <div
                      key={course.id}
                      onClick={() => handleApplyCourse(course.id)}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center space-x-2.5">
                        <GraduationCap className="w-4 h-4 text-[#0f2444] flex-shrink-0" />
                        <div>
                          <span className="font-bold text-[#0f2444]">{course.code}</span>
                          <span className="text-slate-600"> ({course.title})</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded shrink-0">
                        {course.duration}
                      </span>
                    </div>
                  ))}

                  <div className="flex items-center space-x-2.5 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <Monitor className="w-4 h-4 text-[#0f2444] flex-shrink-0" />
                    <div>
                      <span className="font-bold text-[#0f2444]">Online Classes</span>
                      <span className="text-slate-600"> (Web-based interactive learning)</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2.5 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <MapPin className="w-4 h-4 text-[#0f2444] flex-shrink-0" />
                    <div>
                      <span className="font-bold text-[#0f2444]">On-Campus Classes</span>
                      <span className="text-slate-600"> (Direct campus learning experience)</span>
                    </div>
                  </div>
                </div>

                {/* Blended Learning Highlight Box */}
                <div className="bg-[#f0f6ff] border border-blue-200/80 rounded-xl p-3.5 flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-[#0f2444] text-amber-400 flex items-center justify-center flex-shrink-0">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#0f2444]">
                      Blended Learning Approach
                    </h4>
                    <p className="text-[11px] text-slate-600 leading-tight mt-0.5">
                      Learn anytime, anywhere with our combination of online and in-person classes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => setActivePage('courses')}
                  className="px-5 py-2.5 rounded-lg bg-[#0f2444] hover:bg-[#1b3563] text-white text-xs font-semibold tracking-wider transition-all flex items-center group/btn active:scale-95 cursor-pointer"
                >
                  <span>View All Programs</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* LIVE CAMPUS BULLETINS, UPCOMING EVENTS & UPLOADED GALLERY HIGHLIGHTS */}
      {(notices.length > 0 || events.length > 0 || gallery.length > 0) && (
        <section className="py-14 bg-[#faf8f5] border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Latest Notices */}
              {notices.length > 0 && (
                <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-amber-800 font-bold block">
                        Official Announcements
                      </span>
                      <h3 className="font-cinzel text-xl font-bold text-[#0f2444]">
                        Campus Notice Board ({notices.length})
                      </h3>
                    </div>
                    <button
                      onClick={() => setActivePage('students-notices')}
                      className="text-xs font-bold text-blue-900 hover:text-amber-700 cursor-pointer"
                    >
                      View All →
                    </button>
                  </div>
                  <div className="space-y-3">
                    {notices.slice(0, 3).map(n => (
                      <div key={n.id} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-100 space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {n.isUrgent && (
                              <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[10px]">
                                URGENT
                              </span>
                            )}
                            <span className="text-[10px] uppercase font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded">
                              {n.category}
                            </span>
                          </div>
                          <span className="text-[11px] text-stone-400">{n.date}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm">{n.title}</h4>
                        <p className="text-stone-600 line-clamp-2">{n.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upcoming Events */}
              {events.length > 0 && (
                <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-amber-800 font-bold block">
                        Ministry Gatherings
                      </span>
                      <h3 className="font-cinzel text-xl font-bold text-[#0f2444]">
                        Upcoming Campus Events ({events.length})
                      </h3>
                    </div>
                    <button
                      onClick={() => setActivePage('events')}
                      className="text-xs font-bold text-blue-900 hover:text-amber-700 cursor-pointer"
                    >
                      View All →
                    </button>
                  </div>
                  <div className="space-y-3">
                    {events.slice(0, 3).map(ev => (
                      <div key={ev.id} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-100 space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                            {ev.category}
                          </span>
                          <span className="text-[11px] font-mono text-stone-500">{ev.date} • {ev.time}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm">{ev.title}</h4>
                        <p className="text-stone-600">
                          {ev.location} • Speaker: <strong>{ev.speaker}</strong>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Uploaded Gallery Photos Preview if Admin has uploaded photos */}
            {gallery.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-amber-800 font-bold block">
                      Campus Moments
                    </span>
                    <h3 className="font-cinzel text-2xl font-bold text-[#0f2444]">
                      Latest Campus Gallery Photos ({gallery.length})
                    </h3>
                  </div>
                  <button
                    onClick={() => setActivePage('gallery')}
                    className="px-4 py-2 rounded-xl bg-[#0f2444] text-amber-300 text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    View Full Gallery →
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {gallery.slice(0, 4).map(photo => (
                    <div
                      key={photo.id}
                      onClick={() => setActivePage('gallery')}
                      className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer bg-slate-900 aspect-4/3"
                    >
                      <img src={photo.image} alt={photo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent"></div>
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-black/60 text-amber-300">
                        {photo.category}
                      </span>
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                        <h4 className="font-cinzel text-xs font-bold truncate">{photo.title}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 4. WHO WE ARE & PRINCIPAL LEADERSHIP SECTION (DYNAMICALLY LINKED TO ADMIN PANEL) */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left: Who We Are & Mission */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-amber-700 font-bold block mb-1">
                  Rooted in Truth & Service
                </span>
                <h2 className="font-cinzel text-3xl sm:text-4xl font-extrabold text-[#0f2444] tracking-tight">
                  Who We Are
                </h2>
              </div>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-serif italic text-lg text-slate-800">
                “Image of Christ Bible College is committed to providing accessible and transformative biblical education. We aim to raise strong believers who are rooted in God’s Word and prepared to serve effectively in ministry and society.”
              </p>

              <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                <p>
                  Under the spiritual guidance and leadership of our <strong>{principal.role}, {principal.name}</strong>, ICBC Vellore has been commissioned to bridge the gap between academic theological rigor and grassroots pastoral compassion.
                </p>
                {principal.bio && (
                  <p>
                    {principal.bio}
                  </p>
                )}
              </div>

              {/* Direct Contact Phone Highlight */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href={`tel:${(principal.phone || '+919500423126').replace(/\s+/g, '')}`}
                  className="inline-flex items-center px-5 py-3 rounded-xl bg-amber-50 border border-amber-300 hover:bg-amber-100 text-[#0f2444] font-bold text-xs sm:text-sm tracking-wide transition-all shadow-xs"
                >
                  <Phone className="w-4 h-4 mr-2 text-amber-700" />
                  <span>Call: {principal.phone || '+91 95004 23126'}</span>
                </a>

                <a
                  href={`https://wa.me/${(principal.phone || '919500423126').replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center px-5 py-3 rounded-xl bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 text-emerald-900 font-bold text-xs sm:text-sm tracking-wide transition-all shadow-xs"
                >
                  <MessageSquare className="w-4 h-4 mr-2 text-emerald-600" />
                  <span>WhatsApp: {principal.phone || '95004 23126'}</span>
                </a>
              </div>
            </div>

            {/* Right: Principal & Official Seal Card */}
            <div className="lg:col-span-5">
              <div className="bg-[#faf8f5] rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md flex flex-col items-center text-center space-y-4 relative overflow-hidden">
                {/* Principal Photo or Official College Crest Seal */}
                <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-amber-500 via-blue-900 to-amber-400 shadow-lg">
                  <img
                    src={principal.photo || collegeLogo || officialLogo}
                    referrerPolicy="no-referrer"
                    onError={e => {
                      (e.currentTarget as HTMLImageElement).src = collegeLogo || officialLogo;
                    }}
                    alt={principal.name}
                    className="w-full h-full object-cover rounded-full bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <h3 className="font-cinzel text-xl font-bold text-[#0f2444]">
                    {principal.name}
                  </h3>
                  <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
                    {principal.role}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {principal.degrees || 'Committed to the John 17:18 Mandate'}
                  </p>
                </div>

                <p className="text-xs text-slate-600 italic font-serif leading-relaxed px-2">
                  {principal.quote ||
                    '“We exist to empower ordinary believers with extraordinary biblical truth, raising disciples who will carry the revival fire of Jesus Christ across every hamlet and town.”'}
                </p>

                <div className="w-full pt-3 border-t border-stone-200 flex items-center justify-between text-xs text-slate-600">
                  <span className="font-medium">Direct Admissions Helpline</span>
                  <a
                    href={`tel:${(principal.phone || '+919500423126').replace(/\s+/g, '')}`}
                    className="font-bold text-amber-700 hover:text-amber-800"
                  >
                    {principal.phone || '95004 23126'}
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4B. LIVE CAMPUS PHOTO GALLERY SECTION (Shows uploaded photos directly on Home Page) */}
      {gallery.length > 0 && (
        <section className="py-14 bg-[#faf7f0] border-t border-stone-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-1.5">
                <span className="text-xs uppercase tracking-widest text-amber-700 font-bold">
                  Campus Moments & Memories
                </span>
                <h2 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-[#0f2444]">
                  Campus Photo Gallery
                </h2>
              </div>
              <button
                onClick={() => setActivePage('gallery')}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#0f2444] hover:bg-blue-900 text-amber-300 font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer self-start sm:self-auto"
              >
                <span>View Full Gallery ({gallery.length})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {gallery.slice(0, 8).map(item => (
                <div
                  key={item.id}
                  onClick={() => setActivePage('gallery')}
                  className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer bg-slate-900 aspect-4/3 border border-stone-200"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-black/60 text-amber-300 backdrop-blur-sm">
                    {item.category}
                  </span>
                  <div className="absolute bottom-3 left-3 right-3 text-white space-y-0.5">
                    <h4 className="font-cinzel text-sm font-bold leading-snug group-hover:text-amber-300 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-stone-300 line-clamp-1">
                      {item.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. START YOUR JOURNEY TODAY - BOTTOM BANNER MATCHING IMAGE */}
      <section className="relative overflow-hidden bg-[#0a1426] text-white py-16 border-t-2 border-amber-500/30">
        {/* Subtle sunset warmth backdrop with cross silhouette */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1426] via-[#10223d] to-[#1c1822] opacity-90"></div>
        <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
            
            {/* Banner Text */}
            <div className="space-y-2 max-w-2xl">
              <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-white tracking-tight">
                Start Your Journey Today
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Be part of a life-changing experience. Grow in faith, knowledge and purpose.
              </p>
            </div>

            {/* Buttons & "For His Glory" calligraphy */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={() => setActivePage('admissions-application')}
                className="px-7 py-3 rounded-full bg-[#d97706] hover:bg-[#b45309] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all active:scale-95 cursor-pointer"
              >
                Apply Now →
              </button>

              <button
                onClick={() => setActivePage('contact')}
                className="px-6 py-3 rounded-full bg-transparent hover:bg-white/10 text-white font-semibold text-xs uppercase tracking-wider border border-white/40 hover:border-white transition-all active:scale-95 cursor-pointer flex items-center"
              >
                <span>Contact Us</span>
              </button>

              {/* Calligraphy text "For His Glory" with small cross */}
              <div className="hidden xl:flex items-center space-x-2 pl-4 text-amber-200/90 font-serif italic text-2xl">
                <span>For His Glory</span>
                <span className="text-amber-400 text-lg not-italic">✝</span>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
