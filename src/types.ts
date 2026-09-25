export interface Course {
  id: string;
  code: string;
  title: string;
  level: 'Bachelor' | 'Master' | 'Certificate' | 'Short Course';
  duration: string;
  mode: 'Residential' | 'Residential & Day Scholar' | 'Hybrid / Modular' | 'Residential & Hybrid Modular' | 'Residential / Evening Classes';
  language: string;
  description: string;
  eligibility: string;
  totalCredits: number;
  featured?: boolean;
  curriculum: {
    year: string;
    courses: string[];
  }[];
  outcomes: string[];
  annualTuition: string;
}

export interface FacultyMember {
  id: string;
  name: string;
  role: string;
  department: string;
  degrees: string;
  almaMater: string;
  yearsOfExperience: number;
  bio: string;
  subjects: string[];
  photo: string;
  quote?: string;
}

export interface StudentProfile {
  id: string;
  regNo: string;
  name: string;
  email: string;
  phone: string;
  courseId: string;
  courseTitle: string;
  currentYear: string;
  batch: string;
  avatar: string;
  attendancePercent: number;
  gpa: string;
  enrolledSubjects: {
    code: string;
    name: string;
    faculty: string;
    credits: number;
    grade: string;
    attendance: number;
  }[];
  recentAssignments: {
    title: string;
    dueDate: string;
    status: 'Submitted' | 'Graded' | 'Pending';
    score?: string;
  }[];
}

export interface StudyMaterial {
  id: string;
  title: string;
  courseCode: string;
  courseName: string;
  subject: string;
  facultyName: string;
  type: 'PDF' | 'Syllabus' | 'Lecture Notes' | 'Audio / Video' | 'Handout';
  fileSize: string;
  uploadedDate: string;
  description: string;
  downloadUrl?: string;
}

export interface Notice {
  id: string;
  title: string;
  category: 'Academic' | 'Chapel' | 'Examination' | 'Admissions' | 'Hostel';
  date: string;
  isUrgent?: boolean;
  content: string;
  postedBy: string;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  speaker: string;
  category: 'Conference' | 'Chapel' | 'Convocation' | 'Outreach' | 'Seminar';
  description: string;
  image: string;
  registrationOpen: boolean;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  category: 'Campus' | 'Chapel' | 'Graduation' | 'Outreach' | 'Student Life' | 'Classroom';
  image: string;
  caption: string;
}

export interface DownloadDoc {
  id: string;
  title: string;
  category: 'Prospectus' | 'Syllabus' | 'Forms' | 'Academic Calendar' | 'Institutional';
  format: 'PDF' | 'DOCX';
  fileSize: string;
  updatedAt: string;
  description: string;
  downloadCount: number;
}

export interface ApplicationSubmission {
  id: string;
  applicationNo: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  courseId: string;
  previousEducation: string;
  homeChurch: string;
  pastorName: string;
  pastorPhone: string;
  personalTestimony: string;
  ministryCalling: string;
  submittedAt: string;
  status: 'Under Review' | 'Interview Scheduled' | 'Admitted' | 'Pending Documents';
  notes?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  isPrayerRequest: boolean;
  message: string;
  date: string;
  status: 'New' | 'Prayed / Answered';
}

export type UserRole = 'super_admin' | 'admin' | 'faculty' | 'student';

export interface AppUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
  studentId?: string;
  facultyId?: string;
  createdAt?: string;
}

export interface SubjectItem {
  id: string;
  courseId: string;
  courseName?: string;
  subjectCode: string;
  subjectName: string;
  credits: number;
  semesterOrYear: string;
  facultyName: string;
}

export type StorageBucket =
  | 'student-photos'
  | 'faculty-photos'
  | 'study-materials'
  | 'certificates'
  | 'gallery'
  | 'college-documents';

export interface UploadedStorageFile {
  name: string;
  bucket: StorageBucket;
  url: string;
  size: string;
  uploadedAt: string;
}

export type AppTheme =
  | 'pure-light'
  | 'heritage-light'
  | 'midnight-regal'
  | 'cryo-cyan'
  | 'emerald-eden'
  | 'crimson-theology';

export interface ThemeConfig {
  id: AppTheme;
  name: string;
  subtitle: string;
  isDark: boolean;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
  previewBg: string;
  previewBorder: string;
  description: string;
}

