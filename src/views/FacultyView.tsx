import React, { useState } from 'react';
import { useCollege } from '../context/CollegeContext';
import { FacultyMember } from '../types';
import {
  GraduationCap,
  BookOpen,
  Award,
  Phone,
  Mail,
  CheckCircle2,
  Shield,
  Sparkles
} from 'lucide-react';
import officialLogo from '../assets/images/icbc_official_logo_1790324060325.jpg';

export const FacultyView: React.FC = () => {
  const { faculty } = useCollege();
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyMember | null>(null);

  return (
    <div className="space-y-12 pb-16 font-sans">
      {/* Header Banner */}
      <div className="bg-[#0a1426] text-white py-14 border-b border-amber-600/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
            Theological Leadership & Mentorship
          </span>
          <h1 className="font-cinzel text-3xl sm:text-5xl font-extrabold tracking-tight">
            College Leadership & Faculty
          </h1>
          <p className="font-serif italic text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            “And the things you have heard me say among many witnesses, entrust to faithful men who will be able to teach others also.” — 2 Timothy 2:2
          </p>
        </div>
      </div>

      {/* Main Faculty Showcase */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {faculty.map(member => (
          <div
            key={member.id}
            className="bg-white rounded-3xl border border-stone-200 shadow-md p-8 sm:p-10 space-y-6"
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 text-center sm:text-left">
              {/* Faculty Photo or Official College Seal */}
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-amber-500 shadow-md bg-white p-1 flex-shrink-0">
                <img
                  src={member.photo || officialLogo}
                  onError={e => {
                    (e.currentTarget as HTMLImageElement).src = officialLogo;
                  }}
                  alt={member.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              {/* Information */}
              <div className="space-y-3 flex-1">
                <div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-amber-100 text-amber-900 inline-block">
                      {member.department}
                    </span>
                    {member.yearsOfExperience > 0 && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-900 border border-blue-200 inline-block">
                        {member.yearsOfExperience}+ Years Experience
                      </span>
                    )}
                  </div>
                  <h2 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-[#0f2444]">
                    {member.name}
                  </h2>
                  <p className="text-sm font-bold text-amber-800 uppercase tracking-wider">
                    {member.role}
                  </p>
                </div>

                <div className="space-y-1 text-xs text-slate-600">
                  <div className="flex items-center justify-center sm:justify-start">
                    <GraduationCap className="w-4 h-4 mr-2 text-amber-700 flex-shrink-0" />
                    <span>{member.degrees}</span>
                  </div>
                  <div className="text-stone-500 pl-6">
                    Alma Mater: {member.almaMater}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-sans">
                  {member.bio}
                </p>

                {/* Direct Contact */}
                <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-semibold text-[#0f2444]">
                  <a href="tel:+919500423126" className="flex items-center hover:text-amber-700">
                    <Phone className="w-3.5 h-3.5 mr-1 text-amber-600" />
                    <span>ph. 95004 23126</span>
                  </a>
                  <a href="mailto:icbc.vellore@gmail.com" className="flex items-center hover:text-amber-700">
                    <Mail className="w-3.5 h-3.5 mr-1 text-amber-600" />
                    <span>icbc.vellore@gmail.com</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Subjects and Quote */}
            <div className="pt-6 border-t border-stone-200 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Theological & Ministry Subjects:
                </span>
                <div className="flex flex-wrap gap-2">
                  {member.subjects.map((sub, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-3 py-1 rounded-lg bg-[#faf8f5] border border-stone-200 text-stone-800 text-xs font-medium"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              {member.quote && (
                <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 text-xs italic font-serif text-amber-950 flex items-center">
                  {member.quote}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Dean's Message Card */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#faf8f5] rounded-3xl p-6 sm:p-8 border border-stone-200 flex flex-col md:flex-row items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-[#0f2444] text-amber-400 flex items-center justify-center font-bold text-2xl flex-shrink-0">
            ✝
          </div>
          <div className="space-y-1.5 text-stone-700 text-xs sm:text-sm font-sans leading-relaxed">
            <h4 className="font-cinzel text-base font-bold text-[#0f2444]">
              Biblical Mentorship at Image of Christ Bible College
            </h4>
            <p>
              Under the leadership of Pr. Christopher, theological education at ICBC is intentionally focused on character, scriptural inerrancy, and practical church ministry. Our students are mentored through personal discipleship, prayer, and hands-on mission outreach.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
