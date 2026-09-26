import React, { createContext, useContext, useState, useEffect } from 'react';
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
  addGalleryPhoto: (photo: Omit<GalleryPhoto, 'id'>) => Promise<void>;
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
  submitApplication: (app: Omit<ApplicationSubmission, 'id' | 'applicationNo' | 'submittedAt' | 'status'>) => Promise<string>;
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
  GALLERY: 'icbc_gallery_v3',
  UPLOADED_FILES: 'icbc_uploaded_files_v2',
  AUTH_USER: 'icbc_auth_user_v2',
  STUDENT_AUTH: 'icbc_student_auth_v2'
};

export const CollegeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [loginMode, setLoginMode] = useState<'user' | 'admin'>('user');
  const [selectedCourseForApply, setSelectedCourseForApply] = useState<string | null>(null);
  const [activeDocumentPreview, setActiveDocumentPreview] = useState<{ title: string; type: string; content?: string } | null>(null);

  // Supabase status state
  const initialConfig = getSavedSupabaseConfig();
  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseSyncStatus>({
    connected: Boolean(initialConfig.url && initialConfig.key),
    projectUrl: initialConfig.url,
    publishableKey: initialConfig.key || DEFAULT_SUPABASE_KEY,
    lastSyncedAt: undefined,
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

  // Sync to local storage for instant offline resilience
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(studyMaterials));
  }, [studyMaterials]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONTACT, JSON.stringify(contactMessages));
  }, [contactMessages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(studentsList));
  }, [studentsList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjectsList));
  }, [subjectsList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FACULTY, JSON.stringify(faculty));
  }, [faculty]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DOWNLOADS, JSON.stringify(downloads));
  }, [downloads]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(gallery));
  }, [gallery]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.UPLOADED_FILES, JSON.stringify(uploadedFiles));
  }, [uploadedFiles]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENT_AUTH, JSON.stringify(isStudentLoggedIn));
  }, [isStudentLoggedIn]);

  // Listen to Supabase Auth State changes on mount if connected
  useEffect(() => {
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
    const client = getSupabaseClient();
    if (client) {
      const result = await uploadToSupabaseStorage(bucket, file);
      if (result.url) {
        const newFile: UploadedStorageFile = {
          name: file.name,
          bucket: bucket,
          url: result.url,
          size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          uploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        };
        setUploadedFiles(prev => [newFile, ...prev]);
        return { url: result.url };
      }
      if (result.error) {
        console.warn('Supabase storage upload error:', result.error);
      }
    }

    // Fallback URL generator when offline or before storage bucket creation
    const fallbackUrl = URL.createObjectURL(file);
    const newFile: UploadedStorageFile = {
      name: file.name,
      bucket: bucket,
      url: fallbackUrl,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      uploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    setUploadedFiles(prev => [newFile, ...prev]);
    return { url: fallbackUrl };
  };

  const addUploadedFileManual = (file: UploadedStorageFile) => {
    setUploadedFiles(prev => [file, ...prev]);
  };

  const updateUploadedFile = (index: number, updates: Partial<UploadedStorageFile>) => {
    setUploadedFiles(prev => prev.map((f, i) => (i === index ? { ...f, ...updates } : f)));
  };

  const deleteUploadedFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Faculty management
  const addFaculty = async (member: Omit<FacultyMember, 'id'>) => {
    const id = `fac-${Date.now()}`;
    const newMember: FacultyMember = { ...member, id };
    setFaculty(prev => [newMember, ...prev]);
    const client = getSupabaseClient();
    if (client) {
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
    setFaculty(prev => prev.map(f => (f.id === id ? { ...f, ...updates } : f)));
    const client = getSupabaseClient();
    if (client) {
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
    setFaculty(prev => prev.filter(f => f.id !== id));
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('faculty').delete().eq('id', id);
      } catch (e) {
        console.warn('Failed to delete faculty in Supabase:', e);
      }
    }
  };

  // Student & Subject management
  const addStudent = async (student: StudentProfile) => {
    setStudentsList(prev => [student, ...prev]);
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('students').insert({
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
        });
      } catch (e) {
        console.warn('Failed to insert student into Supabase:', e);
      }
    }
  };

  const updateStudent = async (id: string, updates: Partial<StudentProfile>) => {
    setStudentsList(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
    const client = getSupabaseClient();
    if (client) {
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
    setStudentsList(prev => prev.filter(s => s.id !== id));
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('students').delete().eq('id', id);
      } catch (e) {
        console.warn('Failed to delete student in Supabase:', e);
      }
    }
  };

  const addSubject = async (subject: SubjectItem) => {
    setSubjectsList(prev => [...prev, subject]);
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('subjects').insert({
          id: subject.id,
          course_id: subject.courseId,
          subject_code: subject.subjectCode,
          subject_name: subject.subjectName,
          credits: subject.credits,
          semester_or_year: subject.semesterOrYear,
          faculty_name: subject.facultyName
        });
      } catch (e) {
        console.warn('Failed to insert subject into Supabase:', e);
      }
    }
  };

  const updateSubject = async (id: string, updates: Partial<SubjectItem>) => {
    setSubjectsList(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
    const client = getSupabaseClient();
    if (client) {
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
    setSubjectsList(prev => prev.filter(s => s.id !== id));
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('subjects').delete().eq('id', id);
      } catch (e) {
        console.warn('Failed to delete subject in Supabase:', e);
      }
    }
  };

  // Sync with Supabase on mount or when requested
  const syncWithSupabase = async () => {
    const client = getSupabaseClient();
    if (!client) {
      setSupabaseStatus(prev => ({
        ...prev,
        connected: false,
        syncError: 'Please provide your Supabase Project URL in Admin -> Supabase DB.'
      }));
      return;
    }

    try {
      // 1. Fetch admissions
      const { data: appData, error: appError } = await client.from('admissions').select('*').limit(50);
      if (!appError && appData && appData.length > 0) {
        const formatted = appData.map(a => ({
          id: a.id,
          applicationNo: a.application_no || a.id,
          fullName: a.full_name,
          email: a.email,
          phone: a.phone,
          dateOfBirth: a.date_of_birth || '',
          gender: a.gender || 'Male',
          courseId: a.course_id || 'bth',
          previousEducation: a.previous_education || '',
          homeChurch: a.home_church || '',
          pastorName: a.pastor_name || '',
          pastorPhone: a.pastor_phone || '',
          personalTestimony: a.personal_testimony || '',
          ministryCalling: a.ministry_calling || '',
          submittedAt: a.applied_at ? new Date(a.applied_at).toLocaleString() : new Date().toLocaleString(),
          status: a.status || 'Under Review',
          notes: a.notes
        }));
        setApplications(formatted as ApplicationSubmission[]);
      }

      // 2. Fetch notices
      const { data: noticeData, error: noticeErr } = await client.from('notices').select('*').order('created_at', { ascending: false });
      if (!noticeErr && noticeData && noticeData.length > 0) {
        setNotices(noticeData.map(n => ({
          id: n.id,
          title: n.title,
          category: n.category as Notice['category'],
          isUrgent: n.is_urgent,
          content: n.content,
          postedBy: n.posted_by,
          date: n.created_at ? new Date(n.created_at).toISOString().split('T')[0] : '2026-09-24'
        })));
      }

      // 3. Fetch study materials
      const { data: matData, error: matErr } = await client.from('study_materials').select('*');
      if (!matErr && matData && matData.length > 0) {
        setStudyMaterials(matData.map(m => ({
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
        })));
      }

      // 4. Fetch students
      const { data: stdData, error: stdErr } = await client.from('students').select('*');
      if (!stdErr && stdData && stdData.length > 0) {
        setStudentsList(stdData.map(s => ({
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
        })));
      }

      // 5. Fetch events
      const { data: evData, error: evErr } = await client.from('events').select('*');
      if (!evErr && evData && evData.length > 0) {
        setEvents(evData.map(e => ({
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
        })));
      }

      // 6. Fetch gallery
      const { data: galData, error: galErr } = await client.from('gallery').select('*');
      if (!galErr && galData && galData.length > 0) {
        setGallery(galData.map(g => ({
          id: g.id,
          title: g.title,
          category: (g.category as GalleryPhoto['category']) || 'Campus',
          image: g.image_url,
          caption: g.caption || ''
        })));
      }

      // 7. Fetch courses
      const { data: crsData, error: crsErr } = await client.from('courses').select('*');
      if (!crsErr && crsData && crsData.length > 0) {
        setCourses(crsData.map(c => {
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
            curriculum: (c.curriculum && Array.isArray(c.curriculum)) ? c.curriculum : (fallbackCourse?.curriculum || []),
            outcomes: (c.outcomes && Array.isArray(c.outcomes)) ? c.outcomes : (fallbackCourse?.outcomes || [])
          };
        }));
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
        syncError: err?.message || 'Error syncing with Supabase'
      }));
    }
  };

  // STEP 2 & 5: Seed initial database tables in Supabase with one click
  const seedAllDataToSupabase = async (): Promise<{ success: boolean; message: string; seededCount: number }> => {
    const client = getSupabaseClient();
    if (!client) {
      return { success: false, message: 'Please connect your Supabase project URL first.', seededCount: 0 };
    }

    try {
      let count = 0;

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
      const { error: cErr } = await client.from('courses').upsert(courseRows);
      if (!cErr) count += courseRows.length;

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
      const { error: fErr } = await client.from('faculty').upsert(facultyRows);
      if (!fErr) count += facultyRows.length;

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
      const { error: sErr } = await client.from('students').upsert(studentRows);
      if (!sErr) count += studentRows.length;

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
      const { error: subErr } = await client.from('subjects').upsert(subjectRows);
      if (!subErr) count += subjectRows.length;

      // 5. Seed notices
      const noticeRows = notices.map(n => ({
        id: n.id,
        title: n.title,
        category: n.category,
        is_urgent: Boolean(n.isUrgent),
        content: n.content,
        posted_by: n.postedBy
      }));
      const { error: nErr } = await client.from('notices').upsert(noticeRows);
      if (!nErr) count += noticeRows.length;

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
      const { error: eErr } = await client.from('events').upsert(eventRows);
      if (!eErr) count += eventRows.length;

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
      const { error: mErr } = await client.from('study_materials').upsert(materialRows);
      if (!mErr) count += materialRows.length;

      // 8. Seed gallery
      const galleryRows = gallery.map(g => ({
        id: g.id,
        title: g.title,
        category: g.category,
        image_url: g.image,
        caption: g.caption
      }));
      const { error: gErr } = await client.from('gallery').upsert(galleryRows);
      if (!gErr) count += galleryRows.length;

      return {
        success: true,
        message: `Successfully seeded ${count} records across courses, faculty, students, subjects, notices, events, study materials, and gallery!`,
        seededCount: count
      };
    } catch (err: any) {
      return {
        success: false,
        message: err?.message || 'Error occurred while inserting seed records into Supabase.',
        seededCount: 0
      };
    }
  };

  const updateSupabaseCredentials = async (url: string, key: string) => {
    saveSupabaseConfig(url, key);
    setSupabaseStatus(prev => ({
      ...prev,
      projectUrl: url,
      publishableKey: key,
      connected: Boolean(url && key),
      syncError: null
    }));

    await syncWithSupabase();
    return { success: true, message: 'Configuration saved and sync attempted.' };
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

    setStudyMaterials(prev => [newMat, ...prev]);

    const client = getSupabaseClient();
    if (client) {
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
    setStudyMaterials(prev => prev.map(m => (m.id === id ? { ...m, ...updates } : m)));
    const client = getSupabaseClient();
    if (client) {
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
    setStudyMaterials(prev => prev.filter(m => m.id !== id));
    const client = getSupabaseClient();
    if (client) {
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

    setNotices(prev => [newNotice, ...prev]);

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('notices').insert({
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
    setNotices(prev => prev.map(n => (n.id === id ? { ...n, ...updates } : n)));
    const client = getSupabaseClient();
    if (client) {
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
    setNotices(prev => prev.filter(n => n.id !== id));
    const client = getSupabaseClient();
    if (client) {
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
    setEvents(prev => [newEvent, ...prev]);

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('events').insert({
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
    setEvents(prev => prev.map(ev => (ev.id === id ? { ...ev, ...updates } : ev)));
    const client = getSupabaseClient();
    if (client) {
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
    setEvents(prev => prev.filter(ev => ev.id !== id));
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('events').delete().eq('id', id);
      } catch (err) {
        console.warn('Could not delete event from Supabase:', err);
      }
    }
  };

  // Gallery Management (Immediately saved to Supabase & Live in User Site)
  const addGalleryPhoto = async (photo: Omit<GalleryPhoto, 'id'>) => {
    const id = `gal-${Date.now()}`;
    const newPhoto: GalleryPhoto = { ...photo, id };
    setGallery(prev => [newPhoto, ...prev]);

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('gallery').insert({
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
  };

  const updateGalleryPhoto = async (id: string, updates: Partial<GalleryPhoto>) => {
    setGallery(prev => prev.map(g => (g.id === id ? { ...g, ...updates } : g)));
    const client = getSupabaseClient();
    if (client) {
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
    setGallery(prev => prev.filter(g => g.id !== id));
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('gallery').delete().eq('id', id);
      } catch (err) {
        console.warn('Could not delete gallery photo from Supabase:', err);
      }
    }
  };

  // Course Management (Immediately saved to Supabase & Live in User Site)
  const addCourse = async (course: Course) => {
    setCourses(prev => [course, ...prev.filter(c => c.id !== course.id)]);
    const client = getSupabaseClient();
    if (client) {
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
    setCourses(prev => prev.map(c => (c.id === id ? { ...c, ...updates } : c)));
    const client = getSupabaseClient();
    if (client) {
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
    setCourses(prev => prev.filter(c => c.id !== id));
    const client = getSupabaseClient();
    if (client) {
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
    setDownloads(prev => [newDoc, ...prev]);
  };

  const updateDownload = async (id: string, updates: Partial<DownloadDoc>) => {
    const updatedAt = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    setDownloads(prev => prev.map(d => (d.id === id ? { ...d, ...updates, updatedAt } : d)));
  };

  const deleteDownload = async (id: string) => {
    setDownloads(prev => prev.filter(d => d.id !== id));
  };

  const recordDownload = (id: string) => {
    setDownloads(prev =>
      prev.map(d => (d.id === id ? { ...d, downloadCount: d.downloadCount + 1 } : d))
    );
  };

  // Submit Admission Application
  const submitApplication = async (
    appData: Omit<ApplicationSubmission, 'id' | 'applicationNo' | 'submittedAt' | 'status'>
  ): Promise<string> => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const courseCode = appData.courseId.toUpperCase();
    const appNo = `IOCBC-2026-${courseCode}-${randomSuffix}`;
    const id = `app-${Date.now()}`;

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
      status: 'Under Review'
    };

    setApplications(prev => [newApp, ...prev]);

    // Push to Supabase admissions table
    const client = getSupabaseClient();
    if (client) {
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
    setApplications(prev => prev.map(a => (a.id === id ? { ...a, ...updates } : a)));
    const client = getSupabaseClient();
    if (client) {
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
    setApplications(prev =>
      prev.map(a => (a.id === id ? { ...a, status, notes: notes || a.notes } : a))
    );

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('admissions').update({ status, notes }).eq('id', id);
      } catch (err) {
        console.warn('Supabase application update failed:', err);
      }
    }
  };

  const deleteApplication = async (id: string) => {
    setApplications(prev => prev.filter(a => a.id !== id));
    const client = getSupabaseClient();
    if (client) {
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

    setContactMessages(prev => [newMsg, ...prev]);

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('contact_messages').insert(newMsg);
      } catch (err) {
        console.warn('Contact message Supabase push:', err);
      }
    }
  };

  const updateContactMessage = async (id: string, updates: Partial<ContactMessage>) => {
    setContactMessages(prev => prev.map(m => (m.id === id ? { ...m, ...updates } : m)));
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('contact_messages').update(updates).eq('id', id);
      } catch (err) {
        console.warn('Contact message Supabase update:', err);
      }
    }
  };

  const deleteContactMessage = async (id: string) => {
    setContactMessages(prev => prev.filter(m => m.id !== id));
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('contact_messages').delete().eq('id', id);
      } catch (err) {
        console.warn('Contact message Supabase delete:', err);
      }
    }
  };

  const markMessageAnswered = async (id: string) => {
    setContactMessages(prev =>
      prev.map(m => (m.id === id ? { ...m, status: 'Prayed / Answered' } : m))
    );
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
