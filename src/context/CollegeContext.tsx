import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  Course,
  FacultyMember,
  StudentProfile,
  StudyMaterial,
  Notice,
  EventItem,
  GalleryPhoto,
  DownloadDoc,
  ApplicationSubmission,
  ContactMessage,
  UserRole,
  AppUser,
  SubjectItem,
  StorageBucket,
  UploadedStorageFile
} from '../types';
import {
  INITIAL_COURSES,
  INITIAL_FACULTY,
  INITIAL_STUDENT_PROFILE,
  INITIAL_STUDENTS,
  INITIAL_SUBJECTS,
  INITIAL_STUDY_MATERIALS,
  INITIAL_NOTICES,
  INITIAL_EVENTS,
  INITIAL_GALLERY,
  INITIAL_DOWNLOADS,
  INITIAL_APPLICATIONS,
  INITIAL_CONTACT_MESSAGES
} from '../data/collegeData';
import {
  getSupabaseClient,
  getSavedSupabaseConfig,
  saveSupabaseConfig,
  isExternalSupabaseUrl,
  DEFAULT_SUPABASE_KEY,
  supabaseSignIn,
  supabaseSignUp,
  supabaseSignOut,
  uploadToSupabaseStorage
} from '../lib/supabase';

export type ActivePage =
  | 'home'
  | 'about'
  | 'about-history'
  | 'about-vision'
  | 'about-leadership'
  | 'courses'
  | 'courses-bth'
  | 'courses-mdiv'
  | 'courses-cert'
  | 'courses-short'
  | 'admissions'
  | 'admissions-eligibility'
  | 'admissions-application'
  | 'admissions-fees'
  | 'faculty'
  | 'students'
  | 'students-login'
  | 'students-materials'
  | 'students-notices'
  | 'events'
  | 'gallery'
  | 'downloads'
  | 'contact'
  | 'admin'
  | 'login-user'
  | 'login-admin';

export interface SupabaseSyncStatus {
  connected: boolean;
  projectUrl: string;
  publishableKey: string;
  lastSyncedAt?: string;
  syncError?: string | null;
}

interface CollegeContextType {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  loginMode: 'user' | 'admin';
  setLoginMode: (mode: 'user' | 'admin') => void;
  courses: Course[];
  faculty: FacultyMember[];
  addFaculty: (member: Omit<FacultyMember, 'id'>) => Promise<void>;
  updateFaculty: (id: string, updates: Partial<FacultyMember>) => Promise<void>;
  deleteFaculty: (id: string) => Promise<void>;
  // Student Portal
  studentProfile: StudentProfile | null;
  isStudentLoggedIn: boolean;
  loginStudent: (regNo: string) => boolean;
  logoutStudent: () => void;
  // Student Roster & Subjects
  studentsList: StudentProfile[];
  addStudent: (student: StudentProfile) => Promise<void>;
  updateStudent: (id: string, updates: Partial<StudentProfile>) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  subjectsList: SubjectItem[];
  addSubject: (subject: SubjectItem) => Promise<void>;
  updateSubject: (id: string, updates: Partial<SubjectItem>) => Promise<void>;
  deleteSubject: (id: string) => Promise<void>;
  // Supabase Auth State (STEP 3)
  currentUser: AppUser | null;
  currentAuthRole: UserRole | null;
  authLoading: boolean;
  loginWithSupabase: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signUpWithSupabase: (email: string, pass: string, name: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  loginWithPin: (pin: string) => boolean;
  loginWithAdminCredentials: (email: string, pass: string) => boolean;
  logout: () => Promise<void>;
  // Storage & Files (STEP 4)
  uploadedFiles: UploadedStorageFile[];
  uploadFileToStorage: (bucket: StorageBucket, file: File) => Promise<{ url: string; error?: string }>;
  addUploadedFileManual: (file: UploadedStorageFile) => void;
  updateUploadedFile: (index: number, updates: Partial<UploadedStorageFile>) => void;
  deleteUploadedFile: (index: number) => void;
  // Content & Admissions
  studyMaterials: StudyMaterial[];
  addStudyMaterial: (material: Omit<StudyMaterial, 'id' | 'uploadedDate'>) => Promise<void>;
  updateStudyMaterial: (id: string, updates: Partial<StudyMaterial>) => Promise<void>;
  deleteStudyMaterial: (id: string) => Promise<void>;
  notices: Notice[];
  addNotice: (notice: Omit<Notice, 'id' | 'date'>) => Promise<void>;
  updateNotice: (id: string, updates: Partial<Notice>) => Promise<void>;
  deleteNotice: (id: string) => Promise<void>;
  events: EventItem[];
  addEvent: (ev: Omit<EventItem, 'id'>) => Promise<void>;
  updateEvent: (id: string, updates: Partial<EventItem>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  gallery: GalleryPhoto[];
  addGalleryPhoto: (photo: Omit<GalleryPhoto, 'id'>) => Promise<GalleryPhoto>;
  updateGalleryPhoto: (id: string, updates: Partial<GalleryPhoto>) => Promise<void>;
  deleteGalleryPhoto: (id: string) => Promise<void>;
  addCourse: (course: Course) => Promise<void>;
  updateCourse: (id: string, updates: Partial<Course>) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  downloads: DownloadDoc[];
  addDownload: (doc: Omit<DownloadDoc, 'id' | 'updatedAt' | 'downloadCount'>) => Promise<void>;
  updateDownload: (id: string, updates: Partial<DownloadDoc>) => Promise<void>;
  deleteDownload: (id: string) => Promise<void>;
  recordDownload: (id: string) => void;
  applications: ApplicationSubmission[];
  submitApplication: (
    app: Omit<ApplicationSubmission, 'id' | 'applicationNo' | 'submittedAt' | 'status'> & {
      status?: ApplicationSubmission['status'];
    }
  ) => Promise<string>;
  updateApplication: (id: string, updates: Partial<ApplicationSubmission>) => Promise<void>;
  updateApplicationStatus: (id: string, status: ApplicationSubmission['status'], notes?: string) => Promise<void>;
  deleteApplication: (id: string) => Promise<void>;
  contactMessages: ContactMessage[];
  submitContactMessage: (msg: Omit<ContactMessage, 'id' | 'date' | 'status'>) => Promise<void>;
  updateContactMessage: (id: string, updates: Partial<ContactMessage>) => Promise<void>;
  deleteContactMessage: (id: string) => Promise<void>;
  markMessageAnswered: (id: string) => Promise<void>;
  selectedCourseForApply: string | null;
  setSelectedCourseForApply: (courseId: string | null) => void;
  activeDocumentPreview: { title: string; type: string; content?: string } | null;
  setActiveDocumentPreview: (doc: { title: string; type: string; content?: string } | null) => void;
  // Supabase Database Connection & Seeding (STEP 2 & 5)
  supabaseStatus: SupabaseSyncStatus;
  updateSupabaseCredentials: (url: string, key: string) => Promise<{ success: boolean; message: string }>;
  syncWithSupabase: () => Promise<void>;
  seedAllDataToSupabase: () => Promise<{ success: boolean; message: string; seededCount: number }>;
}

const CollegeContext = createContext<CollegeContextType | undefined>(undefined);

const STORAGE_KEYS = {
  NOTICES: 'icbc_notices_v2',
  MATERIALS: 'icbc_materials_v2',
  APPLICATIONS: 'icbc_applications_v2',
  CONTACT: 'icbc_contact_v2',
  EVENTS: 'icbc_events_v2',
  STUDENTS: 'icbc_students_v2',
  SUBJECTS: 'icbc_subjects_v2',
  COURSES: 'icbc_courses_v2',
  FACULTY: 'icbc_faculty_v2',
  DOWNLOADS: 'icbc_downloads_v2',
  GALLERY: 'icbc_gallery_v4_empty',
  UPLOADED_FILES: 'icbc_uploaded_files_v2',
  AUTH_USER: 'icbc_auth_user_v2',
  STUDENT_AUTH: 'icbc_student_auth_v2',
  DELETED_IDS: 'icbc_deleted_ids_v2'
};

const safeSetLocalStorage = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    try {
      // Free up space from secondary uploaded_files cache if localStorage quota is full
      if (key !== STORAGE_KEYS.UPLOADED_FILES) {
        localStorage.removeItem(STORAGE_KEYS.UPLOADED_FILES);
        localStorage.setItem(key, value);
      }
    } catch {
      // ignore quota error
    }
  }
};

export const CollegeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [loginMode, setLoginMode] = useState<'user' | 'admin'>('user');
  const [selectedCourseForApply, setSelectedCourseForApply] = useState<string | null>(null);
  const [activeDocumentPreview, setActiveDocumentPreview] = useState<{ title: string; type: string; content?: string } | null>(null);

  // Supabase status state (Always connected via built-in Supabase Realtime Engine + Cloud)
  const initialConfig = getSavedSupabaseConfig();
  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseSyncStatus>({
    connected: true,
    projectUrl: initialConfig.url,
    publishableKey: initialConfig.key || DEFAULT_SUPABASE_KEY,
    lastSyncedAt: new Date().toLocaleTimeString(),
    syncError: null
  });

  // STEP 3: Supabase & PIN Authentication State
  const [authLoading, setAuthLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.id?.startsWith('demo-')) {
          localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
          return null;
        }
        return parsed;
      } catch {
        return null;
      }
    }
    return null;
  });

  const currentAuthRole: UserRole | null = currentUser?.role || null;

  // Student auth state (default logged out)
  const [isStudentLoggedIn, setIsStudentLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STUDENT_AUTH);
    return saved !== null ? JSON.parse(saved) : false;
  });
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(() => {
    const saved = localStorage.getItem('icbc_student_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  // Stored state with fallbacks
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COURSES);
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });
  const [faculty, setFaculty] = useState<FacultyMember[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FACULTY);
    return saved ? JSON.parse(saved) : INITIAL_FACULTY;
  });
  const [gallery, setGallery] = useState<GalleryPhoto[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GALLERY);
    return saved ? JSON.parse(saved) : INITIAL_GALLERY;
  });
  const [downloads, setDownloads] = useState<DownloadDoc[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DOWNLOADS);
    return saved ? JSON.parse(saved) : INITIAL_DOWNLOADS;
  });

  const [studentsList, setStudentsList] = useState<StudentProfile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [subjectsList, setSubjectsList] = useState<SubjectItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
    return saved ? JSON.parse(saved) : INITIAL_SUBJECTS;
  });

  const [uploadedFiles, setUploadedFiles] = useState<UploadedStorageFile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.UPLOADED_FILES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [notices, setNotices] = useState<Notice[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTICES);
    return saved ? JSON.parse(saved) : INITIAL_NOTICES;
  });

  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MATERIALS);
    return saved ? JSON.parse(saved) : INITIAL_STUDY_MATERIALS;
  });

  const [events, setEvents] = useState<EventItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EVENTS);
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [applications, setApplications] = useState<ApplicationSubmission[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    if (saved) {
      try {
        const parsed: ApplicationSubmission[] = JSON.parse(saved);
        return parsed.filter(a => !['app-1', 'app-2', 'app-3'].includes(a.id));
      } catch {
        return [];
      }
    }
    return INITIAL_APPLICATIONS;
  });

  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CONTACT);
    if (saved) {
      try {
        const parsed: ContactMessage[] = JSON.parse(saved);
        return parsed.filter(m => !['msg-1', 'msg-2'].includes(m.id));
      } catch {
        return [];
      }
    }
    return INITIAL_CONTACT_MESSAGES;
  });

  const clientSessionId = useRef(`tab-${Date.now()}-${Math.random().toString(36).slice(2)}`).current;

  const deletedIdsRef = useRef<Set<string>>(
    (() => {
      try {
        const saved = localStorage.getItem(STORAGE_KEYS.DELETED_IDS);
        return saved ? new Set<string>(JSON.parse(saved)) : new Set<string>();
      } catch {
        return new Set<string>();
      }
    })()
  );

  const recordDeletedId = (id: string) => {
    deletedIdsRef.current.add(id);
    safeSetLocalStorage(STORAGE_KEYS.DELETED_IDS, JSON.stringify(Array.from(deletedIdsRef.current)));
  };

  // Always-fresh ref of all state arrays so SSE/Realtime callbacks never read stale closures
  const liveStateRef = useRef({
    courses,
    faculty,
    studentsList,
    subjectsList,
    applications,
    notices,
    events,
    studyMaterials,
    gallery,
    downloads,
    contactMessages,
    uploadedFiles
  });
  liveStateRef.current = {
    courses,
    faculty,
    studentsList,
    subjectsList,
    applications,
    notices,
    events,
    studyMaterials,
    gallery,
    downloads,
    contactMessages,
    uploadedFiles
  };

  // Helper to push updates to persistent Supabase server store & broadcast to all open website tabs
  const pushToSupabaseBackend = async (payload: Record<string, any[]>) => {
    if (Array.isArray(payload.courses)) safeSetLocalStorage(STORAGE_KEYS.COURSES, JSON.stringify(payload.courses));
    if (Array.isArray(payload.faculty)) safeSetLocalStorage(STORAGE_KEYS.FACULTY, JSON.stringify(payload.faculty));
    if (Array.isArray(payload.students)) safeSetLocalStorage(STORAGE_KEYS.STUDENTS, JSON.stringify(payload.students));
    if (Array.isArray(payload.subjects)) safeSetLocalStorage(STORAGE_KEYS.SUBJECTS, JSON.stringify(payload.subjects));
    if (Array.isArray(payload.admissions)) safeSetLocalStorage(STORAGE_KEYS.APPLICATIONS, JSON.stringify(payload.admissions));
    if (Array.isArray(payload.notices)) safeSetLocalStorage(STORAGE_KEYS.NOTICES, JSON.stringify(payload.notices));
    if (Array.isArray(payload.events)) safeSetLocalStorage(STORAGE_KEYS.EVENTS, JSON.stringify(payload.events));
    if (Array.isArray(payload.study_materials)) safeSetLocalStorage(STORAGE_KEYS.MATERIALS, JSON.stringify(payload.study_materials));
    if (Array.isArray(payload.gallery)) safeSetLocalStorage(STORAGE_KEYS.GALLERY, JSON.stringify(payload.gallery));
    if (Array.isArray(payload.downloads)) safeSetLocalStorage(STORAGE_KEYS.DOWNLOADS, JSON.stringify(payload.downloads));
    if (Array.isArray(payload.contact_messages)) safeSetLocalStorage(STORAGE_KEYS.CONTACT, JSON.stringify(payload.contact_messages));
    if (Array.isArray(payload.uploaded_files)) safeSetLocalStorage(STORAGE_KEYS.UPLOADED_FILES, JSON.stringify(payload.uploaded_files));

    try {
      if (typeof BroadcastChannel !== 'undefined') {
        const bc = new BroadcastChannel('icbc_supabase_realtime');
        bc.postMessage({
          type: 'SUPABASE_REALTIME_SYNC',
          senderId: clientSessionId,
          state: payload,
          updatedAt: new Date().toISOString()
        });
        bc.close();
      }
    } catch {
      // ignore BroadcastChannel errors
    }

    try {
      await fetch('/api/supabase/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, _senderId: clientSessionId })
      });
      setSupabaseStatus(prev => ({
        ...prev,
        connected: true,
        lastSyncedAt: new Date().toLocaleTimeString(),
        syncError: null
      }));
    } catch (err) {
      console.warn('Background Supabase sync error:', err);
    }
  };

  // Apply incoming real-time state from Supabase stream / BroadcastChannel
  const applyRealtimeState = (stateObj: any) => {
    if (!stateObj || typeof stateObj !== 'object') return;
    if (Array.isArray(stateObj.courses)) setCourses(stateObj.courses);
    if (Array.isArray(stateObj.faculty)) setFaculty(stateObj.faculty);
    if (Array.isArray(stateObj.students)) setStudentsList(stateObj.students);
    if (Array.isArray(stateObj.subjects)) setSubjectsList(stateObj.subjects);
    if (Array.isArray(stateObj.admissions)) setApplications(stateObj.admissions);
    if (Array.isArray(stateObj.notices)) setNotices(stateObj.notices);
    if (Array.isArray(stateObj.events)) setEvents(stateObj.events);
    if (Array.isArray(stateObj.study_materials)) setStudyMaterials(stateObj.study_materials);
    if (Array.isArray(stateObj.gallery)) setGallery(stateObj.gallery);
    if (Array.isArray(stateObj.downloads)) setDownloads(stateObj.downloads);
    if (Array.isArray(stateObj.contact_messages)) setContactMessages(stateObj.contact_messages);
    if (Array.isArray(stateObj.uploaded_files)) setUploadedFiles(stateObj.uploaded_files);

    setSupabaseStatus(prev => ({
      ...prev,
      connected: true,
      lastSyncedAt: new Date().toLocaleTimeString(),
      syncError: null
    }));
  };

  // Sync to local storage for instant offline resilience
  useEffect(() => {
    safeSetLocalStorage(STORAGE_KEYS.NOTICES, JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    safeSetLocalStorage(STORAGE_KEYS.MATERIALS, JSON.stringify(studyMaterials));
  }, [studyMaterials]);

  useEffect(() => {
    safeSetLocalStorage(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    safeSetLocalStorage(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    safeSetLocalStorage(STORAGE_KEYS.CONTACT, JSON.stringify(contactMessages));
  }, [contactMessages]);

  useEffect(() => {
    safeSetLocalStorage(STORAGE_KEYS.STUDENTS, JSON.stringify(studentsList));
    if (studentProfile) {
      const updatedSelf = studentsList.find(
        s => s.id === studentProfile.id || s.regNo.toLowerCase() === studentProfile.regNo.toLowerCase()
      );
      if (updatedSelf && JSON.stringify(updatedSelf) !== JSON.stringify(studentProfile)) {
        setStudentProfile(updatedSelf);
        safeSetLocalStorage('icbc_student_profile', JSON.stringify(updatedSelf));
      }
    }
  }, [studentsList]);

  useEffect(() => {
    safeSetLocalStorage(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjectsList));
  }, [subjectsList]);

  useEffect(() => {
    safeSetLocalStorage(STORAGE_KEYS.COURSES, JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    safeSetLocalStorage(STORAGE_KEYS.FACULTY, JSON.stringify(faculty));
  }, [faculty]);

  useEffect(() => {
    safeSetLocalStorage(STORAGE_KEYS.DOWNLOADS, JSON.stringify(downloads));
  }, [downloads]);

  useEffect(() => {
    safeSetLocalStorage(STORAGE_KEYS.GALLERY, JSON.stringify(gallery));
  }, [gallery]);

  useEffect(() => {
    safeSetLocalStorage(STORAGE_KEYS.UPLOADED_FILES, JSON.stringify(uploadedFiles));
  }, [uploadedFiles]);

  useEffect(() => {
    if (currentUser) {
      safeSetLocalStorage(STORAGE_KEYS.AUTH_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    safeSetLocalStorage(STORAGE_KEYS.STUDENT_AUTH, JSON.stringify(isStudentLoggedIn));
  }, [isStudentLoggedIn]);

  // Listen to Supabase Auth State changes on mount if connected to external Supabase
  useEffect(() => {
    const cfg = getSavedSupabaseConfig();
    if (!isExternalSupabaseUrl(cfg.url)) return;
    const client = getSupabaseClient();
    if (!client) return;

    try {
      const { data: authListener } = client.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          const userMeta = session.user.user_metadata || {};
          const role = (userMeta.role as UserRole) || 'student';
          const name = userMeta.full_name || session.user.email?.split('@')[0] || 'User';

          setCurrentUser({
            id: session.user.id,
            email: session.user.email || '',
            fullName: name,
            role: role
          });

          if (role === 'student') {
            setIsStudentLoggedIn(true);
            const foundStudent = studentsList.find(s => s.email.toLowerCase() === session.user.email?.toLowerCase());
            if (foundStudent) setStudentProfile(foundStudent);
          }
        }
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    } catch (e) {
      console.warn('Supabase auth state listener setup failed:', e);
    }
  }, [studentsList]);

  // Auth actions
  const loginStudent = (regNo: string): boolean => {
    const cleanId = regNo.toLowerCase().trim();
    if (!cleanId) return false;
    const found = studentsList.find(
      s => s.regNo.toLowerCase() === cleanId || s.email.toLowerCase() === cleanId
    );
    if (found) {
      setStudentProfile(found);
      setIsStudentLoggedIn(true);
      setCurrentUser({
        id: found.id,
        email: found.email,
        fullName: found.name,
        role: 'student',
        studentId: found.regNo
      });
      localStorage.setItem('icbc_student_profile', JSON.stringify(found));
      localStorage.setItem(STORAGE_KEYS.STUDENT_AUTH, JSON.stringify(true));
      return true;
    }
    return false;
  };

  const logoutStudent = () => {
    setIsStudentLoggedIn(false);
    setStudentProfile(null);
    localStorage.removeItem('icbc_student_profile');
    localStorage.setItem(STORAGE_KEYS.STUDENT_AUTH, JSON.stringify(false));
  };

  // STEP 3: Supabase Auth functions
  const loginWithSupabase = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setAuthLoading(true);
    try {
      const result = await supabaseSignIn(email, pass);
      if (result.error) {
        setAuthLoading(false);
        return { success: false, error: result.error };
      }
      if (result.user) {
        const meta = result.user.user_metadata || {};
        const role = (meta.role as UserRole) || 'student';
        const userObj: AppUser = {
          id: result.user.id,
          email: result.user.email || email,
          fullName: meta.full_name || email.split('@')[0],
          role: role
        };
        setCurrentUser(userObj);
        if (role === 'student') {
          setIsStudentLoggedIn(true);
          const found = studentsList.find(s => s.email.toLowerCase() === email.toLowerCase());
          if (found) setStudentProfile(found);
        }
        setAuthLoading(false);
        return { success: true };
      }
      setAuthLoading(false);
      return { success: false, error: 'Unknown response' };
    } catch (err: any) {
      setAuthLoading(false);
      return { success: false, error: err?.message || 'Login failed' };
    }
  };

  const signUpWithSupabase = async (
    email: string,
    pass: string,
    name: string,
    role: UserRole
  ): Promise<{ success: boolean; error?: string }> => {
    setAuthLoading(true);
    try {
      const result = await supabaseSignUp(email, pass, name, role);
      if (result.error) {
        setAuthLoading(false);
        return { success: false, error: result.error };
      }
      if (result.user) {
        const userObj: AppUser = {
          id: result.user.id,
          email: email,
          fullName: name,
          role: role
        };
        setCurrentUser(userObj);
        setAuthLoading(false);
        return { success: true };
      }
      setAuthLoading(false);
      return { success: false, error: 'Sign up failed' };
    } catch (err: any) {
      setAuthLoading(false);
      return { success: false, error: err?.message || 'Sign up failed' };
    }
  };

  const loginWithAdminCredentials = (email: string, pass: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    // Specifically authenticate requested credentials & Master PIN 801551
    if (
      cleanPass === '801551' ||
      (cleanEmail === 'imageofchrist@gmail.com' && (cleanPass === 'Image097' || cleanPass === 'image097' || cleanPass === '801551')) ||
      (cleanEmail === 'admin@iocbc.edu.in' && (cleanPass === 'Image097' || cleanPass === '801551'))
    ) {
      const adminUser: AppUser = {
        id: 'admin-authorized-iocbc',
        email: cleanEmail || 'imageofchrist@gmail.com',
        fullName: 'Pr. Christopher',
        role: 'super_admin'
      };
      setCurrentUser(adminUser);
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(adminUser));

      const client = getSupabaseClient();
      if (client) {
        client.auth.signInWithPassword({ email: cleanEmail, password: cleanPass }).catch(() => {});
      }
      return true;
    }
    return false;
  };

  const loginWithPin = (pin: string): boolean => {
    const cleanPin = pin.trim();
    if (
      cleanPin === '801551' ||
      cleanPin === 'Image097' ||
      cleanPin === 'image097'
    ) {
      const adminUser: AppUser = {
        id: 'admin-authorized-iocbc',
        email: 'imageofchrist@gmail.com',
        fullName: 'Pr. Christopher',
        role: 'super_admin'
      };
      setCurrentUser(adminUser);
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(adminUser));
      return true;
    }
    return false;
  };

  const logout = async () => {
    await supabaseSignOut();
    setCurrentUser(null);
    setIsStudentLoggedIn(false);
  };

  // STEP 4: Storage Upload Handler
  const uploadFileToStorage = async (
    bucket: StorageBucket,
    file: File
  ): Promise<{ url: string; error?: string }> => {
    // Convert image files to persistent compressed Data URLs so uploaded gallery/faculty/student photos survive page reloads and always render
    const getPersistentFileUrl = (f: File): Promise<string> => {
      return new Promise(resolve => {
        if (!f.type.startsWith('image/')) {
          const r = new FileReader();
          r.onload = () => resolve((r.result as string) || URL.createObjectURL(f));
          r.onerror = () => resolve(URL.createObjectURL(f));
          r.readAsDataURL(f);
          return;
        }
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result as string;
          const img = new window.Image();
          img.onload = () => {
            try {
              const maxDim = 960;
              let w = img.width;
              let h = img.height;
              if (w > maxDim || h > maxDim) {
                if (w > h) {
                  h = Math.round((h * maxDim) / w);
                  w = maxDim;
                } else {
                  w = Math.round((w * maxDim) / h);
                  h = maxDim;
                }
              }
              const canvas = document.createElement('canvas');
              canvas.width = w;
              canvas.height = h;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.drawImage(img, 0, 0, w, h);
                resolve(canvas.toDataURL('image/jpeg', 0.78));
                return;
              }
            } catch {
              // fallback to raw dataUrl
            }
            resolve(dataUrl);
          };
          img.onerror = () => resolve(dataUrl);
          img.src = dataUrl;
        };
        reader.onerror = () => resolve(URL.createObjectURL(f));
        reader.readAsDataURL(f);
      });
    };

    let finalUrl = await getPersistentFileUrl(file);

    const cfg = getSavedSupabaseConfig();
    const client = getSupabaseClient();
    if (client && isExternalSupabaseUrl(cfg.url)) {
      const result = await uploadToSupabaseStorage(bucket, file);
      if (result.url) {
        finalUrl = result.url;
      }
    }

    const newFile: UploadedStorageFile = {
      name: file.name,
      bucket: bucket,
      url: finalUrl,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      uploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    setUploadedFiles(prev => {
      const next = [newFile, ...prev];
      pushToSupabaseBackend({ uploaded_files: next });
      return next;
    });
    return { url: finalUrl };
  };

  const addUploadedFileManual = (file: UploadedStorageFile) => {
    setUploadedFiles(prev => {
      const next = [file, ...prev];
      pushToSupabaseBackend({ uploaded_files: next });
      return next;
    });
  };

  const updateUploadedFile = (index: number, updates: Partial<UploadedStorageFile>) => {
    setUploadedFiles(prev => {
      const next = prev.map((f, i) => (i === index ? { ...f, ...updates } : f));
      pushToSupabaseBackend({ uploaded_files: next });
      return next;
    });
  };

  const deleteUploadedFile = (index: number) => {
    setUploadedFiles(prev => {
      const next = prev.filter((_, i) => i !== index);
      pushToSupabaseBackend({ uploaded_files: next });
      return next;
    });
  };

  // Faculty management
  const addFaculty = async (member: Omit<FacultyMember, 'id'>) => {
    const id = `fac-${Date.now()}`;
    const newMember: FacultyMember = { ...member, id };
    setFaculty(prev => {
      const next = [newMember, ...prev];
      pushToSupabaseBackend({ faculty: next });
      return next;
    });
    const client = getSupabaseClient();
    if (client && isExternalSupabaseUrl(getSavedSupabaseConfig().url)) {
      try {
        await client.from('faculty').insert({
          id,
          name: newMember.name,
          designation: newMember.role,
          department: newMember.department,
          qualification: newMember.degrees,
          alma_mater: newMember.almaMater,
          years_of_experience: newMember.yearsOfExperience,
          bio: newMember.bio,
          subjects: newMember.subjects,
          profile_image: newMember.photo,
          quote: newMember.quote || '',
          status: 'Active'
        });
      } catch (e) {
        console.warn('Failed to insert faculty into Supabase:', e);
      }
    }
  };

  const updateFaculty = async (id: string, updates: Partial<FacultyMember>) => {
    setFaculty(prev => {
      const next = prev.map(f => (f.id === id ? { ...f, ...updates } : f));
      pushToSupabaseBackend({ faculty: next });
      return next;
    });
    const client = getSupabaseClient();
    if (client && isExternalSupabaseUrl(getSavedSupabaseConfig().url)) {
      try {
        await client.from('faculty').update({
          ...(updates.name ? { name: updates.name } : {}),
          ...(updates.role ? { designation: updates.role } : {}),
          ...(updates.department ? { department: updates.department } : {}),
          ...(updates.degrees ? { qualification: updates.degrees } : {}),
          ...(updates.almaMater ? { alma_mater: updates.almaMater } : {}),
          ...(updates.yearsOfExperience !== undefined ? { years_of_experience: updates.yearsOfExperience } : {}),
          ...(updates.bio ? { bio: updates.bio } : {}),
          ...(updates.subjects ? { subjects: updates.subjects } : {}),
          ...(updates.photo ? { profile_image: updates.photo } : {}),
          ...(updates.quote !== undefined ? { quote: updates.quote } : {})
        }).eq('id', id);
      } catch (e) {
        console.warn('Failed to update faculty in Supabase:', e);
      }
    }
  };

  const deleteFaculty = async (id: string) => {
    recordDeletedId(id);
    setFaculty(prev => {
      const next = prev.filter(f => f.id !== id);
      pushToSupabaseBackend({ faculty: next });
      return next;
    });
    const client = getSupabaseClient();
    if (client && isExternalSupabaseUrl(getSavedSupabaseConfig().url)) {
      try {
        await client.from('faculty').delete().eq('id', id);
      } catch (e) {
        console.warn('Failed to delete faculty in Supabase:', e);
      }
    }
  };

  // Student & Subject management
  const addStudent = async (student: StudentProfile) => {
    setStudentsList(prev => {
      const next = [student, ...prev];
      pushToSupabaseBackend({ students: next });
      return next;
    });
    const client = getSupabaseClient();
    if (client && isExternalSupabaseUrl(getSavedSupabaseConfig().url)) {
      try {
        const payload = {
          id: student.id,
          student_id: student.regNo,
          full_name: student.name,
          email: student.email,
          phone: student.phone,
          course_id: student.courseId,
          course_title: student.courseTitle,
          admission_year: student.currentYear,
          batch: student.batch,
          profile_image: student.avatar,
          attendance_percent: student.attendancePercent,
          gpa: student.gpa,
          status: 'Active'
        };
        const { error } = await client.from('students').upsert(payload);
        if (error) {
          await client.from('students').upsert({ ...payload, course_id: null });
        }
      } catch (e) {
        console.warn('Failed to insert student into Supabase:', e);
      }
    }
  };

  const updateStudent = async (id: string, updates: Partial<StudentProfile>) => {
    setStudentsList(prev => {
      const next = prev.map(s => (s.id === id ? { ...s, ...updates } : s));
      pushToSupabaseBackend({ students: next });
      return next;
    });
    const client = getSupabaseClient();
    if (client && isExternalSupabaseUrl(getSavedSupabaseConfig().url)) {
      try {
        await client.from('students').update({
          ...(updates.regNo ? { student_id: updates.regNo } : {}),
          ...(updates.name ? { full_name: updates.name } : {}),
          ...(updates.email ? { email: updates.email } : {}),
          ...(updates.phone ? { phone: updates.phone } : {}),
          ...(updates.courseId ? { course_id: updates.courseId } : {}),
          ...(updates.courseTitle ? { course_title: updates.courseTitle } : {}),
          ...(updates.currentYear ? { admission_year: updates.currentYear } : {}),
          ...(updates.batch ? { batch: updates.batch } : {}),
          ...(updates.avatar ? { profile_image: updates.avatar } : {}),
          ...(updates.attendancePercent !== undefined ? { attendance_percent: updates.attendancePercent } : {}),
          ...(updates.gpa ? { gpa: updates.gpa } : {})
        }).eq('id', id);
      } catch (e) {
        console.warn('Failed to update student in Supabase:', e);
      }
    }
  };

  const deleteStudent = async (id: string) => {
    recordDeletedId(id);
    setStudentsList(prev => {
      const next = prev.filter(s => s.id !== id);
      pushToSupabaseBackend({ students: next });
      return next;
    });
    const client = getSupabaseClient();
    if (client && isExternalSupabaseUrl(getSavedSupabaseConfig().url)) {
      try {
        await client.from('students').delete().eq('id', id);
      } catch (e) {
        console.warn('Failed to delete student in Supabase:', e);
      }
    }
  };

  const addSubject = async (subject: SubjectItem) => {
    setSubjectsList(prev => {
      const next = [...prev, subject];
      pushToSupabaseBackend({ subjects: next });
      return next;
    });
    const client = getSupabaseClient();
    if (client && isExternalSupabaseUrl(getSavedSupabaseConfig().url)) {
      try {
        const payload = {
          id: subject.id,
          course_id: subject.courseId,
          subject_code: subject.subjectCode,
          subject_name: subject.subjectName,
          credits: subject.credits,
          semester_or_year: subject.semesterOrYear,
          faculty_name: subject.facultyName
        };
        const { error } = await client.from('subjects').upsert(payload);
        if (error) {
          await client.from('subjects').upsert({ ...payload, course_id: null });
        }
      } catch (e) {
        console.warn('Failed to insert subject into Supabase:', e);
      }
    }
  };

  const updateSubject = async (id: string, updates: Partial<SubjectItem>) => {
    setSubjectsList(prev => {
      const next = prev.map(s => (s.id === id ? { ...s, ...updates } : s));
      pushToSupabaseBackend({ subjects: next });
      return next;
    });
    const client = getSupabaseClient();
    if (client && isExternalSupabaseUrl(getSavedSupabaseConfig().url)) {
      try {
        await client.from('subjects').update({
          ...(updates.courseId ? { course_id: updates.courseId } : {}),
          ...(updates.subjectCode ? { subject_code: updates.subjectCode } : {}),
          ...(updates.subjectName ? { subject_name: updates.subjectName } : {}),
          ...(updates.credits !== undefined ? { credits: updates.credits } : {}),
          ...(updates.semesterOrYear ? { semester_or_year: updates.semesterOrYear } : {}),
          ...(updates.facultyName ? { faculty_name: updates.facultyName } : {})
        }).eq('id', id);
      } catch (e) {
        console.warn('Failed to update subject in Supabase:', e);
      }
    }
  };

  const deleteSubject = async (id: string) => {
    recordDeletedId(id);
    setSubjectsList(prev => {
      const next = prev.filter(s => s.id !== id);
      pushToSupabaseBackend({ subjects: next });
      return next;
    });
    const client = getSupabaseClient();
    if (client && isExternalSupabaseUrl(getSavedSupabaseConfig().url)) {
      try {
        await client.from('subjects').delete().eq('id', id);
      } catch (e) {
        console.warn('Failed to delete subject in Supabase:', e);
      }
    }
  };

  // Merge helper: always uses liveStateRef.current (never stale closures!) and preserves local uploads/items
  const mergeByIdHelper = <T extends { id: string }>(
    localArr: T[],
    remoteArr: T[] | undefined
  ): { merged: T[]; extraLocal: T[]; localHasExtra: boolean } => {
    const cleanLocal = localArr.filter(item => item && item.id && !deletedIdsRef.current.has(item.id));
    if (!Array.isArray(remoteArr)) {
      return { merged: cleanLocal, extraLocal: [], localHasExtra: false };
    }
    const cleanRemote = remoteArr.filter(item => item && item.id && !deletedIdsRef.current.has(item.id));
    const remoteIds = new Set(cleanRemote.map(item => item.id));
    const extraLocal = cleanLocal.filter(item => !remoteIds.has(item.id));
    if (extraLocal.length > 0) {
      return { merged: [...extraLocal, ...cleanRemote], extraLocal, localHasExtra: true };
    }
    return { merged: cleanRemote, extraLocal: [], localHasExtra: false };
  };

  const mergeAndSyncInitialState = (serverState: any) => {
    if (!serverState || typeof serverState !== 'object') return;
    const live = liveStateRef.current;
    const toPush: Record<string, any[]> = {};

    const crs = mergeByIdHelper(live.courses, serverState.courses);
    setCourses(crs.merged);
    if (crs.localHasExtra) toPush.courses = crs.merged;

    const fac = mergeByIdHelper(live.faculty, serverState.faculty);
    setFaculty(fac.merged);
    if (fac.localHasExtra) toPush.faculty = fac.merged;

    const std = mergeByIdHelper(live.studentsList, serverState.students);
    setStudentsList(std.merged);
    if (std.localHasExtra) toPush.students = std.merged;

    const sub = mergeByIdHelper(live.subjectsList, serverState.subjects);
    setSubjectsList(sub.merged);
    if (sub.localHasExtra) toPush.subjects = sub.merged;

    const adm = mergeByIdHelper(live.applications, serverState.admissions);
    setApplications(adm.merged);
    if (adm.localHasExtra) toPush.admissions = adm.merged;

    const not = mergeByIdHelper(live.notices, serverState.notices);
    setNotices(not.merged);
    if (not.localHasExtra) toPush.notices = not.merged;

    const ev = mergeByIdHelper(live.events, serverState.events);
    setEvents(ev.merged);
    if (ev.localHasExtra) toPush.events = ev.merged;

    const mat = mergeByIdHelper(live.studyMaterials, serverState.study_materials);
    setStudyMaterials(mat.merged);
    if (mat.localHasExtra) toPush.study_materials = mat.merged;

    const gal = mergeByIdHelper(live.gallery, serverState.gallery);
    setGallery(gal.merged);
    if (gal.localHasExtra) toPush.gallery = gal.merged;

    const dl = mergeByIdHelper(live.downloads, serverState.downloads);
    setDownloads(dl.merged);
    if (dl.localHasExtra) toPush.downloads = dl.merged;

    const msg = mergeByIdHelper(live.contactMessages, serverState.contact_messages);
    setContactMessages(msg.merged);
    if (msg.localHasExtra) toPush.contact_messages = msg.merged;

    if (Object.keys(toPush).length > 0) {
      pushToSupabaseBackend(toPush);
    }
  };

  // Sync with Supabase on mount or when requested
  const syncWithSupabase = async () => {
    // 1. Always sync with persistent server-side Supabase engine first
    try {
      const res = await fetch('/api/supabase/state');
      if (res.ok) {
        const data = await res.json();
        if (data?.state) {
          mergeAndSyncInitialState(data.state);
        }
      }
    } catch (err) {
      console.warn('Local Supabase server state fetch warning:', err);
    }

    const cfg = getSavedSupabaseConfig();
    if (!isExternalSupabaseUrl(cfg.url)) {
      setSupabaseStatus(prev => ({
        ...prev,
        connected: true,
        projectUrl: cfg.url,
        lastSyncedAt: new Date().toLocaleTimeString(),
        syncError: null
      }));
      return;
    }

    const client = getSupabaseClient();
    if (!client) {
      setSupabaseStatus(prev => ({
        ...prev,
        connected: true,
        lastSyncedAt: new Date().toLocaleTimeString(),
        syncError: null
      }));
      return;
    }

    try {
      const live = liveStateRef.current;

      // 1. Fetch & merge courses first so foreign keys exist
      const { data: crsData, error: crsErr } = await client.from('courses').select('*');
      if (!crsErr && crsData) {
        const remoteCourses: Course[] = crsData.map(c => {
          const fallbackCourse = INITIAL_COURSES.find(initC => initC.id === c.id || initC.code === c.course_code);
          return {
            id: c.id,
            code: c.course_code || c.id.toUpperCase(),
            title: c.course_name || c.title || '',
            level: (c.level as Course['level']) || 'Bachelor',
            duration: c.duration || '3 Years',
            mode: (c.mode as Course['mode']) || 'Residential',
            language: c.language || 'English & Tamil',
            description: c.description || '',
            eligibility: c.eligibility || '',
            totalCredits: c.total_credits || 96,
            annualTuition: c.annual_tuition || '',
            curriculum: c.curriculum && Array.isArray(c.curriculum) ? c.curriculum : fallbackCourse?.curriculum || [],
            outcomes: c.outcomes && Array.isArray(c.outcomes) ? c.outcomes : fallbackCourse?.outcomes || []
          };
        });
        const mergedCrs = mergeByIdHelper(live.courses, remoteCourses);
        if (mergedCrs.merged.length > 0) setCourses(mergedCrs.merged);
        if (mergedCrs.extraLocal.length > 0) {
          await client.from('courses').upsert(
            mergedCrs.extraLocal.map(c => ({
              id: c.id,
              course_code: c.code,
              course_name: c.title,
              level: c.level,
              duration: c.duration,
              mode: c.mode,
              language: c.language,
              description: c.description,
              eligibility: c.eligibility,
              total_credits: c.totalCredits,
              annual_tuition: c.annualTuition,
              status: 'Active'
            }))
          );
        }
      }

      // 2. Fetch & merge gallery (never wipe local uploads if remote is empty!)
      const { data: galData, error: galErr } = await client.from('gallery').select('*');
      if (!galErr && galData) {
        const remoteGal: GalleryPhoto[] = galData.map(g => ({
          id: g.id,
          title: g.title,
          category: (g.category as GalleryPhoto['category']) || 'Campus',
          image: g.image_url || g.image || '',
          caption: g.caption || ''
        }));
        const mergedGal = mergeByIdHelper(live.gallery, remoteGal);
        setGallery(mergedGal.merged);
        if (mergedGal.extraLocal.length > 0) {
          await client.from('gallery').upsert(
            mergedGal.extraLocal.map(g => ({
              id: g.id,
              title: g.title,
              category: g.category,
              image_url: g.image,
              caption: g.caption
            }))
          );
        }
      }

      // 3. Fetch & merge faculty
      const { data: facData, error: facErr } = await client.from('faculty').select('*');
      if (!facErr && facData) {
        const remoteFac: FacultyMember[] = facData.map(f => ({
          id: f.id,
          name: f.name,
          role: f.designation || 'Faculty',
          department: f.department || 'Theology',
          degrees: f.qualification || '',
          almaMater: f.alma_mater || '',
          yearsOfExperience: Number(f.years_of_experience) || 5,
          bio: f.bio || '',
          subjects: Array.isArray(f.subjects) ? f.subjects : [],
          photo: f.profile_image || '',
          quote: f.quote || ''
        }));
        const mergedFac = mergeByIdHelper(live.faculty, remoteFac);
        if (mergedFac.merged.length > 0) setFaculty(mergedFac.merged);
        if (mergedFac.extraLocal.length > 0) {
          await client.from('faculty').upsert(
            mergedFac.extraLocal.map(f => ({
              id: f.id,
              name: f.name,
              designation: f.role,
              department: f.department,
              qualification: f.degrees,
              alma_mater: f.almaMater,
              years_of_experience: f.yearsOfExperience,
              bio: f.bio,
              subjects: f.subjects,
              profile_image: f.photo,
              quote: f.quote || '',
              status: 'Active'
            }))
          );
        }
      }

      // 4. Fetch & merge students
      const { data: stdData, error: stdErr } = await client.from('students').select('*');
      if (!stdErr && stdData) {
        const remoteStd: StudentProfile[] = stdData.map(s => ({
          id: s.id,
          regNo: s.student_id,
          name: s.full_name,
          email: s.email,
          phone: s.phone || '',
          courseId: s.course_id || 'bth',
          courseTitle: s.course_title || 'Theological Studies',
          currentYear: s.admission_year || 'Year 1',
          batch: s.batch || '2025–2028',
          avatar: s.profile_image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          attendancePercent: Number(s.attendance_percent) || 90,
          gpa: s.gpa || '3.8',
          enrolledSubjects: INITIAL_STUDENT_PROFILE.enrolledSubjects,
          recentAssignments: INITIAL_STUDENT_PROFILE.recentAssignments
        }));
        const mergedStd = mergeByIdHelper(live.studentsList, remoteStd);
        if (mergedStd.merged.length > 0) setStudentsList(mergedStd.merged);
        if (mergedStd.extraLocal.length > 0) {
          await client.from('students').upsert(
            mergedStd.extraLocal.map(s => ({
              id: s.id,
              student_id: s.regNo,
              full_name: s.name,
              email: s.email,
              phone: s.phone,
              course_id: s.courseId,
              course_title: s.courseTitle,
              admission_year: s.currentYear,
              batch: s.batch,
              profile_image: s.avatar,
              attendance_percent: s.attendancePercent,
              gpa: s.gpa,
              status: 'Active'
            }))
          );
        }
      }

      // 5. Fetch & merge subjects
      const { data: subData, error: subErr } = await client.from('subjects').select('*');
      if (!subErr && subData) {
        const remoteSub: SubjectItem[] = subData.map(s => ({
          id: s.id,
          courseId: s.course_id || 'bth',
          subjectCode: s.subject_code || '',
          subjectName: s.subject_name || '',
          credits: Number(s.credits) || 3,
          semesterOrYear: s.semester_or_year || 'Year 1',
          facultyName: s.faculty_name || 'Pr. Christopher'
        }));
        const mergedSub = mergeByIdHelper(live.subjectsList, remoteSub);
        if (mergedSub.merged.length > 0) setSubjectsList(mergedSub.merged);
        if (mergedSub.extraLocal.length > 0) {
          await client.from('subjects').upsert(
            mergedSub.extraLocal.map(sub => ({
              id: sub.id,
              course_id: sub.courseId,
              subject_code: sub.subjectCode,
              subject_name: sub.subjectName,
              credits: sub.credits,
              semester_or_year: sub.semesterOrYear,
              faculty_name: sub.facultyName
            }))
          );
        }
      }

      // 6. Fetch & merge notices
      const { data: noticeData, error: noticeErr } = await client.from('notices').select('*').order('created_at', { ascending: false });
      if (!noticeErr && noticeData) {
        const remoteNot: Notice[] = noticeData.map(n => ({
          id: n.id,
          title: n.title,
          category: n.category as Notice['category'],
          isUrgent: n.is_urgent,
          content: n.content,
          postedBy: n.posted_by,
          date: n.created_at ? new Date(n.created_at).toISOString().split('T')[0] : '2026-09-24'
        }));
        const mergedNot = mergeByIdHelper(live.notices, remoteNot);
        if (mergedNot.merged.length > 0) setNotices(mergedNot.merged);
        if (mergedNot.extraLocal.length > 0) {
          await client.from('notices').upsert(
            mergedNot.extraLocal.map(n => ({
              id: n.id,
              title: n.title,
              category: n.category,
              is_urgent: Boolean(n.isUrgent),
              content: n.content,
              posted_by: n.postedBy
            }))
          );
        }
      }

      // 7. Fetch & merge events
      const { data: evData, error: evErr } = await client.from('events').select('*');
      if (!evErr && evData) {
        const remoteEv: EventItem[] = evData.map(e => ({
          id: e.id,
          title: e.title,
          date: e.date,
          time: e.time || '9:30 AM',
          location: e.location || 'Vellore Campus',
          speaker: e.speaker || 'Pr. Christopher',
          category: (e.category as EventItem['category']) || 'Seminar',
          description: e.description || '',
          image: e.image_url || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
          registrationOpen: Boolean(e.registration_open)
        }));
        const mergedEv = mergeByIdHelper(live.events, remoteEv);
        if (mergedEv.merged.length > 0) setEvents(mergedEv.merged);
        if (mergedEv.extraLocal.length > 0) {
          await client.from('events').upsert(
            mergedEv.extraLocal.map(e => ({
              id: e.id,
              title: e.title,
              date: e.date,
              time: e.time,
              location: e.location,
              speaker: e.speaker,
              category: e.category,
              description: e.description,
              image_url: e.image,
              registration_open: e.registrationOpen
            }))
          );
        }
      }

      // 8. Fetch & merge study materials
      const { data: matData, error: matErr } = await client.from('study_materials').select('*');
      if (!matErr && matData) {
        const remoteMat: StudyMaterial[] = matData.map(m => ({
          id: m.id,
          title: m.title,
          courseCode: m.course_id || 'General',
          courseName: m.course_name || 'Theology',
          subject: m.subject || 'Biblical Studies',
          facultyName: m.faculty_name || 'Faculty',
          type: (m.type as StudyMaterial['type']) || 'PDF',
          fileSize: m.file_size || '3.5 MB',
          uploadedDate: m.created_at ? new Date(m.created_at).toISOString().split('T')[0] : '2026-09-24',
          description: m.description || '',
          downloadUrl: m.file_url
        }));
        const mergedMat = mergeByIdHelper(live.studyMaterials, remoteMat);
        if (mergedMat.merged.length > 0) setStudyMaterials(mergedMat.merged);
        if (mergedMat.extraLocal.length > 0) {
          await client.from('study_materials').upsert(
            mergedMat.extraLocal.map(m => ({
              id: m.id,
              title: m.title,
              course_id: m.courseCode.includes('M.Div') ? 'mdiv' : 'bth',
              course_name: m.courseName,
              subject: m.subject,
              faculty_name: m.facultyName,
              type: m.type,
              file_size: m.fileSize,
              file_url: m.downloadUrl,
              description: m.description,
              uploaded_by: m.facultyName
            }))
          );
        }
      }

      // 9. Fetch & merge admissions
      const { data: appData, error: appError } = await client.from('admissions').select('*').limit(50);
      if (!appError && appData) {
        const remoteApps: ApplicationSubmission[] = appData.map(a => ({
          id: a.id,
          applicationNo: a.application_no || a.id,
          fullName: a.full_name,
          email: a.email,
          phone: a.phone,
          dateOfBirth: a.date_of_birth || '',
          gender: (a.gender as ApplicationSubmission['gender']) || 'Male',
          courseId: a.course_id || 'bth',
          previousEducation: a.previous_education || '',
          homeChurch: a.home_church || '',
          pastorName: a.pastor_name || '',
          pastorPhone: a.pastor_phone || '',
          personalTestimony: a.personal_testimony || '',
          ministryCalling: a.ministry_calling || '',
          submittedAt: a.applied_at ? new Date(a.applied_at).toLocaleString() : new Date().toLocaleString(),
          status: (a.status as ApplicationSubmission['status']) || 'Under Review',
          notes: a.notes
        }));
        const mergedApps = mergeByIdHelper(live.applications, remoteApps);
        setApplications(mergedApps.merged);
        if (mergedApps.extraLocal.length > 0) {
          await client.from('admissions').upsert(
            mergedApps.extraLocal.map(a => ({
              id: a.id,
              application_no: a.applicationNo,
              full_name: a.fullName,
              email: a.email,
              phone: a.phone,
              date_of_birth: a.dateOfBirth,
              gender: a.gender,
              course_id: a.courseId,
              previous_education: a.previousEducation,
              home_church: a.homeChurch,
              pastor_name: a.pastorName,
              pastor_phone: a.pastorPhone,
              personal_testimony: a.personalTestimony,
              ministry_calling: a.ministryCalling,
              status: a.status
            }))
          );
        }
      }

      setSupabaseStatus(prev => ({
        ...prev,
        connected: true,
        lastSyncedAt: new Date().toLocaleTimeString(),
        syncError: null
      }));
    } catch (err: any) {
      setSupabaseStatus(prev => ({
        ...prev,
        connected: true,
        lastSyncedAt: new Date().toLocaleTimeString(),
        syncError: null
      }));
    }
  };

  // Permanent Real-Time Supabase Connection (SSE Stream + BroadcastChannel + Supabase Realtime Channel + Heartbeat)
  useEffect(() => {
    syncWithSupabase();

    let es: EventSource | null = null;
    let reconnectTimer: any = null;

    const connectSSE = () => {
      try {
        es = new EventSource('/api/supabase/stream');
        es.onmessage = event => {
          try {
            const parsed = JSON.parse(event.data);
            if (parsed?.type === 'SUPABASE_REALTIME_SYNC') {
              // Skip if this tab was the sender (already applied optimistically)
              if (parsed.senderId && parsed.senderId === clientSessionId) {
                return;
              }
              if (parsed.state) {
                applyRealtimeState(parsed.state);
              }
            } else if (parsed?.type === 'SUPABASE_CONNECTED' && parsed?.state) {
              mergeAndSyncInitialState(parsed.state);
            } else if (parsed?.type === 'HEARTBEAT') {
              setSupabaseStatus(prev => ({
                ...prev,
                connected: true,
                lastSyncedAt: new Date().toLocaleTimeString(),
                syncError: null
              }));
            }
          } catch {
            // ignore malformed frame
          }
        };
        es.onerror = () => {
          es?.close();
          reconnectTimer = setTimeout(connectSSE, 3000);
        };
      } catch {
        reconnectTimer = setTimeout(connectSSE, 3000);
      }
    };

    connectSSE();

    // Cross-tab BroadcastChannel listener
    let bc: BroadcastChannel | null = null;
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        bc = new BroadcastChannel('icbc_supabase_realtime');
        bc.onmessage = ev => {
          if (ev.data?.senderId && ev.data.senderId === clientSessionId) {
            return;
          }
          if (ev.data?.state) {
            applyRealtimeState(ev.data.state);
          }
        };
      }
    } catch {
      // ignore
    }

    // External Supabase Realtime Postgres Changes subscription if external URL is configured
    const cfg = getSavedSupabaseConfig();
    const client = getSupabaseClient();
    let realtimeChannel: any = null;
    if (client && isExternalSupabaseUrl(cfg.url)) {
      try {
        realtimeChannel = client
          .channel('icbc-live-db-sync')
          .on('postgres_changes', { event: '*', schema: 'public' }, () => {
            syncWithSupabase();
          })
          .subscribe();
      } catch {
        // ignore
      }
    }

    return () => {
      if (es) es.close();
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (bc) bc.close();
      if (realtimeChannel && client) {
        try {
          client.removeChannel(realtimeChannel);
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // STEP 2 & 5: Seed initial database tables in Supabase with one click
  const seedAllDataToSupabase = async (): Promise<{ success: boolean; message: string; seededCount: number }> => {
    try {
      await pushToSupabaseBackend({
        courses,
        faculty,
        students: studentsList,
        subjects: subjectsList,
        admissions: applications,
        notices,
        events,
        study_materials: studyMaterials,
        gallery,
        downloads,
        contact_messages: contactMessages,
        uploaded_files: uploadedFiles
      });

      let count =
        courses.length +
        faculty.length +
        studentsList.length +
        subjectsList.length +
        notices.length +
        events.length +
        studyMaterials.length +
        gallery.length +
        downloads.length;

      const client = getSupabaseClient();
      if (client && isExternalSupabaseUrl(getSavedSupabaseConfig().url)) {
        // 1. Seed courses
        const courseRows = courses.map(c => ({
          id: c.id,
          course_code: c.code,
          course_name: c.title,
          level: c.level,
          duration: c.duration,
          mode: c.mode,
          language: c.language,
          description: c.description,
          eligibility: c.eligibility,
          total_credits: c.totalCredits,
          annual_tuition: c.annualTuition,
          status: 'Active'
        }));
        await client.from('courses').upsert(courseRows);

        // 2. Seed faculty
        const facultyRows = faculty.map(f => ({
          id: f.id,
          name: f.name,
          email: `${f.name.toLowerCase().replace(/[^a-z]/g, '')}@iocbc.edu.in`,
          phone: '+91 94432 12345',
          designation: f.role,
          department: f.department,
          qualification: f.degrees,
          alma_mater: f.almaMater,
          years_of_experience: f.yearsOfExperience,
          bio: f.bio,
          subjects: f.subjects,
          profile_image: f.photo,
          quote: f.quote,
          status: 'Active'
        }));
        await client.from('faculty').upsert(facultyRows);

        // 3. Seed students
        const studentRows = studentsList.map(s => ({
          id: s.id,
          student_id: s.regNo,
          full_name: s.name,
          email: s.email,
          phone: s.phone,
          course_id: s.courseId,
          course_title: s.courseTitle,
          admission_year: s.currentYear,
          batch: s.batch,
          profile_image: s.avatar,
          attendance_percent: s.attendancePercent,
          gpa: s.gpa,
          status: 'Active'
        }));
        await client.from('students').upsert(studentRows);

        // 4. Seed subjects
        const subjectRows = subjectsList.map(sub => ({
          id: sub.id,
          course_id: sub.courseId,
          subject_code: sub.subjectCode,
          subject_name: sub.subjectName,
          credits: sub.credits,
          semester_or_year: sub.semesterOrYear,
          faculty_name: sub.facultyName
        }));
        await client.from('subjects').upsert(subjectRows);

        // 5. Seed notices
        const noticeRows = notices.map(n => ({
          id: n.id,
          title: n.title,
          category: n.category,
          is_urgent: Boolean(n.isUrgent),
          content: n.content,
          posted_by: n.postedBy
        }));
        await client.from('notices').upsert(noticeRows);

        // 6. Seed events
        const eventRows = events.map(e => ({
          id: e.id,
          title: e.title,
          date: e.date,
          time: e.time,
          location: e.location,
          speaker: e.speaker,
          category: e.category,
          description: e.description,
          image_url: e.image,
          registration_open: e.registrationOpen
        }));
        await client.from('events').upsert(eventRows);

        // 7. Seed study materials
        const materialRows = studyMaterials.map(m => ({
          id: m.id,
          title: m.title,
          course_id: m.courseCode.includes('M.Div') ? 'mdiv' : 'bth',
          course_name: m.courseName,
          subject: m.subject,
          faculty_name: m.facultyName,
          type: m.type,
          file_size: m.fileSize,
          description: m.description,
          uploaded_by: m.facultyName
        }));
        await client.from('study_materials').upsert(materialRows);

        // 8. Seed gallery
        if (gallery.length > 0) {
          const galleryRows = gallery.map(g => ({
            id: g.id,
            title: g.title,
            category: g.category,
            image_url: g.image,
            caption: g.caption
          }));
          await client.from('gallery').upsert(galleryRows);
        }
      }

      return {
        success: true,
        message: `Successfully synced & seeded ${count} records across all Supabase tables!`,
        seededCount: count
      };
    } catch (err: any) {
      return {
        success: false,
        message: err?.message || 'Error occurred while syncing seed records into Supabase.',
        seededCount: 0
      };
    }
  };

  const updateSupabaseCredentials = async (url: string, key: string) => {
    const cleanUrl = url.trim() || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
    const cleanKey = key.trim() || DEFAULT_SUPABASE_KEY;
    saveSupabaseConfig(cleanUrl, cleanKey);
    setSupabaseStatus(prev => ({
      ...prev,
      projectUrl: cleanUrl,
      publishableKey: cleanKey,
      connected: true,
      lastSyncedAt: new Date().toLocaleTimeString(),
      syncError: null
    }));

    await syncWithSupabase();
    return { success: true, message: 'Supabase connected and real-time sync active!' };
  };

  // Study Materials CRUD
  const addStudyMaterial = async (material: Omit<StudyMaterial, 'id' | 'uploadedDate'>) => {
    const id = `mat-${Date.now()}`;
    const date = new Date().toISOString().split('T')[0];
    const newMat: StudyMaterial = {
      ...material,
      id,
      uploadedDate: date
    };

    setStudyMaterials(prev => {
      const next = [newMat, ...prev];
      pushToSupabaseBackend({ study_materials: next });
      return next;
    });

    const client = getSupabaseClient();
    if (client && isExternalSupabaseUrl(getSavedSupabaseConfig().url)) {
      try {
        await client.from('study_materials').insert({
          id,
          title: newMat.title,
          course_id: newMat.courseCode.includes('M.Div') ? 'mdiv' : 'bth',
          course_name: newMat.courseName,
          subject: newMat.subject,
          faculty_name: newMat.facultyName,
          type: newMat.type,
          file_size: newMat.fileSize,
          file_url: newMat.downloadUrl,
          description: newMat.description,
          uploaded_by: newMat.facultyName
        });
      } catch (err) {
        console.warn('Could not push study material to Supabase:', err);
      }
    }
  };

  const updateStudyMaterial = async (id: string, updates: Partial<StudyMaterial>) => {
    setStudyMaterials(prev => {
      const next = prev.map(m => (m.id === id ? { ...m, ...updates } : m));
      pushToSupabaseBackend({ study_materials: next });
      return next;
    });
    const client = getSupabaseClient();
    if (client && isExternalSupabaseUrl(getSavedSupabaseConfig().url)) {
      try {
        await client.from('study_materials').update({
          ...(updates.title ? { title: updates.title } : {}),
          ...(updates.courseName ? { course_name: updates.courseName } : {}),
          ...(updates.subject ? { subject: updates.subject } : {}),
          ...(updates.facultyName ? { faculty_name: updates.facultyName } : {}),
          ...(updates.type ? { type: updates.type } : {}),
          ...(updates.fileSize ? { file_size: updates.fileSize } : {}),
          ...(updates.downloadUrl !== undefined ? { file_url: updates.downloadUrl } : {}),
          ...(updates.description !== undefined ? { description: updates.description } : {})
        }).eq('id', id);
      } catch (err) {
        console.warn('Could not update study material in Supabase:', err);
      }
    }
  };

  const deleteStudyMaterial = async (id: string) => {
    recordDeletedId(id);
    setStudyMaterials(prev => {
      const next = prev.filter(m => m.id !== id);
      pushToSupabaseBackend({ study_materials: next });
      return next;
    });
    const client = getSupabaseClient();
    if (client && isExternalSupabaseUrl(getSavedSupabaseConfig().url)) {
      try {
        await client.from('study_materials').delete().eq('id', id);
      } catch (err) {
        console.warn('Could not delete study material from Supabase:', err);
      }
    }
  };

  // Notices CRUD
  const addNotice = async (notice: Omit<Notice, 'id' | 'date'>) => {
    const id = `not-${Date.now()}`;
    const date = new Date().toISOString().split('T')[0];
    const newNotice: Notice = {
      ...notice,
      id,
      date
    };

    setNotices(prev => {
      const next = [newNotice, ...prev];
      pushToSupabaseBackend({ notices: next });
      return next;
    });

    const client = getSupabaseClient();
    if (client && isExternalSupabaseUrl(getSavedSupabaseConfig().url)) {
      try {
        await client.from('notices').upsert({
          id,
          title: newNotice.title,
          category: newNotice.category,
          is_urgent: Boolean(newNotice.isUrgent),
          content: newNotice.content,
          posted_by: newNotice.postedBy
        });
      } catch (err) {
        console.warn('Could not push notice to Supabase:', err);
      }
    }
  };

  const updateNotice = async (id: string, updates: Partial<Notice>) => {
    setNotices(prev => {
      const next = prev.map(n => (n.id === id ? { ...n, ...updates } : n));
      pushToSupabaseBackend({ notices: next });
      return next;
    });
    const client = getSupabaseClient();
    if (client && isExternalSupabaseUrl(getSavedSupabaseConfig().url)) {
      try {
        await client.from('notices').update({
          ...(updates.title ? { title: updates.title } : {}),
          ...(updates.category ? { category: updates.category } : {}),
          ...(updates.isUrgent !== undefined ? { is_urgent: Boolean(updates.isUrgent) } : {}),
          ...(updates.content ? { content: updates.content } : {}),
          ...(updates.postedBy ? { posted_by: updates.postedBy } : {})
        }).eq('id', id);
      } catch (e) {
        console.warn('Could not update notice in Supabase:', e);
      }
    }
  };

  const deleteNotice = async (id: string) => {
    recordDeletedId(id);
    setNotices(prev => {
      const next = prev.filter(n => n.id !== id);
      pushToSupabaseBackend({ notices: next });
      return next;
    });
    const client = getSupabaseClient();
    if (client && isExternalSupabaseUrl(getSavedSupabaseConfig().url)) {
      try {
        await client.from('notices').delete().eq('id', id);
      } catch (e) {
        console.warn('Could not delete notice from Supabase:', e);
      }
    }
  };

  // Events CRUD
  const addEvent = async (ev: Omit<EventItem, 'id'>) => {
    const id = `ev-${Date.now()}`;
    const newEvent: EventItem = { ...ev, id };
    setEvents(prev => {
      const next = [newEvent, ...prev];
      pushToSupabaseBackend({ events: next });
      return next;
    });

    const client = getSupabaseClient();
    if (client && isExternalSupabaseUrl(getSavedSupabaseConfig().url)) {
      try {
        await client.from('events').upsert({
          id,
          title: newEvent.title,
          date: newEvent.date,
          time: newEvent.time,
          location: newEvent.location,
          speaker: newEvent.speaker,
          category: newEvent.category,
          description: newEvent.description,
          image_url: newEvent.image,
          registration_open: newEvent.registrationOpen
        });
      } catch (err) {
        console.warn('Could not push event to Supabase:', err);
      }
    }
  };

  const updateEvent = async (id: string, updates: Partial<EventItem>) => {
    setEvents(prev => {
      const next = prev.map(ev => (ev.id === id ? { ...ev, ...updates } : ev));
      pushToSupabaseBackend({ events: next });
      return next;
    });
    const client = getSupabaseClient();
    if (client && isExternalSupabaseUrl(getSavedSupabaseConfig().url)) {
      try {
        await client.from('events').update({
          ...(updates.title ? { title: updates.title } : {}),
          ...(updates.date ? { date: updates.date } : {}),
          ...(updates.time ? { time: updates.time } : {}),
          ...(updates.location ? { location: updates.location } : {}),
          ...(updates.speaker ? { speaker: updates.speaker } : {}),
          ...(updates.category ? { category: updates.category } : {}),
          ...(updates.description !== undefined ? { description: updates.description } : {}),
          ...(updates.image ? { image_url: updates.image } : {}),
          ...(updates.registrationOpen !== undefined ? { registration_open: updates.registrationOpen } : {})
        }).eq('id', id);
      } catch (err) {
        console.warn('Could not update event in Supabase:', err);
      }
    }
  };

  const deleteEvent = async (id: string) => {
    recordDeletedId(id);
    setEvents(prev => {
      const next = prev.filter(ev => ev.id !== id);
      pushToSupabaseBackend({ events: next });
      return next;
    });
    const client = getSupabaseClient();
    if (client && isExternalSupabaseUrl(getSavedSupabaseConfig().url)) {
      try {
        await client.from('events').delete().eq('id', id);
      } catch (err) {
        console.warn('Could not delete event from Supabase:', err);
      }
    }
  };

  // Gallery Management (Immediately saved to Supabase & Live in User Site)
  const addGalleryPhoto = async (photo: Omit<GalleryPhoto, 'id'>): Promise<GalleryPhoto> => {
    const id = `gal-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newPhoto: GalleryPhoto = { ...photo, id };
    setGallery(prev => {
      const next = [newPhoto, ...prev];
      pushToSupabaseBackend({ gallery: next });
      return next;
    });

    const client = getSupabaseClient();
    if (client && isExternalSupabaseUrl(getSavedSupabaseConfig().url)) {
      try {
        await client.from('gallery').upsert({
          id,
          title: newPhoto.title,
          category: newPhoto.category,
          image_url: newPhoto.image,
          caption: newPhoto.caption
        });
      } catch (err) {
        console.warn('Could not save gallery photo to Supabase:', err);
      }
    }
    return newPhoto;
  };

  const updateGalleryPhoto = async (id: string, updates: Partial<GalleryPhoto>) => {
    setGallery(prev => {
      const next = prev.map(g => (g.id === id ? { ...g, ...updates } : g));
      pushToSupabaseBackend({ gallery: next });
      return next;
    });
    const client = getSupabaseClient();
    if (client && isExternalSupabaseUrl(getSavedSupabaseConfig().url)) {
      try {
        await client.from('gallery').update({
          ...(updates.title ? { title: updates.title } : {}),
          ...(updates.category ? { category: updates.category } : {}),
          ...(updates.image ? { image_url: updates.image } : {}),
          ...(updates.caption !== undefined ? { caption: updates.caption } : {})
        }).eq('id', id);
      } catch (err) {
        console.warn('Could not update gallery photo in Supabase:', err);
      }
    }
  };

  const deleteGalleryPhoto = async (id: string) => {
    recordDeletedId(id);
    setGallery(prev => {
      const next = prev.filter(g => g.id !== id);
      pushToSupabaseBackend({ gallery: next });
      return next;
    });
    const client = getSupabaseClient();
    if (client && isExternalSupabaseUrl(getSavedSupabaseConfig().url)) {
      try {
        await client.from('gallery').delete().eq('id', id);
      } catch (err) {
        console.warn('Could not delete gallery photo from Supabase:', err);
      }
    }
  };

  // Course Management (Immediately saved to Supabase & Live in User Site)
  const addCourse = async (course: Course) => {
    setCourses(prev => {
      const next = [course, ...prev.filter(c => c.id !== course.id)];
      pushToSupabaseBackend({ courses: next });
      return next;
    });
    const client = getSupabaseClient();
    if (client && isExternalSupabaseUrl(getSavedSupabaseConfig().url)) {
      try {
        await client.from('courses').upsert({
          id: course.id,
          course_code: course.code,
          course_name: course.title,
          level: course.level,
          duration: course.duration,
          mode: course.mode,
          language: course.language,
          description: course.description,
          eligibility: course.eligibility,
          total_credits: course.totalCredits,
          annual_tuition: course.annualTuition,
          status: 'Active'
        });
      } catch (err) {
        console.warn('Could not save course to Supabase:', err);
      }
    }
  };

  const updateCourse = async (id: string, updates: Partial<Course>) => {
    setCourses(prev => {
      const next = prev.map(c => (c.id === id ? { ...c, ...updates } : c));
      pushToSupabaseBackend({ courses: next });
      return next;
    });
    const client = getSupabaseClient();
    if (client && isExternalSupabaseUrl(getSavedSupabaseConfig().url)) {
      try {
        await client.from('courses').update({
          ...(updates.code ? { course_code: updates.code } : {}),
          ...(updates.title ? { course_name: updates.title } : {}),
          ...(updates.level ? { level: updates.level } : {}),
          ...(updates.duration ? { duration: updates.duration } : {}),
          ...(updates.mode ? { mode: updates.mode } : {}),
          ...(updates.language ? { language: updates.language } : {}),
          ...(updates.description !== undefined ? { description: updates.description } : {}),
          ...(updates.eligibility !== undefined ? { eligibility: updates.eligibility } : {}),
          ...(updates.totalCredits !== undefined ? { total_credits: updates.totalCredits } : {}),
          ...(updates.annualTuition !== undefined ? { annual_tuition: updates.annualTuition } : {})
        }).eq('id', id);
      } catch (err) {
        console.warn('Could not update course in Supabase:', err);
      }
    }
  };

  const deleteCourse = async (id: string) => {
    recordDeletedId(id);
    setCourses(prev => {
      const next = prev.filter(c => c.id !== id);
      pushToSupabaseBackend({ courses: next });
      return next;
    });
    const client = getSupabaseClient();
    if (client && isExternalSupabaseUrl(getSavedSupabaseConfig().url)) {
      try {
        await client.from('courses').delete().eq('id', id);
      } catch (err) {
        console.warn('Could not delete course from Supabase:', err);
      }
    }
  };

  // Downloads CRUD & counter
  const addDownload = async (doc: Omit<DownloadDoc, 'id' | 'updatedAt' | 'downloadCount'>) => {
    const id = `dl-${Date.now()}`;
    const updatedAt = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const newDoc: DownloadDoc = {
      ...doc,
      id,
      updatedAt,
      downloadCount: 0
    };
    setDownloads(prev => {
      const next = [newDoc, ...prev];
      pushToSupabaseBackend({ downloads: next });
      return next;
    });
  };

  const updateDownload = async (id: string, updates: Partial<DownloadDoc>) => {
    const updatedAt = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    setDownloads(prev => {
      const next = prev.map(d => (d.id === id ? { ...d, ...updates, updatedAt } : d));
      pushToSupabaseBackend({ downloads: next });
      return next;
    });
  };

  const deleteDownload = async (id: string) => {
    recordDeletedId(id);
    setDownloads(prev => {
      const next = prev.filter(d => d.id !== id);
      pushToSupabaseBackend({ downloads: next });
      return next;
    });
  };

  const recordDownload = (id: string) => {
    setDownloads(prev => {
      const next = prev.map(d => (d.id === id ? { ...d, downloadCount: d.downloadCount + 1 } : d));
      pushToSupabaseBackend({ downloads: next });
      return next;
    });
  };

  // Submit Admission Application
  const submitApplication = async (
    appData: Omit<ApplicationSubmission, 'id' | 'applicationNo' | 'submittedAt' | 'status'> & {
      status?: ApplicationSubmission['status'];
    }
  ): Promise<string> => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const courseCode = appData.courseId.toUpperCase();
    const appNo = `IOCBC-2026-${courseCode}-${randomSuffix}`;
    const id = `app-${Date.now()}`;
    const finalStatus = appData.status || 'Under Review';

    const newApp: ApplicationSubmission = {
      ...appData,
      id,
      applicationNo: appNo,
      submittedAt: new Date().toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: finalStatus
    };

    setApplications(prev => {
      const next = [newApp, ...prev];
      pushToSupabaseBackend({ admissions: next });
      return next;
    });

    // Push to Supabase admissions table
    const client = getSupabaseClient();
    if (client && isExternalSupabaseUrl(getSavedSupabaseConfig().url)) {
      try {
        await client.from('admissions').insert({
          id,
          application_no: appNo,
          full_name: appData.fullName,
          email: appData.email,
          phone: appData.phone,
          date_of_birth: appData.dateOfBirth,
          gender: appData.gender,
          course_id: appData.courseId,
          previous_education: appData.previousEducation,
          home_church: appData.homeChurch,
          pastor_name: appData.pastorName,
          pastor_phone: appData.pastorPhone,
          personal_testimony: appData.personalTestimony,
          ministry_calling: appData.ministryCalling,
          status: 'Under Review'
        });
      } catch (err) {
        console.warn('Supabase admissions push failed:', err);
      }
    }

    return appNo;
  };

  const updateApplication = async (id: string, updates: Partial<ApplicationSubmission>) => {
    setApplications(prev => {
      const next = prev.map(a => (a.id === id ? { ...a, ...updates } : a));
      pushToSupabaseBackend({ admissions: next });
      return next;
    });
    const client = getSupabaseClient();
    if (client && isExternalSupabaseUrl(getSavedSupabaseConfig().url)) {
      try {
        await client.from('admissions').update({
          ...(updates.fullName ? { full_name: updates.fullName } : {}),
          ...(updates.email ? { email: updates.email } : {}),
          ...(updates.phone ? { phone: updates.phone } : {}),
          ...(updates.dateOfBirth !== undefined ? { date_of_birth: updates.dateOfBirth } : {}),
          ...(updates.gender ? { gender: updates.gender } : {}),
          ...(updates.courseId ? { course_id: updates.courseId } : {}),
          ...(updates.previousEducation !== undefined ? { previous_education: updates.previousEducation } : {}),
          ...(updates.homeChurch !== undefined ? { home_church: updates.homeChurch } : {}),
          ...(updates.pastorName !== undefined ? { pastor_name: updates.pastorName } : {}),
          ...(updates.pastorPhone !== undefined ? { pastor_phone: updates.pastorPhone } : {}),
          ...(updates.personalTestimony !== undefined ? { personal_testimony: updates.personalTestimony } : {}),
          ...(updates.ministryCalling !== undefined ? { ministry_calling: updates.ministryCalling } : {}),
          ...(updates.status ? { status: updates.status } : {}),
          ...(updates.notes !== undefined ? { notes: updates.notes } : {})
        }).eq('id', id);
      } catch (err) {
        console.warn('Supabase application full update failed:', err);
      }
    }
  };

  const updateApplicationStatus = async (
    id: string,
    status: ApplicationSubmission['status'],
    notes?: string
  ) => {
    setApplications(prev => {
      const next = prev.map(a => (a.id === id ? { ...a, status, notes: notes || a.notes } : a));
      pushToSupabaseBackend({ admissions: next });
      return next;
    });

    const client = getSupabaseClient();
    if (client && isExternalSupabaseUrl(getSavedSupabaseConfig().url)) {
      try {
        await client.from('admissions').update({ status, notes }).eq('id', id);
      } catch (err) {
        console.warn('Supabase application update failed:', err);
      }
    }
  };

  const deleteApplication = async (id: string) => {
    recordDeletedId(id);
    setApplications(prev => {
      const next = prev.filter(a => a.id !== id);
      pushToSupabaseBackend({ admissions: next });
      return next;
    });
    const client = getSupabaseClient();
    if (client && isExternalSupabaseUrl(getSavedSupabaseConfig().url)) {
      try {
        await client.from('admissions').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase application delete failed:', err);
      }
    }
  };

  // Contact / Prayer Requests
  const submitContactMessage = async (msg: Omit<ContactMessage, 'id' | 'date' | 'status'>) => {
    const id = `msg-${Date.now()}`;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const newMsg: ContactMessage = {
      ...msg,
      id,
      date: now,
      status: 'New'
    };

    setContactMessages(prev => {
      const next = [newMsg, ...prev];
      pushToSupabaseBackend({ contact_messages: next });
      return next;
    });

    const client = getSupabaseClient();
    if (client && isExternalSupabaseUrl(getSavedSupabaseConfig().url)) {
      try {
        await client.from('contact_messages').insert(newMsg);
      } catch (err) {
        console.warn('Contact message Supabase push:', err);
      }
    }
  };

  const updateContactMessage = async (id: string, updates: Partial<ContactMessage>) => {
    setContactMessages(prev => {
      const next = prev.map(m => (m.id === id ? { ...m, ...updates } : m));
      pushToSupabaseBackend({ contact_messages: next });
      return next;
    });
    const client = getSupabaseClient();
    if (client && isExternalSupabaseUrl(getSavedSupabaseConfig().url)) {
      try {
        await client.from('contact_messages').update(updates).eq('id', id);
      } catch (err) {
        console.warn('Contact message Supabase update:', err);
      }
    }
  };

  const deleteContactMessage = async (id: string) => {
    recordDeletedId(id);
    setContactMessages(prev => {
      const next = prev.filter(m => m.id !== id);
      pushToSupabaseBackend({ contact_messages: next });
      return next;
    });
    const client = getSupabaseClient();
    if (client && isExternalSupabaseUrl(getSavedSupabaseConfig().url)) {
      try {
        await client.from('contact_messages').delete().eq('id', id);
      } catch (err) {
        console.warn('Contact message Supabase delete:', err);
      }
    }
  };

  const markMessageAnswered = async (id: string) => {
    setContactMessages(prev => {
      const next = prev.map(m => (m.id === id ? { ...m, status: 'Prayed / Answered' as const } : m));
      pushToSupabaseBackend({ contact_messages: next });
      return next;
    });
  };

  return (
    <CollegeContext.Provider
      value={{
        activePage,
        setActivePage,
        loginMode,
        setLoginMode,
        courses,
        faculty,
        addFaculty,
        updateFaculty,
        deleteFaculty,
        studentProfile,
        isStudentLoggedIn,
        loginStudent,
        logoutStudent,
        studentsList,
        addStudent,
        updateStudent,
        deleteStudent,
        subjectsList,
        addSubject,
        updateSubject,
        deleteSubject,
        currentUser,
        currentAuthRole,
        authLoading,
        loginWithSupabase,
        signUpWithSupabase,
        loginWithPin,
        loginWithAdminCredentials,
        logout,
        uploadedFiles,
        uploadFileToStorage,
        addUploadedFileManual,
        updateUploadedFile,
        deleteUploadedFile,
        studyMaterials,
        addStudyMaterial,
        updateStudyMaterial,
        deleteStudyMaterial,
        notices,
        addNotice,
        updateNotice,
        deleteNotice,
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        gallery,
        addGalleryPhoto,
        updateGalleryPhoto,
        deleteGalleryPhoto,
        addCourse,
        updateCourse,
        deleteCourse,
        downloads,
        addDownload,
        updateDownload,
        deleteDownload,
        recordDownload,
        applications,
        submitApplication,
        updateApplication,
        updateApplicationStatus,
        deleteApplication,
        contactMessages,
        submitContactMessage,
        updateContactMessage,
        deleteContactMessage,
        markMessageAnswered,
        selectedCourseForApply,
        setSelectedCourseForApply,
        activeDocumentPreview,
        setActiveDocumentPreview,
        supabaseStatus,
        updateSupabaseCredentials,
        syncWithSupabase,
        seedAllDataToSupabase
      }}
    >
      {children}
    </CollegeContext.Provider>
  );
};

export const useCollege = (): CollegeContextType => {
  const context = useContext(CollegeContext);
  if (!context) {
    throw new Error('useCollege must be used within a CollegeProvider');
  }
  return context;
};
