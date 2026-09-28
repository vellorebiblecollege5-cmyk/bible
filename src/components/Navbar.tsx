import React, { useState } from 'react';
import { useCollege, ActivePage } from '../context/CollegeContext';
import { COLLEGE_INFO } from '../data/collegeData';
import {
  BookOpen,
  Phone,
  Mail,
  ChevronDown,
  Menu,
  X,
  UserCheck,
  Shield,
  GraduationCap,
  Sparkles,
  Award,
  Milestone,
  LogIn,
  User
} from 'lucide-react';

import officialLogo from '../assets/images/icbc_vellore_official_logo_1790438854633.jpg';

export const Navbar: React.FC = () => {
  const { activePage, setActivePage, loginMode, setLoginMode, isStudentLoggedIn, studentProfile, currentUser, collegeLogo } = useCollege();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutDropdown, setAboutDropdown] = useState(false);
  const [coursesDropdown, setCoursesDropdown] = useState(false);
  const [admissionsDropdown, setAdmissionsDropdown] = useState(false);
  const [studentsDropdown, setStudentsDropdown] = useState(false);
  const [loginDropdown, setLoginDropdown] = useState(false);
  const [topLoginDropdown, setTopLoginDropdown] = useState(false);

  const navigateTo = (page: ActivePage) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    setAboutDropdown(false);
    setCoursesDropdown(false);
    setAdmissionsDropdown(false);
    setStudentsDropdown(false);
    setLoginDropdown(false);
    setTopLoginDropdown(false);
  };

  const openLoginPortal = (mode: 'user' | 'admin') => {
    setLoginMode(mode);
    navigateTo(mode === 'user' ? 'login-user' : 'login-admin');
  };

  const isCurrent = (page: string) => {
    return activePage.startsWith(page);
  };

  return (
    <header className="sticky top-0 z-40 w-full shadow-xs bg-white text-slate-800 border-b border-slate-200">
      {/* Top Banner Strip */}
      <div className="text-xs py-1.5 px-4 bg-[#0a1426] text-slate-200 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-center sm:text-left">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950 uppercase tracking-wide">
              Admissions Open 2026–27
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="text-slate-300 truncate font-medium text-[11px] sm:text-xs">
              Vellore, Tamil Nadu • Since 2020 • John 17:18 Mandate
            </span>
          </div>

          <div className="flex items-center space-x-4 text-xs">
            <a
              href={`tel:${COLLEGE_INFO.phonePrimary}`}
              className="flex items-center hover:text-amber-400 transition-colors font-medium"
            >
              <Phone className="w-3.5 h-3.5 mr-1 text-amber-400" />
              <span>ph. {COLLEGE_INFO.phoneDisplay}</span>
            </a>
            <a
              href={`mailto:${COLLEGE_INFO.email}`}
              className="hidden lg:flex items-center hover:text-amber-400 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 mr-1 text-amber-400" />
              <span>{COLLEGE_INFO.email}</span>
            </a>

            {/* Login Dropdown (User Login & Admin Login) */}
            <div
              className="relative pl-2 border-l border-slate-700"
              onMouseEnter={() => setTopLoginDropdown(true)}
              onMouseLeave={() => setTopLoginDropdown(false)}
            >
              <button
                onClick={() => setTopLoginDropdown(!topLoginDropdown)}
                className="flex items-center text-amber-300 hover:text-white transition-colors font-semibold cursor-pointer"
                title="Login Portal"
              >
                <LogIn className="w-3.5 h-3.5 mr-1" />
                <span>Login</span>
                <ChevronDown className="w-3 h-3 ml-1" />
              </button>

              {topLoginDropdown && (
                <div className="absolute right-0 top-full pt-1.5 w-48 z-50">
                  <div className="bg-white text-slate-800 rounded-xl shadow-xl border border-slate-200 py-1.5 overflow-hidden">
                    <button
                      onClick={() => openLoginPortal('user')}
                      className="w-full text-left px-3.5 py-2 text-xs hover:bg-amber-50 hover:text-[#0f2444] transition-colors font-semibold flex items-center space-x-2 cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5 text-blue-700" />
                      <span>User Login</span>
                    </button>
                    <button
                      onClick={() => openLoginPortal('admin')}
                      className="w-full text-left px-3.5 py-2 text-xs hover:bg-amber-50 hover:text-[#0f2444] transition-colors font-semibold flex items-center space-x-2 border-t border-slate-100 cursor-pointer"
                    >
                      <Shield className="w-3.5 h-3.5 text-amber-600" />
                      <span>Admin Login</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Name */}
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center space-x-3 text-left group focus:outline-none cursor-pointer"
          >
            {/* Real Crest Seal */}
            <div className="w-13 h-13 rounded-full overflow-hidden p-0.5 border-2 border-amber-500/80 shadow-sm group-hover:scale-105 transition-transform flex-shrink-0 bg-white">
              <img
                src={collegeLogo || officialLogo}
                alt="Image of Christ Bible College Vellore Official Logo"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = officialLogo;
                }}
                className="w-full h-full object-cover rounded-full"
              />
            </div>

            {/* Typography matching reference */}
            <div className="flex flex-col">
              <span className="font-cinzel text-lg sm:text-xl font-bold tracking-tight text-[#0f2444] group-hover:text-[#1b3563] transition-colors leading-tight">
                IMAGE OF CHRIST
              </span>
              <span className="text-[11px] sm:text-xs font-semibold tracking-wider uppercase text-amber-800 font-sans">
                BIBLE COLLEGE <span className="text-slate-300">•</span> VELLORE
              </span>
              <span className="text-[10px] text-slate-500 font-medium tracking-tight hidden sm:block">
                Since 2020 • Equipping Lives Through the Word of God
              </span>
            </div>
          </button>

          {/* Desktop Nav Items matching reference layout */}
          <nav className="hidden xl:flex items-center space-x-6 font-medium text-xs uppercase tracking-wider text-slate-700">
            {/* Home */}
            <button
              onClick={() => navigateTo('home')}
              className={`py-2 transition-all relative cursor-pointer ${
                activePage === 'home'
                  ? 'text-[#0f2444] font-bold border-b-2 border-amber-600'
                  : 'hover:text-[#0f2444]'
              }`}
            >
              Home
            </button>

            {/* About Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setAboutDropdown(true)}
              onMouseLeave={() => setAboutDropdown(false)}
            >
              <button
                onClick={() => navigateTo('about')}
                className={`flex items-center py-2 transition-all cursor-pointer ${
                  isCurrent('about')
                    ? 'text-[#0f2444] font-bold border-b-2 border-amber-600'
                    : 'hover:text-[#0f2444]'
                }`}
              >
                <span>About Us</span>
                <ChevronDown className="w-3.5 h-3.5 ml-1" />
              </button>

              {aboutDropdown && (
                <div className="absolute left-0 top-full mt-1 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in duration-150">
                  <button
                    onClick={() => navigateTo('about')}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-amber-50 hover:text-[#0f2444] transition-colors font-medium"
                  >
                    About Overview & Vision
                  </button>
                  <button
                    onClick={() => navigateTo('about-vision')}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-amber-50 hover:text-[#0f2444] transition-colors font-medium"
                  >
                    Vision (John 17:18)
                  </button>
                  <button
                    onClick={() => navigateTo('about-history')}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-amber-50 hover:text-[#0f2444] transition-colors font-medium"
                  >
                    Our History Since 2020
                  </button>
                  <button
                    onClick={() => navigateTo('about-leadership')}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-amber-50 hover:text-[#0f2444] transition-colors font-medium"
                  >
                    Principal & Leadership
                  </button>
                </div>
              )}
            </div>

            {/* Programs / Courses */}
            <div
              className="relative"
              onMouseEnter={() => setCoursesDropdown(true)}
              onMouseLeave={() => setCoursesDropdown(false)}
            >
              <button
                onClick={() => navigateTo('courses')}
                className={`flex items-center py-2 transition-all cursor-pointer ${
                  isCurrent('courses')
                    ? 'text-[#0f2444] font-bold border-b-2 border-amber-600'
                    : 'hover:text-[#0f2444]'
                }`}
              >
                <span>Programs</span>
                <ChevronDown className="w-3.5 h-3.5 ml-1" />
              </button>

              {coursesDropdown && (
                <div className="absolute left-0 top-full mt-1 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in duration-150">
                  <button
                    onClick={() => navigateTo('courses')}
                    className="w-full text-left px-4 py-2 text-xs text-[#0f2444] font-bold hover:bg-amber-50 border-b border-slate-100"
                  >
                    All Programs Overview
                  </button>
                  <button
                    onClick={() => navigateTo('courses')}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-amber-50 hover:text-[#0f2444] transition-colors font-medium"
                  >
                    C.Th (Certificate in Theology)
                  </button>
                  <button
                    onClick={() => navigateTo('courses')}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-amber-50 hover:text-[#0f2444] transition-colors font-medium"
                  >
                    D.Th (Diploma in Theology)
                  </button>
                  <button
                    onClick={() => navigateTo('courses-bth')}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-amber-50 hover:text-[#0f2444] transition-colors font-medium"
                  >
                    B.Th (Bachelor of Theology)
                  </button>
                  <button
                    onClick={() => navigateTo('courses-mdiv')}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-amber-50 hover:text-[#0f2444] transition-colors font-medium"
                  >
                    M.Div (Master of Divinity)
                  </button>
                </div>
              )}
            </div>

            {/* Our Journey Link */}
            <button
              onClick={() => navigateTo('about-history')}
              className={`py-2 transition-all cursor-pointer ${
                activePage === 'about-history'
                  ? 'text-[#0f2444] font-bold border-b-2 border-amber-600'
                  : 'hover:text-[#0f2444]'
              }`}
            >
              Our Journey
            </button>

            {/* Faculty */}
            <button
              onClick={() => navigateTo('faculty')}
              className={`py-2 transition-all cursor-pointer ${
                activePage === 'faculty'
                  ? 'text-[#0f2444] font-bold border-b-2 border-amber-600'
                  : 'hover:text-[#0f2444]'
              }`}
            >
              Faculty
            </button>

            {/* Admissions */}
            <div
              className="relative"
              onMouseEnter={() => setAdmissionsDropdown(true)}
              onMouseLeave={() => setAdmissionsDropdown(false)}
            >
              <button
                onClick={() => navigateTo('admissions')}
                className={`flex items-center py-2 transition-all cursor-pointer ${
                  isCurrent('admissions')
                    ? 'text-[#0f2444] font-bold border-b-2 border-amber-600'
                    : 'hover:text-[#0f2444]'
                }`}
              >
                <span>Admissions</span>
                <ChevronDown className="w-3.5 h-3.5 ml-1" />
              </button>

              {admissionsDropdown && (
                <div className="absolute left-0 top-full mt-1 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in duration-150">
                  <button
                    onClick={() => navigateTo('admissions-application')}
                    className="w-full text-left px-4 py-2 text-xs text-amber-700 font-bold hover:bg-amber-50 transition-colors"
                  >
                    Apply Online (2026–27)
                  </button>
                  <button
                    onClick={() => navigateTo('admissions-eligibility')}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-amber-50 hover:text-[#0f2444] transition-colors font-medium"
                  >
                    Eligibility & Requirements
                  </button>
                  <button
                    onClick={() => navigateTo('admissions-fees')}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-amber-50 hover:text-[#0f2444] transition-colors font-medium"
                  >
                    Tuition & Concessions
                  </button>
                </div>
              )}
            </div>

            {/* Students */}
            <div
              className="relative"
              onMouseEnter={() => setStudentsDropdown(true)}
              onMouseLeave={() => setStudentsDropdown(false)}
            >
              <button
                onClick={() => navigateTo('students')}
                className={`flex items-center py-2 transition-all cursor-pointer ${
                  isCurrent('students')
                    ? 'text-[#0f2444] font-bold border-b-2 border-amber-600'
                    : 'hover:text-[#0f2444]'
                }`}
              >
                <span>Students</span>
                <ChevronDown className="w-3.5 h-3.5 ml-1" />
              </button>

              {studentsDropdown && (
                <div className="absolute left-0 top-full mt-1 w-60 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in duration-150">
                  <button
                    onClick={() => navigateTo('students-login')}
                    className="w-full text-left px-4 py-2.5 text-xs hover:bg-amber-50 hover:text-[#0f2444] transition-colors font-medium flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <UserCheck className="w-4 h-4 mr-2 text-emerald-600" />
                      <span>Student Portal</span>
                    </div>
                    {isStudentLoggedIn && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    )}
                  </button>
                  <button
                    onClick={() => navigateTo('students-materials')}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-amber-50 hover:text-[#0f2444] transition-colors font-medium"
                  >
                    Study Materials & Notes
                  </button>
                  <button
                    onClick={() => navigateTo('students-notices')}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-amber-50 hover:text-[#0f2444] transition-colors font-medium"
                  >
                    Notice Board
                  </button>
                </div>
              )}
            </div>

            {/* Gallery */}
            <button
              onClick={() => navigateTo('gallery')}
              className={`py-2 transition-all cursor-pointer ${
                activePage === 'gallery'
                  ? 'text-[#0f2444] font-bold border-b-2 border-amber-600'
                  : 'hover:text-[#0f2444]'
              }`}
            >
              Gallery
            </button>

            {/* Contact */}
            <button
              onClick={() => navigateTo('contact')}
              className={`py-2 transition-all cursor-pointer ${
                activePage === 'contact'
                  ? 'text-[#0f2444] font-bold border-b-2 border-amber-600'
                  : 'hover:text-[#0f2444]'
              }`}
            >
              Contact
            </button>

            {/* Login Dropdown in Main Nav */}
            <div
              className="relative"
              onMouseEnter={() => setLoginDropdown(true)}
              onMouseLeave={() => setLoginDropdown(false)}
            >
              <button
                onClick={() => openLoginPortal('user')}
                className={`flex items-center py-2 transition-all cursor-pointer ${
                  activePage === 'admin' || activePage === 'login-user' || activePage === 'login-admin'
                    ? 'text-[#0f2444] font-bold border-b-2 border-amber-600'
                    : 'hover:text-[#0f2444]'
                }`}
              >
                <LogIn className="w-3.5 h-3.5 mr-1 text-amber-600" />
                <span>Login</span>
                <ChevronDown className="w-3.5 h-3.5 ml-1" />
              </button>

              {loginDropdown && (
                <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in duration-150">
                  <button
                    onClick={() => openLoginPortal('user')}
                    className="w-full text-left px-4 py-2.5 text-xs hover:bg-amber-50 hover:text-[#0f2444] transition-colors font-semibold flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-blue-700" />
                      <span>User Login</span>
                    </div>
                    {isStudentLoggedIn && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    )}
                  </button>
                  <button
                    onClick={() => openLoginPortal('admin')}
                    className="w-full text-left px-4 py-2.5 text-xs hover:bg-amber-50 hover:text-[#0f2444] transition-colors font-semibold flex items-center justify-between border-t border-slate-100 cursor-pointer"
                  >
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 mr-2 text-amber-600" />
                      <span>Admin Login</span>
                    </div>
                    {currentUser && (currentUser.role === 'super_admin' || currentUser.role === 'admin') && (
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    )}
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Right Action: Phone & Apply Now button */}
          <div className="flex items-center space-x-4">
            {/* Phone Number Clickable */}
            <a
              href={`tel:${COLLEGE_INFO.phonePrimary}`}
              className="hidden lg:flex items-center text-xs font-bold text-[#0f2444] hover:text-amber-700 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
              <span>95004 23126</span>
            </a>

            {/* Apply Now Pill Button matching reference image */}
            <button
              onClick={() => navigateTo('admissions-application')}
              className="px-6 py-2.5 rounded-full bg-[#d97706] hover:bg-[#b45309] text-white font-bold text-xs uppercase tracking-wider shadow-sm hover:shadow transition-all active:scale-95 cursor-pointer"
            >
              Apply Now
            </button>

            {/* Mobile Menu Hamburger */}
            <div className="flex xl:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-700 hover:text-[#0f2444] hover:bg-slate-100"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-200">
          <div className="py-2 px-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
            <span className="font-semibold">Direct Helpline</span>
            <a href="tel:+919500423126" className="font-bold text-amber-800 underline">
              +91 95004 23126
            </a>
          </div>

          <button
            onClick={() => navigateTo('home')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold ${
              activePage === 'home' ? 'bg-amber-100 text-amber-900' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => navigateTo('about')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold ${
              isCurrent('about') ? 'bg-amber-100 text-amber-900' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            About Us & Vision
          </button>
          <button
            onClick={() => navigateTo('courses')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold ${
              isCurrent('courses') ? 'bg-amber-100 text-amber-900' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Programs (C.Th, D.Th, B.Th, M.Div)
          </button>
          <button
            onClick={() => navigateTo('about-history')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Our Journey Since 2020
          </button>
          <button
            onClick={() => navigateTo('faculty')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold ${
              activePage === 'faculty' ? 'bg-amber-100 text-amber-900' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Faculty & Principal
          </button>
          <button
            onClick={() => navigateTo('admissions')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold ${
              isCurrent('admissions') ? 'bg-amber-100 text-amber-900' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Admissions
          </button>
          <button
            onClick={() => navigateTo('students')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold ${
              isCurrent('students') ? 'bg-amber-100 text-amber-900' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Student Portal
          </button>
          <button
            onClick={() => navigateTo('gallery')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold ${
              activePage === 'gallery' ? 'bg-amber-100 text-amber-900' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Gallery
          </button>
          <button
            onClick={() => navigateTo('contact')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold ${
              activePage === 'contact' ? 'bg-amber-100 text-amber-900' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Contact & Prayer
          </button>

          {/* Mobile Login Options: User Login & Admin Login */}
          <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2">
            <button
              onClick={() => openLoginPortal('user')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 border ${
                activePage === 'login-user'
                  ? 'bg-blue-900 text-white border-blue-900'
                  : 'bg-slate-50 text-[#0f2444] border-slate-200 hover:bg-slate-100'
              }`}
            >
              <User className="w-3.5 h-3.5 text-blue-700" />
              <span>User Login</span>
            </button>
            <button
              onClick={() => openLoginPortal('admin')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 border ${
                activePage === 'login-admin' || activePage === 'admin'
                  ? 'bg-blue-900 text-amber-300 border-blue-900'
                  : 'bg-slate-50 text-[#0f2444] border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-amber-600" />
              <span>Admin Login</span>
            </button>
          </div>

          <div className="pt-2">
            <button
              onClick={() => navigateTo('admissions-application')}
              className="w-full py-3 rounded-full bg-[#d97706] hover:bg-[#b45309] text-white font-bold text-xs uppercase tracking-wider text-center shadow-md"
            >
              Apply for 2026–27 Session
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
