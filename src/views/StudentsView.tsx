import React, { useState, useEffect } from 'react';
import { useCollege, ActivePage } from '../context/CollegeContext';
import { StudyMaterial, Notice } from '../types';
import {
  UserCheck,
  BookOpen,
  Bell,
  Search,
  Download,
  FileText,
  Calendar,
  Award,
  CheckCircle2,
  Clock,
  LogOut,
  Sparkles,
  AlertTriangle,
  GraduationCap,
  UploadCloud,
  Check,
  CreditCard,
  Printer,
  ChevronRight,
  Shield,
  Key
} from 'lucide-react';

export const StudentsView: React.FC = () => {
  const {
    activePage,
    studentProfile,
    isStudentLoggedIn,
    loginStudent,
    logoutStudent,
    studyMaterials,
    notices,
    subjectsList,
    setActiveDocumentPreview,
    uploadFileToStorage,
    loginWithSupabase,
    authLoading
  } = useCollege();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'subjects' | 'materials' | 'assignments' | 'notices' | 'idcard'>('dashboard');

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Materials filter
  const [materialSearch, setMaterialSearch] = useState('');
  const [materialTypeFilter, setMaterialTypeFilter] = useState<string>('All');

  // Notices filter
  const [noticeCategory, setNoticeCategory] = useState<string>('All');
  const [noticeModal, setNoticeModal] = useState<Notice | null>(null);

  // Assignment upload state
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [isUploadingAssignment, setIsUploadingAssignment] = useState(false);
  const [assignmentFeedback, setAssignmentFeedback] = useState<string | null>(null);

  // ID Card modal state
  const [showIdCardModal, setShowIdCardModal] = useState(false);

  useEffect(() => {
    if (activePage === 'students-materials') setActiveTab('materials');
    else if (activePage === 'students-notices') setActiveTab('notices');
    else if (activePage === 'students-login') setActiveTab('dashboard');
  }, [activePage]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    // If identifier is an email and password is provided, attempt Supabase Auth
    if (loginIdentifier.includes('@') && loginPassword) {
      const res = await loginWithSupabase(loginIdentifier, loginPassword);
      if (!res.success) {
        // Fallback to local student registry check
        const ok = loginStudent(loginIdentifier);
        if (!ok) {
          setLoginError(res.error || 'Invalid credentials.');
          return;
        }
      }
    } else {
      // RegNo login
      if (!loginIdentifier.trim()) {
        setLoginError('Please enter your Student Registration Number or Email.');
        return;
      }
      const ok = loginStudent(loginIdentifier.trim());
      if (!ok) {
        setLoginError('Student Registration Number not found in college registry. Please verify with the Academic Office.');
      }
    }
  };

  const handleAssignmentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    setIsUploadingAssignment(true);
    setAssignmentFeedback(null);
    try {
      const res = await uploadFileToStorage('study-materials', file);
      if (res.url) {
        setAssignmentFeedback(`Successfully submitted "${file.name}" to Academic Dean.`);
        setAssignmentTitle('');
      } else {
        setAssignmentFeedback(res.error || 'Failed to submit file.');
      }
    } catch (err: any) {
      setAssignmentFeedback(err?.message || 'Upload error');
    } finally {
      setIsUploadingAssignment(false);
      e.target.value = '';
    }
  };

  const filteredMaterials = studyMaterials.filter(m => {
    const matchesSearch =
      m.title.toLowerCase().includes(materialSearch.toLowerCase()) ||
      m.subject.toLowerCase().includes(materialSearch.toLowerCase()) ||
      m.facultyName.toLowerCase().includes(materialSearch.toLowerCase());
    const matchesType = materialTypeFilter === 'All' || m.type === materialTypeFilter;
    return matchesSearch && matchesType;
  });

  const filteredNotices = notices.filter(n => {
    return noticeCategory === 'All' || n.category === noticeCategory;
  });

  // IF NOT LOGGED IN AS STUDENT
  if (!isStudentLoggedIn || !studentProfile) {
    return (
      <div className="space-y-12 pb-16 font-sans">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white py-14 border-b border-amber-600/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
              Student Academic Affairs & Services
            </span>
            <h1 className="font-cinzel text-3xl sm:text-5xl font-extrabold tracking-tight">
              Student Portal Login
            </h1>
            <p className="font-serif italic text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
              “Your word is a lamp to my feet and a light to my path.” — Psalm 119:105
            </p>
          </div>
        </div>

        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xl p-8 sm:p-10 space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-900 to-indigo-950 text-amber-400 mx-auto flex items-center justify-center shadow-lg">
              <GraduationCap className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-amber-700 font-bold">
                Student Self-Service Hub
              </span>
              <h2 className="font-cinzel text-2xl font-bold text-slate-900">
                Sign In to Student Portal
              </h2>
              <p className="text-xs text-stone-500">
                Access your registered theological courses, lecture notes, and examination results.
              </p>
            </div>

            {loginError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold text-left">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Registration No. or Student Email *
                </label>
                <input
                  type="text"
                  required
                  value={loginIdentifier}
                  onChange={e => setLoginIdentifier(e.target.value)}
                  placeholder="e.g. ICBC-2024-M08 or john.rajan@student.icbc.ac.in"
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-900 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Portal Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="Enter student password"
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-900 text-xs pl-10"
                  />
                  <Key className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-amber-300 font-bold text-xs uppercase tracking-wider transition-all shadow flex items-center justify-center space-x-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>{authLoading ? 'Signing In...' : 'Access Student Dashboard'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // LOGGED IN: STUDENT DASHBOARD
  return (
    <div className="space-y-8 pb-16 font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white py-10 border-b border-amber-600/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
                Student Self-Service Portal
              </span>
              <h1 className="font-cinzel text-2xl sm:text-3xl font-extrabold tracking-tight">
                Academic Dashboard & E-Library
              </h1>
              <p className="text-xs text-slate-300">
                “Study to shew thyself approved unto God, a workman that needeth not to be ashamed” — 2 Timothy 2:15
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowIdCardModal(true)}
                className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold flex items-center space-x-1.5 transition-colors border border-amber-400/30"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Student ID Card</span>
              </button>
              <button
                onClick={logoutStudent}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors border border-white/10"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Student Profile Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-5 text-center sm:text-left">
            <img
              src={studentProfile.avatar}
              alt={studentProfile.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-500/40 shadow-sm"
            />
            <div>
              <div className="flex items-center space-x-2 justify-center sm:justify-start">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Enrolled Candidate
                </span>
                <span className="text-xs font-mono font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded">
                  {studentProfile.regNo}
                </span>
              </div>
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                {studentProfile.name}
              </h3>
              <p className="text-xs text-amber-800 font-semibold">{studentProfile.courseTitle}</p>
              <p className="text-[11px] text-stone-500 mt-0.5">
                {studentProfile.batch} • {studentProfile.email}
              </p>
            </div>
          </div>

          {/* Academic Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full md:w-auto text-xs">
            <div className="bg-stone-50 p-3.5 rounded-2xl text-center border border-stone-100">
              <span className="text-[10px] uppercase text-stone-400 font-bold block">Attendance</span>
              <span className="font-cinzel text-xl font-bold text-emerald-700">{studentProfile.attendancePercent}%</span>
              <span className="text-[10px] text-stone-500 block">Eligible for exams</span>
            </div>
            <div className="bg-stone-50 p-3.5 rounded-2xl text-center border border-stone-100">
              <span className="text-[10px] uppercase text-stone-400 font-bold block">GPA Standing</span>
              <span className="font-cinzel text-xl font-bold text-blue-900">{studentProfile.gpa}</span>
              <span className="text-[10px] text-stone-500 block">Top Tier</span>
            </div>
            <div className="bg-stone-50 p-3.5 rounded-2xl text-center border border-stone-100 col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase text-stone-400 font-bold block">Enrolled Units</span>
              <span className="font-cinzel text-xl font-bold text-amber-800">
                {studentProfile.enrolledSubjects ? studentProfile.enrolledSubjects.length : 5}
              </span>
              <span className="text-[10px] text-stone-500 block">Sem IV</span>
            </div>
          </div>
        </div>

        {/* Dashboard Sub-Tabs Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-200 scrollbar-none">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-blue-900 text-amber-300 shadow'
                : 'text-stone-600 hover:text-slate-900 hover:bg-stone-100'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 mr-1.5" />
            <span>Overview & Schedule</span>
          </button>

          <button
            onClick={() => setActiveTab('subjects')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center whitespace-nowrap ${
              activeTab === 'subjects'
                ? 'bg-blue-900 text-amber-300 shadow'
                : 'text-stone-600 hover:text-slate-900 hover:bg-stone-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 mr-1.5" />
            <span>My Registered Subjects</span>
          </button>

          <button
            onClick={() => setActiveTab('materials')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center whitespace-nowrap ${
              activeTab === 'materials'
                ? 'bg-blue-900 text-amber-300 shadow'
                : 'text-stone-600 hover:text-slate-900 hover:bg-stone-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5 mr-1.5" />
            <span>Study Notes & Syllabi ({studyMaterials.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('assignments')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center whitespace-nowrap ${
              activeTab === 'assignments'
                ? 'bg-blue-900 text-amber-300 shadow'
                : 'text-stone-600 hover:text-slate-900 hover:bg-stone-100'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5 mr-1.5" />
            <span>Assignments & Upload</span>
          </button>

          <button
            onClick={() => setActiveTab('notices')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center whitespace-nowrap ${
              activeTab === 'notices'
                ? 'bg-blue-900 text-amber-300 shadow'
                : 'text-stone-600 hover:text-slate-900 hover:bg-stone-100'
            }`}
          >
            <Bell className="w-3.5 h-3.5 mr-1.5" />
            <span>Campus Notices ({notices.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('idcard')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center whitespace-nowrap ${
              activeTab === 'idcard'
                ? 'bg-blue-900 text-amber-300 shadow'
                : 'text-stone-600 hover:text-slate-900 hover:bg-stone-100'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 mr-1.5" />
            <span>Fee Status & Receipts</span>
          </button>
        </div>

        {/* SUB-TAB 1: OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Daily Chapel & Classes */}
              <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <h3 className="font-cinzel text-lg font-bold text-slate-900">
                    Today’s Academic & Chapel Timetable
                  </h3>
                  <span className="text-xs text-stone-500 font-semibold">Semester IV Schedule</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/50 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                        ✝
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">Morning Chapel Service & Intercession</div>
                        <div className="text-stone-500">Grace Memorial Chapel • Speaker: Pr. Christopher</div>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-amber-900 bg-amber-100/80 px-2.5 py-1 rounded-lg">
                      08:00 – 09:00 AM
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold">
                        📖
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">Advanced Greek Exegesis of Romans</div>
                        <div className="text-stone-500">Hall B-102 • Dr. Grace Joshua</div>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-slate-700 bg-stone-200 px-2.5 py-1 rounded-lg">
                      09:15 – 11:00 AM
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center font-bold">
                        🌿
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">Pioneer Church Planting Dynamics</div>
                        <div className="text-stone-500">Seminar Hall 2 • Rev. Dr. Samuel Jayakumar</div>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-slate-700 bg-stone-200 px-2.5 py-1 rounded-lg">
                      11:15 AM – 01:00 PM
                    </span>
                  </div>
                </div>
              </div>

              {/* Recent Assignments status */}
              <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-sm">
                <h3 className="font-cinzel text-lg font-bold text-slate-900">
                  Course Assignment Tracking
                </h3>
                <div className="space-y-3">
                  {studentProfile.recentAssignments.map((asg, i) => (
                    <div key={i} className="p-4 rounded-2xl border border-stone-100 bg-stone-50 flex items-center justify-between text-xs">
                      <div>
                        <h4 className="font-bold text-slate-900">{asg.title}</h4>
                        <span className="text-stone-500">Due: {asg.dueDate}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {asg.score && (
                          <span className="font-mono font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg">
                            Score: {asg.score}
                          </span>
                        )}
                        <span
                          className={`font-bold px-2.5 py-1 rounded-lg ${
                            asg.status === 'Graded'
                              ? 'bg-emerald-50 text-emerald-800'
                              : asg.status === 'Submitted'
                              ? 'bg-blue-50 text-blue-800'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {asg.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Quick Notices & Resources */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <h3 className="font-cinzel text-base font-bold text-slate-900">Urgent Bulletins</h3>
                  <button
                    onClick={() => setActiveTab('notices')}
                    className="text-xs text-blue-900 font-bold hover:underline"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  {notices.slice(0, 3).map(n => (
                    <div key={n.id} className="p-3 rounded-xl bg-stone-50 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-stone-500">{n.category}</span>
                        <span className="text-[10px] text-stone-400">{n.date}</span>
                      </div>
                      <h4 className="font-bold text-slate-900">{n.title}</h4>
                      <p className="text-stone-600 line-clamp-2 text-[11px]">{n.content}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chapel Prayer Request shortcut */}
              <div className="bg-gradient-to-br from-blue-950 to-indigo-950 text-white p-6 rounded-3xl space-y-3">
                <h4 className="font-cinzel text-base font-bold text-amber-300">Chapel Intercessory Team</h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Need spiritual guidance or upholding in prayer? Submit prayer requests directly to the faculty chapel board.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SUB-TAB 2: REGISTERED SUBJECTS */}
        {activeTab === 'subjects' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-cinzel text-xl font-bold text-slate-900">Enrolled Theological Curriculum</h3>
              <p className="text-xs text-stone-500">
                Official subjects, assigned professors, credit weightings, and individual attendance records for your enrolled semester.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {studentProfile.enrolledSubjects.map((sub, i) => (
                <div key={i} className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-xl">
                      {sub.code}
                    </span>
                    <span className="text-xs font-bold text-blue-900 bg-blue-50 px-2.5 py-1 rounded-xl">
                      {sub.credits} Academic Credits
                    </span>
                  </div>

                  <div>
                    <h4 className="font-cinzel text-lg font-bold text-slate-900">{sub.name}</h4>
                    <p className="text-xs text-stone-500 mt-1">Instructor: <strong className="text-slate-800">{sub.faculty}</strong></p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 text-xs">
                    <div className="bg-stone-50 p-2.5 rounded-xl">
                      <span className="text-[10px] uppercase text-stone-400 font-bold block">Current Grade</span>
                      <span className="font-bold text-slate-900 text-sm">{sub.grade}</span>
                    </div>
                    <div className="bg-stone-50 p-2.5 rounded-xl">
                      <span className="text-[10px] uppercase text-stone-400 font-bold block">Attendance</span>
                      <span className="font-bold text-emerald-700 text-sm">{sub.attendance}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUB-TAB 3: STUDY MATERIALS */}
        {activeTab === 'materials' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-stone-200 p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={materialSearch}
                  onChange={e => setMaterialSearch(e.target.value)}
                  placeholder="Search lecture notes, syllabi, or author..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <select
                value={materialTypeFilter}
                onChange={e => setMaterialTypeFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-700 bg-white"
              >
                <option value="All">All Formats</option>
                <option value="PDF">PDF Documents</option>
                <option value="Syllabus">Course Syllabi</option>
                <option value="Lecture Notes">Lecture Notes</option>
                <option value="Handout">Handouts</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMaterials.map(m => (
                <div key={m.id} className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                        {m.courseCode}
                      </span>
                      <span className="text-stone-400 font-mono">{m.fileSize}</span>
                    </div>
                    <h4 className="font-cinzel text-base font-bold text-slate-900">{m.title}</h4>
                    <p className="text-xs text-stone-500">{m.subject} • {m.facultyName}</p>
                    <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">{m.description}</p>
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[10px] text-stone-400 font-medium">Updated {m.uploadedDate}</span>
                    <button
                      onClick={() =>
                        setActiveDocumentPreview({
                          title: m.title,
                          type: m.type,
                          content: m.description
                        })
                      }
                      className="px-3.5 py-1.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-amber-300 font-bold text-xs flex items-center space-x-1.5 transition-colors shadow"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Read / Download</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUB-TAB 4: ASSIGNMENTS & UPLOAD (STEP 4 & 7) */}
        {activeTab === 'assignments' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-sm">
              <h3 className="font-cinzel font-bold text-slate-900 text-lg flex items-center space-x-2">
                <UploadCloud className="w-5 h-5 text-blue-900" />
                <span>Submit Assignment Paper</span>
              </h3>

              <p className="text-xs text-stone-500">
                Upload your research paper, exegetical essay, or ministry log directly to the Supabase storage bucket.
              </p>

              {assignmentFeedback && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                  {assignmentFeedback}
                </div>
              )}

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Subject Assignment</label>
                  <select
                    value={assignmentTitle}
                    onChange={e => setAssignmentTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  >
                    <option value="">Select Target Assignment...</option>
                    <option value="Romans Exegetical Paper">Romans Exegetical Paper (Dr. Grace Joshua)</option>
                    <option value="Indian Theology Critique">Indian Theology Critique (Pr. Christopher)</option>
                    <option value="Missions Practicum Log">Weekend Village Outreach Log (Rev. Dr. Samuel Jayakumar)</option>
                  </select>
                </div>

                <div className="p-6 border-2 border-dashed border-stone-300 rounded-2xl text-center space-y-3 bg-stone-50">
                  <UploadCloud className={`w-8 h-8 mx-auto text-blue-900 ${isUploadingAssignment ? 'animate-bounce' : ''}`} />
                  <div>
                    <span className="font-bold text-slate-800 block text-xs">Choose PDF or DOCX File</span>
                    <span className="text-[10px] text-stone-400">Max size 25MB • Supabase Storage</span>
                  </div>
                  <label className="inline-block px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-amber-300 font-bold text-xs uppercase cursor-pointer shadow">
                    <span>{isUploadingAssignment ? 'Uploading...' : 'Browse Document'}</span>
                    <input
                      type="file"
                      accept=".pdf,.docx,.doc"
                      disabled={isUploadingAssignment}
                      onChange={handleAssignmentUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <h3 className="font-cinzel font-bold text-slate-900 text-lg">
                Pending & Graded Assignments
              </h3>
              <div className="space-y-3">
                {studentProfile.recentAssignments.map((asg, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-500 font-semibold">Due: {asg.dueDate}</span>
                      <span
                        className={`font-bold px-2.5 py-1 rounded-lg ${
                          asg.status === 'Graded'
                            ? 'bg-emerald-100 text-emerald-800'
                            : asg.status === 'Submitted'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {asg.status}
                      </span>
                    </div>
                    <h4 className="font-cinzel text-base font-bold text-slate-900">{asg.title}</h4>
                    {asg.score && (
                      <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-900 text-xs font-semibold flex items-center justify-between">
                        <span>Professor Feedback Grade</span>
                        <span className="font-bold">{asg.score}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUB-TAB 5: NOTICES */}
        {activeTab === 'notices' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <h3 className="font-cinzel text-xl font-bold text-slate-900">Official College Circulars</h3>
                <p className="text-xs text-stone-500">Notices published by Academic Dean, Examination Board, and Chapel Director.</p>
              </div>
              <select
                value={noticeCategory}
                onChange={e => setNoticeCategory(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs text-stone-700 bg-white"
              >
                <option value="All">All Categories</option>
                <option value="Academic">Academic</option>
                <option value="Chapel">Chapel</option>
                <option value="Examination">Examination</option>
                <option value="Hostel">Hostel</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredNotices.map(n => (
                <div key={n.id} className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg bg-stone-100 font-semibold text-[10px] text-stone-700 uppercase">
                      {n.category}
                    </span>
                    <span className="text-[11px] text-stone-400">{n.date}</span>
                  </div>
                  <h4 className="font-cinzel text-base font-bold text-slate-900">{n.title}</h4>
                  <p className="text-xs text-stone-600 leading-relaxed font-sans">{n.content}</p>
                  <div className="text-[10px] text-amber-800 font-semibold pt-1">
                    Issued by: {n.postedBy}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUB-TAB 6: FEE DETAILS & DIGITAL ID */}
        {activeTab === 'idcard' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Tuition Status */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <h3 className="font-cinzel text-lg font-bold text-slate-900">Academic Year Fee Breakdown</h3>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  Status: Fully Cleared
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50">
                  <span className="text-stone-600">Annual Tuition Fee (Subsidized)</span>
                  <span className="font-bold text-slate-900">₹36,000</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50">
                  <span className="text-stone-600">Library & Theological Research Fee</span>
                  <span className="font-bold text-slate-900">₹4,500</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50">
                  <span className="text-stone-600">Hostel & Mess Facility Maintenance</span>
                  <span className="font-bold text-slate-900">₹18,000</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 text-emerald-950 font-bold border border-emerald-100">
                  <span>Total Paid for 2025–2026</span>
                  <span>₹58,500</span>
                </div>
              </div>

              <p className="text-[11px] text-stone-500">
                Official institutional receipt voucher #ICBC-REC-8849 generated on 15 July 2025. Contact Accounts Office for duplicate receipt.
              </p>
            </div>

            {/* Official Digital Student ID Preview */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm text-center">
              <h3 className="font-cinzel text-lg font-bold text-slate-900">Official Virtual Student ID</h3>
              
              <div className="max-w-sm mx-auto bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-xl border-2 border-amber-500/50 space-y-4 text-left">
                <div className="flex items-center justify-between border-b border-white/20 pb-3">
                  <div>
                    <h5 className="font-cinzel font-extrabold text-sm tracking-wider text-amber-300">
                      IMAGE OF CHRIST BIBLE COLLEGE
                    </h5>
                    <span className="text-[10px] text-slate-300">Vellore, Tamil Nadu • Affiliated Campus</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center font-bold text-slate-950 text-xs">
                    ✝
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <img
                    src={studentProfile.avatar}
                    alt={studentProfile.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow"
                  />
                  <div>
                    <h4 className="font-cinzel font-bold text-base text-white">{studentProfile.name}</h4>
                    <p className="text-xs text-amber-300">{studentProfile.courseTitle}</p>
                    <span className="font-mono text-[11px] text-slate-300 block mt-0.5 font-bold">
                      ID: {studentProfile.regNo}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 text-[10px] text-slate-300 flex items-center justify-between">
                  <span>VALID: 2024–2027</span>
                  <span className="text-emerald-400 font-bold">BONAFIDE STUDENT</span>
                </div>
              </div>

              <button
                onClick={() => setShowIdCardModal(true)}
                className="px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-amber-300 font-bold text-xs uppercase tracking-wider shadow transition-colors inline-flex items-center space-x-2"
              >
                <Printer className="w-4 h-4" />
                <span>Open Printable Student ID Card</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: PRINTABLE STUDENT ID */}
      {showIdCardModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-cinzel text-lg font-bold text-slate-900">Institutional ID Badge</h3>
              <button
                onClick={() => setShowIdCardModal(false)}
                className="text-stone-400 hover:text-stone-600 font-bold text-base"
              >
                ✕
              </button>
            </div>

            <div className="bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-xl border-2 border-amber-500/50 space-y-4">
              <div className="flex items-center justify-between border-b border-white/20 pb-3">
                <div>
                  <h5 className="font-cinzel font-extrabold text-sm tracking-wider text-amber-300">
                    IMAGE OF CHRIST BIBLE COLLEGE
                  </h5>
                  <span className="text-[10px] text-slate-300">Katpadi Main Road, Vellore</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center font-bold text-slate-950 text-xs">
                  ✝
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <img
                  src={studentProfile.avatar}
                  alt={studentProfile.name}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-400 shadow"
                />
                <div className="space-y-1">
                  <h4 className="font-cinzel font-bold text-lg text-white">{studentProfile.name}</h4>
                  <p className="text-xs text-amber-300 font-semibold">{studentProfile.courseTitle}</p>
                  <span className="font-mono text-xs text-slate-200 block font-bold">
                    Reg: {studentProfile.regNo}
                  </span>
                  <span className="text-[10px] text-stone-300 block">Batch: {studentProfile.batch}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 text-[10px] text-slate-300 flex items-center justify-between">
                <span>Principal: Pr. Christopher</span>
                <span className="text-emerald-400 font-bold">ACTIVE BONAFIDE</span>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowIdCardModal(false)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-amber-300 text-xs font-bold uppercase tracking-wider shadow flex items-center space-x-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Badge</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
