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
  ContactMessage
} from '../types';

import gradHall2024 from '../assets/images/icbc_grad_hall_2024_1790326259879.jpg';
import gradCourtyard from '../assets/images/icbc_grad_courtyard_1790326274351.jpg';
import gradStageService from '../assets/images/icbc_grad_stage_service_1790326295032.jpg';
import gradOfficialPhoto from '../assets/images/icbc_graduation_1790324006996.jpg';
import classroomPhoto from '../assets/images/icbc_classroom_1790324037922.jpg';
import heroBannerPhoto from '../assets/images/icbc_hero_banner_1790323989549.jpg';

export const COLLEGE_INFO = {
  name: 'Image of Christ Bible College',
  shortName: 'ICBC Vellore',
  tagline: 'Equipping Lives Through the Word of God',
  scriptureVerse: '“Just as You sent Me into the world, I also have sent them into the world.” — John 17:18',
  motto: 'TRANSFORMING LIVES | REACHING NATIONS | BUILDING REVIVAL',
  address: 'Vellore, Tamil Nadu 632014, India',
  phonePrimary: '+91 95004 23126',
  phoneSecondary: '+91 95004 23126',
  phoneDisplay: '95004 23126',
  email: 'icbc.vellore@gmail.com',
  establishedYear: '2020',
  foundedDate: 'January 2020',
  affiliation: 'Adherent to ATA (Asia Theological Association) Academic Curricular Framework & Evangelical Fellowship',
  visitingHours: 'Monday – Saturday: 9:00 AM – 5:00 PM (Sunday: Chapel Services Only)',
  principal: 'Pr. Christopher',
  principalTitle: 'Principal & President, ICBC Vellore',
  vision: 'Established in January 2020, Image of Christ Bible College is founded on the mission of John 17:18 — to reach people with the Word of God and equip them for His purpose. Our vision is to teach and disciple individuals, especially in rural communities, through the Scriptures, shaping their lives so they may become instruments of spiritual revival in the nation.',
  whoWeAre: 'Image of Christ Bible College is committed to providing accessible and transformative biblical education. We aim to raise strong believers who are rooted in God’s Word and prepared to serve effectively in ministry and society.',
};

export const COLLEGE_JOURNEY = [
  {
    year: '2020',
    title: 'Established in January 2020',
    location: 'Online Cohort',
    description: 'Founded on the mission of John 17:18. Started with online C.Th classes (13 students enrolled) to bring sound biblical doctrine to rural communities.',
    highlight: true,
  },
  {
    year: 'First Graduation',
    title: '1st Graduation Convocation',
    location: 'Held at Kalluvilai, Kanyakumari',
    description: 'First cohort of faithful students graduated and were consecrated for gospel ministry and church leadership.',
    highlight: false,
  },
  {
    year: 'Second Graduation',
    title: '2nd Graduation Convocation',
    location: 'Conducted at Christian Association Church, Nagercoil',
    description: 'Celebrated the second wave of trained disciple-makers and pastoral servants sent to minister across the nation.',
    highlight: false,
  },
  {
    year: '2026',
    title: 'Campus & Blended Learning Expansion',
    location: 'Vellore Campus & Online Tracks',
    description: 'Expanded to include in-person classes along with online programs, reaching students with flexible learning options.',
    highlight: true,
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'cth',
    code: 'C.Th',
    title: 'Certificate in Theology (C.Th)',
    level: 'Certificate',
    duration: '1 Year (Online & Hybrid)',
    mode: 'Hybrid / Modular',
    language: 'Tamil & English Tracks',
    description: 'Our foundational theological certificate launched in 2020. Designed to disciple believers, especially in rural and grassroots communities, through sound biblical exposition, theology, and spiritual formation.',
    eligibility: 'Open to born-again believers with a desire to understand God’s Word and serve in church ministries.',
    totalCredits: 30,
    featured: true,
    annualTuition: 'Subsidized / Accessible (Scholarships for rural pastors)',
    curriculum: [
      {
        year: 'Core Modules',
        courses: [
          'Old & New Testament Survey',
          'Foundations of Christian Discipleship & Theology',
          'Basic Bible Hermeneutics & Study Methods',
          'Evangelism & Rural Outreach Ministries',
          'Spiritual Life, Prayer & Ministry Ethics'
        ]
      }
    ],
    outcomes: [
      'Rooted in sound biblical doctrine and Christian discipleship',
      'Equipped for rural church planting and local fellowship leadership',
      'Prepared for advancement to Diploma in Theology (D.Th) and B.Th programs'
    ]
  },
  {
    id: 'dth',
    code: 'D.Th',
    title: 'Diploma in Theology (D.Th)',
    level: 'Certificate',
    duration: '2 Years (Online & In-person)',
    mode: 'Residential & Day Scholar',
    language: 'Tamil & English Tracks',
    description: 'An advanced diploma curriculum taking students deeper into systematic doctrine, biblical exegesis overview, pastoral counseling, and church administration.',
    eligibility: 'Pass in Higher Secondary or completion of C.Th certificate with recommendation from church pastor.',
    totalCredits: 60,
    featured: true,
    annualTuition: 'Affordable tuition with flexible installment plans',
    curriculum: [
      {
        year: 'Year 1: Biblical Foundations',
        courses: [
          'Gospel Studies & Life of Christ',
          'Systematic Theology Overview',
          'Homiletics & Effective Preaching',
          'History of Christianity in Tamil Nadu & India'
        ]
      },
      {
        year: 'Year 2: Pastoral Practice',
        courses: [
          'Pastoral Care & Counseling in Rural Contexts',
          'Church Planting & Mission Strategy',
          'Apologetics & Christian Worldview',
          'Supervised Field Ministry Practicum'
        ]
      }
    ],
    outcomes: [
      'Confidence in expository teaching and pulpit ministry',
      'Competence in church shepherding and family counseling',
      'Seamless credit transfer to Bachelor of Theology (B.Th)'
    ]
  },
  {
    id: 'bth',
    code: 'B.Th',
    title: 'Bachelor of Theology (B.Th)',
    level: 'Bachelor',
    duration: '3 Years (6 Semesters)',
    mode: 'Residential & Day Scholar',
    language: 'English & Tamil Medium Tracks',
    description: 'A comprehensive foundational undergraduate theological degree designed to ground future pastors, evangelists, and Christian educators in conservative biblical scholarship, personal spiritual formation, and practical ministry skills.',
    eligibility: 'Pass in Higher Secondary (10+2) or equivalent with a minimum of 50% marks. Personal Christian testimony, baptism certificate, and pastor’s recommendation.',
    totalCredits: 96,
    featured: true,
    annualTuition: '₹28,500 / year (Concessions available for rural ministers)',
    curriculum: [
      {
        year: 'Year 1: Foundations',
        courses: [
          'Introduction to Old Testament Literature',
          'Introduction to New Testament Literature',
          'Christian Spiritual Formation & Prayer',
          'Basic Biblical Hermeneutics',
          'English / Tamil for Theological Study',
          'Survey of Christian Doctrine I & II'
        ]
      },
      {
        year: 'Year 2: Exegesis & Theology',
        courses: [
          'Pentateuch & Historical Books',
          'Gospels and Acts: Exegetical Studies',
          'Systematic Theology: God, Christ & Holy Spirit',
          'History of Christianity in India',
          'Homiletics: The Art of Biblical Preaching',
          'Biblical Greek Grammar (Elective)'
        ]
      },
      {
        year: 'Year 3: Pastoral Leadership & Mission',
        courses: [
          'Pauline Epistles & General Epistles',
          'Christian Ethics & Contemporary Issues in India',
          'Pastoral Ministry, Counseling & Church Administration',
          'World Religions & Christian Apologetics',
          'Evangelism, Church Planting & Urban Missions',
          'Senior Graduation Thesis / Ministry Project'
        ]
      }
    ],
    outcomes: [
      'Ordained Pastoral Ministry in denominational or independent churches',
      'Pioneer Church Planter across rural and urban mission frontiers',
      'Bible Teacher and Sunday School Director',
      'Eligibility for Advanced M.Div Standing (2-year track)'
    ]
  },
  {
    id: 'mdiv',
    code: 'M.Div',
    title: 'Master of Divinity (M.Div)',
    level: 'Master',
    duration: '3 Years (2 Years for B.Th Graduates)',
    mode: 'Residential & Hybrid Modular',
    language: 'English (with Tamil tutorial support)',
    description: 'The premier professional master’s degree for pastoral and theological leadership. Equips students with high-level biblical exegesis in original languages, comprehensive dogmatic theology, cultural analysis, and leadership wisdom for church leadership and theological faculty teaching.',
    eligibility: 'A recognized Bachelor’s Degree (B.A, B.Sc, B.Com, B.Tech, etc.) or a B.Th from a recognized Bible College. Evidence of active Christian ministry calling.',
    totalCredits: 92,
    featured: true,
    annualTuition: '₹36,000 / year (Hostel & Mess subsidized)',
    curriculum: [
      {
        year: 'Year 1: Advanced Biblical Foundations',
        courses: [
          'Biblical Greek: Syntax & Exegesis',
          'Biblical Hebrew: Grammar & Translation',
          'Advanced Old Testament Theology',
          'Johannine & Pauline Theologies',
          'Church History: Early Church to Reformation',
          'Missiological Paradigms in the Global South'
        ]
      },
      {
        year: 'Year 2: Dogmatics & Cultural Engagement',
        courses: [
          'Systematic Theology III: Soteriology & Eschatology',
          'Advanced Exegesis of Romans & Galatians',
          'Indian Christian Theology & Contextualization',
          'Philosophy of Religion & Apologetics in Modern India',
          'Christian Leadership, Governance & Financial Stewardship',
          'Cross-Cultural Hermeneutics'
        ]
      },
      {
        year: 'Year 3: Master Pastoral Praxis & Research',
        courses: [
          'Pastoral Care in Trauma & Crisis Counseling',
          'Expository Preaching through Difficult Texts',
          'Theology of Suffering & Persecution',
          'Christian Family Life & Youth Formation',
          'Independent Master’s Research Dissertation',
          'Supervised Pastoral Field Internship'
        ]
      }
    ],
    outcomes: [
      'Senior Pastor & Pastoral Staff in urban or rural congregations',
      'Theological Seminary Instructor or College Faculty Member',
      'National & International Mission Director',
      'Christian Author, Apologist, and Public Theologian'
    ]
  },
  {
    id: 'cert-bible',
    code: 'CBS',
    title: 'Certificate in Biblical Studies & Ministry',
    level: 'Certificate',
    duration: '1 Year (2 Semesters)',
    mode: 'Residential / Evening Classes',
    language: 'Tamil & English Bilingual',
    description: 'A 1-year intensive certificate course tailored for lay leaders, elders, deaconesses, Sunday school teachers, and Christian professionals eager to gain solid biblical grounding and practical ministry tools without committing to a multi-year degree.',
    eligibility: '10th Standard (SSLC) or above. Born-again Christian with hunger to study God’s Word.',
    totalCredits: 32,
    featured: true,
    annualTuition: '₹14,500 total course fee',
    curriculum: [
      {
        year: 'Semester 1: Bible Survey',
        courses: [
          'Old Testament Overview & Chronology',
          'Life and Teachings of Jesus Christ',
          'How to Study the Bible (Inductive Method)',
          'Basic Christian Discipleship'
        ]
      },
      {
        year: 'Semester 2: Practical Ministry',
        courses: [
          'Acts of the Apostles & Early Church Growth',
          'Evangelism in Daily Workplace & Community',
          'Leading Children and Youth Ministry',
          'Christian Family Foundations & Practical Service'
        ]
      }
    ],
    outcomes: [
      'Effective Lay Leader, Cell Group Shepherd, or Bible Study Leader',
      'Children and Youth Ministry Coordinator',
      'Personal Witness & Gospel Worker in secular vocations'
    ]
  },
  {
    id: 'short-preaching',
    code: 'ST-01',
    title: 'Short Course: Expository Preaching Mastery',
    level: 'Short Course',
    duration: '8 Weeks (Weekend Intensive)',
    mode: 'Hybrid / Modular',
    language: 'English & Tamil',
    description: 'Practical training on bridging the ancient text to contemporary listeners. Focuses on structural analysis of scripture passages, homiletical outlines, compelling delivery, and Christ-centered application.',
    eligibility: 'Open to pastors, evangelists, and lay preachers.',
    totalCredits: 6,
    annualTuition: '₹4,500 (Includes manual & sermon clinic evaluation)',
    curriculum: [
      {
        year: 'Module Topics',
        courses: [
          'From Exegesis to Sermon: The Hermeneutical Bridge',
          'Crafting Big Idea & Clear Structural Outlines',
          'Illustrations, Cultural Relevance & Ethical Application',
          'Live Sermon Clinic with Peer & Faculty Critiques'
        ]
      }
    ],
    outcomes: ['Transform your weekly pulpit ministry with biblical depth and clarity.']
  },
  {
    id: 'short-greek',
    code: 'ST-02',
    title: 'Short Course: Biblical Greek for Preachers',
    level: 'Short Course',
    duration: '6 Weeks (Evening Online / In-person)',
    mode: 'Hybrid / Modular',
    language: 'English',
    description: 'Learn to read the Greek New Testament without fear. Understand verbal aspect, cases, prepositions, and key theological vocabulary to unlock rich nuance in sermon preparation.',
    eligibility: 'Basic theological interest or current theological student.',
    totalCredits: 4,
    annualTuition: '₹3,500 (Includes lexicon guide)',
    curriculum: [
      {
        year: 'Module Topics',
        courses: [
          'Alphabet, Phonetics, and Pronunciation',
          'Noun Declensions & Prepositions in Gospel of John',
          'Verbal Aspects: Present, Aorist, and Perfect Insights',
          'Utilizing Modern Software Tools & Word Study Caution'
        ]
      }
    ],
    outcomes: ['Enrich sermons with authentic insights from original Koine Greek manuscripts.']
  },
  {
    id: 'short-counseling',
    code: 'ST-03',
    title: 'Short Course: Pastoral Care & Grief Counseling',
    level: 'Short Course',
    duration: '5 Weeks',
    mode: 'Residential & Day Scholar',
    language: 'Tamil & English',
    description: 'Biblically centered pastoral counseling addressing marital discord, depression, youth addiction, bereavement, and community trauma in Indian church contexts.',
    eligibility: 'Pastors, deaconesses, and Christian counselors.',
    totalCredits: 4,
    annualTuition: '₹3,800',
    curriculum: [
      {
        year: 'Module Topics',
        courses: [
          'The Biblical Shepherd: Listening with Empathy',
          'Addressing Marital Conflict & Family Dysfunction',
          'Walking through Sickness, Bereavement & Grief',
          'Ethical Boundaries & When to Refer to Medical Professionals'
        ]
      }
    ],
    outcomes: ['Skillful pastoral counseling with compassion and biblical wisdom.']
  }
];

export const INITIAL_FACULTY: FacultyMember[] = [
  {
    id: 'fac-1',
    name: 'Pr. Christopher',
    role: 'Principal & President, ICBC Vellore',
    department: 'Theology & Pastoral Leadership',
    degrees: 'B.Sc, B.D, M.Th, Ph.D (Theological Studies)',
    almaMater: 'United Theological College & Senate of Serampore',
    yearsOfExperience: 24,
    photo: '',
    bio: 'Pr. Christopher serves as Principal & President of Image of Christ Bible College. Leading with a heart for apostolic revival and rural church empowerment, he guides ICBC under the mandate of John 17:18 to train faithful servant-leaders deeply grounded in Scripture, spiritual holiness, and compassionate ministry.',
    subjects: ['Systematic Theology', 'Pastoral Leadership & Church Planting', 'Expository Preaching', 'Spiritual Revival'],
    quote: '“True theological education does not puff up the mind; it bends the knee before Christ and commissions our hands for the harvest.”'
  }
];

export const INITIAL_STUDENT_PROFILE: StudentProfile = {
  id: 'std-2025-042',
  regNo: 'ICBC-2024-M08',
  name: 'Brother John Rajan',
  email: 'john.rajan@student.icbc.ac.in',
  phone: '+91 98410 44521',
  courseId: 'mdiv',
  courseTitle: 'Master of Divinity (M.Div) - 2nd Year',
  currentYear: 'Academic Year 2025–26 (Semester IV)',
  batch: 'Batch of 2024–2027',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  attendancePercent: 92.4,
  gpa: '3.82 / 4.0 (Distinction)',
  enrolledSubjects: [
    { code: 'NT-502', name: 'Advanced Greek Exegesis of Romans', faculty: 'Dr. Grace Joshua', credits: 4, grade: 'A', attendance: 95 },
    { code: 'ST-504', name: 'Soteriology & Contemporary Indian Theology', faculty: 'Pr. Christopher', credits: 4, grade: 'A-', attendance: 91 },
    { code: 'OT-503', name: 'Hebrew Poetry: Psalms & Job', faculty: 'Rev. K. David Raj', credits: 3, grade: 'B+', attendance: 88 },
    { code: 'PT-505', name: 'Pastoral Care & Crisis Counseling', faculty: 'Sis. Priscilla Ebenezer', credits: 3, grade: 'A', attendance: 96 },
    { code: 'MS-506', name: 'Pioneer Church Planting Dynamics', faculty: 'Rev. Dr. Samuel Jayakumar', credits: 3, grade: 'A', attendance: 92 }
  ],
  recentAssignments: [
    { title: 'Exegetical Paper on Romans 8:18–30 (2,500 words)', dueDate: '15 Oct 2026', status: 'Submitted', score: '92 / 100' },
    { title: 'Theological Critique of Prosperity Gospel in Tamil Nadu', dueDate: '28 Oct 2026', status: 'Graded', score: '95 / 100' },
    { title: 'Weekend Village Outreach Report & Ministry Log', dueDate: '05 Nov 2026', status: 'Pending' }
  ]
};

export const INITIAL_STUDENTS: StudentProfile[] = [
  INITIAL_STUDENT_PROFILE,
  {
    id: 'std-2025-018',
    regNo: 'ICBC-2024-B12',
    name: 'Stephen Dhanraj',
    email: 'stephen.dhanraj@student.icbc.ac.in',
    phone: '+91 97890 32145',
    courseId: 'bth',
    courseTitle: 'Bachelor of Theology (B.Th) - 2nd Year',
    currentYear: 'Year 2 (Semester III)',
    batch: 'Batch of 2024–2027',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    attendancePercent: 94.0,
    gpa: '3.75 / 4.0',
    enrolledSubjects: [
      { code: 'NT-301', name: 'Gospel of Matthew', faculty: 'Dr. Grace Joshua', credits: 3, grade: 'A', attendance: 95 },
      { code: 'TH-302', name: 'Doctrine of Salvation', faculty: 'Pr. Christopher', credits: 3, grade: 'B+', attendance: 92 },
      { code: 'CH-303', name: 'Indian Church History', faculty: 'Pastor Timothy Barnabas', credits: 3, grade: 'A', attendance: 96 }
    ],
    recentAssignments: [
      { title: 'Life of Sadhu Sundar Singh Essay', dueDate: '10 Oct 2026', status: 'Submitted', score: '88 / 100' }
    ]
  },
  {
    id: 'std-2025-029',
    regNo: 'ICBC-2025-M04',
    name: 'Deborah Jemimah',
    email: 'deborah.j@student.icbc.ac.in',
    phone: '+91 94432 19876',
    courseId: 'mdiv',
    courseTitle: 'Master of Divinity (M.Div) - 1st Year',
    currentYear: 'Year 1 (Semester II)',
    batch: 'Batch of 2025–2028',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    attendancePercent: 96.5,
    gpa: '3.92 / 4.0',
    enrolledSubjects: [
      { code: 'GK-501', name: 'Biblical Greek Grammar', faculty: 'Dr. Grace Joshua', credits: 4, grade: 'A+', attendance: 98 },
      { code: 'OT-501', name: 'Pentateuch & Historical Books', faculty: 'Rev. K. David Raj', credits: 4, grade: 'A', attendance: 95 }
    ],
    recentAssignments: [
      { title: 'Genesis 1-3 Hermeneutical Analysis', dueDate: '22 Oct 2026', status: 'Graded', score: '98 / 100' }
    ]
  },
  {
    id: 'std-2025-055',
    regNo: 'ICBC-2025-C07',
    name: 'Samuel Ebenezer',
    email: 'samuel.eb@student.icbc.ac.in',
    phone: '+91 99401 77654',
    courseId: 'cert',
    courseTitle: 'Certificate in Biblical Studies (CBS)',
    currentYear: '1 Year Evening Track',
    batch: 'Batch of 2025–2026',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    attendancePercent: 89.0,
    gpa: '3.60 / 4.0',
    enrolledSubjects: [
      { code: 'CB-101', name: 'Old Testament Essentials', faculty: 'Rev. K. David Raj', credits: 3, grade: 'A-', attendance: 90 },
      { code: 'CB-102', name: 'Personal Evangelism', faculty: 'Rev. Dr. Samuel Jayakumar', credits: 3, grade: 'A', attendance: 88 }
    ],
    recentAssignments: [
      { title: 'Tract Distribution Journal', dueDate: '18 Oct 2026', status: 'Submitted' }
    ]
  }
];

export const INITIAL_SUBJECTS = [
  { id: 'sub-1', courseId: 'bth', courseName: 'B.Th', subjectCode: 'NT-301', subjectName: 'Gospels & Life of Christ', credits: 3, semesterOrYear: 'Year 1 / Sem 1', facultyName: 'Dr. Grace Joshua' },
  { id: 'sub-2', courseId: 'bth', courseName: 'B.Th', subjectCode: 'OT-301', subjectName: 'Old Testament Survey: Pentateuch', credits: 3, semesterOrYear: 'Year 1 / Sem 1', facultyName: 'Rev. K. David Raj' },
  { id: 'sub-3', courseId: 'bth', courseName: 'B.Th', subjectCode: 'TH-301', subjectName: 'Systematic Theology I: God & Revelation', credits: 3, semesterOrYear: 'Year 1 / Sem 2', facultyName: 'Pr. Christopher' },
  { id: 'sub-4', courseId: 'bth', courseName: 'B.Th', subjectCode: 'CH-301', subjectName: 'History of Christianity in India', credits: 3, semesterOrYear: 'Year 2 / Sem 3', facultyName: 'Pastor Timothy Barnabas' },
  { id: 'sub-5', courseId: 'bth', courseName: 'B.Th', subjectCode: 'PT-301', subjectName: 'Homiletics: Biblical Preaching', credits: 3, semesterOrYear: 'Year 2 / Sem 4', facultyName: 'Rev. Dr. Samuel Jayakumar' },
  { id: 'sub-6', courseId: 'mdiv', courseName: 'M.Div', subjectCode: 'GK-501', subjectName: 'Biblical Greek: Syntax & Exegesis', credits: 4, semesterOrYear: 'Year 1 / Sem 1', facultyName: 'Dr. Grace Joshua' },
  { id: 'sub-7', courseId: 'mdiv', courseName: 'M.Div', subjectCode: 'HB-501', subjectName: 'Biblical Hebrew: Grammar & Exegesis', credits: 4, semesterOrYear: 'Year 1 / Sem 2', facultyName: 'Rev. K. David Raj' },
  { id: 'sub-8', courseId: 'mdiv', courseName: 'M.Div', subjectCode: 'ST-504', subjectName: 'Systematic Theology: Soteriology & Eschatology', credits: 4, semesterOrYear: 'Year 2 / Sem 3', facultyName: 'Pr. Christopher' },
  { id: 'sub-9', courseId: 'mdiv', courseName: 'M.Div', subjectCode: 'PT-505', subjectName: 'Pastoral Counseling in Crisis', credits: 3, semesterOrYear: 'Year 2 / Sem 4', facultyName: 'Sis. Priscilla Ebenezer' },
  { id: 'sub-10', courseId: 'cert', courseName: 'Certificate', subjectCode: 'CB-101', subjectName: 'Bible Survey: Genesis to Revelation', credits: 3, semesterOrYear: 'Module 1', facultyName: 'Rev. K. David Raj' },
  { id: 'sub-11', courseId: 'cert', courseName: 'Certificate', subjectCode: 'CB-102', subjectName: 'Practical Christian Living & Discipleship', credits: 3, semesterOrYear: 'Module 2', facultyName: 'Sis. Priscilla Ebenezer' }
];

export const INITIAL_STUDY_MATERIALS: StudyMaterial[] = [
  {
    id: 'mat-1',
    title: 'Biblical Hermeneutics: Complete Lecture Handbook & Rules',
    courseCode: 'B.Th & M.Div',
    courseName: 'Theological Foundations',
    subject: 'Hermeneutics',
    facultyName: 'Dr. Grace Joshua',
    type: 'PDF',
    fileSize: '4.8 MB',
    uploadedDate: '12 Sep 2026',
    description: 'Comprehensive guidelines on literal-grammatical-historical interpretation, figures of speech, genre sensitivity, and christocentric application.'
  },
  {
    id: 'mat-2',
    title: 'Old Testament Survey: Chronological Charts & Prophetic Timelines',
    courseCode: 'B.Th',
    courseName: 'Old Testament Studies',
    subject: 'Old Testament Literature',
    facultyName: 'Rev. K. David Raj',
    type: 'Lecture Notes',
    fileSize: '6.2 MB',
    uploadedDate: '04 Sep 2026',
    description: 'High-resolution genealogical charts, covenant progressions, historical monarchy outlines, and map guides of the Ancient Near East.'
  },
  {
    id: 'mat-3',
    title: 'Systematic Theology: Doctrine of God (Theology Proper)',
    courseCode: 'M.Div',
    courseName: 'Systematic Theology',
    subject: 'Theology Proper',
    facultyName: 'Pr. Christopher',
    type: 'Syllabus',
    fileSize: '2.1 MB',
    uploadedDate: '20 Aug 2026',
    description: 'In-depth notes on the attributes of God, Trinitarian orthodoxy against historic heresies, divine sovereignty, and providence.'
  },
  {
    id: 'mat-4',
    title: 'Church Planting Manual: Tamil Nadu & South India Rural Strategies',
    courseCode: 'M.Div & Certificate',
    courseName: 'Missions & Evangelism',
    subject: 'Practical Missiology',
    facultyName: 'Rev. Dr. Samuel Jayakumar',
    type: 'Handout',
    fileSize: '3.4 MB',
    uploadedDate: '15 Aug 2026',
    description: 'Step-by-step field guide: community entry, prayer walking, evangelistic cottage meetings, baptismal discipleship, and elder ordination.'
  },
  {
    id: 'mat-5',
    title: 'Koine Greek Vocabulary Flashcards & Paradigm Sheets',
    courseCode: 'B.Th / M.Div',
    courseName: 'Biblical Languages',
    subject: 'Biblical Greek',
    facultyName: 'Dr. Grace Joshua',
    type: 'PDF',
    fileSize: '1.9 MB',
    uploadedDate: '01 Aug 2026',
    description: 'All 312 Greek words occurring 50+ times in the New Testament with mnemonic guides and nominal/verbal inflection tables.'
  },
  {
    id: 'mat-6',
    title: 'Audio Lecture: History of the Protestant Reformation & Indian Impact',
    courseCode: 'All Courses',
    courseName: 'Church History',
    subject: 'Historical Theology',
    facultyName: 'Pastor Timothy Barnabas',
    type: 'Audio / Video',
    fileSize: '42 MB (MP3)',
    uploadedDate: '18 Jul 2026',
    description: 'Live chapel symposium audio recording on the Solas of the Reformation and their enduring relevance for the 21st century Indian church.'
  }
];

export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'not-1',
    title: 'Admissions Open for Academic Year 2026–2027: B.Th, M.Div & Certificate',
    category: 'Admissions',
    date: '20 Sep 2026',
    isUrgent: true,
    content: 'Applications are now open for the 2026–2027 academic session. Both residential and day-scholar batches are available. Entrance interviews will be held on the first and third Saturdays of each month at the Vellore campus or via online video call for out-of-state applicants.',
    postedBy: 'Registrar Office'
  },
  {
    id: 'not-2',
    title: 'Annual Spiritual Emphasis & Revival Week (October 14–18, 2026)',
    category: 'Chapel',
    date: '18 Sep 2026',
    isUrgent: true,
    content: 'All faculty, staff, and students are required to participate in the five-day Spiritual Emphasis Week themed “Renewed in the Image of Christ”. Guest speakers from Chennai and Bangalore will minister during morning and evening sessions.',
    postedBy: 'Chapel Dean'
  },
  {
    id: 'not-3',
    title: 'Mid-Term Examinations Schedule – Odd Semester 2026',
    category: 'Examination',
    date: '12 Sep 2026',
    isUrgent: false,
    content: 'The Mid-Term written examinations for all B.Th and M.Div students will commence on November 10, 2026. Hall tickets will be issued through the Student Portal to students maintaining a minimum of 80% attendance.',
    postedBy: 'Academic Dean'
  },
  {
    id: 'not-4',
    title: 'Weekly Weekend Ministry Practicum Allocation Notice',
    category: 'Academic',
    date: '05 Sep 2026',
    isUrgent: false,
    content: 'Students allocated to rural mission circuits in Gudiyatham, Ranipet, and Arcot are reminded to submit their weekly ministry attendance sheets signed by their field pastors before 5:00 PM every Tuesday.',
    postedBy: 'Director of Practical Ministry'
  }
];

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'ev-1',
    title: 'National Theological Symposium: Faithful Ministry in Modern India',
    date: 'November 18–20, 2026',
    time: '9:30 AM – 4:30 PM Daily',
    location: 'ICBC Main Auditorium, Calvary Hill, Vellore',
    speaker: 'Keynote: Bishop Dr. V. Aruldoss & Theological Scholars Panel',
    category: 'Conference',
    description: 'A 3-day high-impact conference convening 200+ pastors, scholars, and seminarians exploring the challenges of biblical witness, religious liberty, and christocentric mission in contemporary India.',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    registrationOpen: true
  },
  {
    id: 'ev-2',
    title: '26th Annual Convocation & Graduation Ceremony',
    date: 'December 05, 2026',
    time: '4:00 PM – 7:30 PM',
    location: 'Open Air College Amphitheatre, Vellore',
    speaker: 'Chief Guest: Rev. Dr. C. J. Manuel, Senior Missiologist',
    category: 'Convocation',
    description: 'Conferring degrees and diplomas upon the graduating classes of B.Th, M.Div, and Bible Certificate. An evening of prayer, thanksgiving, and commissioning into the harvest fields.',
    image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80',
    registrationOpen: true
  },
  {
    id: 'ev-3',
    title: 'Youth Ministry & Expository Preaching Bootcamp',
    date: 'October 24, 2026',
    time: '8:30 AM – 5:00 PM',
    location: 'Grace Chapel Hall, ICBC Vellore',
    speaker: 'Faculty Team & Guest Youth Leaders',
    category: 'Seminar',
    description: 'An intensive 1-day workshop for youth pastors, worship leaders, and Sunday school teachers on engaging Gen-Z with uncompromising biblical truth and discipleship rhythms.',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    registrationOpen: true
  }
];

export const INITIAL_GALLERY: GalleryPhoto[] = [
  {
    id: 'gal-grad-1',
    title: 'The Image of Christ Bible College Convocation 2024',
    category: 'Graduation',
    image: gradHall2024,
    caption: 'Official 2024 Graduation Service in the chapel sanctuary with graduating students in academic gowns and Pr. Christopher on stage.'
  },
  {
    id: 'gal-class-1',
    title: 'Interactive Biblical Training & Classroom Lectures',
    category: 'Classroom',
    image: classroomPhoto,
    caption: 'Students engaged in systematic theology and biblical exegesis with the Scriptures open, equipping for ministerial service.'
  },
  {
    id: 'gal-grad-2',
    title: 'Graduation Day Fellowship with Families',
    category: 'Graduation',
    image: gradCourtyard,
    caption: 'Graduates standing in joy in the campus courtyard holding the Scriptures, celebrating with families and faculty.'
  },
  {
    id: 'gal-vision-1',
    title: 'ICBC Foundation Mandate: John 17:18',
    category: 'Campus',
    image: heroBannerPhoto,
    caption: '“As You sent Me into the world, I also have sent them into the world” — Equipping lives through the Word of God.'
  },
  {
    id: 'gal-grad-3',
    title: 'Convocation Stage & Awards Ceremony',
    category: 'Graduation',
    image: gradStageService,
    caption: 'Solemn evening graduation commissioning service conferring diplomas and ministry certificates.'
  },
  {
    id: 'gal-grad-4',
    title: 'Graduating Cohort Consecration',
    category: 'Graduation',
    image: gradOfficialPhoto,
    caption: 'The graduating cohort standing consecrated and commissioned for pastoral ministry and church planting.'
  },
  {
    id: 'gal-1',
    title: 'Morning Chapel Worship & Prayer',
    category: 'Chapel',
    image: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&w=800&q=80',
    caption: 'Students and faculty gathering in prayer before the day’s theological lectures.'
  },
  {
    id: 'gal-2',
    title: 'College Library & Research Wing',
    category: 'Campus',
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
    caption: 'Housing over 16,000 theological volumes, biblical commentaries, and digital journal archives.'
  },
  {
    id: 'gal-3',
    title: 'Graduation Day Commissioning Service',
    category: 'Graduation',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    caption: 'Laying on of hands and prayer of consecration for graduating pastors and evangelists.'
  },
  {
    id: 'gal-4',
    title: 'Weekend Gospel Outreach in Vellore Villages',
    category: 'Outreach',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
    caption: 'Students conducting street preaching, medical camps, and vacation Bible schools.'
  },
  {
    id: 'gal-5',
    title: 'Campus Garden & Fellowship Lawn',
    category: 'Campus',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
    caption: 'Serene campus environment at the foot of Calvary Hill, ideal for quiet prayer and meditation.'
  },
  {
    id: 'gal-6',
    title: 'Student Community Life & Hostel Fellowship',
    category: 'Student Life',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
    caption: 'Lifelong friendships forged across students representing over 12 Indian states.'
  },
  {
    id: 'gal-7',
    title: 'Original Languages Exegesis Seminar',
    category: 'Campus',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
    caption: 'Interactive classroom discussions on Hebrew syntax and Greek New Testament translation.'
  },
  {
    id: 'gal-8',
    title: 'Convocation Academic Procession',
    category: 'Graduation',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80',
    caption: 'The Faculty Board and graduating seniors entering the convocation arena.'
  }
];

export const INITIAL_DOWNLOADS: DownloadDoc[] = [
  {
    id: 'dl-1',
    title: 'College Prospectus 2026–2027 (Official Guide & Information)',
    category: 'Prospectus',
    format: 'PDF',
    fileSize: '5.2 MB',
    updatedAt: 'September 2026',
    description: 'Complete brochure detailing our biblical philosophy, academic curriculum, faculty credentials, campus facilities, and admission procedures.',
    downloadCount: 1420
  },
  {
    id: 'dl-2',
    title: 'Application Form for Admission (Printable PDF)',
    category: 'Forms',
    format: 'PDF',
    fileSize: '1.4 MB',
    updatedAt: 'August 2026',
    description: 'Physical printable application form with pastor recommendation sheet, medical fitness certificate, and financial sponsorship guarantee.',
    downloadCount: 2890
  },
  {
    id: 'dl-3',
    title: 'B.Th & M.Div Master Syllabus & Course Regulations',
    category: 'Syllabus',
    format: 'PDF',
    fileSize: '3.8 MB',
    updatedAt: 'July 2026',
    description: 'Full course breakdown, semester credits, grading policies, prescribed textbooks, and graduation requirements.',
    downloadCount: 890
  },
  {
    id: 'dl-4',
    title: 'Academic Calendar & Chapel Schedule 2026–2027',
    category: 'Academic Calendar',
    format: 'PDF',
    fileSize: '820 KB',
    updatedAt: 'September 2026',
    description: 'Important dates for semester commencement, mid-term exams, spiritual retreat, mission week, and graduation.',
    downloadCount: 1120
  },
  {
    id: 'dl-5',
    title: 'Statement of Faith & Institutional Doctrinal Basis',
    category: 'Institutional',
    format: 'PDF',
    fileSize: '650 KB',
    updatedAt: 'June 2026',
    description: 'Our conservative evangelical statement on the inerrancy of Scripture, the Holy Trinity, salvation by grace through faith, and the Great Commission.',
    downloadCount: 640
  },
  {
    id: 'dl-6',
    title: 'Pastor Recommendation & Reference Form',
    category: 'Forms',
    format: 'PDF',
    fileSize: '740 KB',
    updatedAt: 'August 2026',
    description: 'Confidential evaluation form to be completed by the applicant’s home church pastor or denominational overseer.',
    downloadCount: 1750
  }
];

export const INITIAL_APPLICATIONS: ApplicationSubmission[] = [];

export const INITIAL_CONTACT_MESSAGES: ContactMessage[] = [];

export const DOCTRINAL_ARTICLES = [
  {
    number: 'I',
    title: 'The Holy Scriptures',
    text: 'We believe the Bible (66 books of the Old and New Testaments) to be the inspired, infallible, and authoritative Word of God, uniquely authoritative and sufficient in all matters of faith, doctrine, and Christian life.'
  },
  {
    number: 'II',
    title: 'The Eternal Trinity',
    text: 'We believe there is one living and true God, eternally existing in three co-equal persons: Father, Son, and Holy Spirit, each possessing equal divine perfection, majesty, and power.'
  },
  {
    number: 'III',
    title: 'The Person & Work of Jesus Christ',
    text: 'We believe in the full deity and true humanity of Jesus Christ, His virgin birth, sinless life, vicarious substitutionary atonement on the Cross, bodily resurrection, ascension to the Father’s right hand, and personal, imminent return.'
  },
  {
    number: 'IV',
    title: 'The Holy Spirit',
    text: 'We believe in the personality and deity of the Holy Spirit, who regenerates, indwells, sanctifies, comforts, and empowers every believer with spiritual gifts for witness and building up the body of Christ.'
  },
  {
    number: 'V',
    title: 'Humanity, Fall & Salvation by Grace',
    text: 'We believe all humanity was created in the image of God, fell into sin through Adam’s disobedience, and is separated from God. Salvation is solely by God’s grace through personal faith in the shed blood of Jesus Christ, apart from human works.'
  },
  {
    number: 'VI',
    title: 'The Great Commission & The Church',
    text: 'We believe the universal Church is the bride and body of Christ, comprised of all regenerated believers. The primary mandate of the Church is to glorify God and fulfill the Great Commission to make disciples of all nations.'
  }
];
