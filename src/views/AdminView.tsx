import React, { useState, useEffect } from 'react';
import { useCollege } from '../context/CollegeContext';
import { ApplicationSubmission, UserRole, StorageBucket } from '../types';
import { LiquidCooledServerWidget } from '../components/LiquidCooledServerWidget';
import { useTheme } from '../context/ThemeContext';
import { useLiquidCooling } from '../context/LiquidCoolingContext';
import {
  DEFAULT_SUPABASE_KEY,
  DEFAULT_SUPABASE_SECRET,
  COMPLETE_SUPABASE_SCHEMA_SQL,
  ALL_STORAGE_BUCKETS
} from '../lib/supabase';
import {
  Shield,
  Lock,
  LogOut,
  Users,
  Bell,
  Calendar,
  BookOpen,
  MessageSquare,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Clock,
  Search,
  FileText,
  Database,
  RefreshCw,
  HardDrive,
  UploadCloud,
  Copy,
  Check,
  Eye,
  GraduationCap,
  Key,
  FolderOpen,
  Filter,
  CheckCircle,
  AlertCircle,
  Palette,
  Sun,
  Moon,
  Droplets,
  User,
  UserCheck,
  Mail
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const {
    activePage,
    setActivePage,
    loginMode,
    setLoginMode,
    applications,
    updateApplicationStatus,
    notices,
    addNotice,
    deleteNotice,
    events,
    addEvent,
    studyMaterials,
    addStudyMaterial,
    contactMessages,
    markMessageAnswered,
    studentsList,
    addStudent,
    updateStudent,
    subjectsList,
    addSubject,
    courses,
    faculty,
    currentUser,
    currentAuthRole,
    loginWithPin,
    loginWithAdminCredentials,
    loginWithSupabase,
    signUpWithSupabase,
    loginStudent,
    isStudentLoggedIn,
    studentProfile,
    authLoading,
    logout,
    uploadedFiles,
    uploadFileToStorage,
    supabaseStatus,
    updateSupabaseCredentials,
    syncWithSupabase,
    seedAllDataToSupabase
  } = useCollege();

  // Theme & Liquid Cooling Controls
  const { theme, setTheme, allThemes, isDark, toggleDarkLight, config: themeConfig } = useTheme();
  const { preset: coolantPreset, setPreset: setCoolantPreset, flowSpeed, setFlowSpeed, temperature, flowRate, pumpRpm } = useLiquidCooling();

  // Authentication State
  const [adminPin, setAdminPin] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [userIdentifier, setUserIdentifier] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userFullName, setUserFullName] = useState('');
  const [isUserSignUp, setIsUserSignUp] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (activePage === 'login-user') {
      setLoginMode('user');
      setAuthError(null);
    } else if (activePage === 'login-admin' || activePage === 'admin') {
      setLoginMode('admin');
      setAuthError(null);
    }
  }, [activePage, setLoginMode]);

  // Active Admin Sub-Tab
  const [adminTab, setAdminTab] = useState<
    | 'applications'
    | 'students'
    | 'faculty'
    | 'courses'
    | 'notices'
    | 'materials'
    | 'events'
    | 'storage'
    | 'supabase'
    | 'users'
    | 'messages'
    | 'themes'
  >('applications');

  // Action toast feedback banner
  const [actionFeedback, setActionFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setActionFeedback({ type, message });
    setTimeout(() => {
      setActionFeedback(null);
    }, 4500);
  };

  // Supabase Config form state
  const [inputUrl, setInputUrl] = useState(supabaseStatus.projectUrl || '');
  const [inputKey, setInputKey] = useState(supabaseStatus.publishableKey || DEFAULT_SUPABASE_KEY);
  const [testingSupabase, setTestingSupabase] = useState(false);
  const [seedingSupabase, setSeedingSupabase] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Filter & Inspection state
  const [appSearch, setAppSearch] = useState('');
  const [appCourseFilter, setAppCourseFilter] = useState('All');
  const [appStatusFilter, setAppStatusFilter] = useState('All');
  const [inspectedApp, setInspectedApp] = useState<ApplicationSubmission | null>(null);

  // Storage Uploader State
  const [selectedBucket, setSelectedBucket] = useState<StorageBucket>('study-materials');
  const [isUploading, setIsUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // New Student modal / state
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStdName, setNewStdName] = useState('');
  const [newStdEmail, setNewStdEmail] = useState('');
  const [newStdPhone, setNewStdPhone] = useState('');
  const [newStdCourse, setNewStdCourse] = useState('bth');
  const [newStdYear, setNewStdYear] = useState('Year 1 (Semester I)');

  // New Notice form
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeCategory, setNoticeCategory] = useState<'Academic' | 'Chapel' | 'Examination' | 'Admissions' | 'Hostel'>('Academic');
  const [noticeUrgent, setNoticeUrgent] = useState(false);
  const [noticeContent, setNoticeContent] = useState('');
  const [noticeAuthor, setNoticeAuthor] = useState('Registrar Office');

  // New Study Material form
  const [matTitle, setMatTitle] = useState('');
  const [matCourse, setMatCourse] = useState('B.Th');
  const [matSubject, setMatSubject] = useState('');
  const [matFaculty, setMatFaculty] = useState('Dr. Grace Joshua');
  const [matType, setMatType] = useState<'PDF' | 'Syllabus' | 'Lecture Notes' | 'Audio / Video' | 'Handout'>('PDF');
  const [matSize, setMatSize] = useState('2.5 MB');
  const [matDesc, setMatDesc] = useState('');

  // New Event form
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('9:30 AM – 4:00 PM');
  const [eventLocation, setEventLocation] = useState('Grace Memorial Chapel, Vellore');
  const [eventSpeaker, setEventSpeaker] = useState('');
  const [eventCategory, setEventCategory] = useState<'Conference' | 'Chapel' | 'Convocation' | 'Outreach' | 'Seminar'>('Seminar');
  const [eventDesc, setEventDesc] = useState('');

  // Check if authenticated as admin or super_admin
  const isAuthorized =
    currentUser && (currentUser.role === 'super_admin' || currentUser.role === 'admin' || currentUser.role === 'faculty');

  const handlePinLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (adminEmail.trim() && adminPass.trim()) {
      if (loginWithAdminCredentials(adminEmail, adminPass)) {
        showToast('success', 'Authenticated as College Administrator.');
        return;
      }
      const res = await loginWithSupabase(adminEmail.trim(), adminPass.trim());
      if (res.success) {
        showToast('success', 'Authenticated via Cloud Admin Account.');
        return;
      }
    }

    if (adminPin.trim() && loginWithPin(adminPin)) {
      showToast('success', 'Authenticated as College Administrator.');
      return;
    }

    if (adminPass.trim() && loginWithPin(adminPass)) {
      showToast('success', 'Authenticated as College Administrator.');
      return;
    }

    setAuthError('Invalid Admin credentials or PIN. Access restricted to authorized personnel.');
  };

  const handleUserLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (isUserSignUp) {
      if (!userFullName.trim() || !userIdentifier.trim() || !userPassword.trim()) {
        setAuthError('Please enter your full name, email address, and password.');
        return;
      }
      const res = await signUpWithSupabase(userIdentifier.trim(), userPassword.trim(), userFullName.trim(), 'student');
      if (res.success) {
        setActivePage('students-login');
        return;
      }
      // Register locally in student roster as fallback
      const regNo = `ICBC-2026-USR-${Math.floor(10 + Math.random() * 90)}`;
      await addStudent({
        id: `std-${Date.now()}`,
        regNo,
        name: userFullName.trim(),
        email: userIdentifier.trim(),
        phone: '+91 95004 23126',
        courseId: 'bth',
        courseTitle: 'Bachelor of Theology',
        currentYear: 'Year 1 (Semester I)',
        batch: 'Batch of 2026–2029',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        attendancePercent: 100,
        gpa: '4.0 / 4.0',
        enrolledSubjects: [],
        recentAssignments: []
      });
      loginStudent(regNo);
      setActivePage('students-login');
      return;
    }

    if (!userIdentifier.trim()) {
      setAuthError('Please enter your Email or Student Registration Number.');
      return;
    }

    if (userIdentifier.includes('@') && userPassword.trim()) {
      const res = await loginWithSupabase(userIdentifier.trim(), userPassword.trim());
      if (res.success) {
        setActivePage('students-login');
        return;
      }
    }

    const ok = loginStudent(userIdentifier.trim());
    if (ok) {
      setActivePage('students-login');
    } else {
      setAuthError('User account or Registration Number not found. Try e.g. ICBC-2024-M08 or create a new user account.');
    }
  };

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle || !noticeContent) {
      showToast('error', 'Please provide title and content for the notice.');
      return;
    }
    addNotice({
      title: noticeTitle,
      category: noticeCategory,
      isUrgent: noticeUrgent,
      content: noticeContent,
      postedBy: noticeAuthor
    });
    setNoticeTitle('');
    setNoticeContent('');
    showToast('success', 'Notice published successfully to public bulletin and notices table.');
  };

  const handleCreateMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matTitle || !matSubject) {
      showToast('error', 'Please provide a title and theological subject.');
      return;
    }
    addStudyMaterial({
      title: matTitle,
      courseCode: matCourse,
      courseName: matCourse === 'B.Th' ? 'Bachelor of Theology' : 'Master of Divinity',
      subject: matSubject,
      facultyName: matFaculty,
      type: matType,
      fileSize: matSize,
      description: matDesc || 'Official lecture course material.'
    });
    setMatTitle('');
    setMatSubject('');
    setMatDesc('');
    showToast('success', 'Study material notes registered and synced!');
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle || !eventDate) {
      showToast('error', 'Please provide event title and date.');
      return;
    }
    addEvent({
      title: eventTitle,
      date: eventDate,
      time: eventTime,
      location: eventLocation,
      speaker: eventSpeaker || 'Pr. Christopher',
      category: eventCategory,
      description: eventDesc || 'Special campus gathering for theological growth.',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
      registrationOpen: true
    });
    setEventTitle('');
    setEventDate('');
    setEventSpeaker('');
    setEventDesc('');
    showToast('success', 'Event successfully scheduled and published.');
  };

  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStdName || !newStdEmail) {
      showToast('error', 'Please enter student name and email.');
      return;
    }
    const randId = Math.floor(10 + Math.random() * 90);
    const regNo = `ICBC-2026-${newStdCourse.toUpperCase()}-${randId}`;
    const id = `std-${Date.now()}`;

    addStudent({
      id,
      regNo,
      name: newStdName,
      email: newStdEmail,
      phone: newStdPhone || '+91 98400 12345',
      courseId: newStdCourse,
      courseTitle: newStdCourse === 'bth' ? 'Bachelor of Theology' : 'Master of Divinity',
      currentYear: newStdYear,
      batch: 'Batch of 2026–2029',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      attendancePercent: 95.0,
      gpa: '3.80 / 4.0',
      enrolledSubjects: subjectsList.slice(0, 4).map(sub => ({
        code: sub.subjectCode,
        name: sub.subjectName,
        faculty: sub.facultyName,
        credits: sub.credits,
        grade: 'A',
        attendance: 95
      })),
      recentAssignments: []
    });

    setNewStdName('');
    setNewStdEmail('');
    setNewStdPhone('');
    setShowAddStudentModal(false);
    showToast('success', `Student registered with ID ${regNo} in database.`);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    setIsUploading(true);
    try {
      const res = await uploadFileToStorage(selectedBucket, file);
      if (res.url) {
        showToast('success', `Uploaded ${file.name} to bucket '${selectedBucket}'.`);
      } else {
        showToast('error', res.error || 'Failed to upload file.');
      }
    } catch (err: any) {
      showToast('error', err?.message || 'Upload error');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const filteredApplications = applications.filter(a => {
    const matchesQuery =
      a.fullName.toLowerCase().includes(appSearch.toLowerCase()) ||
      a.applicationNo.toLowerCase().includes(appSearch.toLowerCase()) ||
      a.email.toLowerCase().includes(appSearch.toLowerCase());
    const matchesCourse = appCourseFilter === 'All' || a.courseId === appCourseFilter;
    const matchesStatus = appStatusFilter === 'All' || a.status === appStatusFilter;
    return matchesQuery && matchesCourse && matchesStatus;
  });

  // If user selected 'login-user' or is not authorized as admin
  if (activePage === 'login-user' || !isAuthorized) {
    return (
      <div className="min-h-[78vh] flex items-center justify-center px-4 py-14 font-sans bg-[#faf8f5]">
        <div className="max-w-md w-full bg-white rounded-3xl border border-stone-200 shadow-2xl p-7 sm:p-9 space-y-6 text-center">
          {/* Mode Switcher Tabs: User Login | Admin Login */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setLoginMode('user');
                setActivePage('login-user');
                setAuthError(null);
              }}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                loginMode === 'user'
                  ? 'bg-[#0f2444] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>User Login</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setLoginMode('admin');
                setActivePage('login-admin');
                setAuthError(null);
              }}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                loginMode === 'admin'
                  ? 'bg-[#0f2444] text-amber-300 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Login</span>
            </button>
          </div>

          {loginMode === 'user' ? (
            <>
              <div className="w-15 h-15 rounded-2xl bg-gradient-to-br from-blue-900 to-indigo-950 text-amber-400 mx-auto flex items-center justify-center shadow-lg">
                <UserCheck className="w-8 h-8" />
              </div>

              <div className="space-y-1.5">
                <span className="text-xs uppercase tracking-widest text-amber-700 font-bold">
                  Student & User Portal
                </span>
                <h2 className="font-cinzel text-2xl font-bold text-slate-900">
                  {isUserSignUp ? 'Create User Account' : 'User Login'}
                </h2>
                <p className="text-xs text-stone-500">
                  {isUserSignUp
                    ? 'Register your account to access courses, study materials, and student services.'
                    : 'Sign in with your Email or Student Registration Number to access your portal.'}
                </p>
              </div>

              {authError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center space-x-2 text-left">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleUserLogin} className="space-y-4 text-left">
                {isUserSignUp && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={userFullName}
                      onChange={e => setUserFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-900 text-sm"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {isUserSignUp ? 'Email Address *' : 'Email or Registration No. *'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={userIdentifier}
                      onChange={e => setUserIdentifier(e.target.value)}
                      placeholder={isUserSignUp ? 'you@example.com' : 'e.g. ICBC-2024-M08 or email'}
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-900 text-sm pl-10"
                    />
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={userPassword}
                      onChange={e => setUserPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-900 text-sm pl-10"
                    />
                    <Key className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm tracking-wider uppercase transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <UserCheck className="w-4 h-4 text-amber-300" />
                  <span>{authLoading ? 'Please Wait...' : isUserSignUp ? 'Create User Account' : 'Sign In as User'}</span>
                </button>
              </form>

              <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-xs text-stone-600">
                <span>{isUserSignUp ? 'Already have an account?' : 'New student or user?'}</span>
                <button
                  type="button"
                  onClick={() => {
                    setIsUserSignUp(!isUserSignUp);
                    setAuthError(null);
                  }}
                  className="font-bold text-blue-900 hover:underline cursor-pointer"
                >
                  {isUserSignUp ? 'Back to User Login' : 'Create User Account'}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="w-15 h-15 rounded-2xl bg-gradient-to-br from-blue-900 to-indigo-950 text-amber-400 mx-auto flex items-center justify-center shadow-lg">
                <Shield className="w-8 h-8" />
              </div>

              <div className="space-y-1.5">
                <span className="text-xs uppercase tracking-widest text-amber-700 font-bold">
                  Secured Administrative Portal
                </span>
                <h2 className="font-cinzel text-2xl font-bold text-slate-900">
                  Admin Login
                </h2>
                <p className="text-xs text-stone-500">
                  Sign in with your Administrator Email & Password or College Admin PIN.
                </p>
              </div>

              {authError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center space-x-2 text-left">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handlePinLogin} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Admin Email (Optional if using PIN)
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={adminEmail}
                      onChange={e => setAdminEmail(e.target.value)}
                      placeholder="e.g. imageofchrist@gmail.com"
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-900 text-sm pl-10"
                    />
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Admin Password or Master PIN *
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={adminPin}
                      onChange={e => {
                        setAdminPin(e.target.value);
                        setAdminPass(e.target.value);
                      }}
                      placeholder="Enter Admin Password or PIN"
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-900 text-sm pl-10"
                    />
                    <Key className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-amber-300 font-bold text-sm tracking-wider uppercase transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Sign In as Admin</span>
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    );
  }

  // AUTHORIZED ADMIN PANEL
  return (
    <div className="space-y-8 pb-20 font-sans">
      {/* Toast Feedback */}
      {actionFeedback && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center space-x-3 text-sm font-semibold transition-all transform animate-in slide-in-from-bottom ${
            actionFeedback.type === 'success'
              ? 'bg-slate-900 text-emerald-400 border border-emerald-500/30'
              : 'bg-rose-900 text-rose-100 border border-rose-500/30'
          }`}
        >
          {actionFeedback.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400" />
          )}
          <span>{actionFeedback.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white py-10 border-b border-amber-600/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-3">
                <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
                  Administrative Control Panel
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  {currentUser?.role.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <h1 className="font-cinzel text-2xl sm:text-3xl font-extrabold tracking-tight">
                College Operations & Cloud DB Hub
              </h1>
              <p className="text-xs text-slate-300">
                Logged in as <strong className="text-white">{currentUser?.fullName}</strong> ({currentUser?.email})
              </p>
            </div>

            <div className="flex items-center space-x-3">
              {/* Database quick status pill */}
              <div
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center border ${
                  supabaseStatus.connected
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/40'
                    : 'bg-amber-950/80 text-amber-300 border-amber-600/40'
                }`}
              >
                <Database className="w-3.5 h-3.5 mr-1.5" />
                <span>{supabaseStatus.connected ? 'Supabase Connected' : 'Supabase Offline / Fallback'}</span>
              </div>

              <button
                onClick={() => logout()}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors border border-white/10"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-stone-200 scrollbar-none">
          <button
            onClick={() => setAdminTab('applications')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center whitespace-nowrap ${
              adminTab === 'applications'
                ? 'bg-blue-900 text-amber-300 shadow'
                : 'text-stone-600 hover:text-slate-900 hover:bg-stone-100'
            }`}
          >
            <Users className="w-3.5 h-3.5 mr-1.5" />
            <span>Admissions ({applications.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('students')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center whitespace-nowrap ${
              adminTab === 'students'
                ? 'bg-blue-900 text-amber-300 shadow'
                : 'text-stone-600 hover:text-slate-900 hover:bg-stone-100'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 mr-1.5" />
            <span>Students ({studentsList.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('faculty')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center whitespace-nowrap ${
              adminTab === 'faculty'
                ? 'bg-blue-900 text-amber-300 shadow'
                : 'text-stone-600 hover:text-slate-900 hover:bg-stone-100'
            }`}
          >
            <Shield className="w-3.5 h-3.5 mr-1.5" />
            <span>Faculty ({faculty.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('courses')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center whitespace-nowrap ${
              adminTab === 'courses'
                ? 'bg-blue-900 text-amber-300 shadow'
                : 'text-stone-600 hover:text-slate-900 hover:bg-stone-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 mr-1.5" />
            <span>Courses ({courses.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('notices')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center whitespace-nowrap ${
              adminTab === 'notices'
                ? 'bg-blue-900 text-amber-300 shadow'
                : 'text-stone-600 hover:text-slate-900 hover:bg-stone-100'
            }`}
          >
            <Bell className="w-3.5 h-3.5 mr-1.5" />
            <span>Notices ({notices.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('materials')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center whitespace-nowrap ${
              adminTab === 'materials'
                ? 'bg-blue-900 text-amber-300 shadow'
                : 'text-stone-600 hover:text-slate-900 hover:bg-stone-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5 mr-1.5" />
            <span>Study Notes ({studyMaterials.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('events')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center whitespace-nowrap ${
              adminTab === 'events'
                ? 'bg-blue-900 text-amber-300 shadow'
                : 'text-stone-600 hover:text-slate-900 hover:bg-stone-100'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 mr-1.5" />
            <span>Events ({events.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('storage')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center whitespace-nowrap ${
              adminTab === 'storage'
                ? 'bg-blue-900 text-amber-300 shadow'
                : 'text-stone-600 hover:text-slate-900 hover:bg-stone-100'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5 mr-1.5" />
            <span>Supabase Storage</span>
          </button>

          <button
            onClick={() => setAdminTab('supabase')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center whitespace-nowrap ${
              adminTab === 'supabase'
                ? 'bg-emerald-900 text-emerald-300 shadow'
                : 'text-emerald-800 hover:bg-emerald-50'
            }`}
          >
            <Database className="w-3.5 h-3.5 mr-1.5" />
            <span>Supabase DB & Setup</span>
          </button>

          <button
            onClick={() => setAdminTab('messages')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center whitespace-nowrap ${
              adminTab === 'messages'
                ? 'bg-blue-900 text-amber-300 shadow'
                : 'text-stone-600 hover:text-slate-900 hover:bg-stone-100'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
            <span>Inquiries ({contactMessages.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('themes')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center whitespace-nowrap ${
              adminTab === 'themes'
                ? 'bg-amber-500 text-slate-950 shadow font-extrabold ring-1 ring-amber-400'
                : 'text-stone-600 hover:text-slate-900 hover:bg-stone-100'
            }`}
          >
            <Palette className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
            <span>Theme & Styling Studio</span>
          </button>
        </div>

        {/* TAB 1: ADMISSIONS */}
        {adminTab === 'applications' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-2xl border border-stone-200 p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={appSearch}
                  onChange={e => setAppSearch(e.target.value)}
                  placeholder="Search by candidate name, reg no, or email..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <select
                  value={appCourseFilter}
                  onChange={e => setAppCourseFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-700 bg-white"
                >
                  <option value="All">All Courses</option>
                  <option value="bth">B.Th Candidates</option>
                  <option value="mdiv">M.Div Candidates</option>
                  <option value="cert">Certificate</option>
                </select>

                <select
                  value={appStatusFilter}
                  onChange={e => setAppStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-700 bg-white"
                >
                  <option value="All">All Statuses</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Interview Scheduled">Interview Scheduled</option>
                  <option value="Admitted">Admitted</option>
                  <option value="Pending Documents">Pending Documents</option>
                </select>
              </div>
            </div>

            {/* Application List */}
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 text-slate-700 font-bold uppercase tracking-wider border-b border-stone-200">
                    <tr>
                      <th className="px-5 py-3.5">App No</th>
                      <th className="px-5 py-3.5">Candidate Name</th>
                      <th className="px-5 py-3.5">Target Course</th>
                      <th className="px-5 py-3.5">Contact Details</th>
                      <th className="px-5 py-3.5">Status</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredApplications.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-5 py-12 text-center text-stone-400">
                          <FileText className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                          <p className="font-semibold text-slate-700 text-sm">No admission applications received yet.</p>
                          <p className="text-xs text-stone-400 mt-1">New applicant submissions from the Admissions Portal will appear here in real time.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredApplications.map(app => (
                        <tr key={app.id} className="hover:bg-stone-50/80 transition-colors">
                          <td className="px-5 py-4 font-mono font-bold text-blue-950">
                            {app.applicationNo}
                          </td>
                          <td className="px-5 py-4">
                            <div className="font-bold text-slate-900">{app.fullName}</div>
                            <div className="text-[11px] text-stone-500">{app.gender} • {app.homeChurch}</div>
                          </td>
                          <td className="px-5 py-4">
                            <span className="px-2.5 py-1 rounded-lg bg-stone-100 font-semibold uppercase text-stone-700">
                              {app.courseId}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-stone-600">
                            <div>{app.email}</div>
                            <div className="text-[11px] text-stone-400">{app.phone}</div>
                          </td>
                          <td className="px-5 py-4">
                            <select
                              value={app.status}
                              onChange={e => {
                                updateApplicationStatus(app.id, e.target.value as any);
                                showToast('success', `Status updated to ${e.target.value}`);
                              }}
                              className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${
                                app.status === 'Admitted'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : app.status === 'Interview Scheduled'
                                  ? 'bg-blue-50 text-blue-800 border-blue-200'
                                  : 'bg-amber-50 text-amber-800 border-amber-200'
                              }`}
                            >
                              <option value="Under Review">Under Review</option>
                              <option value="Interview Scheduled">Interview Scheduled</option>
                              <option value="Admitted">Admitted</option>
                              <option value="Pending Documents">Pending Documents</option>
                            </select>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <button
                              onClick={() => setInspectedApp(app)}
                              className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-slate-800 font-semibold text-[11px] inline-flex items-center space-x-1"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Dossier</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STUDENTS */}
        {adminTab === 'students' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-cinzel text-xl font-bold text-slate-900">Enrolled Student Roster</h3>
                <p className="text-xs text-stone-500">
                  Manage student profiles, GPA standings, attendance, and registry numbers in the <code>students</code> table.
                </p>
              </div>
              <button
                onClick={() => setShowAddStudentModal(true)}
                className="px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-amber-300 text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Add Student</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studentsList.map(std => (
                <div key={std.id} className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={std.avatar}
                      alt={std.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-500/40 shadow-sm"
                    />
                    <div>
                      <span className="font-mono text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-bold">
                        {std.regNo}
                      </span>
                      <h4 className="font-cinzel font-bold text-slate-900 text-base">{std.name}</h4>
                      <p className="text-xs text-stone-500">{std.courseTitle}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 text-xs">
                    <div className="bg-stone-50 p-2.5 rounded-xl">
                      <span className="text-[10px] uppercase text-stone-400 font-bold block">GPA Standing</span>
                      <span className="font-bold text-slate-900">{std.gpa}</span>
                    </div>
                    <div className="bg-stone-50 p-2.5 rounded-xl">
                      <span className="text-[10px] uppercase text-stone-400 font-bold block">Attendance</span>
                      <span className="font-bold text-emerald-700">{std.attendancePercent}%</span>
                    </div>
                  </div>

                  <div className="text-xs text-stone-600 space-y-1">
                    <div><strong>Email:</strong> {std.email}</div>
                    <div><strong>Batch:</strong> {std.batch}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: FACULTY */}
        {adminTab === 'faculty' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-cinzel text-xl font-bold text-slate-900">Theological Faculty Registry</h3>
              <p className="text-xs text-stone-500">
                Distinguished professors, deans, and ministry lecturers registered in the <code>faculty</code> table.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {faculty.map(f => (
                <div key={f.id} className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={f.photo}
                      alt={f.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-stone-200 shadow-sm"
                    />
                    <div>
                      <h4 className="font-cinzel font-bold text-slate-900 text-base">{f.name}</h4>
                      <p className="text-xs text-amber-800 font-semibold">{f.role}</p>
                      <p className="text-[11px] text-stone-500">{f.department}</p>
                    </div>
                  </div>

                  <div className="text-xs text-stone-600 space-y-1 pt-2 border-t border-stone-100">
                    <div><strong>Degrees:</strong> {f.degrees}</div>
                    <div><strong>Alma Mater:</strong> {f.almaMater}</div>
                    <div><strong>Experience:</strong> {f.yearsOfExperience} Years</div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {f.subjects.slice(0, 3).map((sub, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-stone-100 text-[10px] text-stone-600">
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: COURSES & CURRICULUM */}
        {adminTab === 'courses' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-cinzel text-xl font-bold text-slate-900">Academic Degree Programs & Subjects</h3>
              <p className="text-xs text-stone-500">
                Degree programs and subjects synced across the <code>courses</code> and <code>subjects</code> tables.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map(c => (
                <div key={c.id} className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold uppercase">
                      {c.level}
                    </span>
                    <span className="text-xs font-bold text-amber-800">{c.annualTuition}</span>
                  </div>
                  <div>
                    <h4 className="font-cinzel text-lg font-bold text-slate-900">{c.title}</h4>
                    <p className="text-xs text-stone-500">Duration: {c.duration} • Mode: {c.mode}</p>
                  </div>
                  <p className="text-xs text-stone-600 line-clamp-3">{c.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: NOTICES */}
        {adminTab === 'notices' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-sm">
              <h3 className="font-cinzel font-bold text-slate-900 text-lg flex items-center space-x-2">
                <Plus className="w-5 h-5 text-blue-900" />
                <span>Publish Notice</span>
              </h3>

              <form onSubmit={handleCreateNotice} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Notice Headline *</label>
                  <input
                    type="text"
                    required
                    value={noticeTitle}
                    onChange={e => setNoticeTitle(e.target.value)}
                    placeholder="e.g. Convocation 2026 Gown Fitting"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Category</label>
                  <select
                    value={noticeCategory}
                    onChange={e => setNoticeCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Chapel">Chapel</option>
                    <option value="Examination">Examination</option>
                    <option value="Admissions">Admissions</option>
                    <option value="Hostel">Hostel</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Content / Circular *</label>
                  <textarea
                    rows={4}
                    required
                    value={noticeContent}
                    onChange={e => setNoticeContent(e.target.value)}
                    placeholder="Full announcement details..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-900 font-sans"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="urgentNotice"
                    checked={noticeUrgent}
                    onChange={e => setNoticeUrgent(e.target.checked)}
                    className="rounded text-blue-900 focus:ring-blue-900"
                  />
                  <label htmlFor="urgentNotice" className="font-semibold text-rose-700">
                    Mark as Urgent Announcement (Flashing Banner)
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-amber-300 font-bold uppercase tracking-wider transition-colors shadow"
                >
                  Post Notice to Supabase
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <h3 className="font-cinzel font-bold text-slate-900 text-lg">Active College Notices ({notices.length})</h3>
              <div className="space-y-3">
                {notices.map(n => (
                  <div key={n.id} className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-2 relative">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {n.isUrgent && (
                          <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[10px]">
                            URGENT
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 text-[10px] font-semibold">
                          {n.category}
                        </span>
                        <span className="text-[11px] text-stone-400">{n.date}</span>
                      </div>
                      <button
                        onClick={() => {
                          deleteNotice(n.id);
                          showToast('success', 'Notice removed.');
                        }}
                        className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{n.title}</h4>
                    <p className="text-xs text-stone-600">{n.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: STUDY MATERIALS */}
        {adminTab === 'materials' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-sm">
              <h3 className="font-cinzel font-bold text-slate-900 text-lg flex items-center space-x-2">
                <Plus className="w-5 h-5 text-blue-900" />
                <span>Upload Study Notes</span>
              </h3>

              <form onSubmit={handleCreateMaterial} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Document Title *</label>
                  <input
                    type="text"
                    required
                    value={matTitle}
                    onChange={e => setMatTitle(e.target.value)}
                    placeholder="e.g. Romans Greek Exegesis Handbook"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Target Degree</label>
                  <select
                    value={matCourse}
                    onChange={e => setMatCourse(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  >
                    <option value="B.Th">Bachelor of Theology (B.Th)</option>
                    <option value="M.Div">Master of Divinity (M.Div)</option>
                    <option value="Certificate">Certificate in Biblical Studies</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Theological Subject *</label>
                  <input
                    type="text"
                    required
                    value={matSubject}
                    onChange={e => setMatSubject(e.target.value)}
                    placeholder="e.g. Biblical Greek, Systematic Theology"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Lecturer / Author</label>
                  <input
                    type="text"
                    value={matFaculty}
                    onChange={e => setMatFaculty(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-amber-300 font-bold uppercase tracking-wider transition-colors shadow"
                >
                  Save to Materials Table
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <h3 className="font-cinzel font-bold text-slate-900 text-lg">
                Uploaded Lecture Notes & Syllabi ({studyMaterials.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {studyMaterials.map(m => (
                  <div key={m.id} className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                        {m.courseCode}
                      </span>
                      <span className="text-stone-400">{m.uploadedDate}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{m.title}</h4>
                    <p className="text-xs text-stone-500">Subject: {m.subject} • {m.facultyName}</p>
                    <p className="text-xs text-stone-600 line-clamp-2">{m.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: EVENTS */}
        {adminTab === 'events' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-sm">
              <h3 className="font-cinzel font-bold text-slate-900 text-lg flex items-center space-x-2">
                <Plus className="w-5 h-5 text-blue-900" />
                <span>Schedule Event</span>
              </h3>

              <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Event Title *</label>
                  <input
                    type="text"
                    required
                    value={eventTitle}
                    onChange={e => setEventTitle(e.target.value)}
                    placeholder="e.g. Annual Mission & Church Growth Conference"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={e => setEventDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Keynote Speaker</label>
                  <input
                    type="text"
                    value={eventSpeaker}
                    onChange={e => setEventSpeaker(e.target.value)}
                    placeholder="e.g. Bishop Dr. Samuel John"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-amber-300 font-bold uppercase tracking-wider transition-colors shadow"
                >
                  Publish Event
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <h3 className="font-cinzel font-bold text-slate-900 text-lg">Upcoming College Programs ({events.length})</h3>
              <div className="space-y-3">
                {events.map(ev => (
                  <div key={ev.id} className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                        {ev.category}
                      </span>
                      <span className="text-stone-500 font-mono">{ev.date} • {ev.time}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-base">{ev.title}</h4>
                    <p className="text-xs text-stone-600">Location: {ev.location} | Speaker: {ev.speaker}</p>
                    <p className="text-xs text-stone-500">{ev.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: SUPABASE STORAGE MANAGER (STEP 4) */}
        {adminTab === 'storage' && (
          <div className="space-y-8">
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                    <HardDrive className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                      STEP 4: Storage for PDFs & Images
                    </span>
                    <h3 className="font-cinzel text-xl font-bold text-slate-900">
                      Supabase Cloud Storage Buckets
                    </h3>
                  </div>
                </div>
              </div>

              {/* Bucket Selection Grid */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Select Storage Bucket Target:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {ALL_STORAGE_BUCKETS.map(b => (
                    <button
                      key={b.id}
                      onClick={() => setSelectedBucket(b.id)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        selectedBucket === b.id
                          ? 'bg-blue-900 text-white border-blue-900 shadow-md ring-2 ring-amber-400'
                          : 'bg-stone-50 hover:bg-stone-100 text-slate-800 border-stone-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs uppercase">{b.name}</span>
                        <FolderOpen className={`w-4 h-4 ${selectedBucket === b.id ? 'text-amber-300' : 'text-stone-400'}`} />
                      </div>
                      <code className={`text-[10px] block mt-1 ${selectedBucket === b.id ? 'text-blue-200' : 'text-stone-500'}`}>
                        storage/{b.id}/
                      </code>
                      <p className={`text-[11px] mt-1.5 line-clamp-2 ${selectedBucket === b.id ? 'text-slate-200' : 'text-stone-600'}`}>
                        {b.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Drag and Drop Upload Area */}
              <div className="p-8 border-2 border-dashed border-stone-300 rounded-3xl text-center space-y-4 bg-stone-50/50 hover:bg-stone-50 transition-colors">
                <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-900 flex items-center justify-center mx-auto">
                  <UploadCloud className={`w-8 h-8 ${isUploading ? 'animate-bounce' : ''}`} />
                </div>
                <div>
                  <h4 className="font-cinzel text-lg font-bold text-slate-900">
                    Upload file to bucket: <code className="text-amber-800 font-mono font-bold">"{selectedBucket}"</code>
                  </h4>
                  <p className="text-xs text-stone-500 max-w-md mx-auto">
                    Select a PDF syllabus, faculty portrait, application document, or campus photo.
                  </p>
                </div>
                <div>
                  <label className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-amber-300 font-bold text-xs uppercase tracking-wider cursor-pointer shadow transition-all">
                    <span>{isUploading ? 'Uploading to Supabase...' : 'Browse Computer / Select File'}</span>
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Uploaded Files Table */}
              <div className="space-y-3">
                <h4 className="font-cinzel text-base font-bold text-slate-900">
                  Uploaded Assets ({uploadedFiles.length})
                </h4>
                <div className="divide-y divide-stone-100 rounded-2xl border border-stone-200 overflow-hidden bg-white text-xs">
                  {uploadedFiles.map((file, i) => (
                    <div key={i} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-50">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-blue-900 flex-shrink-0" />
                        <div>
                          <div className="font-bold text-slate-900">{file.name}</div>
                          <div className="text-[11px] text-stone-400">
                            Bucket: <code className="text-amber-800">{file.bucket}</code> • Size: {file.size} • {file.uploadedAt}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(file.url);
                            setCopiedUrl(file.url);
                            showToast('success', 'Public CDN URL copied to clipboard!');
                            setTimeout(() => setCopiedUrl(null), 2500);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-slate-800 font-semibold text-[11px] flex items-center space-x-1"
                        >
                          {copiedUrl === file.url ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedUrl === file.url ? 'Copied' : 'Copy Public URL'}</span>
                        </button>
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 font-semibold text-[11px] flex items-center space-x-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>View</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: SUPABASE DB & SETUP (STEP 2 & 5) */}
        {adminTab === 'supabase' && (
          <div className="space-y-8">
            {/* Live Cryogenic Liquid Cooled Database Engine & Server Visualizer */}
            <LiquidCooledServerWidget />

            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <Database className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                      STEP 2 & 5: Database Connection & Schema
                    </span>
                    <h3 className="font-cinzel text-xl font-bold text-slate-900">
                      Supabase PostgreSQL Connection & Seeding
                    </h3>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={async () => {
                      setSeedingSupabase(true);
                      const res = await seedAllDataToSupabase();
                      setSeedingSupabase(false);
                      if (res.success) {
                        showToast('success', res.message);
                      } else {
                        showToast('error', res.message);
                      }
                    }}
                    disabled={seedingSupabase}
                    className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold uppercase tracking-wider flex items-center shadow transition-colors disabled:opacity-50"
                  >
                    <Sparkles className={`w-3.5 h-3.5 mr-1.5 ${seedingSupabase ? 'animate-spin' : ''}`} />
                    <span>{seedingSupabase ? 'Seeding Tables...' : 'Seed Initial Data to Supabase'}</span>
                  </button>

                  <button
                    onClick={async () => {
                      setTestingSupabase(true);
                      await syncWithSupabase();
                      setTestingSupabase(false);
                      showToast('success', 'Tables refreshed from Supabase.');
                    }}
                    disabled={testingSupabase}
                    className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-800 text-xs font-semibold flex items-center transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${testingSupabase ? 'animate-spin' : ''}`} />
                    <span>{testingSupabase ? 'Testing Sync...' : 'Sync Tables Now'}</span>
                  </button>
                </div>
              </div>

              {/* Status Banner */}
              <div
                className={`p-4 rounded-2xl border flex items-start space-x-3 text-xs ${
                  supabaseStatus.connected
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                <div className="mt-0.5 font-bold text-base">
                  {supabaseStatus.connected ? '✓' : 'ℹ'}
                </div>
                <div className="space-y-1 flex-1">
                  <div className="font-bold flex items-center gap-2">
                    <span>
                      {supabaseStatus.connected
                        ? 'Connected to Supabase Project'
                        : 'Action Needed: Enter your Supabase Project URL below'}
                    </span>
                  </div>
                  <p className="text-stone-600">
                    {supabaseStatus.connected
                      ? `Project connected. Last synced at: ${supabaseStatus.lastSyncedAt || 'Just now'}. Real-time synchronization active.`
                      : 'Please paste your Supabase Project URL (e.g. https://xyzcompany.supabase.co) from your Supabase Dashboard.'}
                  </p>
                </div>
              </div>

              {/* Credentials Input */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Supabase Project URL *
                  </label>
                  <input
                    type="text"
                    value={inputUrl}
                    onChange={e => setInputUrl(e.target.value)}
                    placeholder="https://your-project-id.supabase.co"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Publishable Key (Anon Key)
                  </label>
                  <input
                    type="text"
                    value={inputKey}
                    onChange={e => setInputKey(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={async () => {
                    await updateSupabaseCredentials(inputUrl, inputKey);
                    showToast('success', 'Credentials saved and connection tested.');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow"
                >
                  Save & Connect Supabase
                </button>
              </div>

              {/* What Gets Created in Supabase Summary */}
              <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 space-y-5 border border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-cinzel text-base font-bold text-emerald-300">
                      Everything Included in the Supabase Setup Script
                    </h4>
                    <p className="text-xs text-slate-300">
                      Running this single SQL script creates and seeds everything necessary in your Supabase project.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-1.5">
                    <div className="font-bold text-amber-300 flex items-center gap-1.5">
                      <HardDrive className="w-4 h-4" />
                      <span>6 Storage Buckets</span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      student-photos, faculty-photos, study-materials, certificates, gallery, college-documents.
                    </p>
                  </div>

                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-1.5">
                    <div className="font-bold text-blue-300 flex items-center gap-1.5">
                      <Database className="w-4 h-4" />
                      <span>10 Database Tables</span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      courses, faculty, students, subjects, admissions, notices, events, study_materials, gallery, users.
                    </p>
                  </div>

                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-1.5">
                    <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                      <Shield className="w-4 h-4" />
                      <span>Security & Policies</span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Row Level Security (RLS) configured with public read access and application submission policies.
                    </p>
                  </div>

                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-1.5">
                    <div className="font-bold text-purple-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      <span>Pre-Populated Data</span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Instant seeding of B.Th/M.Div courses, professors, registered students, and study lecture notes.
                    </p>
                  </div>
                </div>

                {/* 3 Step Action Guide */}
                <div className="p-4 bg-emerald-950/60 rounded-2xl border border-emerald-500/30 space-y-2 text-xs">
                  <span className="font-bold text-emerald-300 uppercase tracking-wider block">
                    How to Create Everything in Your Supabase Project (3 Easy Steps):
                  </span>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-200 text-[11px]">
                    <li>
                      Click the <strong className="text-amber-300">"Copy Complete SQL Schema"</strong> button below.
                    </li>
                    <li>
                      Go to your{' '}
                      <a
                        href="https://supabase.com/dashboard"
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-400 underline font-bold"
                      >
                        Supabase Dashboard
                      </a>{' '}
                      &rarr; Click <strong>SQL Editor</strong> on the left menu &rarr; Click <strong>New Query</strong>.
                    </li>
                    <li>
                      Paste the code into the editor and click the green <strong className="text-emerald-300">Run</strong> button.
                    </li>
                  </ol>
                </div>
              </div>

              {/* Ready-to-Run SQL Schema Section */}
              <div className="pt-6 border-t border-stone-100 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-cinzel text-base font-bold text-slate-900">
                      Complete Setup SQL Script
                    </h4>
                    <p className="text-xs text-stone-500">
                      Pre-written with all table definitions, storage buckets, RLS policies, and seed rows.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(COMPLETE_SUPABASE_SCHEMA_SQL);
                      setCopiedSql(true);
                      showToast('success', 'Complete SQL schema copied to clipboard!');
                      setTimeout(() => setCopiedSql(false), 3000);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs flex items-center space-x-1.5 shadow"
                  >
                    {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy Complete SQL Schema'}</span>
                  </button>
                </div>

                <div className="bg-slate-950 rounded-2xl p-4 text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-64 border border-slate-800">
                  <pre>{COMPLETE_SUPABASE_SCHEMA_SQL}</pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 10: INQUIRIES & PRAYER REQUESTS */}
        {adminTab === 'messages' && (
          <div className="space-y-4">
            <h3 className="font-cinzel font-bold text-slate-900 text-lg">
              Campus Contact & Prayer Messages ({contactMessages.length})
            </h3>
            <div className="space-y-3">
              {contactMessages.length === 0 ? (
                <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-400 space-y-2 shadow-sm">
                  <MessageSquare className="w-8 h-8 text-stone-300 mx-auto mb-1" />
                  <p className="font-semibold text-slate-700 text-sm">No incoming inquiries or messages yet.</p>
                  <p className="text-xs text-stone-400">Public messages submitted via the Contact Us page or Prayer Petitions will appear here.</p>
                </div>
              ) : (
                contactMessages.map(msg => (
                  <div key={msg.id} className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {msg.isPrayerRequest && (
                          <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold">
                            Prayer Request
                          </span>
                        )}
                        <span className="font-bold text-slate-900 text-xs">{msg.name}</span>
                        <span className="text-stone-400 text-xs">({msg.email} | {msg.phone})</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] text-stone-500">{msg.date}</span>
                        <button
                          onClick={() => {
                            markMessageAnswered(msg.id);
                            showToast('success', 'Message marked as prayed/answered.');
                          }}
                          className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-colors ${
                            msg.status === 'Prayed / Answered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-stone-200 hover:bg-stone-300 text-stone-700'
                          }`}
                        >
                          {msg.status}
                        </button>
                      </div>
                    </div>

                    <h5 className="font-semibold text-xs text-slate-800">{msg.subject}</h5>
                    <p className="text-xs text-stone-600 leading-relaxed font-sans">{msg.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 11: APPEARANCE & THEMES STUDIO */}
        {adminTab === 'themes' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Studio Header Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-700 border border-amber-400/30">
                      Visual Identity & Palettes
                    </span>
                    <span className="text-xs text-stone-400">·</span>
                    <span className="text-xs font-semibold text-slate-700">
                      Current: <strong className="text-amber-600">{themeConfig.name}</strong>
                    </span>
                  </div>
                  <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-slate-900">
                    Theme & Visual Styling Studio
                  </h3>
                  <p className="text-xs text-stone-500 max-w-2xl leading-relaxed">
                    Switch between {allThemes.length} curated institutional palettes designed for Image of Christ Bible College. Changes apply instantly across all pages and synchronize seamlessly with the liquid cooling engine.
                  </p>
                </div>

                {/* Dark/Light Quick Toggle */}
                <div className="flex items-center space-x-3 shrink-0">
                  <button
                    onClick={() => {
                      toggleDarkLight();
                      showToast('success', `Switched to ${!isDark ? 'Midnight Dark' : 'Pure Collegiate Light'} mode.`);
                    }}
                    className="px-4 py-2.5 rounded-xl border border-stone-300 hover:border-amber-500 text-xs font-bold uppercase tracking-wider flex items-center space-x-2 bg-stone-50 hover:bg-stone-100 transition-all shadow-sm"
                  >
                    {isDark ? (
                      <>
                        <Sun className="w-4 h-4 text-amber-500" />
                        <span>Switch to Light Mode</span>
                      </>
                    ) : (
                      <>
                        <Moon className="w-4 h-4 text-slate-700" />
                        <span>Switch to Dark Mode</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Curated Themes Grid */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Available Institutional Palettes ({allThemes.length} Presets)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {allThemes.map((item) => {
                  const isCurrent = item.id === theme;
                  return (
                    <div
                      key={item.id}
                      className={`rounded-3xl p-6 border transition-all space-y-4 relative overflow-hidden flex flex-col justify-between ${
                        isCurrent
                          ? 'bg-slate-900 text-white border-amber-500 shadow-xl ring-2 ring-amber-500/30'
                          : 'bg-white hover:bg-stone-50 text-slate-900 border-stone-200 shadow-sm'
                      }`}
                    >
                      {/* Top preview swatch */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2.5">
                            <div
                              className="w-9 h-9 rounded-xl border-2 flex items-center justify-center shadow-inner relative overflow-hidden shrink-0"
                              style={{
                                backgroundColor: item.previewBg,
                                borderColor: item.previewBorder
                              }}
                            >
                              <span
                                className="w-3.5 h-3.5 rounded-full shadow"
                                style={{ backgroundColor: item.accentColor }}
                              />
                            </div>
                            <div>
                              <h5 className="font-bold text-sm leading-tight flex items-center gap-1.5">
                                {item.name}
                                {item.id === 'cryo-cyan' && (
                                  <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                                )}
                              </h5>
                              <span className="text-[10px] uppercase font-mono opacity-60">
                                {item.isDark ? 'Dark Mode' : 'Light Mode'} · {item.accentColor}
                              </span>
                            </div>
                          </div>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500 text-slate-950">
                              Active
                            </span>
                          )}
                        </div>

                        <p className={`text-xs leading-relaxed ${isCurrent ? 'text-slate-300' : 'text-stone-600'}`}>
                          {item.description}
                        </p>
                      </div>

                      {/* Action button */}
                      <button
                        onClick={() => {
                          setTheme(item.id);
                          if (item.id === 'pure-light') setCoolantPreset('living-water');
                          if (item.id === 'cryo-cyan') setCoolantPreset('cyan');
                          if (item.id === 'emerald-eden') setCoolantPreset('emerald');
                          if (item.id === 'midnight-regal') setCoolantPreset('gold');
                          if (item.id === 'heritage-light') setCoolantPreset('living-water');
                          if (item.id === 'crimson-theology') setCoolantPreset('gold');
                          showToast('success', `Theme switched to "${item.name}".`);
                        }}
                        disabled={isCurrent}
                        className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5 ${
                          isCurrent
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 cursor-default'
                            : 'bg-slate-900 hover:bg-slate-800 text-white shadow hover:shadow-md'
                        }`}
                      >
                        {isCurrent ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-amber-400" />
                            <span>Currently Applied</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            <span>Apply This Theme</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Liquid Cooling Coordination Panel */}
            <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-cyan-500/30 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Droplets className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                      Liquid Cooling Harmonizer
                    </span>
                  </div>
                  <h4 className="font-cinzel text-lg sm:text-xl font-bold">
                    Fluid Caustics & Coolant Calibration
                  </h4>
                  <p className="text-xs text-slate-400">
                    Fine-tune coolant color streams, circulation velocity, and cooling engine telemetry.
                  </p>
                </div>

                <div className="flex items-center space-x-4 bg-slate-900/90 border border-slate-800 px-4 py-2 rounded-2xl text-xs font-mono">
                  <div className="text-center">
                    <div className="text-[10px] text-slate-400 uppercase">Temp</div>
                    <div className="text-cyan-300 font-bold text-sm">{temperature}°C</div>
                  </div>
                  <div className="w-px h-6 bg-slate-800"></div>
                  <div className="text-center">
                    <div className="text-[10px] text-slate-400 uppercase">Flow</div>
                    <div className="text-emerald-400 font-bold text-sm">{flowRate} L/m</div>
                  </div>
                  <div className="w-px h-6 bg-slate-800"></div>
                  <div className="text-center">
                    <div className="text-[10px] text-slate-400 uppercase">Pump</div>
                    <div className="text-amber-400 font-bold text-sm">{pumpRpm} RPM</div>
                  </div>
                </div>
              </div>

              {/* Coolant color presets & flow rate */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="space-y-2">
                  <label className="block text-slate-300 font-bold uppercase tracking-wider">
                    Coolant Color Stream Preset:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'cyan', name: 'Cryo Cyan Flow', color: '#06b6d4' },
                      { id: 'living-water', name: 'Living Water Azure', color: '#3b82f6' },
                      { id: 'emerald', name: 'Emerald Coolant', color: '#10b981' },
                      { id: 'gold', name: 'Golden Anointing', color: '#f59e0b' }
                    ].map((cp) => (
                      <button
                        key={cp.id}
                        onClick={() => {
                          setCoolantPreset(cp.id as any);
                          showToast('success', `Coolant fluid stream changed to ${cp.name}.`);
                        }}
                        className={`p-2.5 rounded-xl border flex items-center space-x-2 transition-all ${
                          coolantPreset === cp.id
                            ? 'bg-slate-800 border-cyan-400 text-white font-bold ring-1 ring-cyan-400/40'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: cp.color }}
                        />
                        <span className="truncate">{cp.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-slate-300 font-bold uppercase tracking-wider">
                    Circulation Velocity (Flow Speed):
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'calm', label: 'Calm Flow', desc: 'Subtle wave drift' },
                      { id: 'normal', label: 'Normal Flow', desc: 'Balanced 60 FPS' },
                      { id: 'turbo', label: 'Chill Turbo', desc: 'High circulation' }
                    ].map((sp) => (
                      <button
                        key={sp.id}
                        onClick={() => {
                          setFlowSpeed(sp.id as any);
                          showToast('success', `Liquid cooling velocity set to ${sp.label}.`);
                        }}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          flowSpeed === sp.id
                            ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 font-bold'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="font-semibold">{sp.label}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{sp.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Design Tokens & CSS Variables Inspector */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                Design Architecture & Typography Pairings
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Headings & Crest</span>
                  <div className="font-cinzel text-lg font-bold text-slate-900">Cinzel</div>
                  <p className="text-[11px] text-stone-500">Classical epigraphic serif inspired by ancient Roman inscriptions.</p>
                </div>
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Scripture & Devotional</span>
                  <div className="font-cormorant text-lg italic font-semibold text-slate-900">Cormorant Garamond</div>
                  <p className="text-[11px] text-stone-500">Refined literary serif with high contrast for biblical passages.</p>
                </div>
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Body & UI Sans</span>
                  <div className="font-sans text-lg font-bold text-slate-900">Plus Jakarta Sans</div>
                  <p className="text-[11px] text-stone-500">Geometric clean neo-grotesque optimized for dense academic reading.</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* MODAL: ADD STUDENT */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-cinzel text-xl font-bold text-slate-900">Register New Student</h3>
              <button
                onClick={() => setShowAddStudentModal(false)}
                className="text-stone-400 hover:text-stone-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStudentSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={newStdName}
                  onChange={e => setNewStdName(e.target.value)}
                  placeholder="e.g. Stephen Paul"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Student Email *</label>
                <input
                  type="email"
                  required
                  value={newStdEmail}
                  onChange={e => setNewStdEmail(e.target.value)}
                  placeholder="e.g. stephen.paul@student.icbc.ac.in"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={newStdPhone}
                  onChange={e => setNewStdPhone(e.target.value)}
                  placeholder="+91 98400 12345"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Enrolled Degree</label>
                  <select
                    value={newStdCourse}
                    onChange={e => setNewStdCourse(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  >
                    <option value="bth">Bachelor of Theology (B.Th)</option>
                    <option value="mdiv">Master of Divinity (M.Div)</option>
                    <option value="cert">Certificate (CBS)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Current Year</label>
                  <input
                    type="text"
                    value={newStdYear}
                    onChange={e => setNewStdYear(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-amber-300 font-bold uppercase tracking-wider shadow"
                >
                  Save Student to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: INSPECT APPLICATION */}
      {inspectedApp && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <span className="font-mono text-xs text-amber-800 font-bold">{inspectedApp.applicationNo}</span>
                <h3 className="font-cinzel text-xl font-bold text-slate-900">{inspectedApp.fullName}</h3>
              </div>
              <button
                onClick={() => setInspectedApp(null)}
                className="text-stone-400 hover:text-stone-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-stone-50 p-4 rounded-2xl">
                <div><strong>Email:</strong> {inspectedApp.email}</div>
                <div><strong>Phone:</strong> {inspectedApp.phone}</div>
                <div><strong>Date of Birth:</strong> {inspectedApp.dateOfBirth}</div>
                <div><strong>Gender:</strong> {inspectedApp.gender}</div>
                <div><strong>Course:</strong> <span className="uppercase font-bold text-blue-950">{inspectedApp.courseId}</span></div>
                <div><strong>Education:</strong> {inspectedApp.previousEducation}</div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-1">Local Church & Pastoral Reference</h4>
                <div className="bg-stone-50 p-4 rounded-2xl space-y-1">
                  <div><strong>Home Church:</strong> {inspectedApp.homeChurch}</div>
                  <div><strong>Pastor:</strong> {inspectedApp.pastorName} ({inspectedApp.pastorPhone})</div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-1">Spiritual Testimony & Calling</h4>
                <div className="bg-amber-50/60 border border-amber-200/50 p-4 rounded-2xl text-stone-700 leading-relaxed italic">
                  “{inspectedApp.personalTestimony}”
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-1">Update Status</h4>
                <div className="flex flex-wrap gap-2">
                  {['Under Review', 'Interview Scheduled', 'Admitted', 'Pending Documents'].map(st => (
                    <button
                      key={st}
                      onClick={() => {
                        updateApplicationStatus(inspectedApp.id, st as any);
                        setInspectedApp(prev => (prev ? { ...prev, status: st as any } : null));
                        showToast('success', `Application status changed to ${st}`);
                      }}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                        inspectedApp.status === st
                          ? 'bg-blue-900 text-amber-300 shadow'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
