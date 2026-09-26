import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { StorageBucket, UserRole, AppUser } from '../types';

// Default Supabase project configuration keys provided by user:
// Publishable key: sb_publishable_mY-zOAZTMoje3pwhNMw4gg_XD_AcXHr
// Secret key: sb_secret_2K24FMByaTgTVBC9NSvF9Q_tiSKXK0s

export const DEFAULT_SUPABASE_KEY = 'sb_publishable_mY-zOAZTMoje3pwhNMw4gg_XD_AcXHr';
export const DEFAULT_SUPABASE_SECRET = 'sb_secret_2K24FMByaTgTVBC9NSvF9Q_tiSKXK0s';

const SUPABASE_STORAGE_URL_KEY = 'icbc_supabase_project_url';
const SUPABASE_STORAGE_KEY_KEY = 'icbc_supabase_project_key';

export function getSavedSupabaseConfig(): { url: string; key: string } {
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

  const defaultOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  const storedUrl = localStorage.getItem(SUPABASE_STORAGE_URL_KEY) || envUrl || defaultOrigin;
  const storedKey = localStorage.getItem(SUPABASE_STORAGE_KEY_KEY) || envKey || DEFAULT_SUPABASE_KEY;

  return {
    url: storedUrl.trim(),
    key: storedKey.trim()
  };
}

export function isExternalSupabaseUrl(url: string): boolean {
  return Boolean(url && url.includes('.supabase.co'));
}

export function saveSupabaseConfig(url: string, key: string) {
  if (url) localStorage.setItem(SUPABASE_STORAGE_URL_KEY, url.trim());
  if (key) localStorage.setItem(SUPABASE_STORAGE_KEY_KEY, key.trim());
}

let cachedClient: SupabaseClient | null = null;
let lastUrl = '';
let lastKey = '';

export function getSupabaseClient(): SupabaseClient | null {
  const { url, key } = getSavedSupabaseConfig();
  if (!url || !key) {
    return null;
  }

  // Ensure url is valid format (e.g. https://xyz.supabase.co)
  let normalizedUrl = url;
  if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
    normalizedUrl = `https://${normalizedUrl}`;
  }

  try {
    if (cachedClient && lastUrl === normalizedUrl && lastKey === key) {
      return cachedClient;
    }
    cachedClient = createClient(normalizedUrl, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    });
    lastUrl = normalizedUrl;
    lastKey = key;
    return cachedClient;
  } catch (err) {
    console.error('Failed to create Supabase client:', err);
    return null;
  }
}

// ==========================================
// STEP 3: AUTHENTICATION HELPERS
// ==========================================

export async function supabaseSignIn(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
  const client = getSupabaseClient();
  if (!client) {
    return { user: null, error: 'Supabase project URL is not configured. Please enter your project URL in Admin > Supabase DB.' };
  }
  try {
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) return { user: null, error: error.message };
    return { user: data.user, error: null };
  } catch (err: any) {
    return { user: null, error: err.message || 'Authentication failed' };
  }
}

export async function supabaseSignUp(
  email: string,
  password: string,
  fullName: string,
  role: UserRole
): Promise<{ user: User | null; error: string | null }> {
  const client = getSupabaseClient();
  if (!client) {
    return { user: null, error: 'Supabase project URL is not configured.' };
  }
  try {
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role
        }
      }
    });
    if (error) return { user: null, error: error.message };

    // Also insert or sync into public.users table if client has access
    if (data.user) {
      try {
        await client.from('users').upsert({
          auth_id: data.user.id,
          email: email,
          full_name: fullName,
          role: role
        });
      } catch (e) {
        console.warn('Could not upsert into public.users table:', e);
      }
    }

    return { user: data.user, error: null };
  } catch (err: any) {
    return { user: null, error: err.message || 'Registration failed' };
  }
}

export async function supabaseSignOut(): Promise<void> {
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.auth.signOut();
    } catch (err) {
      console.error('Sign out error:', err);
    }
  }
}

// ==========================================
// STEP 4: STORAGE HELPERS FOR PDFS / IMAGES
// ==========================================

export const ALL_STORAGE_BUCKETS: { id: StorageBucket; name: string; description: string; acceptedTypes: string }[] = [
  {
    id: 'student-photos',
    name: 'Student Photos',
    description: 'Profile pictures and ID badge portraits of enrolled students',
    acceptedTypes: 'image/jpeg, image/png, image/webp'
  },
  {
    id: 'faculty-photos',
    name: 'Faculty Photos',
    description: 'Portraits and department head profile photos',
    acceptedTypes: 'image/jpeg, image/png, image/webp'
  },
  {
    id: 'study-materials',
    name: 'Study Materials & Lecture PDFs',
    description: 'Hermeneutics, Greek, theology notes, course syllabi, and handbooks',
    acceptedTypes: 'application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  },
  {
    id: 'certificates',
    name: 'Certificates & Transcripts',
    description: 'Graduation diplomas, B.Th/M.Div certificates, and official transcripts',
    acceptedTypes: 'application/pdf, image/jpeg, image/png'
  },
  {
    id: 'gallery',
    name: 'Campus Gallery & Events',
    description: 'High-res photos of chapel services, convocations, library, and ministry outreach',
    acceptedTypes: 'image/jpeg, image/png, image/webp'
  },
  {
    id: 'college-documents',
    name: 'College Documents & Prospectus',
    description: 'Academic calendar, institutional prospectus, pastoral recommendation forms',
    acceptedTypes: 'application/pdf'
  }
];

export async function uploadToSupabaseStorage(
  bucket: StorageBucket,
  file: File,
  customPath?: string
): Promise<{ url: string; path: string; error?: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { url: '', path: '', error: 'Supabase client is not connected' };
  }

  try {
    const timestamp = Date.now();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = customPath || `${timestamp}_${cleanFileName}`;

    const { data, error } = await client.storage.from(bucket).upload(filePath, file, {
      cacheControl: '3600',
      upsert: true
    });

    if (error) {
      return { url: '', path: '', error: error.message };
    }

    const { data: urlData } = client.storage.from(bucket).getPublicUrl(data.path);
    return { url: urlData.publicUrl, path: data.path };
  } catch (err: any) {
    return { url: '', path: '', error: err.message || 'File upload failed' };
  }
}

// ==========================================
// STEP 2 & 5: FULL DATABASE SCHEMA SQL
// ==========================================

export const COMPLETE_SUPABASE_SCHEMA_SQL = `-- =========================================================
-- IMAGE OF CHRIST BIBLE COLLEGE (VELLORE)
-- Complete Supabase PostgreSQL Schema, Storage & RLS Setup
-- Copy and run this script in the Supabase Dashboard -> SQL Editor
-- =========================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CREATE STORAGE BUCKETS (STEP 4)
INSERT INTO storage.buckets (id, name, public) VALUES
  ('student-photos', 'student-photos', true),
  ('faculty-photos', 'faculty-photos', true),
  ('study-materials', 'study-materials', true),
  ('certificates', 'certificates', true),
  ('gallery', 'gallery', true),
  ('college-documents', 'college-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Public Read and Upload Policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Public Access Storage' AND tablename = 'objects'
  ) THEN
    CREATE POLICY "Public Access Storage" ON storage.objects FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Public Upload Storage' AND tablename = 'objects'
  ) THEN
    CREATE POLICY "Public Upload Storage" ON storage.objects FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- 3. USERS / PROFILES TABLE (STEP 3: Auth & Roles)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID UNIQUE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('super_admin', 'admin', 'faculty', 'student')),
  avatar_url TEXT,
  student_id TEXT,
  faculty_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. COURSES TABLE
CREATE TABLE IF NOT EXISTS public.courses (
  id TEXT PRIMARY KEY,
  course_code TEXT NOT NULL,
  course_name TEXT NOT NULL,
  level TEXT NOT NULL,
  duration TEXT NOT NULL,
  mode TEXT NOT NULL,
  language TEXT NOT NULL,
  description TEXT,
  eligibility TEXT,
  total_credits INT DEFAULT 0,
  annual_tuition TEXT,
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. FACULTY TABLE
CREATE TABLE IF NOT EXISTS public.faculty (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  designation TEXT NOT NULL,
  department TEXT NOT NULL,
  qualification TEXT NOT NULL,
  alma_mater TEXT,
  years_of_experience INT DEFAULT 0,
  bio TEXT,
  subjects TEXT[],
  profile_image TEXT,
  quote TEXT,
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. STUDENTS TABLE
CREATE TABLE IF NOT EXISTS public.students (
  id TEXT PRIMARY KEY,
  student_id TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  course_id TEXT REFERENCES public.courses(id) ON DELETE SET NULL,
  course_title TEXT,
  admission_year TEXT,
  batch TEXT,
  profile_image TEXT,
  attendance_percent NUMERIC DEFAULT 90.0,
  gpa TEXT DEFAULT '3.8',
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. SUBJECTS TABLE
CREATE TABLE IF NOT EXISTS public.subjects (
  id TEXT PRIMARY KEY,
  course_id TEXT REFERENCES public.courses(id) ON DELETE CASCADE,
  subject_code TEXT NOT NULL,
  subject_name TEXT NOT NULL,
  credits INT DEFAULT 3,
  semester_or_year TEXT,
  faculty_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ADMISSIONS TABLE (Online Applications)
CREATE TABLE IF NOT EXISTS public.admissions (
  id TEXT PRIMARY KEY,
  application_no TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  date_of_birth TEXT,
  gender TEXT,
  course_id TEXT REFERENCES public.courses(id) ON DELETE SET NULL,
  previous_education TEXT,
  home_church TEXT,
  pastor_name TEXT,
  pastor_phone TEXT,
  personal_testimony TEXT,
  ministry_calling TEXT,
  status TEXT DEFAULT 'Under Review',
  notes TEXT,
  applied_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. NOTICES TABLE
CREATE TABLE IF NOT EXISTS public.notices (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  is_urgent BOOLEAN DEFAULT FALSE,
  content TEXT NOT NULL,
  posted_by TEXT DEFAULT 'Academic Dean',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT,
  location TEXT,
  speaker TEXT,
  category TEXT,
  description TEXT,
  image_url TEXT,
  registration_open BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. STUDY MATERIALS TABLE
CREATE TABLE IF NOT EXISTS public.study_materials (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subject_id TEXT,
  course_id TEXT REFERENCES public.courses(id) ON DELETE SET NULL,
  course_name TEXT,
  subject TEXT,
  faculty_name TEXT,
  type TEXT DEFAULT 'PDF',
  file_size TEXT,
  file_url TEXT,
  description TEXT,
  uploaded_by TEXT DEFAULT 'Faculty',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. GALLERY TABLE
CREATE TABLE IF NOT EXISTS public.gallery (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- 14. POLICIES: PUBLIC READ & WRITE ACCESS FOR CLIENT APP
DO $$
BEGIN
  -- Courses
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Courses' AND tablename = 'courses') THEN
    CREATE POLICY "Public Read Courses" ON public.courses FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Modify Courses' AND tablename = 'courses') THEN
    CREATE POLICY "Public Modify Courses" ON public.courses FOR ALL USING (true);
  END IF;

  -- Faculty
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Faculty' AND tablename = 'faculty') THEN
    CREATE POLICY "Public Read Faculty" ON public.faculty FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Modify Faculty' AND tablename = 'faculty') THEN
    CREATE POLICY "Public Modify Faculty" ON public.faculty FOR ALL USING (true);
  END IF;

  -- Students
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Students' AND tablename = 'students') THEN
    CREATE POLICY "Public Read Students" ON public.students FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Modify Students' AND tablename = 'students') THEN
    CREATE POLICY "Public Modify Students" ON public.students FOR ALL USING (true);
  END IF;

  -- Subjects
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Subjects' AND tablename = 'subjects') THEN
    CREATE POLICY "Public Read Subjects" ON public.subjects FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Modify Subjects' AND tablename = 'subjects') THEN
    CREATE POLICY "Public Modify Subjects" ON public.subjects FOR ALL USING (true);
  END IF;

  -- Admissions
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Admissions' AND tablename = 'admissions') THEN
    CREATE POLICY "Public Read Admissions" ON public.admissions FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Insert Admissions' AND tablename = 'admissions') THEN
    CREATE POLICY "Public Insert Admissions" ON public.admissions FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Update Admissions' AND tablename = 'admissions') THEN
    CREATE POLICY "Public Update Admissions" ON public.admissions FOR UPDATE USING (true);
  END IF;

  -- Notices
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Notices' AND tablename = 'notices') THEN
    CREATE POLICY "Public Read Notices" ON public.notices FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Modify Notices' AND tablename = 'notices') THEN
    CREATE POLICY "Public Modify Notices" ON public.notices FOR ALL USING (true);
  END IF;

  -- Events
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Events' AND tablename = 'events') THEN
    CREATE POLICY "Public Read Events" ON public.events FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Modify Events' AND tablename = 'events') THEN
    CREATE POLICY "Public Modify Events" ON public.events FOR ALL USING (true);
  END IF;

  -- Study Materials
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Study Materials' AND tablename = 'study_materials') THEN
    CREATE POLICY "Public Read Study Materials" ON public.study_materials FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Modify Study Materials' AND tablename = 'study_materials') THEN
    CREATE POLICY "Public Modify Study Materials" ON public.study_materials FOR ALL USING (true);
  END IF;

  -- Gallery
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Gallery' AND tablename = 'gallery') THEN
    CREATE POLICY "Public Read Gallery" ON public.gallery FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Modify Gallery' AND tablename = 'gallery') THEN
    CREATE POLICY "Public Modify Gallery" ON public.gallery FOR ALL USING (true);
  END IF;

  -- Users
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Users' AND tablename = 'users') THEN
    CREATE POLICY "Public Read Users" ON public.users FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Modify Users' AND tablename = 'users') THEN
    CREATE POLICY "Public Modify Users" ON public.users FOR ALL USING (true);
  END IF;
END $$;

-- 15. INITIAL SEED DATA (Pre-populates the College Database)
-- Courses
INSERT INTO public.courses (id, course_code, course_name, level, duration, mode, language, description, eligibility, total_credits, annual_tuition, status)
VALUES
  ('bth', 'B.Th', 'Bachelor of Theology (B.Th)', 'Bachelor', '3 Years (6 Semesters)', 'Residential & Day Scholar', 'English & Tamil Tracks', 'Comprehensive undergraduate theological degree equipping servant-leaders with sound biblical doctrine, pastoral formation, and cross-cultural church planting in South Asia.', 'Pass in 10+2 / Higher Secondary / Intermediate from a recognized board, or equivalent. Born-again Christian with verifiable ministry calling.', 108, '₹24,000 / year (Scholarships available for eligible rural candidates)', 'Active'),
  ('mdiv', 'M.Div', 'Master of Divinity (M.Div)', 'Master', '3 Years (2 Years for B.Th Graduates)', 'Residential & Hybrid Modular', 'English (with Tamil tutorial support)', 'The premier professional master’s degree for pastoral and theological leadership. Equips students with high-level biblical exegesis in original languages, dogmatic theology, and leadership wisdom.', 'A recognized Bachelor’s Degree (B.A, B.Sc, B.Com, B.Tech, etc.) or a B.Th from a recognized Bible College.', 92, '₹36,000 / year (Hostel & Mess subsidized)', 'Active'),
  ('cert', 'CBS', 'Certificate in Biblical Studies (CBS)', 'Certificate', '1 Year (Evening & Weekend Modular)', 'Residential / Evening Classes', 'Tamil and English', 'Foundational biblical certification designed for Sunday school educators, youth directors, worship leaders, and lay elders.', 'Pass in 10th Standard / Matriculation. A passion for knowing God’s Word.', 32, '₹12,000 / year', 'Active'),
  ('short-greek', 'ST-02', 'Short Course: Biblical Greek for Preachers', 'Short Course', '6 Weeks (Evening Online / In-person)', 'Hybrid / Modular', 'English', 'Learn to read the Greek New Testament without fear. Understand verbal aspect, cases, prepositions, and key theological vocabulary.', 'Basic theological interest or current theological student.', 4, '₹3,500', 'Active')
ON CONFLICT (id) DO UPDATE SET course_name = EXCLUDED.course_name;

-- Faculty
INSERT INTO public.faculty (id, name, email, phone, designation, department, qualification, alma_mater, years_of_experience, bio, subjects, profile_image, quote, status)
VALUES
  ('fac-1', 'Pr. Christopher', 'principal@iocbc.edu.in', '+91 95004 23126', 'Principal & President', 'Theology & Pastoral Leadership', 'B.Th, B.D, M.Th (Theology), Ph.D (Theology)', 'United Theological College, Bangalore', 24, 'Pr. Christopher serves Image of Christ Bible College since 2020. Dedicated to the Great Commission and the John 17:18 mission.', ARRAY['Systematic Theology', 'Trinitarian Dogmatics', 'Pastoral Leadership'], 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80', '“We do not merely teach students information about Christ; we mentor them into the very image of Christ.”', 'Active'),
  ('fac-2', 'Dr. Grace Joshua', 'dr.grace@iocbc.edu.in', '+91 94432 10022', 'Vice Principal & Professor of New Testament Studies', 'Biblical Languages & Exegesis', 'M.A (English), B.D, M.Th (New Testament), D.Th', 'South Asia Institute of Advanced Christian Studies (SAIACS)', 19, 'Dr. Grace Joshua is a renowned scholar of Johannine literature and Koine Greek.', ARRAY['Biblical Greek', 'Johannine Literature', 'Romans'], 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80', '“To read the New Testament in its original Greek is to sit at the feet of the Apostles.”', 'Active'),
  ('fac-3', 'Rev. Dr. Samuel Jayakumar', 'dr.samuel@iocbc.edu.in', '+91 94432 10033', 'Academic Dean & Professor of Missions', 'Missiology & Church Planting', 'B.Sc, B.Th, M.Div, M.Th (Missions), Ph.D', 'Union Biblical Seminary, Pune', 22, 'Rev. Dr. Samuel Jayakumar directs the college practical ministry practicums and rural church planting.', ARRAY['Theology of Mission', 'Church Planting Strategies'], 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80', '“We train soldiers of the Cross for the harvest fields.”', 'Active')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- Students
INSERT INTO public.students (id, student_id, full_name, email, phone, course_id, course_title, admission_year, batch, profile_image, attendance_percent, gpa, status)
VALUES
  ('std-2025-042', 'ICBC-2024-M08', 'Brother John Rajan', 'john.rajan@student.icbc.ac.in', '+91 98410 44521', 'mdiv', 'Master of Divinity (M.Div) - 2nd Year', 'Academic Year 2025–26 (Semester IV)', 'Batch of 2024–2027', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', 92.4, '3.82 / 4.0', 'Active'),
  ('std-2025-018', 'ICBC-2024-B12', 'Stephen Dhanraj', 'stephen.dhanraj@student.icbc.ac.in', '+91 97890 32145', 'bth', 'Bachelor of Theology (B.Th) - 2nd Year', 'Year 2 (Semester III)', 'Batch of 2024–2027', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', 94.0, '3.75 / 4.0', 'Active')
ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;

-- Subjects
INSERT INTO public.subjects (id, course_id, subject_code, subject_name, credits, semester_or_year, faculty_name)
VALUES
  ('sub-1', 'bth', 'NT-301', 'Gospels & Life of Christ', 3, 'Year 1 / Sem 1', 'Dr. Grace Joshua'),
  ('sub-2', 'bth', 'OT-301', 'Old Testament Survey: Pentateuch', 3, 'Year 1 / Sem 1', 'Rev. K. David Raj'),
  ('sub-3', 'bth', 'TH-301', 'Systematic Theology I: God & Revelation', 3, 'Year 1 / Sem 2', 'Pr. Christopher'),
  ('sub-6', 'mdiv', 'GK-501', 'Biblical Greek: Syntax & Exegesis', 4, 'Year 1 / Sem 1', 'Dr. Grace Joshua'),
  ('sub-8', 'mdiv', 'ST-504', 'Systematic Theology: Soteriology & Eschatology', 4, 'Year 2 / Sem 3', 'Pr. Christopher')
ON CONFLICT (id) DO UPDATE SET subject_name = EXCLUDED.subject_name;

-- Notices
INSERT INTO public.notices (id, title, category, is_urgent, content, posted_by)
VALUES
  ('not-1', 'Admissions for Academic Year 2026–2027 are Open', 'Admissions', true, 'Formal applications for B.Th, M.Div, and Certificate courses are now open. Hostel reservation is on a first-come basis.', 'Office of the Registrar'),
  ('not-2', 'Annual All-Night Intercessory Chapel Service', 'Chapel', false, 'All enrolled students, resident scholars, and visiting pastors are invited to the Chapel on Friday from 9:00 PM to 4:30 AM.', 'Dean of Chapel')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;

-- Users
INSERT INTO public.users (id, email, full_name, role, avatar_url, student_id, faculty_id)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'admin@iocbc.edu.in', 'Pr. Christopher', 'super_admin', 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80', NULL, 'fac-1'),
  ('44444444-4444-4444-4444-444444444444', 'john.rajan@student.icbc.ac.in', 'Brother John Rajan', 'student', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', 'ICBC-2024-M08', NULL)
ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role;
`;
