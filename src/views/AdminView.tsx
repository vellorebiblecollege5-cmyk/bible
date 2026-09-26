import React, { useState, useEffect } from 'react';
import { useCollege } from '../context/CollegeContext';
import {
  ApplicationSubmission,
  UserRole,
  StorageBucket,
  StudentProfile,
  FacultyMember,
  Course,
  SubjectItem,
  Notice,
  StudyMaterial,
  EventItem,
  GalleryPhoto,
  DownloadDoc,
  ContactMessage
} from '../types';
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
  Edit3,
  Image as ImageIcon,
  Download,
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
    submitApplication,
    updateApplication,
    updateApplicationStatus,
    deleteApplication,
    notices,
    addNotice,
    updateNotice,
    deleteNotice,
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    studyMaterials,
    addStudyMaterial,
    updateStudyMaterial,
    deleteStudyMaterial,
    gallery,
    addGalleryPhoto,
    updateGalleryPhoto,
    deleteGalleryPhoto,
    downloads,
    addDownload,
    updateDownload,
    deleteDownload,
    contactMessages,
    submitContactMessage,
    updateContactMessage,
    deleteContactMessage,
    markMessageAnswered,
    studentsList,
    addStudent,
    updateStudent,
    deleteStudent,
    subjectsList,
    addSubject,
    updateSubject,
    deleteSubject,
    courses,
    addCourse,
    updateCourse,
    deleteCourse,
    faculty,
    addFaculty,
    updateFaculty,
    deleteFaculty,
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
    addUploadedFileManual,
    updateUploadedFile,
    deleteUploadedFile,
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
    | 'gallery'
    | 'downloads'
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

  // Filter & Inspection state (Admissions)
  const [appSearch, setAppSearch] = useState('');
  const [appCourseFilter, setAppCourseFilter] = useState('All');
  const [appStatusFilter, setAppStatusFilter] = useState('All');
  const [inspectedApp, setInspectedApp] = useState<ApplicationSubmission | null>(null);
  const [showAppModal, setShowAppModal] = useState(false);
  const [editingAppId, setEditingAppId] = useState<string | null>(null);
  const [appFormName, setAppFormName] = useState('');
  const [appFormEmail, setAppFormEmail] = useState('');
  const [appFormPhone, setAppFormPhone] = useState('');
  const [appFormDob, setAppFormDob] = useState('');
  const [appFormGender, setAppFormGender] = useState('Male');
  const [appFormCourseId, setAppFormCourseId] = useState('bth');
  const [appFormEducation, setAppFormEducation] = useState('');
  const [appFormChurch, setAppFormChurch] = useState('');
  const [appFormPastor, setAppFormPastor] = useState('');
  const [appFormPastorPhone, setAppFormPastorPhone] = useState('');
  const [appFormTestimony, setAppFormTestimony] = useState('');
  const [appFormCalling, setAppFormCalling] = useState('');
  const [appFormStatus, setAppFormStatus] = useState<ApplicationSubmission['status']>('Under Review');

  // Storage Uploader State
  const [selectedBucket, setSelectedBucket] = useState<StorageBucket>('study-materials');
  const [isUploading, setIsUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [editingFileIndex, setEditingFileIndex] = useState<number | null>(null);
  const [fileFormName, setFileFormName] = useState('');
  const [fileFormUrl, setFileFormUrl] = useState('');
  const [fileFormSize, setFileFormSize] = useState('1.2 MB');
  const [showAddFileModal, setShowAddFileModal] = useState(false);

  // Student modal / state (Add & Edit)
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [newStdRegNo, setNewStdRegNo] = useState('');
  const [newStdName, setNewStdName] = useState('');
  const [newStdEmail, setNewStdEmail] = useState('');
  const [newStdPhone, setNewStdPhone] = useState('');
  const [newStdCourse, setNewStdCourse] = useState('bth');
  const [newStdYear, setNewStdYear] = useState('Year 1 (Semester I)');
  const [newStdBatch, setNewStdBatch] = useState('Batch of 2026–2029');
  const [newStdGpa, setNewStdGpa] = useState('3.80 / 4.0');
  const [newStdAttendance, setNewStdAttendance] = useState(95);
  const [newStdAvatar, setNewStdAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80');

  // Faculty modal / state (Add & Edit)
  const [showFacultyModal, setShowFacultyModal] = useState(false);
  const [editingFacultyId, setEditingFacultyId] = useState<string | null>(null);
  const [facName, setFacName] = useState('');
  const [facRole, setFacRole] = useState('Professor of Theology');
  const [facDept, setFacDept] = useState('Department of Biblical & Theological Studies');
  const [facDegrees, setFacDegrees] = useState('M.Div., M.Th.');
  const [facAlmaMater, setFacAlmaMater] = useState('Senate of Serampore / ATA');
  const [facExp, setFacExp] = useState(10);
  const [facSubjects, setFacSubjects] = useState('Systematic Theology, Homiletics');
  const [facBio, setFacBio] = useState('');
  const [facQuote, setFacQuote] = useState('');
  const [facPhoto, setFacPhoto] = useState('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80');

  // Course modal / state (Add & Edit)
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [crsCode, setCrsCode] = useState('');
  const [crsTitle, setCrsTitle] = useState('');
  const [crsLevel, setCrsLevel] = useState<Course['level']>('Bachelor');
  const [crsDuration, setCrsDuration] = useState('3 Years');
  const [crsMode, setCrsMode] = useState<Course['mode']>('Residential & Day Scholar');
  const [crsLanguage, setCrsLanguage] = useState('English & Tamil');
  const [crsCredits, setCrsCredits] = useState(96);
  const [crsTuition, setCrsTuition] = useState('₹18,000 / Year (Scholarship Available)');
  const [crsEligibility, setCrsEligibility] = useState('10+2 / Higher Secondary Pass');
  const [crsDesc, setCrsDesc] = useState('');

  // Subject modal / state (Add & Edit)
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  const [subCode, setSubCode] = useState('');
  const [subName, setSubName] = useState('');
  const [subCourseId, setSubCourseId] = useState('bth');
  const [subCredits, setSubCredits] = useState(4);
  const [subSemester, setSubSemester] = useState('Year 1 - Sem I');
  const [subFaculty, setSubFaculty] = useState('Pr. Christopher');

  // Notice form (Add & Edit)
  const [editingNoticeId, setEditingNoticeId] = useState<string | null>(null);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeCategory, setNoticeCategory] = useState<'Academic' | 'Chapel' | 'Examination' | 'Admissions' | 'Hostel'>('Academic');
  const [noticeUrgent, setNoticeUrgent] = useState(false);
  const [noticeContent, setNoticeContent] = useState('');
  const [noticeAuthor, setNoticeAuthor] = useState('Registrar Office');

  // Study Material form (Add & Edit)
  const [editingMatId, setEditingMatId] = useState<string | null>(null);
  const [matTitle, setMatTitle] = useState('');
  const [matCourse, setMatCourse] = useState('B.Th');
  const [matSubject, setMatSubject] = useState('');
  const [matFaculty, setMatFaculty] = useState('Pr. Christopher');
  const [matType, setMatType] = useState<'PDF' | 'Syllabus' | 'Lecture Notes' | 'Audio / Video' | 'Handout'>('PDF');
  const [matSize, setMatSize] = useState('2.5 MB');
  const [matDesc, setMatDesc] = useState('');
  const [matUrl, setMatUrl] = useState('');

  // Event form (Add & Edit)
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('9:30 AM – 4:00 PM');
  const [eventLocation, setEventLocation] = useState('Grace Memorial Chapel, Vellore');
  const [eventSpeaker, setEventSpeaker] = useState('');
  const [eventCategory, setEventCategory] = useState<'Conference' | 'Chapel' | 'Convocation' | 'Outreach' | 'Seminar'>('Seminar');
  const [eventDesc, setEventDesc] = useState('');
  const [eventImage, setEventImage] = useState('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80');

  // Gallery form (Add & Edit)
  const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null);
  const [autoCreatedGalleryId, setAutoCreatedGalleryId] = useState<string | null>(null);
  const [galTitle, setGalTitle] = useState('');
  const [galCategory, setGalCategory] = useState<GalleryPhoto['category']>('Campus');
  const [galImage, setGalImage] = useState('');
  const [galCaption, setGalCaption] = useState('');

  // Downloads form (Add & Edit)
  const [editingDownloadId, setEditingDownloadId] = useState<string | null>(null);
  const [dlTitle, setDlTitle] = useState('');
  const [dlCategory, setDlCategory] = useState<DownloadDoc['category']>('Forms');
  const [dlFormat, setDlFormat] = useState<DownloadDoc['format']>('PDF');
  const [dlSize, setDlSize] = useState('1.4 MB');
  const [dlDesc, setDlDesc] = useState('');

  // Inquiries / Messages modal (Add & Edit)
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [editingMsgId, setEditingMsgId] = useState<string | null>(null);
  const [msgName, setMsgName] = useState('');
  const [msgEmail, setMsgEmail] = useState('');
  const [msgPhone, setMsgPhone] = useState('');
  const [msgSubject, setMsgSubject] = useState('');
  const [msgContent, setMsgContent] = useState('');
  const [msgIsPrayer, setMsgIsPrayer] = useState(false);
  const [msgStatus, setMsgStatus] = useState<'New' | 'Prayed / Answered'>('New');

  // Check if authenticated as admin or super_admin
  const isAuthorized =
    currentUser && (currentUser.role === 'super_admin' || currentUser.role === 'admin' || currentUser.role === 'faculty');

  const handlePinLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (adminPin.trim() && loginWithPin(adminPin)) {
      setActivePage('admin');
      showToast('success', 'Authenticated as College Administrator.');
      return;
    }

    if (adminPass.trim() && loginWithPin(adminPass)) {
      setActivePage('admin');
      showToast('success', 'Authenticated as College Administrator.');
      return;
    }

    if (adminEmail.trim() && adminPass.trim()) {
      if (loginWithAdminCredentials(adminEmail, adminPass)) {
        setActivePage('admin');
        showToast('success', 'Authenticated as College Administrator.');
        return;
      }
      const res = await loginWithSupabase(adminEmail.trim(), adminPass.trim());
      if (res.success) {
        setActivePage('admin');
        showToast('success', 'Authenticated via Cloud Admin Account.');
        return;
      }
    }

    setAuthError('Invalid Admin credentials or Master PIN. Access restricted to authorized personnel.');
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
    if (editingNoticeId) {
      updateNotice(editingNoticeId, {
        title: noticeTitle,
        category: noticeCategory,
        isUrgent: noticeUrgent,
        content: noticeContent,
        postedBy: noticeAuthor
      });
      setEditingNoticeId(null);
      showToast('success', 'Notice updated successfully.');
    } else {
      addNotice({
        title: noticeTitle,
        category: noticeCategory,
        isUrgent: noticeUrgent,
        content: noticeContent,
        postedBy: noticeAuthor
      });
      showToast('success', 'Notice published successfully to public bulletin.');
    }
    setNoticeTitle('');
    setNoticeContent('');
    setNoticeUrgent(false);
  };

  const handleEditNoticeClick = (n: Notice) => {
    setEditingNoticeId(n.id);
    setNoticeTitle(n.title);
    setNoticeCategory(n.category);
    setNoticeUrgent(Boolean(n.isUrgent));
    setNoticeContent(n.content);
    setNoticeAuthor(n.postedBy || 'Registrar Office');
  };

  const handleCreateMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matTitle || !matSubject) {
      showToast('error', 'Please provide a title and theological subject.');
      return;
    }
    if (editingMatId) {
      updateStudyMaterial(editingMatId, {
        title: matTitle,
        courseCode: matCourse,
        courseName: matCourse === 'B.Th' ? 'Bachelor of Theology' : matCourse === 'M.Div' ? 'Master of Divinity' : 'Certificate in Biblical Studies',
        subject: matSubject,
        facultyName: matFaculty,
        type: matType,
        fileSize: matSize,
        description: matDesc || 'Official lecture course material.',
        downloadUrl: matUrl || undefined
      });
      setEditingMatId(null);
      showToast('success', 'Study material updated!');
    } else {
      addStudyMaterial({
        title: matTitle,
        courseCode: matCourse,
        courseName: matCourse === 'B.Th' ? 'Bachelor of Theology' : matCourse === 'M.Div' ? 'Master of Divinity' : 'Certificate in Biblical Studies',
        subject: matSubject,
        facultyName: matFaculty,
        type: matType,
        fileSize: matSize,
        description: matDesc || 'Official lecture course material.',
        downloadUrl: matUrl || undefined
      });
      showToast('success', 'Study material notes registered and synced!');
    }
    setMatTitle('');
    setMatSubject('');
    setMatDesc('');
    setMatUrl('');
  };

  const handleEditMaterialClick = (m: StudyMaterial) => {
    setEditingMatId(m.id);
    setMatTitle(m.title);
    setMatCourse(m.courseCode);
    setMatSubject(m.subject);
    setMatFaculty(m.facultyName);
    setMatType(m.type);
    setMatSize(m.fileSize);
    setMatDesc(m.description);
    setMatUrl(m.downloadUrl || '');
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle || !eventDate) {
      showToast('error', 'Please provide event title and date.');
      return;
    }
    if (editingEventId) {
      updateEvent(editingEventId, {
        title: eventTitle,
        date: eventDate,
        time: eventTime,
        location: eventLocation,
        speaker: eventSpeaker || 'Pr. Christopher',
        category: eventCategory,
        description: eventDesc || 'Special campus gathering for theological growth.',
        image: eventImage || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80'
      });
      setEditingEventId(null);
      showToast('success', 'Event updated successfully.');
    } else {
      addEvent({
        title: eventTitle,
        date: eventDate,
        time: eventTime,
        location: eventLocation,
        speaker: eventSpeaker || 'Pr. Christopher',
        category: eventCategory,
        description: eventDesc || 'Special campus gathering for theological growth.',
        image: eventImage || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
        registrationOpen: true
      });
      showToast('success', 'Event successfully scheduled and published.');
    }
    setEventTitle('');
    setEventDate('');
    setEventSpeaker('');
    setEventDesc('');
  };

  const handleEditEventClick = (ev: EventItem) => {
    setEditingEventId(ev.id);
    setEventTitle(ev.title);
    setEventDate(ev.date);
    setEventTime(ev.time);
    setEventLocation(ev.location);
    setEventSpeaker(ev.speaker);
    setEventCategory(ev.category);
    setEventDesc(ev.description);
    setEventImage(ev.image);
  };

  const handleSaveGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galImage) {
      showToast('error', 'Please upload a picture or provide an image URL.');
      return;
    }
    const finalTitle = galTitle.trim() || 'Campus Gallery Photo';
    const targetId = editingGalleryId || autoCreatedGalleryId;
    if (targetId) {
      await updateGalleryPhoto(targetId, {
        title: finalTitle,
        category: galCategory,
        image: galImage,
        caption: galCaption || `${finalTitle} — Image of Christ Bible College, Vellore.`
      });
      setEditingGalleryId(null);
      setAutoCreatedGalleryId(null);
      showToast('success', 'Gallery photo saved to Supabase & updated on live Website Gallery!');
    } else {
      await addGalleryPhoto({
        title: finalTitle,
        category: galCategory,
        image: galImage,
        caption: galCaption || `${finalTitle} — Image of Christ Bible College, Vellore.`
      });
      showToast('success', 'Picture uploaded, saved to Supabase & published to the live Website Gallery!');
    }
    setGalTitle('');
    setGalImage('');
    setGalCaption('');
  };

  const handleEditGalleryClick = (g: GalleryPhoto) => {
    setAutoCreatedGalleryId(null);
    setEditingGalleryId(g.id);
    setGalTitle(g.title);
    setGalCategory(g.category);
    setGalImage(g.image);
    setGalCaption(g.caption);
  };

  const handleSaveDownload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dlTitle) {
      showToast('error', 'Please provide document title.');
      return;
    }
    if (editingDownloadId) {
      updateDownload(editingDownloadId, {
        title: dlTitle,
        category: dlCategory,
        format: dlFormat,
        fileSize: dlSize,
        description: dlDesc
      });
      setEditingDownloadId(null);
      showToast('success', 'Downloadable document updated.');
    } else {
      addDownload({
        title: dlTitle,
        category: dlCategory,
        format: dlFormat,
        fileSize: dlSize,
        description: dlDesc || 'Official college document for download.'
      });
      showToast('success', 'Document added to Downloads page.');
    }
    setDlTitle('');
    setDlDesc('');
  };

  const handleEditDownloadClick = (d: DownloadDoc) => {
    setEditingDownloadId(d.id);
    setDlTitle(d.title);
    setDlCategory(d.category);
    setDlFormat(d.format);
    setDlSize(d.fileSize);
    setDlDesc(d.description);
  };

  const openAddStudentModal = () => {
    setEditingStudentId(null);
    setNewStdRegNo('');
    setNewStdName('');
    setNewStdEmail('');
    setNewStdPhone('');
    setNewStdCourse('bth');
    setNewStdYear('Year 1 (Semester I)');
    setNewStdBatch('Batch of 2026–2029');
    setNewStdGpa('3.80 / 4.0');
    setNewStdAttendance(95);
    setNewStdAvatar('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80');
    setShowAddStudentModal(true);
  };

  const openEditStudentModal = (std: StudentProfile) => {
    setEditingStudentId(std.id);
    setNewStdRegNo(std.regNo);
    setNewStdName(std.name);
    setNewStdEmail(std.email);
    setNewStdPhone(std.phone);
    setNewStdCourse(std.courseId);
    setNewStdYear(std.currentYear);
    setNewStdBatch(std.batch);
    setNewStdGpa(std.gpa);
    setNewStdAttendance(std.attendancePercent);
    setNewStdAvatar(std.avatar);
    setShowAddStudentModal(true);
  };

  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStdName || !newStdEmail) {
      showToast('error', 'Please enter student name and email.');
      return;
    }
    const courseTitle =
      newStdCourse === 'bth'
        ? 'Bachelor of Theology'
        : newStdCourse === 'mdiv'
        ? 'Master of Divinity'
        : 'Certificate in Theology';

    if (editingStudentId) {
      updateStudent(editingStudentId, {
        regNo: newStdRegNo || `ICBC-2026-${newStdCourse.toUpperCase()}-10`,
        name: newStdName,
        email: newStdEmail,
        phone: newStdPhone || '+91 98400 12345',
        courseId: newStdCourse,
        courseTitle,
        currentYear: newStdYear,
        batch: newStdBatch,
        gpa: newStdGpa,
        attendancePercent: Number(newStdAttendance) || 95,
        avatar: newStdAvatar
      });
      showToast('success', `Student profile for ${newStdName} updated.`);
    } else {
      const randId = Math.floor(10 + Math.random() * 90);
      const regNo = newStdRegNo.trim() || `ICBC-2026-${newStdCourse.toUpperCase()}-${randId}`;
      const id = `std-${Date.now()}`;

      addStudent({
        id,
        regNo,
        name: newStdName,
        email: newStdEmail,
        phone: newStdPhone || '+91 98400 12345',
        courseId: newStdCourse,
        courseTitle,
        currentYear: newStdYear,
        batch: newStdBatch || 'Batch of 2026–2029',
        avatar: newStdAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        attendancePercent: Number(newStdAttendance) || 95,
        gpa: newStdGpa || '3.80 / 4.0',
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
      showToast('success', `Student registered with ID ${regNo} in database.`);
    }

    setShowAddStudentModal(false);
    setEditingStudentId(null);
  };

  const openAddFacultyModal = () => {
    setEditingFacultyId(null);
    setFacName('');
    setFacRole('Professor of Theology');
    setFacDept('Department of Biblical & Theological Studies');
    setFacDegrees('M.Div., M.Th.');
    setFacAlmaMater('Senate of Serampore');
    setFacExp(10);
    setFacSubjects('Systematic Theology, Homiletics');
    setFacBio('');
    setFacQuote('');
    setFacPhoto('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80');
    setShowFacultyModal(true);
  };

  const openEditFacultyModal = (f: FacultyMember) => {
    setEditingFacultyId(f.id);
    setFacName(f.name);
    setFacRole(f.role);
    setFacDept(f.department);
    setFacDegrees(f.degrees);
    setFacAlmaMater(f.almaMater);
    setFacExp(f.yearsOfExperience);
    setFacSubjects(f.subjects.join(', '));
    setFacBio(f.bio);
    setFacQuote(f.quote || '');
    setFacPhoto(f.photo);
    setShowFacultyModal(true);
  };

  const handleSaveFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!facName.trim()) {
      showToast('error', 'Please enter faculty member name.');
      return;
    }
    const subjectsArr = facSubjects
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (editingFacultyId) {
      updateFaculty(editingFacultyId, {
        name: facName,
        role: facRole,
        department: facDept,
        degrees: facDegrees,
        almaMater: facAlmaMater,
        yearsOfExperience: Number(facExp) || 5,
        subjects: subjectsArr,
        bio: facBio,
        quote: facQuote,
        photo: facPhoto
      });
      showToast('success', `Faculty profile for ${facName} updated.`);
    } else {
      addFaculty({
        name: facName,
        role: facRole,
        department: facDept,
        degrees: facDegrees,
        almaMater: facAlmaMater,
        yearsOfExperience: Number(facExp) || 5,
        subjects: subjectsArr.length ? subjectsArr : ['Biblical Studies'],
        bio: facBio || 'Dedicated faculty member equipping servant leaders through the Word of God.',
        quote: facQuote || 'Equipping lives for the Great Commission.',
        photo: facPhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
      });
      showToast('success', `Added ${facName} to Faculty directory.`);
    }
    setShowFacultyModal(false);
    setEditingFacultyId(null);
  };

  const openAddCourseModal = () => {
    setEditingCourseId(null);
    setCrsCode('DIP.TH');
    setCrsTitle('');
    setCrsLevel('Bachelor');
    setCrsDuration('3 Years');
    setCrsMode('Residential & Day Scholar');
    setCrsLanguage('English & Tamil');
    setCrsCredits(96);
    setCrsTuition('₹18,000 / Year');
    setCrsEligibility('10+2 or Equivalent');
    setCrsDesc('');
    setShowCourseModal(true);
  };

  const openEditCourseModal = (c: Course) => {
    setEditingCourseId(c.id);
    setCrsCode(c.code);
    setCrsTitle(c.title);
    setCrsLevel(c.level);
    setCrsDuration(c.duration);
    setCrsMode(c.mode);
    setCrsLanguage(c.language);
    setCrsCredits(c.totalCredits);
    setCrsTuition(c.annualTuition);
    setCrsEligibility(c.eligibility);
    setCrsDesc(c.description);
    setShowCourseModal(true);
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!crsTitle.trim() || !crsCode.trim()) {
      showToast('error', 'Please enter course code and title.');
      return;
    }
    if (editingCourseId) {
      updateCourse(editingCourseId, {
        code: crsCode,
        title: crsTitle,
        level: crsLevel,
        duration: crsDuration,
        mode: crsMode,
        language: crsLanguage,
        totalCredits: Number(crsCredits) || 60,
        annualTuition: crsTuition,
        eligibility: crsEligibility,
        description: crsDesc
      });
      showToast('success', `Course "${crsTitle}" updated.`);
    } else {
      const id = crsCode.toLowerCase().replace(/[^a-z0-9]/g, '') || `crs-${Date.now()}`;
      addCourse({
        id,
        code: crsCode,
        title: crsTitle,
        level: crsLevel,
        duration: crsDuration,
        mode: crsMode,
        language: crsLanguage,
        totalCredits: Number(crsCredits) || 60,
        annualTuition: crsTuition,
        eligibility: crsEligibility,
        description: crsDesc || 'Comprehensive theological degree program equipping leaders for ministry.',
        curriculum: [
          {
            year: 'Year 1: Biblical Foundations',
            courses: ['Old Testament Survey', 'New Testament Survey', 'Systematic Theology I', 'Spiritual Formation']
          }
        ],
        outcomes: ['Sound biblical exegesis', 'Pastoral leadership & preaching']
      });
      showToast('success', `Course "${crsTitle}" added.`);
    }
    setShowCourseModal(false);
    setEditingCourseId(null);
  };

  const openAddSubjectModal = () => {
    setEditingSubjectId(null);
    setSubCode('TH-105');
    setSubName('');
    setSubCourseId('bth');
    setSubCredits(4);
    setSubSemester('Year 1 - Sem I');
    setSubFaculty('Pr. Christopher');
    setShowSubjectModal(true);
  };

  const openEditSubjectModal = (sub: SubjectItem) => {
    setEditingSubjectId(sub.id);
    setSubCode(sub.subjectCode);
    setSubName(sub.subjectName);
    setSubCourseId(sub.courseId);
    setSubCredits(sub.credits);
    setSubSemester(sub.semesterOrYear);
    setSubFaculty(sub.facultyName);
    setShowSubjectModal(true);
  };

  const handleSaveSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName.trim() || !subCode.trim()) {
      showToast('error', 'Please enter subject code and name.');
      return;
    }
    if (editingSubjectId) {
      updateSubject(editingSubjectId, {
        subjectCode: subCode,
        subjectName: subName,
        courseId: subCourseId,
        credits: Number(subCredits) || 3,
        semesterOrYear: subSemester,
        facultyName: subFaculty
      });
      showToast('success', `Subject "${subName}" updated.`);
    } else {
      addSubject({
        id: `sub-${Date.now()}`,
        subjectCode: subCode,
        subjectName: subName,
        courseId: subCourseId,
        credits: Number(subCredits) || 3,
        semesterOrYear: subSemester,
        facultyName: subFaculty
      });
      showToast('success', `Subject "${subName}" added.`);
    }
    setShowSubjectModal(false);
    setEditingSubjectId(null);
  };

  const openAddAppModal = () => {
    setEditingAppId(null);
    setAppFormName('');
    setAppFormEmail('');
    setAppFormPhone('');
    setAppFormDob('2002-05-15');
    setAppFormGender('Male');
    setAppFormCourseId('bth');
    setAppFormEducation('Higher Secondary (12th)');
    setAppFormChurch('');
    setAppFormPastor('');
    setAppFormPastorPhone('');
    setAppFormTestimony('');
    setAppFormCalling('Pastoral Ministry');
    setAppFormStatus('Under Review');
    setShowAppModal(true);
  };

  const openEditAppModal = (app: ApplicationSubmission) => {
    setEditingAppId(app.id);
    setAppFormName(app.fullName);
    setAppFormEmail(app.email);
    setAppFormPhone(app.phone);
    setAppFormDob(app.dateOfBirth);
    setAppFormGender(app.gender);
    setAppFormCourseId(app.courseId);
    setAppFormEducation(app.previousEducation);
    setAppFormChurch(app.homeChurch);
    setAppFormPastor(app.pastorName);
    setAppFormPastorPhone(app.pastorPhone);
    setAppFormTestimony(app.personalTestimony);
    setAppFormCalling(app.ministryCalling);
    setAppFormStatus(app.status);
    setShowAppModal(true);
  };

  const handleSaveApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appFormName.trim() || !appFormEmail.trim()) {
      showToast('error', 'Please enter applicant name and email.');
      return;
    }
    if (editingAppId) {
      await updateApplication(editingAppId, {
        fullName: appFormName,
        email: appFormEmail,
        phone: appFormPhone,
        dateOfBirth: appFormDob,
        gender: appFormGender,
        courseId: appFormCourseId,
        previousEducation: appFormEducation,
        homeChurch: appFormChurch,
        pastorName: appFormPastor,
        pastorPhone: appFormPastorPhone,
        personalTestimony: appFormTestimony,
        ministryCalling: appFormCalling,
        status: appFormStatus
      });
      showToast('success', `Application for ${appFormName} updated.`);
    } else {
      await submitApplication({
        fullName: appFormName,
        email: appFormEmail,
        phone: appFormPhone || '+91 95004 23126',
        dateOfBirth: appFormDob || '2000-01-01',
        gender: appFormGender,
        courseId: appFormCourseId,
        previousEducation: appFormEducation || 'Higher Secondary',
        homeChurch: appFormChurch || 'Local Evangelical Church',
        pastorName: appFormPastor || 'Pr. Christopher',
        pastorPhone: appFormPastorPhone || '+91 95004 23126',
        personalTestimony: appFormTestimony || 'Committed to serving Christ.',
        ministryCalling: appFormCalling || 'Pastoral Ministry',
        status: appFormStatus
      });
      showToast('success', `New admission application created for ${appFormName}.`);
    }
    setShowAppModal(false);
    setEditingAppId(null);
  };

  const openAddMessageModal = () => {
    setEditingMsgId(null);
    setMsgName('');
    setMsgEmail('');
    setMsgPhone('');
    setMsgSubject('');
    setMsgContent('');
    setMsgIsPrayer(false);
    setMsgStatus('New');
    setShowMessageModal(true);
  };

  const openEditMessageModal = (m: ContactMessage) => {
    setEditingMsgId(m.id);
    setMsgName(m.name);
    setMsgEmail(m.email);
    setMsgPhone(m.phone);
    setMsgSubject(m.subject);
    setMsgContent(m.message);
    setMsgIsPrayer(m.isPrayerRequest);
    setMsgStatus(m.status);
    setShowMessageModal(true);
  };

  const handleSaveMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgName.trim() || !msgContent.trim()) {
      showToast('error', 'Please enter name and message content.');
      return;
    }
    if (editingMsgId) {
      await updateContactMessage(editingMsgId, {
        name: msgName,
        email: msgEmail,
        phone: msgPhone,
        subject: msgSubject,
        message: msgContent,
        isPrayerRequest: msgIsPrayer,
        status: msgStatus
      });
      showToast('success', 'Inquiry / prayer request updated.');
    } else {
      await submitContactMessage({
        name: msgName,
        email: msgEmail || 'visitor@iocbc.edu.in',
        phone: msgPhone || '+91 95004 23126',
        subject: msgSubject || 'General Inquiry',
        message: msgContent,
        isPrayerRequest: msgIsPrayer
      });
      showToast('success', 'New inquiry / prayer request added.');
    }
    setShowMessageModal(false);
    setEditingMsgId(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);
    try {
      let uploadedCount = 0;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await uploadFileToStorage(selectedBucket, file);
        if (res.url) {
          uploadedCount++;
          const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
          const formattedTitle = cleanName.charAt(0).toUpperCase() + cleanName.slice(1) || 'Uploaded Asset';
          const sizeStr = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;

          if (selectedBucket === 'gallery' && file.type.startsWith('image/')) {
            await addGalleryPhoto({
              title: formattedTitle,
              category: 'Campus',
              image: res.url,
              caption: `${formattedTitle} — Image of Christ Bible College, Vellore.`
            });
          } else if (selectedBucket === 'study-materials') {
            await addStudyMaterial({
              title: formattedTitle,
              courseCode: 'B.Th',
              courseName: 'Bachelor of Theology (B.Th)',
              subject: 'Biblical & Theological Studies',
              facultyName: 'Pr. Christopher',
              type: 'PDF',
              fileSize: sizeStr,
              description: `${formattedTitle} — Uploaded to Study Materials.`,
              downloadUrl: res.url
            });
          } else if (selectedBucket === 'college-documents') {
            await addDownload({
              title: formattedTitle,
              category: 'Academic',
              format: file.name.toLowerCase().endsWith('.docx') ? 'DOCX' : 'PDF',
              fileSize: sizeStr,
              description: `${formattedTitle} — Official College Document.`
            });
          }
        }
      }
      if (uploadedCount > 0) {
        showToast(
          'success',
          `Uploaded ${uploadedCount} file(s) to Supabase bucket '${selectedBucket}' and published to live website!`
        );
      } else {
        showToast('error', 'Failed to upload file.');
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
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center whitespace-nowrap cursor-pointer ${
              adminTab === 'events'
                ? 'bg-blue-900 text-amber-300 shadow'
                : 'text-stone-600 hover:text-slate-900 hover:bg-stone-100'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 mr-1.5" />
            <span>Events ({events.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('gallery')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center whitespace-nowrap cursor-pointer ${
              adminTab === 'gallery'
                ? 'bg-blue-900 text-amber-300 shadow'
                : 'text-stone-600 hover:text-slate-900 hover:bg-stone-100'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 mr-1.5" />
            <span>Gallery ({gallery.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('downloads')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center whitespace-nowrap cursor-pointer ${
              adminTab === 'downloads'
                ? 'bg-blue-900 text-amber-300 shadow'
                : 'text-stone-600 hover:text-slate-900 hover:bg-stone-100'
            }`}
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            <span>Downloads ({downloads.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('messages')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center whitespace-nowrap cursor-pointer ${
              adminTab === 'messages'
                ? 'bg-blue-900 text-amber-300 shadow'
                : 'text-stone-600 hover:text-slate-900 hover:bg-stone-100'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
            <span>Inquiries ({contactMessages.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('storage')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center whitespace-nowrap cursor-pointer ${
              adminTab === 'storage'
                ? 'bg-blue-900 text-amber-300 shadow'
                : 'text-stone-600 hover:text-slate-900 hover:bg-stone-100'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5 mr-1.5" />
            <span>Storage ({uploadedFiles.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('supabase')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center whitespace-nowrap cursor-pointer ${
              adminTab === 'supabase'
                ? 'bg-emerald-900 text-emerald-300 shadow'
                : 'text-emerald-800 hover:bg-emerald-50'
            }`}
          >
            <Database className="w-3.5 h-3.5 mr-1.5" />
            <span>Supabase DB</span>
          </button>

          <button
            onClick={() => setAdminTab('themes')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center whitespace-nowrap cursor-pointer ${
              adminTab === 'themes'
                ? 'bg-amber-500 text-slate-950 shadow font-extrabold ring-1 ring-amber-400'
                : 'text-stone-600 hover:text-slate-900 hover:bg-stone-100'
            }`}
          >
            <Palette className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
            <span>Theme Studio</span>
          </button>
        </div>

        {/* TAB 1: ADMISSIONS */}
        {adminTab === 'applications' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-cinzel text-xl font-bold text-slate-900">Admission Applications</h3>
                <p className="text-xs text-stone-500">
                  Add, edit, review, and delete candidate admission applications.
                </p>
              </div>
              <button
                onClick={openAddAppModal}
                className="px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-amber-300 text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 shadow cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Application</span>
              </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-stone-200 p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={appSearch}
                  onChange={e => setAppSearch(e.target.value)}
                  placeholder="Search by candidate name, reg no, or email..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
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
                          <p className="font-semibold text-slate-700 text-sm">No admission applications found.</p>
                          <p className="text-xs text-stone-400 mt-1">Click "Add Application" above or submit from the Admissions page.</p>
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
                            <div className="inline-flex items-center space-x-1.5">
                              <button
                                onClick={() => setInspectedApp(app)}
                                className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-slate-800 font-semibold text-[11px] inline-flex items-center space-x-1 cursor-pointer"
                                title="View Dossier"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>View</span>
                              </button>
                              <button
                                onClick={() => openEditAppModal(app)}
                                className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 font-semibold text-[11px] inline-flex items-center space-x-1 cursor-pointer"
                                title="Edit Application"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => {
                                  deleteApplication(app.id);
                                  showToast('success', `Application for ${app.fullName} deleted.`);
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-[11px] inline-flex items-center space-x-1 cursor-pointer"
                                title="Delete Application"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
                              </button>
                            </div>
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
                  Add, edit, and delete student profiles, GPA standings, attendance, and registry numbers.
                </p>
              </div>
              <button
                onClick={openAddStudentModal}
                className="px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-amber-300 text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 shadow cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Student</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studentsList.map(std => (
                <div key={std.id} className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-3.5">
                        <img
                          src={std.avatar}
                          alt={std.name}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-500/40 shadow-sm shrink-0"
                        />
                        <div>
                          <span className="font-mono text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-bold">
                            {std.regNo}
                          </span>
                          <h4 className="font-cinzel font-bold text-slate-900 text-base mt-0.5">{std.name}</h4>
                          <p className="text-xs text-stone-500">{std.courseTitle}</p>
                        </div>
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
                      <div><strong>Phone:</strong> {std.phone}</div>
                      <div><strong>Year:</strong> {std.currentYear}</div>
                      <div><strong>Batch:</strong> {std.batch}</div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-end space-x-2">
                    <button
                      onClick={() => openEditStudentModal(std)}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold text-xs inline-flex items-center space-x-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        deleteStudent(std.id);
                        showToast('success', `Student ${std.name} removed.`);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs inline-flex items-center space-x-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: FACULTY */}
        {adminTab === 'faculty' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-cinzel text-xl font-bold text-slate-900">Theological Faculty Registry</h3>
                <p className="text-xs text-stone-500">
                  Add, edit, and delete professors, deans, and ministry lecturers.
                </p>
              </div>
              <button
                onClick={openAddFacultyModal}
                className="px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-amber-300 text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 shadow cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Faculty</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {faculty.map(f => (
                <div key={f.id} className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={f.photo}
                        alt={f.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-stone-200 shadow-sm shrink-0"
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
                      {f.subjects.map((sub, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-stone-100 text-[10px] text-stone-600">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-end space-x-2">
                    <button
                      onClick={() => openEditFacultyModal(f)}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold text-xs inline-flex items-center space-x-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        deleteFaculty(f.id);
                        showToast('success', `Faculty member ${f.name} removed.`);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs inline-flex items-center space-x-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: COURSES & CURRICULUM */}
        {adminTab === 'courses' && (
          <div className="space-y-10">
            {/* Degree Programs */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-cinzel text-xl font-bold text-slate-900">Academic Degree Programs ({courses.length})</h3>
                  <p className="text-xs text-stone-500">
                    Add, edit, and delete theological degree programs displayed on the Courses page.
                  </p>
                </div>
                <button
                  onClick={openAddCourseModal}
                  className="px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-amber-300 text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 shadow cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Course</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.map(c => (
                  <div key={c.id} className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold uppercase">
                            {c.level}
                          </span>
                          <span className="font-mono text-xs font-bold text-stone-500">{c.code}</span>
                        </div>
                        <span className="text-xs font-bold text-amber-800">{c.annualTuition}</span>
                      </div>
                      <div>
                        <h4 className="font-cinzel text-lg font-bold text-slate-900">{c.title}</h4>
                        <p className="text-xs text-stone-500">
                          Duration: {c.duration} • Mode: {c.mode} • Credits: {c.totalCredits}
                        </p>
                      </div>
                      <p className="text-xs text-stone-600 line-clamp-3">{c.description}</p>
                    </div>

                    <div className="pt-3 border-t border-stone-100 flex items-center justify-end space-x-2">
                      <button
                        onClick={() => openEditCourseModal(c)}
                        className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold text-xs inline-flex items-center space-x-1 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => {
                          deleteCourse(c.id);
                          showToast('success', `Course "${c.title}" deleted.`);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs inline-flex items-center space-x-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Curriculum Subjects */}
            <div className="space-y-4 pt-6 border-t border-stone-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-cinzel text-xl font-bold text-slate-900">Curriculum Subjects ({subjectsList.length})</h3>
                  <p className="text-xs text-stone-500">
                    Manage individual theological subjects, credit hours, and assigned faculty.
                  </p>
                </div>
                <button
                  onClick={openAddSubjectModal}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 shadow cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Subject</span>
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 text-slate-700 font-bold uppercase tracking-wider border-b border-stone-200">
                      <tr>
                        <th className="px-5 py-3.5">Code</th>
                        <th className="px-5 py-3.5">Subject Name</th>
                        <th className="px-5 py-3.5">Degree</th>
                        <th className="px-5 py-3.5">Semester</th>
                        <th className="px-5 py-3.5">Credits</th>
                        <th className="px-5 py-3.5">Faculty</th>
                        <th className="px-5 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {subjectsList.map(sub => (
                        <tr key={sub.id} className="hover:bg-stone-50">
                          <td className="px-5 py-3.5 font-mono font-bold text-blue-950">{sub.subjectCode}</td>
                          <td className="px-5 py-3.5 font-bold text-slate-900">{sub.subjectName}</td>
                          <td className="px-5 py-3.5 uppercase font-semibold text-stone-600">{sub.courseId}</td>
                          <td className="px-5 py-3.5 text-stone-600">{sub.semesterOrYear}</td>
                          <td className="px-5 py-3.5 font-bold text-amber-800">{sub.credits} Cr</td>
                          <td className="px-5 py-3.5 text-stone-700">{sub.facultyName}</td>
                          <td className="px-5 py-3.5 text-right">
                            <div className="inline-flex items-center space-x-1.5">
                              <button
                                onClick={() => openEditSubjectModal(sub)}
                                className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 font-semibold text-[11px] inline-flex items-center space-x-1 cursor-pointer"
                              >
                                <Edit3 className="w-3 h-3" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => {
                                  deleteSubject(sub.id);
                                  showToast('success', `Subject "${sub.subjectName}" deleted.`);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-[11px] inline-flex items-center space-x-1 cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: NOTICES */}
        {adminTab === 'notices' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-sm h-fit">
              <div className="flex items-center justify-between">
                <h3 className="font-cinzel font-bold text-slate-900 text-lg flex items-center space-x-2">
                  {editingNoticeId ? <Edit3 className="w-5 h-5 text-amber-600" /> : <Plus className="w-5 h-5 text-blue-900" />}
                  <span>{editingNoticeId ? 'Edit Notice' : 'Publish Notice'}</span>
                </h3>
                {editingNoticeId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingNoticeId(null);
                      setNoticeTitle('');
                      setNoticeContent('');
                      setNoticeUrgent(false);
                    }}
                    className="text-xs text-stone-500 hover:text-slate-900 underline cursor-pointer"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleCreateNotice} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Notice Headline *</label>
                  <input
                    type="text"
                    required
                    value={noticeTitle}
                    onChange={e => setNoticeTitle(e.target.value)}
                    placeholder="e.g. Convocation 2026 Gown Fitting"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Category</label>
                  <select
                    value={noticeCategory}
                    onChange={e => setNoticeCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Chapel">Chapel</option>
                    <option value="Examination">Examination</option>
                    <option value="Admissions">Admissions</option>
                    <option value="Hostel">Hostel</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Posted By</label>
                  <input
                    type="text"
                    value={noticeAuthor}
                    onChange={e => setNoticeAuthor(e.target.value)}
                    placeholder="e.g. Registrar Office"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Content / Circular *</label>
                  <textarea
                    rows={4}
                    required
                    value={noticeContent}
                    onChange={e => setNoticeContent(e.target.value)}
                    placeholder="Full announcement details..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 font-sans"
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
                  className="w-full py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-amber-300 font-bold uppercase tracking-wider transition-colors shadow cursor-pointer"
                >
                  {editingNoticeId ? 'Update Notice' : 'Post Notice'}
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
                        {n.postedBy && <span className="text-[11px] text-stone-500">• {n.postedBy}</span>}
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => handleEditNoticeClick(n)}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 font-semibold text-[11px] inline-flex items-center space-x-1 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => {
                            deleteNotice(n.id);
                            showToast('success', 'Notice removed.');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-[11px] inline-flex items-center space-x-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
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
            <div className="lg:col-span-1 bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-sm h-fit">
              <div className="flex items-center justify-between">
                <h3 className="font-cinzel font-bold text-slate-900 text-lg flex items-center space-x-2">
                  {editingMatId ? <Edit3 className="w-5 h-5 text-amber-600" /> : <Plus className="w-5 h-5 text-blue-900" />}
                  <span>{editingMatId ? 'Edit Study Notes' : 'Upload Study Notes'}</span>
                </h3>
                {editingMatId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingMatId(null);
                      setMatTitle('');
                      setMatSubject('');
                      setMatDesc('');
                      setMatUrl('');
                    }}
                    className="text-xs text-stone-500 hover:text-slate-900 underline cursor-pointer"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleCreateMaterial} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Document Title *</label>
                  <input
                    type="text"
                    required
                    value={matTitle}
                    onChange={e => setMatTitle(e.target.value)}
                    placeholder="e.g. Romans Greek Exegesis Handbook"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Target Degree</label>
                    <select
                      value={matCourse}
                      onChange={e => setMatCourse(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                    >
                      <option value="B.Th">B.Th</option>
                      <option value="M.Div">M.Div</option>
                      <option value="Certificate">Certificate</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Material Type</label>
                    <select
                      value={matType}
                      onChange={e => setMatType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                    >
                      <option value="PDF">PDF</option>
                      <option value="Syllabus">Syllabus</option>
                      <option value="Lecture Notes">Lecture Notes</option>
                      <option value="Handout">Handout</option>
                      <option value="Audio / Video">Audio / Video</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Theological Subject *</label>
                  <input
                    type="text"
                    required
                    value={matSubject}
                    onChange={e => setMatSubject(e.target.value)}
                    placeholder="e.g. Biblical Greek, Systematic Theology"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Lecturer / Author</label>
                    <input
                      type="text"
                      value={matFaculty}
                      onChange={e => setMatFaculty(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">File Size</label>
                    <input
                      type="text"
                      value={matSize}
                      onChange={e => setMatSize(e.target.value)}
                      placeholder="e.g. 2.4 MB"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Upload PDF / Study File from Device</label>
                  <label className="w-full border border-dashed border-blue-900/40 hover:border-blue-900 bg-blue-50/40 rounded-xl p-2.5 flex items-center justify-center space-x-2 cursor-pointer transition-all">
                    <UploadCloud className="w-4 h-4 text-blue-900" />
                    <span className="font-bold text-blue-950 text-[11px]">
                      {isUploading ? 'Uploading File...' : 'Choose PDF / Document from Device'}
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,image/*"
                      className="hidden"
                      onChange={async e => {
                        const f = e.target.files?.[0];
                        if (f) {
                          setIsUploading(true);
                          const res = await uploadFileToStorage('study-materials', f);
                          setIsUploading(false);
                          if (res.url) {
                            setMatUrl(res.url);
                            setMatSize(`${(f.size / (1024 * 1024)).toFixed(2)} MB`);
                            if (!matTitle.trim()) {
                              const cleanName = f.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
                              setMatTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
                            }
                            showToast('success', `File "${f.name}" attached to study material!`);
                          }
                        }
                        e.target.value = '';
                      }}
                    />
                  </label>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Summary / Description</label>
                  <textarea
                    rows={2}
                    value={matDesc}
                    onChange={e => setMatDesc(e.target.value)}
                    placeholder="Brief description of study notes..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-amber-300 font-bold uppercase tracking-wider transition-colors shadow cursor-pointer"
                >
                  {editingMatId ? 'Update Study Notes' : 'Save Study Notes'}
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <h3 className="font-cinzel font-bold text-slate-900 text-lg">
                Uploaded Lecture Notes & Syllabi ({studyMaterials.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {studyMaterials.map(m => (
                  <div key={m.id} className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                            {m.courseCode}
                          </span>
                          <span className="text-stone-500 bg-stone-100 px-2 py-0.5 rounded font-semibold">
                            {m.type}
                          </span>
                        </div>
                        <span className="text-stone-400">{m.uploadedDate}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">{m.title}</h4>
                      <p className="text-xs text-stone-500">Subject: {m.subject} • {m.facultyName}</p>
                      <p className="text-xs text-stone-600 line-clamp-2">{m.description}</p>
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-[11px] text-stone-400 font-mono">{m.fileSize}</span>
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => handleEditMaterialClick(m)}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 font-semibold text-[11px] inline-flex items-center space-x-1 cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => {
                            deleteStudyMaterial(m.id);
                            showToast('success', 'Study material deleted.');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-[11px] inline-flex items-center space-x-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: EVENTS */}
        {adminTab === 'events' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-sm h-fit">
              <div className="flex items-center justify-between">
                <h3 className="font-cinzel font-bold text-slate-900 text-lg flex items-center space-x-2">
                  {editingEventId ? <Edit3 className="w-5 h-5 text-amber-600" /> : <Plus className="w-5 h-5 text-blue-900" />}
                  <span>{editingEventId ? 'Edit Event' : 'Schedule Event'}</span>
                </h3>
                {editingEventId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingEventId(null);
                      setEventTitle('');
                      setEventDate('');
                      setEventSpeaker('');
                      setEventDesc('');
                    }}
                    className="text-xs text-stone-500 hover:text-slate-900 underline cursor-pointer"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Event Title *</label>
                  <input
                    type="text"
                    required
                    value={eventTitle}
                    onChange={e => setEventTitle(e.target.value)}
                    placeholder="e.g. Annual Mission & Church Growth Conference"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Date *</label>
                    <input
                      type="text"
                      required
                      value={eventDate}
                      onChange={e => setEventDate(e.target.value)}
                      placeholder="e.g. 2026-08-15"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Category</label>
                    <select
                      value={eventCategory}
                      onChange={e => setEventCategory(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                    >
                      <option value="Conference">Conference</option>
                      <option value="Chapel">Chapel</option>
                      <option value="Convocation">Convocation</option>
                      <option value="Outreach">Outreach</option>
                      <option value="Seminar">Seminar</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Time</label>
                    <input
                      type="text"
                      value={eventTime}
                      onChange={e => setEventTime(e.target.value)}
                      placeholder="9:30 AM – 4:00 PM"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Venue / Location</label>
                    <input
                      type="text"
                      value={eventLocation}
                      onChange={e => setEventLocation(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Keynote Speaker</label>
                  <input
                    type="text"
                    value={eventSpeaker}
                    onChange={e => setEventSpeaker(e.target.value)}
                    placeholder="e.g. Pr. Christopher"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Banner Image (Upload or URL)</label>
                  <div className="flex gap-2 mb-1.5">
                    <label className="px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-950 border border-blue-200 font-bold text-[11px] inline-flex items-center space-x-1.5 cursor-pointer shrink-0">
                      <UploadCloud className="w-3.5 h-3.5 text-blue-900" />
                      <span>{isUploading ? 'Uploading...' : 'Upload Banner'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async e => {
                          const f = e.target.files?.[0];
                          if (f) {
                            setIsUploading(true);
                            const res = await uploadFileToStorage('gallery', f);
                            setIsUploading(false);
                            if (res.url) {
                              setEventImage(res.url);
                              showToast('success', 'Event banner photo uploaded!');
                            }
                          }
                          e.target.value = '';
                        }}
                      />
                    </label>
                    <input
                      type="text"
                      value={eventImage}
                      onChange={e => setEventImage(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Event Description</label>
                  <textarea
                    rows={3}
                    value={eventDesc}
                    onChange={e => setEventDesc(e.target.value)}
                    placeholder="Event schedule and details..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-amber-300 font-bold uppercase tracking-wider transition-colors shadow cursor-pointer"
                >
                  {editingEventId ? 'Update Event' : 'Publish Event'}
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <h3 className="font-cinzel font-bold text-slate-900 text-lg">Upcoming College Programs ({events.length})</h3>
              <div className="space-y-3">
                {events.map(ev => (
                  <div key={ev.id} className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                          {ev.category}
                        </span>
                        <span className="text-stone-500 font-mono">{ev.date} • {ev.time}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => handleEditEventClick(ev)}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 font-semibold text-[11px] inline-flex items-center space-x-1 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => {
                            deleteEvent(ev.id);
                            showToast('success', 'Event deleted.');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-[11px] inline-flex items-center space-x-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
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

        {/* TAB 8: GALLERY */}
        {adminTab === 'gallery' && (
          <div className="space-y-6">
            {/* Top Banner: Direct Multi-Picture Uploader & Live Page Link */}
            <div className="bg-gradient-to-r from-[#0f2444] to-[#1b3563] rounded-3xl p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-amber-300 font-bold block">
                  Website Gallery Manager
                </span>
                <h3 className="font-cinzel text-xl font-bold">
                  Upload Pictures to Website Gallery Page
                </h3>
                <p className="text-xs text-slate-200 max-w-xl">
                  All default gallery photos have been removed. Any picture you upload here is immediately saved and displayed on the public <strong>Gallery</strong> page of the website.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <label className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow transition-all inline-flex items-center space-x-2 cursor-pointer">
                  <UploadCloud className="w-4 h-4" />
                  <span>Quick Upload Pictures from Device</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={async e => {
                      const files = e.target.files;
                      if (!files || files.length === 0) return;
                      setIsUploading(true);
                      let uploadedCount = 0;
                      for (let i = 0; i < files.length; i++) {
                        const file = files[i];
                        const res = await uploadFileToStorage('gallery', file);
                        if (res.url) {
                          const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
                          const formattedTitle = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
                          await addGalleryPhoto({
                            title: formattedTitle || 'Campus Photo',
                            category: galCategory,
                            image: res.url,
                            caption: `${formattedTitle} — Image of Christ Bible College, Vellore.`
                          });
                          uploadedCount++;
                        }
                      }
                      setIsUploading(false);
                      e.target.value = '';
                      if (uploadedCount > 0) {
                        showToast('success', `Successfully uploaded ${uploadedCount} picture(s) to the Website Gallery!`);
                      }
                    }}
                  />
                </label>

                <button
                  type="button"
                  onClick={() => setActivePage('gallery')}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/25 font-bold text-xs uppercase tracking-wider transition-all inline-flex items-center space-x-1.5 cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-amber-300" />
                  <span>View Website Gallery ({gallery.length})</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-sm h-fit">
                <div className="flex items-center justify-between">
                  <h3 className="font-cinzel font-bold text-slate-900 text-lg flex items-center space-x-2">
                    {editingGalleryId ? <Edit3 className="w-5 h-5 text-amber-600" /> : <Plus className="w-5 h-5 text-blue-900" />}
                    <span>{editingGalleryId ? 'Edit Gallery Picture' : 'Upload Picture with Details'}</span>
                  </h3>
                  {(editingGalleryId || autoCreatedGalleryId) && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingGalleryId(null);
                        setAutoCreatedGalleryId(null);
                        setGalTitle('');
                        setGalImage('');
                        setGalCaption('');
                      }}
                      className="text-xs text-stone-500 hover:text-slate-900 underline cursor-pointer"
                    >
                      {editingGalleryId ? 'Cancel Edit' : 'Reset Form'}
                    </button>
                  )}
                </div>

                <form onSubmit={handleSaveGallery} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1.5">1. Select Picture from Computer / Phone *</label>
                    <label className="w-full border-2 border-dashed border-blue-900/30 hover:border-blue-900 bg-blue-50/40 hover:bg-blue-50/80 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all">
                      <UploadCloud className="w-7 h-7 text-blue-900 mb-1.5" />
                      <span className="font-bold text-blue-950 text-xs">Click to Choose Picture from Device</span>
                      <span className="text-[11px] text-stone-500 mt-0.5">Auto-saves to Supabase & Website Gallery immediately</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async e => {
                          const f = e.target.files?.[0];
                          if (f) {
                            setIsUploading(true);
                            const res = await uploadFileToStorage('gallery', f);
                            setIsUploading(false);
                            if (res.url) {
                              setGalImage(res.url);
                              const cleanName = f.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
                              const autoTitle = cleanName.charAt(0).toUpperCase() + cleanName.slice(1) || 'Campus Photo';
                              const nextTitle = editingGalleryId && galTitle.trim() ? galTitle.trim() : autoTitle;
                              setGalTitle(nextTitle);

                              if (editingGalleryId) {
                                await updateGalleryPhoto(editingGalleryId, {
                                  image: res.url,
                                  title: nextTitle,
                                  category: galCategory,
                                  caption: galCaption || `${nextTitle} — Image of Christ Bible College, Vellore.`
                                });
                                showToast('success', 'Gallery picture updated in Supabase & Website Gallery!');
                              } else {
                                const created = await addGalleryPhoto({
                                  title: nextTitle,
                                  category: galCategory,
                                  image: res.url,
                                  caption: galCaption || `${nextTitle} — Image of Christ Bible College, Vellore.`
                                });
                                setAutoCreatedGalleryId(created.id);
                                showToast('success', 'Picture uploaded, saved to Supabase & published to Live Website Gallery!');
                              }
                            }
                          }
                          e.target.value = '';
                        }}
                      />
                    </label>
                  </div>

                  {galImage && (
                    <div className="rounded-2xl overflow-hidden border border-stone-200 bg-stone-50 relative">
                      <img src={galImage} alt="Preview" className="w-full h-40 object-cover" />
                      {autoCreatedGalleryId && (
                        <span className="absolute top-2 left-2 px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-bold shadow">
                          ✓ Live in Website Gallery
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          if (autoCreatedGalleryId) {
                            deleteGalleryPhoto(autoCreatedGalleryId);
                            setAutoCreatedGalleryId(null);
                          }
                          setGalImage('');
                        }}
                        className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-slate-900/80 text-white text-[10px] font-bold hover:bg-rose-600 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Or Paste Image URL</label>
                    <input
                      type="text"
                      value={galImage}
                      onChange={e => {
                        const val = e.target.value;
                        setGalImage(val);
                        const targetId = editingGalleryId || autoCreatedGalleryId;
                        if (targetId && val.trim()) {
                          updateGalleryPhoto(targetId, { image: val.trim() });
                        }
                      }}
                      placeholder="https://... (auto-filled when uploading file)"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">2. Picture Title *</label>
                    <input
                      type="text"
                      required
                      value={galTitle}
                      onChange={e => {
                        const val = e.target.value;
                        setGalTitle(val);
                        const targetId = editingGalleryId || autoCreatedGalleryId;
                        if (targetId && val.trim()) {
                          updateGalleryPhoto(targetId, { title: val.trim() });
                        }
                      }}
                      placeholder="e.g. Convocation Ceremony 2025"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">3. Gallery Category</label>
                    <select
                      value={galCategory}
                      onChange={e => {
                        const val = e.target.value as GalleryPhoto['category'];
                        setGalCategory(val);
                        const targetId = editingGalleryId || autoCreatedGalleryId;
                        if (targetId) {
                          updateGalleryPhoto(targetId, { category: val });
                        }
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                    >
                      <option value="Campus">Campus</option>
                      <option value="Chapel">Chapel</option>
                      <option value="Graduation">Graduation</option>
                      <option value="Library">Library</option>
                      <option value="Mission">Mission</option>
                      <option value="Classrooms">Classrooms</option>
                      <option value="Outreach">Outreach</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">4. Caption / Description</label>
                    <textarea
                      rows={3}
                      value={galCaption}
                      onChange={e => {
                        const val = e.target.value;
                        setGalCaption(val);
                        const targetId = editingGalleryId || autoCreatedGalleryId;
                        if (targetId) {
                          updateGalleryPhoto(targetId, { caption: val });
                        }
                      }}
                      placeholder="Describe this campus moment..."
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isUploading}
                    className="w-full py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-amber-300 font-bold uppercase tracking-wider transition-colors shadow cursor-pointer"
                  >
                    {isUploading
                      ? 'Uploading Picture...'
                      : editingGalleryId
                      ? 'Update Gallery Picture'
                      : autoCreatedGalleryId
                      ? 'Save Details & Upload Another Picture'
                      : 'Publish Picture to Gallery'}
                  </button>
                </form>
              </div>

              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-cinzel font-bold text-slate-900 text-lg">
                    Website Gallery Pictures ({gallery.length})
                  </h3>
                  {gallery.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        gallery.forEach(g => deleteGalleryPhoto(g.id));
                        showToast('success', 'All gallery pictures removed.');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs inline-flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear All Photos</span>
                    </button>
                  )}
                </div>

                {gallery.length === 0 ? (
                  <div className="bg-white rounded-3xl border-2 border-dashed border-stone-300 p-12 text-center space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-700">
                      <ImageIcon className="w-7 h-7" />
                    </div>
                    <h4 className="font-cinzel text-lg font-bold text-slate-900">
                      Gallery is Currently Empty
                    </h4>
                    <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
                      All previous default photos have been removed. Use the uploader on the left or click <strong>"Quick Upload Pictures from Device"</strong> above to upload pictures that will appear on the website Gallery page.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {gallery.map(g => (
                      <div key={g.id} className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm flex flex-col justify-between">
                        <div>
                          <div className="h-44 bg-stone-100 relative overflow-hidden">
                            <img src={g.image} alt={g.title} className="w-full h-full object-cover" />
                            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/80 text-amber-300 text-[10px] font-bold uppercase">
                              {g.category}
                            </span>
                          </div>
                          <div className="p-4 space-y-1">
                            <h4 className="font-bold text-slate-900 text-sm">{g.title}</h4>
                            <p className="text-xs text-stone-500 line-clamp-2">{g.caption}</p>
                          </div>
                        </div>

                        <div className="px-4 py-3 border-t border-stone-100 flex items-center justify-end space-x-2 bg-stone-50/50">
                          <button
                            onClick={() => handleEditGalleryClick(g)}
                            className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 font-semibold text-[11px] inline-flex items-center space-x-1 cursor-pointer"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => {
                              deleteGalleryPhoto(g.id);
                              showToast('success', 'Gallery photo deleted.');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-[11px] inline-flex items-center space-x-1 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: DOWNLOADS */}
        {adminTab === 'downloads' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-sm h-fit">
              <div className="flex items-center justify-between">
                <h3 className="font-cinzel font-bold text-slate-900 text-lg flex items-center space-x-2">
                  {editingDownloadId ? <Edit3 className="w-5 h-5 text-amber-600" /> : <Plus className="w-5 h-5 text-blue-900" />}
                  <span>{editingDownloadId ? 'Edit Document' : 'Add Download Document'}</span>
                </h3>
                {editingDownloadId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingDownloadId(null);
                      setDlTitle('');
                      setDlDesc('');
                    }}
                    className="text-xs text-stone-500 hover:text-slate-900 underline cursor-pointer"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveDownload} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Document Title *</label>
                  <input
                    type="text"
                    required
                    value={dlTitle}
                    onChange={e => setDlTitle(e.target.value)}
                    placeholder="e.g. 2026–2027 Academic Prospectus"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Category</label>
                    <select
                      value={dlCategory}
                      onChange={e => setDlCategory(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                    >
                      <option value="Forms">Forms</option>
                      <option value="Prospectus">Prospectus</option>
                      <option value="Academic">Academic</option>
                      <option value="Rules">Rules</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Format</label>
                    <select
                      value={dlFormat}
                      onChange={e => setDlFormat(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                    >
                      <option value="PDF">PDF</option>
                      <option value="DOCX">DOCX</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">File Size</label>
                  <input
                    type="text"
                    value={dlSize}
                    onChange={e => setDlSize(e.target.value)}
                    placeholder="e.g. 1.8 MB"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={dlDesc}
                    onChange={e => setDlDesc(e.target.value)}
                    placeholder="Details included in this downloadable document..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-amber-300 font-bold uppercase tracking-wider transition-colors shadow cursor-pointer"
                >
                  {editingDownloadId ? 'Update Document' : 'Add Document'}
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <h3 className="font-cinzel font-bold text-slate-900 text-lg">Official College Downloads ({downloads.length})</h3>
              <div className="space-y-3">
                {downloads.map(d => (
                  <div key={d.id} className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-[11px]">
                        <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-bold uppercase">
                          {d.category}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-600 font-mono">
                          {d.format} • {d.fileSize}
                        </span>
                        <span className="text-stone-400">Updated: {d.updatedAt}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">{d.title}</h4>
                      <p className="text-xs text-stone-500">{d.description}</p>
                    </div>

                    <div className="flex items-center space-x-1.5 shrink-0">
                      <button
                        onClick={() => handleEditDownloadClick(d)}
                        className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 font-semibold text-[11px] inline-flex items-center space-x-1 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => {
                          deleteDownload(d.id);
                          showToast('success', 'Download item deleted.');
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-[11px] inline-flex items-center space-x-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
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
                <div className="flex items-center justify-between">
                  <h4 className="font-cinzel text-base font-bold text-slate-900">
                    Uploaded Assets ({uploadedFiles.length})
                  </h4>
                  <button
                    onClick={() => {
                      setEditingFileIndex(null);
                      setFileFormName('');
                      setFileFormUrl('');
                      setFileFormSize('1.2 MB');
                      setShowAddFileModal(true);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-amber-300 text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 shadow cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add File / URL</span>
                  </button>
                </div>
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

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(file.url);
                            setCopiedUrl(file.url);
                            showToast('success', 'Public CDN URL copied to clipboard!');
                            setTimeout(() => setCopiedUrl(null), 2500);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-slate-800 font-semibold text-[11px] flex items-center space-x-1 cursor-pointer"
                        >
                          {copiedUrl === file.url ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedUrl === file.url ? 'Copied' : 'Copy URL'}</span>
                        </button>
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-slate-800 font-semibold text-[11px] flex items-center space-x-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>View</span>
                        </a>
                        <button
                          onClick={() => {
                            setEditingFileIndex(i);
                            setFileFormName(file.name);
                            setFileFormUrl(file.url);
                            setFileFormSize(file.size);
                            setSelectedBucket(file.bucket);
                            setShowAddFileModal(true);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 font-semibold text-[11px] flex items-center space-x-1 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => {
                            deleteUploadedFile(i);
                            showToast('success', 'File removed from storage list.');
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-[11px] flex items-center space-x-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-cinzel font-bold text-slate-900 text-lg">
                  Campus Contact & Prayer Messages ({contactMessages.length})
                </h3>
                <p className="text-xs text-stone-500">
                  Add, edit, mark answered, or delete visitor inquiries and prayer requests.
                </p>
              </div>
              <button
                onClick={openAddMessageModal}
                className="px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-amber-300 text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 shadow cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Inquiry / Prayer</span>
              </button>
            </div>
            <div className="space-y-3">
              {contactMessages.length === 0 ? (
                <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-400 space-y-2 shadow-sm">
                  <MessageSquare className="w-8 h-8 text-stone-300 mx-auto mb-1" />
                  <p className="font-semibold text-slate-700 text-sm">No incoming inquiries or messages yet.</p>
                  <p className="text-xs text-stone-400">Click "Add Inquiry / Prayer" above or submit via the Contact Us page.</p>
                </div>
              ) : (
                contactMessages.map(msg => (
                  <div key={msg.id} className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center space-x-2 flex-wrap">
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
                          className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                            msg.status === 'Prayed / Answered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-stone-200 hover:bg-stone-300 text-stone-700'
                          }`}
                        >
                          {msg.status}
                        </button>
                        <button
                          onClick={() => openEditMessageModal(msg)}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 font-semibold text-[11px] inline-flex items-center space-x-1 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => {
                            deleteContactMessage(msg.id);
                            showToast('success', 'Inquiry deleted.');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-[11px] inline-flex items-center space-x-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
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

      {/* MODAL: ADD / EDIT APPLICATION */}
      {showAppModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-cinzel text-xl font-bold text-slate-900">
                {editingAppId ? 'Edit Admission Application' : 'Add New Admission Application'}
              </h3>
              <button
                onClick={() => setShowAppModal(false)}
                className="text-stone-400 hover:text-stone-600 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveApp} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={appFormName}
                    onChange={e => setAppFormName(e.target.value)}
                    placeholder="Applicant Full Name"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={appFormEmail}
                    onChange={e => setAppFormEmail(e.target.value)}
                    placeholder="applicant@example.com"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Phone</label>
                  <input
                    type="text"
                    value={appFormPhone}
                    onChange={e => setAppFormPhone(e.target.value)}
                    placeholder="+91 95004 23126"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Date of Birth</label>
                  <input
                    type="text"
                    value={appFormDob}
                    onChange={e => setAppFormDob(e.target.value)}
                    placeholder="YYYY-MM-DD"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Gender</label>
                  <select
                    value={appFormGender}
                    onChange={e => setAppFormGender(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Target Course</label>
                  <select
                    value={appFormCourseId}
                    onChange={e => setAppFormCourseId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  >
                    <option value="bth">Bachelor of Theology (bth)</option>
                    <option value="mdiv">Master of Divinity (mdiv)</option>
                    <option value="cert">Certificate in Theology (cert)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Previous Education</label>
                  <input
                    type="text"
                    value={appFormEducation}
                    onChange={e => setAppFormEducation(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Home Church</label>
                  <input
                    type="text"
                    value={appFormChurch}
                    onChange={e => setAppFormChurch(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Pastor Name</label>
                  <input
                    type="text"
                    value={appFormPastor}
                    onChange={e => setAppFormPastor(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Pastor Phone</label>
                  <input
                    type="text"
                    value={appFormPastorPhone}
                    onChange={e => setAppFormPastorPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Ministry Calling</label>
                  <input
                    type="text"
                    value={appFormCalling}
                    onChange={e => setAppFormCalling(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Application Status</label>
                  <select
                    value={appFormStatus}
                    onChange={e => setAppFormStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  >
                    <option value="Under Review">Under Review</option>
                    <option value="Interview Scheduled">Interview Scheduled</option>
                    <option value="Admitted">Admitted</option>
                    <option value="Pending Documents">Pending Documents</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Personal Testimony</label>
                <textarea
                  rows={3}
                  value={appFormTestimony}
                  onChange={e => setAppFormTestimony(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAppModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-amber-300 font-bold uppercase tracking-wider shadow cursor-pointer"
                >
                  {editingAppId ? 'Update Application' : 'Save Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT STUDENT */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-cinzel text-xl font-bold text-slate-900">
                {editingStudentId ? 'Edit Student Profile' : 'Register New Student'}
              </h3>
              <button
                onClick={() => setShowAddStudentModal(false)}
                className="text-stone-400 hover:text-stone-600 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStudentSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={newStdName}
                    onChange={e => setNewStdName(e.target.value)}
                    placeholder="e.g. Stephen Paul"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Registration No.</label>
                  <input
                    type="text"
                    value={newStdRegNo}
                    onChange={e => setNewStdRegNo(e.target.value)}
                    placeholder="Auto-generated if blank"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Student Email *</label>
                  <input
                    type="email"
                    required
                    value={newStdEmail}
                    onChange={e => setNewStdEmail(e.target.value)}
                    placeholder="e.g. stephen@student.icbc.ac.in"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={newStdPhone}
                    onChange={e => setNewStdPhone(e.target.value)}
                    placeholder="+91 98400 12345"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Enrolled Degree</label>
                  <select
                    value={newStdCourse}
                    onChange={e => setNewStdCourse(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
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
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Batch</label>
                  <input
                    type="text"
                    value={newStdBatch}
                    onChange={e => setNewStdBatch(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">GPA</label>
                  <input
                    type="text"
                    value={newStdGpa}
                    onChange={e => setNewStdGpa(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Attendance %</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={newStdAttendance}
                    onChange={e => setNewStdAttendance(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Profile Photo (Upload or URL)</label>
                <div className="flex gap-2">
                  <label className="px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-950 border border-blue-200 font-bold text-[11px] inline-flex items-center space-x-1.5 cursor-pointer shrink-0">
                    <UploadCloud className="w-3.5 h-3.5 text-blue-900" />
                    <span>{isUploading ? 'Uploading...' : 'Upload Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async e => {
                        const f = e.target.files?.[0];
                        if (f) {
                          setIsUploading(true);
                          const res = await uploadFileToStorage('student-photos', f);
                          setIsUploading(false);
                          if (res.url) {
                            setNewStdAvatar(res.url);
                            showToast('success', 'Student photo uploaded!');
                          }
                        }
                        e.target.value = '';
                      }}
                    />
                  </label>
                  <input
                    type="text"
                    value={newStdAvatar}
                    onChange={e => setNewStdAvatar(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-amber-300 font-bold uppercase tracking-wider shadow cursor-pointer"
                >
                  {editingStudentId ? 'Update Student' : 'Save Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT FACULTY */}
      {showFacultyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-cinzel text-xl font-bold text-slate-900">
                {editingFacultyId ? 'Edit Faculty Member' : 'Add Faculty Member'}
              </h3>
              <button
                onClick={() => setShowFacultyModal(false)}
                className="text-stone-400 hover:text-stone-600 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveFaculty} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={facName}
                    onChange={e => setFacName(e.target.value)}
                    placeholder="e.g. Rev. Dr. Thomas Paul"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Role / Title *</label>
                  <input
                    type="text"
                    required
                    value={facRole}
                    onChange={e => setFacRole(e.target.value)}
                    placeholder="Professor of Theology"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Department</label>
                <input
                  type="text"
                  value={facDept}
                  onChange={e => setFacDept(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Degrees</label>
                  <input
                    type="text"
                    value={facDegrees}
                    onChange={e => setFacDegrees(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Alma Mater</label>
                  <input
                    type="text"
                    value={facAlmaMater}
                    onChange={e => setFacAlmaMater(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Years Exp.</label>
                  <input
                    type="number"
                    value={facExp}
                    onChange={e => setFacExp(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Subjects Taught (comma-separated)</label>
                <input
                  type="text"
                  value={facSubjects}
                  onChange={e => setFacSubjects(e.target.value)}
                  placeholder="Systematic Theology, Homiletics"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Faculty Photo (Upload or URL)</label>
                <div className="flex gap-2">
                  <label className="px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-950 border border-blue-200 font-bold text-[11px] inline-flex items-center space-x-1.5 cursor-pointer shrink-0">
                    <UploadCloud className="w-3.5 h-3.5 text-blue-900" />
                    <span>{isUploading ? 'Uploading...' : 'Upload Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async e => {
                        const f = e.target.files?.[0];
                        if (f) {
                          setIsUploading(true);
                          const res = await uploadFileToStorage('faculty-photos', f);
                          setIsUploading(false);
                          if (res.url) {
                            setFacPhoto(res.url);
                            showToast('success', 'Faculty photo uploaded!');
                          }
                        }
                        e.target.value = '';
                      }}
                    />
                  </label>
                  <input
                    type="text"
                    value={facPhoto}
                    onChange={e => setFacPhoto(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Biography</label>
                <textarea
                  rows={3}
                  value={facBio}
                  onChange={e => setFacBio(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowFacultyModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-amber-300 font-bold uppercase tracking-wider shadow cursor-pointer"
                >
                  {editingFacultyId ? 'Update Faculty' : 'Save Faculty'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT COURSE */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-cinzel text-xl font-bold text-slate-900">
                {editingCourseId ? 'Edit Degree Course' : 'Add New Degree Course'}
              </h3>
              <button
                onClick={() => setShowCourseModal(false)}
                className="text-stone-400 hover:text-stone-600 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Course Code *</label>
                  <input
                    type="text"
                    required
                    value={crsCode}
                    onChange={e => setCrsCode(e.target.value)}
                    placeholder="e.g. B.Th or Dip.Th"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Level</label>
                  <select
                    value={crsLevel}
                    onChange={e => setCrsLevel(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  >
                    <option value="Certificate">Certificate</option>
                    <option value="Diploma">Diploma</option>
                    <option value="Bachelor">Bachelor</option>
                    <option value="Master">Master</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Course Title *</label>
                <input
                  type="text"
                  required
                  value={crsTitle}
                  onChange={e => setCrsTitle(e.target.value)}
                  placeholder="e.g. Bachelor of Theology"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Duration</label>
                  <input
                    type="text"
                    value={crsDuration}
                    onChange={e => setCrsDuration(e.target.value)}
                    placeholder="3 Years"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Study Mode</label>
                  <select
                    value={crsMode}
                    onChange={e => setCrsMode(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  >
                    <option value="Residential & Day Scholar">Residential & Day Scholar</option>
                    <option value="Full-Time Residential">Full-Time Residential</option>
                    <option value="Weekend / Evening">Weekend / Evening</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Total Credits</label>
                  <input
                    type="number"
                    value={crsCredits}
                    onChange={e => setCrsCredits(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Annual Tuition</label>
                  <input
                    type="text"
                    value={crsTuition}
                    onChange={e => setCrsTuition(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Eligibility</label>
                <input
                  type="text"
                  value={crsEligibility}
                  onChange={e => setCrsEligibility(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Course Description</label>
                <textarea
                  rows={3}
                  value={crsDesc}
                  onChange={e => setCrsDesc(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCourseModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-amber-300 font-bold uppercase tracking-wider shadow cursor-pointer"
                >
                  {editingCourseId ? 'Update Course' : 'Save Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT SUBJECT */}
      {showSubjectModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-cinzel text-xl font-bold text-slate-900">
                {editingSubjectId ? 'Edit Curriculum Subject' : 'Add Curriculum Subject'}
              </h3>
              <button
                onClick={() => setShowSubjectModal(false)}
                className="text-stone-400 hover:text-stone-600 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSubject} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Subject Code *</label>
                  <input
                    type="text"
                    required
                    value={subCode}
                    onChange={e => setSubCode(e.target.value)}
                    placeholder="TH-105"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Degree Program</label>
                  <select
                    value={subCourseId}
                    onChange={e => setSubCourseId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  >
                    <option value="bth">B.Th (bth)</option>
                    <option value="mdiv">M.Div (mdiv)</option>
                    <option value="cert">Certificate (cert)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Subject Name *</label>
                <input
                  type="text"
                  required
                  value={subName}
                  onChange={e => setSubName(e.target.value)}
                  placeholder="e.g. Systematic Theology I"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Semester / Year</label>
                  <input
                    type="text"
                    value={subSemester}
                    onChange={e => setSubSemester(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Credit Hours</label>
                  <input
                    type="number"
                    value={subCredits}
                    onChange={e => setSubCredits(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Assigned Faculty</label>
                <input
                  type="text"
                  value={subFaculty}
                  onChange={e => setSubFaculty(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowSubjectModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-amber-300 font-bold uppercase tracking-wider shadow cursor-pointer"
                >
                  {editingSubjectId ? 'Update Subject' : 'Save Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT INQUIRY OR PRAYER REQUEST */}
      {showMessageModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-cinzel text-xl font-bold text-slate-900">
                {editingMsgId ? 'Edit Inquiry / Prayer Request' : 'Add Inquiry / Prayer Request'}
              </h3>
              <button
                onClick={() => setShowMessageModal(false)}
                className="text-stone-400 hover:text-stone-600 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMessage} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Sender Name *</label>
                  <input
                    type="text"
                    required
                    value={msgName}
                    onChange={e => setMsgName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Phone</label>
                  <input
                    type="text"
                    value={msgPhone}
                    onChange={e => setMsgPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Email</label>
                  <input
                    type="email"
                    value={msgEmail}
                    onChange={e => setMsgEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Status</label>
                  <select
                    value={msgStatus}
                    onChange={e => setMsgStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  >
                    <option value="New">New</option>
                    <option value="Prayed / Answered">Prayed / Answered</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Subject</label>
                <input
                  type="text"
                  value={msgSubject}
                  onChange={e => setMsgSubject(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Message / Prayer Petition *</label>
                <textarea
                  rows={3}
                  required
                  value={msgContent}
                  onChange={e => setMsgContent(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPrayerCheck"
                  checked={msgIsPrayer}
                  onChange={e => setMsgIsPrayer(e.target.checked)}
                />
                <label htmlFor="isPrayerCheck" className="font-semibold text-rose-700">
                  Mark as Prayer Request
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowMessageModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-amber-300 font-bold uppercase tracking-wider shadow cursor-pointer"
                >
                  {editingMsgId ? 'Update Message' : 'Save Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT STORAGE FILE */}
      {showAddFileModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-cinzel text-xl font-bold text-slate-900">
                {editingFileIndex !== null ? 'Edit Storage File Record' : 'Add Storage File Record'}
              </h3>
              <button
                onClick={() => setShowAddFileModal(false)}
                className="text-stone-400 hover:text-stone-600 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={e => {
                e.preventDefault();
                if (!fileFormName.trim() || !fileFormUrl.trim()) {
                  showToast('error', 'Please enter file name and URL.');
                  return;
                }
                if (editingFileIndex !== null) {
                  updateUploadedFile(editingFileIndex, {
                    name: fileFormName,
                    url: fileFormUrl,
                    size: fileFormSize,
                    bucket: selectedBucket
                  });
                  showToast('success', 'Storage file record updated.');
                } else {
                  addUploadedFileManual({
                    name: fileFormName,
                    url: fileFormUrl,
                    size: fileFormSize || '1.0 MB',
                    bucket: selectedBucket,
                    uploadedAt: new Date().toISOString().split('T')[0]
                  });
                  showToast('success', 'Storage file record added.');
                }
                setShowAddFileModal(false);
                setEditingFileIndex(null);
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">File Name *</label>
                <input
                  type="text"
                  required
                  value={fileFormName}
                  onChange={e => setFileFormName(e.target.value)}
                  placeholder="e.g. ICBC-2026-Brochure.pdf"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Bucket</label>
                <select
                  value={selectedBucket}
                  onChange={e => setSelectedBucket(e.target.value as StorageBucket)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                >
                  {ALL_STORAGE_BUCKETS.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Public File URL *</label>
                <input
                  type="text"
                  required
                  value={fileFormUrl}
                  onChange={e => setFileFormUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">File Size</label>
                <input
                  type="text"
                  value={fileFormSize}
                  onChange={e => setFileFormSize(e.target.value)}
                  placeholder="1.2 MB"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddFileModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-amber-300 font-bold uppercase tracking-wider shadow cursor-pointer"
                >
                  {editingFileIndex !== null ? 'Update File' : 'Save File'}
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
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    const appToEdit = inspectedApp;
                    setInspectedApp(null);
                    openEditAppModal(appToEdit);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold text-xs inline-flex items-center space-x-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => {
                    deleteApplication(inspectedApp.id);
                    setInspectedApp(null);
                    showToast('success', 'Application deleted.');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs inline-flex items-center space-x-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
                <button
                  onClick={() => setInspectedApp(null)}
                  className="text-stone-400 hover:text-stone-600 font-bold text-lg pl-2 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-stone-50 p-4 rounded-2xl text-slate-800">
                <div><strong>Email:</strong> {inspectedApp.email}</div>
                <div><strong>Phone:</strong> {inspectedApp.phone}</div>
                <div><strong>Date of Birth:</strong> {inspectedApp.dateOfBirth}</div>
                <div><strong>Gender:</strong> {inspectedApp.gender}</div>
                <div><strong>Course:</strong> <span className="uppercase font-bold text-blue-950">{inspectedApp.courseId}</span></div>
                <div><strong>Education:</strong> {inspectedApp.previousEducation}</div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-1">Local Church & Pastoral Reference</h4>
                <div className="bg-stone-50 p-4 rounded-2xl space-y-1 text-slate-800">
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
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
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
