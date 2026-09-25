-- ==============================================================================
-- IMAGE OF CHRIST BIBLE COLLEGE (VELLORE) - COMPLETE SUPABASE DATABASE SETUP
-- ==============================================================================
-- Run this entire script in Supabase Dashboard -> SQL Editor -> New Query -> Run
-- This script safely creates:
--   1. Storage Buckets (6 buckets)
--   2. Database Tables (10 tables)
--   3. Row Level Security (RLS) Policies
--   4. Complete Pre-Populated College Data (Courses, Faculty, Students, Subjects,
--      Notices, Events, Study Materials, Gallery, and User Roles)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. STORAGE BUCKETS (STEP 4: Storage for PDFs & Images)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public) VALUES
  ('student-photos', 'student-photos', true),
  ('faculty-photos', 'faculty-photos', true),
  ('study-materials', 'study-materials', true),
  ('certificates', 'certificates', true),
  ('gallery', 'gallery', true),
  ('college-documents', 'college-documents', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Public Read and Upload Policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Storage Objects' AND tablename = 'objects'
  ) THEN
    CREATE POLICY "Public Read Storage Objects" ON storage.objects FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Public Upload Storage Objects' AND tablename = 'objects'
  ) THEN
    CREATE POLICY "Public Upload Storage Objects" ON storage.objects FOR INSERT WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Public Update Storage Objects' AND tablename = 'objects'
  ) THEN
    CREATE POLICY "Public Update Storage Objects" ON storage.objects FOR UPDATE USING (true);
  END IF;
END $$;

-- ==============================================================================
-- 3. DATABASE TABLES (STEP 2: Tables Architecture)
-- ==============================================================================

-- A. USERS / PROFILES TABLE (Authentication & Roles: super_admin, admin, faculty, student)
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

-- B. COURSES TABLE
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

-- C. FACULTY TABLE
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

-- D. STUDENTS TABLE
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

-- E. SUBJECTS TABLE
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

-- F. ADMISSIONS TABLE (Online Applications)
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

-- G. NOTICES TABLE
CREATE TABLE IF NOT EXISTS public.notices (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  is_urgent BOOLEAN DEFAULT FALSE,
  content TEXT NOT NULL,
  posted_by TEXT DEFAULT 'Academic Dean',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- H. EVENTS TABLE
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

-- I. STUDY MATERIALS TABLE (Lecture Notes & Handbooks)
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

-- J. GALLERY TABLE
CREATE TABLE IF NOT EXISTS public.gallery (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- K. CONTACT & PRAYER REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  is_prayer_request BOOLEAN DEFAULT FALSE,
  message TEXT NOT NULL,
  date TEXT,
  status TEXT DEFAULT 'New',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
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
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  -- Courses Policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read courses' AND tablename = 'courses') THEN
    CREATE POLICY "Allow read courses" ON public.courses FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow write courses' AND tablename = 'courses') THEN
    CREATE POLICY "Allow write courses" ON public.courses FOR ALL USING (true);
  END IF;

  -- Faculty Policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read faculty' AND tablename = 'faculty') THEN
    CREATE POLICY "Allow read faculty" ON public.faculty FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow write faculty' AND tablename = 'faculty') THEN
    CREATE POLICY "Allow write faculty" ON public.faculty FOR ALL USING (true);
  END IF;

  -- Students Policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read students' AND tablename = 'students') THEN
    CREATE POLICY "Allow read students" ON public.students FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow write students' AND tablename = 'students') THEN
    CREATE POLICY "Allow write students" ON public.students FOR ALL USING (true);
  END IF;

  -- Subjects Policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read subjects' AND tablename = 'subjects') THEN
    CREATE POLICY "Allow read subjects" ON public.subjects FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow write subjects' AND tablename = 'subjects') THEN
    CREATE POLICY "Allow write subjects" ON public.subjects FOR ALL USING (true);
  END IF;

  -- Admissions Policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read admissions' AND tablename = 'admissions') THEN
    CREATE POLICY "Allow read admissions" ON public.admissions FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow insert admissions' AND tablename = 'admissions') THEN
    CREATE POLICY "Allow insert admissions" ON public.admissions FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow update admissions' AND tablename = 'admissions') THEN
    CREATE POLICY "Allow update admissions" ON public.admissions FOR UPDATE USING (true);
  END IF;

  -- Notices Policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read notices' AND tablename = 'notices') THEN
    CREATE POLICY "Allow read notices" ON public.notices FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow write notices' AND tablename = 'notices') THEN
    CREATE POLICY "Allow write notices" ON public.notices FOR ALL USING (true);
  END IF;

  -- Events Policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read events' AND tablename = 'events') THEN
    CREATE POLICY "Allow read events" ON public.events FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow write events' AND tablename = 'events') THEN
    CREATE POLICY "Allow write events" ON public.events FOR ALL USING (true);
  END IF;

  -- Study Materials Policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read study_materials' AND tablename = 'study_materials') THEN
    CREATE POLICY "Allow read study_materials" ON public.study_materials FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow write study_materials' AND tablename = 'study_materials') THEN
    CREATE POLICY "Allow write study_materials" ON public.study_materials FOR ALL USING (true);
  END IF;

  -- Gallery Policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read gallery' AND tablename = 'gallery') THEN
    CREATE POLICY "Allow read gallery" ON public.gallery FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow write gallery' AND tablename = 'gallery') THEN
    CREATE POLICY "Allow write gallery" ON public.gallery FOR ALL USING (true);
  END IF;

  -- Users Policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read users' AND tablename = 'users') THEN
    CREATE POLICY "Allow read users" ON public.users FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow write users' AND tablename = 'users') THEN
    CREATE POLICY "Allow write users" ON public.users FOR ALL USING (true);
  END IF;

  -- Contact Messages Policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read contact_messages' AND tablename = 'contact_messages') THEN
    CREATE POLICY "Allow read contact_messages" ON public.contact_messages FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow insert contact_messages' AND tablename = 'contact_messages') THEN
    CREATE POLICY "Allow insert contact_messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow update contact_messages' AND tablename = 'contact_messages') THEN
    CREATE POLICY "Allow update contact_messages" ON public.contact_messages FOR UPDATE USING (true);
  END IF;
END $$;

-- ==============================================================================
-- 5. INITIAL SEED DATA (Populates the College Database Immediately)
-- ==============================================================================

-- A. Insert Academic Courses
INSERT INTO public.courses (id, course_code, course_name, level, duration, mode, language, description, eligibility, total_credits, annual_tuition, status)
VALUES
  ('bth', 'B.Th', 'Bachelor of Theology (B.Th)', 'Bachelor', '3 Years (6 Semesters)', 'Residential & Day Scholar', 'English & Tamil Tracks', 'Comprehensive undergraduate theological degree equipping servant-leaders with deep grounding in Old & New Testament exegesis, systematic theology, church history, homiletics, pastoral care, and cross-cultural church planting in South Asia.', 'Pass in 10+2 / Higher Secondary / Intermediate from a recognized board, or equivalent. Born-again Christian with verifiable ministry calling and recommendation letter from local church pastor.', 108, '₹24,000 / year (Scholarships available for eligible rural candidates)', 'Active'),
  ('mdiv', 'M.Div', 'Master of Divinity (M.Div)', 'Master', '3 Years (2 Years for B.Th Graduates)', 'Residential & Hybrid Modular', 'English (with Tamil tutorial support)', 'The premier professional master’s degree for pastoral and theological leadership. Equips students with high-level biblical exegesis in original languages (Greek & Hebrew), comprehensive dogmatic theology, cultural analysis, and leadership wisdom for church leadership and theological faculty teaching.', 'A recognized Bachelor’s Degree (B.A, B.Sc, B.Com, B.Tech, etc.) or a B.Th from a recognized Bible College. Evidence of active Christian ministry calling.', 92, '₹36,000 / year (Hostel & Mess subsidized)', 'Active'),
  ('cert', 'CBS', 'Certificate in Biblical Studies (CBS)', 'Certificate', '1 Year (Evening & Weekend Modular)', 'Residential / Evening Classes', 'Tamil and English', 'Foundational biblical certification designed for Sunday school educators, youth directors, worship leaders, and lay elders seeking doctrinal grounding while retaining secular employment.', 'Pass in 10th Standard / Matriculation. A passion for knowing God’s Word and serving the local fellowship faithfully.', 32, '₹12,000 / year', 'Active'),
  ('short-greek', 'ST-02', 'Short Course: Biblical Greek for Preachers', 'Short Course', '6 Weeks (Evening Online / In-person)', 'Hybrid / Modular', 'English', 'Learn to read the Greek New Testament without fear. Understand verbal aspect, cases, prepositions, and key theological vocabulary to unlock rich nuance in sermon preparation.', 'Basic theological interest or current theological student.', 4, '₹3,500 (Includes lexicon guide)', 'Active')
ON CONFLICT (id) DO UPDATE SET course_name = EXCLUDED.course_name;

-- B. Insert Theological Faculty
INSERT INTO public.faculty (id, name, email, phone, designation, department, qualification, alma_mater, years_of_experience, bio, subjects, profile_image, quote, status)
VALUES
  ('fac-1', 'Rev. Dr. S. Paul Dinakaran', 'dr.paul@iocbc.edu.in', '+91 94432 10011', 'Principal & Professor of Systematic Theology', 'Theology & Christian Doctrine', 'B.Th, B.D, M.Th (Theology), Ph.D (Theology)', 'United Theological College, Bangalore', 28, 'Rev. Dr. S. Paul Dinakaran has served Image of Christ Bible College since 1998. An ordained minister with pioneering pastoral experience across North and South India, he has authored seven textbooks on Christology, Trinitarian Orthodoxy, and Evangelical Hermeneutics.', ARRAY['Systematic Theology', 'Trinitarian Dogmatics', 'Hermeneutics', 'Pauline Theology'], 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80', '“We do not merely teach students information about Christ; we mentor them into the very image and character of Christ.”', 'Active'),
  ('fac-2', 'Dr. Grace Joshua', 'dr.grace@iocbc.edu.in', '+91 94432 10022', 'Vice Principal & Professor of New Testament Studies', 'Biblical Languages & Exegesis', 'M.A (English), B.D, M.Th (New Testament), D.Th', 'South Asia Institute of Advanced Christian Studies (SAIACS)', 19, 'Dr. Grace Joshua is a renowned scholar of Johannine literature and Koine Greek. She has dedicated her life to training ministers to handle the original biblical texts with reverence, literary discernment, and devotional vigor.', ARRAY['Biblical Greek', 'Johannine Literature', 'Epistle to the Romans', 'New Testament Theology'], 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80', '“To read the New Testament in its original Greek is to sit at the feet of the Apostles and catch the living heartbeat of the Early Church.”', 'Active'),
  ('fac-3', 'Rev. Dr. Samuel Jayakumar', 'dr.samuel@iocbc.edu.in', '+91 94432 10033', 'Academic Dean & Professor of Missions & Evangelism', 'Missiology & Church Planting', 'B.Sc, B.Th, M.Div, M.Th (Missions), Ph.D', 'Union Biblical Seminary, Pune', 22, 'Rev. Dr. Samuel Jayakumar combines academic rigor with apostolic field passion, having mobilized missionary teams across tribal corridors in Odisha, Andhra Pradesh, and rural Tamil Nadu. He directs the college’s weekend practical ministry practicums.', ARRAY['Theology of Mission', 'Church Planting Strategies', 'Contemporary Indian Religions', 'Apologetics'], 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80', '“A Bible college without passionate missionary outreach is like a lighthouse with no oil. We train soldiers of the Cross for the harvest fields.”', 'Active'),
  ('fac-4', 'Rev. K. David Raj', 'david.raj@iocbc.edu.in', '+91 94432 10044', 'Associate Professor of Old Testament & Hebrew', 'Old Testament Literature', 'B.A (History), B.D, M.Th (Old Testament)', 'Serampore College, West Bengal', 16, 'Rev. David Raj guides students through the richness of the Hebrew Bible, ancient Near Eastern cultural backgrounds, and messianic typology throughout the Pentateuch, Psalms, and the Major Prophets.', ARRAY['Biblical Hebrew', 'Pentateuch & Historical Books', 'Prophetic Literature', 'Wisdom Books'], 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80', '“The Old Testament is not a relic of the past; it is the grand foundation upon which the Gospel of Jesus Christ stands revealed.”', 'Active'),
  ('fac-5', 'Pastor Timothy Barnabas', 'timothy@iocbc.edu.in', '+91 94432 10055', 'Senior Lecturer in Church History & Christian Ethics', 'Historical Theology', 'M.A (History), B.Th, M.Th', 'Gurukul Lutheran Theological College', 11, 'Pastor Timothy inspires students with the heroic heritage of martyrs, reformers, and Indian missionary pioneers like Bartholomew Ziegenbalg, William Carey, and Sadhu Sundar Singh. He also teaches Christian ethics in modern society.', ARRAY['History of Christianity in India', 'Patristic Era', 'Christian Ethics', 'Indian Religions'], 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80', '“Knowing where God has led His church preserves us from the pitfalls of modern drift.”', 'Active'),
  ('fac-6', 'Sis. Priscilla Ebenezer', 'priscilla@iocbc.edu.in', '+91 94432 10066', 'Director of Practical Ministry & Christian Education', 'Christian Education', 'B.Sc (Child Dev), M.A, M.Th (Christian Education)', 'Senate of Serampore', 14, 'Sis. Priscilla oversees practical Christian training, women’s discipleship groups, and children’s ministry practicums. She is deeply committed to nurturing holistic emotional resilience and spiritual habits in each enrolled student.', ARRAY['Christian Education', 'Women in Ministry', 'Sunday School Pedagogy', 'Youth Counseling'], 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80', '“Teach the young generation not just to recite Scripture, but to fall passionately in love with its Author.”', 'Active')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- C. Insert Enrolled Students
INSERT INTO public.students (id, student_id, full_name, email, phone, course_id, course_title, admission_year, batch, profile_image, attendance_percent, gpa, status)
VALUES
  ('std-2025-042', 'ICBC-2024-M08', 'Brother John Rajan', 'john.rajan@student.icbc.ac.in', '+91 98410 44521', 'mdiv', 'Master of Divinity (M.Div) - 2nd Year', 'Academic Year 2025–26 (Semester IV)', 'Batch of 2024–2027', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', 92.4, '3.82 / 4.0 (Distinction)', 'Active'),
  ('std-2025-018', 'ICBC-2024-B12', 'Stephen Dhanraj', 'stephen.dhanraj@student.icbc.ac.in', '+91 97890 32145', 'bth', 'Bachelor of Theology (B.Th) - 2nd Year', 'Year 2 (Semester III)', 'Batch of 2024–2027', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', 94.0, '3.75 / 4.0', 'Active'),
  ('std-2025-029', 'ICBC-2025-M04', 'Deborah Jemimah', 'deborah.j@student.icbc.ac.in', '+91 94432 19876', 'mdiv', 'Master of Divinity (M.Div) - 1st Year', 'Year 1 (Semester II)', 'Batch of 2025–2028', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80', 96.5, '3.92 / 4.0', 'Active'),
  ('std-2025-055', 'ICBC-2025-C07', 'Samuel Ebenezer', 'samuel.eb@student.icbc.ac.in', '+91 99401 77654', 'cert', 'Certificate in Biblical Studies (CBS)', '1 Year Evening Track', 'Batch of 2025–2026', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', 89.0, '3.60 / 4.0', 'Active')
ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;

-- D. Insert Academic Curriculum Subjects
INSERT INTO public.subjects (id, course_id, subject_code, subject_name, credits, semester_or_year, faculty_name)
VALUES
  ('sub-1', 'bth', 'NT-301', 'Gospels & Life of Christ', 3, 'Year 1 / Sem 1', 'Dr. Grace Joshua'),
  ('sub-2', 'bth', 'OT-301', 'Old Testament Survey: Pentateuch', 3, 'Year 1 / Sem 1', 'Rev. K. David Raj'),
  ('sub-3', 'bth', 'TH-301', 'Systematic Theology I: God & Revelation', 3, 'Year 1 / Sem 2', 'Rev. Dr. S. Paul Dinakaran'),
  ('sub-4', 'bth', 'CH-301', 'History of Christianity in India', 3, 'Year 2 / Sem 3', 'Pastor Timothy Barnabas'),
  ('sub-5', 'bth', 'PT-301', 'Homiletics: Biblical Preaching', 3, 'Year 2 / Sem 4', 'Rev. Dr. Samuel Jayakumar'),
  ('sub-6', 'mdiv', 'GK-501', 'Biblical Greek: Syntax & Exegesis', 4, 'Year 1 / Sem 1', 'Dr. Grace Joshua'),
  ('sub-7', 'mdiv', 'HB-501', 'Biblical Hebrew: Grammar & Exegesis', 4, 'Year 1 / Sem 2', 'Rev. K. David Raj'),
  ('sub-8', 'mdiv', 'ST-504', 'Systematic Theology: Soteriology & Eschatology', 4, 'Year 2 / Sem 3', 'Rev. Dr. S. Paul Dinakaran'),
  ('sub-9', 'mdiv', 'PT-505', 'Pastoral Counseling in Crisis', 3, 'Year 2 / Sem 4', 'Sis. Priscilla Ebenezer'),
  ('sub-10', 'cert', 'CB-101', 'Bible Survey: Genesis to Revelation', 3, 'Module 1', 'Rev. K. David Raj'),
  ('sub-11', 'cert', 'CB-102', 'Practical Christian Living & Discipleship', 3, 'Module 2', 'Sis. Priscilla Ebenezer')
ON CONFLICT (id) DO UPDATE SET subject_name = EXCLUDED.subject_name;

-- E. Insert Study Materials & Lecture PDFs
INSERT INTO public.study_materials (id, title, course_id, course_name, subject, faculty_name, type, file_size, description, uploaded_by)
VALUES
  ('mat-1', 'Biblical Hermeneutics: Complete Lecture Handbook & Rules', 'bth', 'Theological Foundations', 'Hermeneutics', 'Dr. Grace Joshua', 'PDF', '4.8 MB', 'Comprehensive guidelines on literal-grammatical-historical interpretation, figures of speech, genre sensitivity, and christocentric application.', 'Dr. Grace Joshua'),
  ('mat-2', 'Old Testament Survey: Chronological Charts & Prophetic Timelines', 'bth', 'Old Testament Studies', 'Old Testament Literature', 'Rev. K. David Raj', 'Lecture Notes', '6.2 MB', 'High-resolution genealogical charts, covenant progressions, historical monarchy outlines, and map guides of the Ancient Near East.', 'Rev. K. David Raj'),
  ('mat-3', 'Systematic Theology: Doctrine of God (Theology Proper)', 'mdiv', 'Systematic Theology', 'Theology Proper', 'Rev. Dr. S. Paul Dinakaran', 'Syllabus', '2.1 MB', 'In-depth notes on the attributes of God, Trinitarian orthodoxy against historic heresies, divine sovereignty, and providence.', 'Rev. Dr. S. Paul Dinakaran'),
  ('mat-4', 'Church Planting Manual: Tamil Nadu & South India Rural Strategies', 'mdiv', 'Missions & Evangelism', 'Practical Missiology', 'Rev. Dr. Samuel Jayakumar', 'Handout', '3.4 MB', 'Step-by-step field guide: community entry, prayer walking, evangelistic cottage meetings, baptismal discipleship, and elder ordination.', 'Rev. Dr. Samuel Jayakumar'),
  ('mat-5', 'Koine Greek Paradigms: Nouns, Verbs, and Prepositional Charts', 'mdiv', 'Biblical Languages', 'Biblical Greek', 'Dr. Grace Joshua', 'PDF', '1.8 MB', 'Quick-reference laminated summary sheet containing all 1st, 2nd, and 3rd declension endings and master indicative active verb paradigm.', 'Dr. Grace Joshua')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;

-- F. Insert Official Campus Notices
INSERT INTO public.notices (id, title, category, is_urgent, content, posted_by)
VALUES
  ('not-1', 'Admissions for Academic Year 2026–2027 are Open', 'Admissions', true, 'Image of Christ Bible College invites formal applications for B.Th (Residential), M.Div (Residential & Modular), and Certificate courses. Early entrance aptitude and personal interview dates are published. Hostel accommodation reservation is on a first-come basis.', 'Office of the Registrar'),
  ('not-2', 'Annual All-Night Intercessory Chapel Service', 'Chapel', false, 'All enrolled students, resident scholars, and visiting pastors are invited to the Chapel on Friday from 9:00 PM to 4:30 AM for a dedicated night of prayer for church revival and Indian missions.', 'Dean of Chapel'),
  ('not-3', 'Mid-Term Exegetical Paper Submission Deadline', 'Academic', false, 'All B.Th II and M.Div candidates must upload or submit their 2,500-word exegesis papers to their respective department supervisors before 5:00 PM on Friday.', 'Academic Dean'),
  ('not-4', 'Annual Convocation Ceremony & Gown Distribution Notice', 'Academic', true, 'The 26th Graduation Service will be held at the Grace Auditorium. Graduands are requested to clear all library dues and collect convocation robes from the administration counter.', 'Principal Office')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;

-- G. Insert College Events
INSERT INTO public.events (id, title, date, time, location, speaker, category, description, image_url, registration_open)
VALUES
  ('ev-1', 'South India Theological Revival & Pastors Conference 2026', '2026-10-14', '09:00 AM – 05:00 PM', 'Grace Memorial Chapel, Vellore Campus', 'Bishop Dr. Samuel John & Rev. Dr. S. Paul Dinakaran', 'Conference', 'A 3-day catalytic gathering of 400+ rural pastors, evangelists, and ministry workers across Tamil Nadu, Andhra, and Karnataka on Biblical Shepherding in times of rapid social change.', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80', true),
  ('ev-2', 'Annual Missionary Commissioning & Convocation Day', '2026-11-20', '10:00 AM – 02:00 PM', 'College Main Auditorium', 'Rev. Dr. S. Paul Dinakaran, Principal', 'Convocation', 'Commemorating the graduation of our 2026 B.Th and M.Div batch. Commissioning and ordaining graduates for pioneer church planting and pastoral assignments.', 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80', true),
  ('ev-3', 'Hermeneutics & Expository Preaching Seminar', '2026-12-05', '09:30 AM – 04:30 PM', 'Library Audio-Visual Hall', 'Dr. Grace Joshua', 'Seminar', 'Intensive hands-on workshop guiding ministers on moving from ancient grammatical-historical context to culturally compelling Sunday expository sermons.', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80', true)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;

-- H. Insert Campus Gallery Photography
INSERT INTO public.gallery (id, title, category, image_url, caption)
VALUES
  ('gal-1', 'Main Chapel Altar & Devotional Service', 'Chapel', 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=800&q=80', 'Faculty and students gathering for the 8:00 AM morning liturgical worship and intercession.'),
  ('gal-2', 'Theological Research Library & Reading Archives', 'Campus', 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80', 'Over 16,000 theological commentaries, original language lexicons, and journal archives.'),
  ('gal-3', '25th Graduation Convocation & Commissioning', 'Graduation', 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80', 'Graduating candidates receiving degree hoods and missionary anointing.'),
  ('gal-4', 'Weekend Village Outreach & Medical Mission', 'Outreach', 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=800&q=80', 'M.Div students leading open-air gospel preaching and health camps in remote hamlets near Vellore.')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;

-- I. Insert Initial Users with Roles (STEP 3: Auth Roles)
INSERT INTO public.users (id, email, full_name, role, avatar_url, student_id, faculty_id)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'admin@iocbc.edu.in', 'Rev. Dr. S. Paul Dinakaran', 'super_admin', 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80', NULL, 'fac-1'),
  ('22222222-2222-2222-2222-222222222222', 'admissions@iocbc.edu.in', 'Academic Registrar Office', 'admin', NULL, NULL, NULL),
  ('33333333-3333-3333-3333-333333333333', 'samuel@iocbc.edu.in', 'Rev. Dr. Samuel Jayakumar', 'faculty', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80', NULL, 'fac-3'),
  ('44444444-4444-4444-4444-444444444444', 'john.rajan@student.icbc.ac.in', 'Brother John Rajan', 'student', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', 'ICBC-2024-M08', NULL)
ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role;
