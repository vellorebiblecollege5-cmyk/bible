import React, { useState, useEffect } from 'react';
import { useCollege, ActivePage } from '../context/CollegeContext';
import {
  GraduationCap,
  FileCheck,
  CreditCard,
  Search,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
  Send,
  Download,
  Calendar
} from 'lucide-react';

export const AdmissionsView: React.FC = () => {
  const {
    activePage,
    courses,
    submitApplication,
    applications,
    selectedCourseForApply,
    setSelectedCourseForApply,
    setActiveDocumentPreview
  } = useCollege();

  const [activeTab, setActiveTab] = useState<'eligibility' | 'application' | 'fees' | 'track'>('application');

  // Multi-step Application form state
  const [formStep, setFormStep] = useState<1 | 2 | 3>(1);
  const [submissionSuccessNo, setSubmissionSuccessNo] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('Male');
  const [selectedCourse, setSelectedCourse] = useState(selectedCourseForApply || 'bth');
  const [previousEducation, setPreviousEducation] = useState('');
  const [homeChurch, setHomeChurch] = useState('');
  const [pastorName, setPastorName] = useState('');
  const [pastorPhone, setPastorPhone] = useState('');
  const [personalTestimony, setPersonalTestimony] = useState('');
  const [ministryCalling, setMinistryCalling] = useState('');

  // Tracking query state
  const [trackQuery, setTrackQuery] = useState('');
  const [foundApplication, setFoundApplication] = useState<any | null>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (activePage === 'admissions-eligibility') setActiveTab('eligibility');
    else if (activePage === 'admissions-fees') setActiveTab('fees');
    else setActiveTab('application');
  }, [activePage]);

  useEffect(() => {
    if (selectedCourseForApply) {
      setSelectedCourse(selectedCourseForApply);
      setActiveTab('application');
    }
  }, [selectedCourseForApply]);

  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (formStep === 1) {
      if (!fullName || !email || !phone || !dateOfBirth) {
        setFormError('Please fill out all required personal contact details.');
        return;
      }
      setFormStep(2);
    } else if (formStep === 2) {
      if (!selectedCourse || !previousEducation) {
        setFormError('Please select your target course and provide educational background.');
        return;
      }
      setFormStep(3);
    } else if (formStep === 3) {
      if (!homeChurch || !pastorName || !personalTestimony) {
        setFormError('Please provide your church details and personal spiritual testimony.');
        return;
      }

      setIsSubmitting(true);
      try {
        // Submit application!
        const generatedNo = await submitApplication({
          fullName,
          email,
          phone,
          dateOfBirth,
          gender,
          courseId: selectedCourse,
          previousEducation,
          homeChurch,
          pastorName,
          pastorPhone,
          personalTestimony,
          ministryCalling
        });

        setSubmissionSuccessNo(generatedNo);
        // Reset form
        setFullName('');
        setEmail('');
        setPhone('');
        setPreviousEducation('');
        setHomeChurch('');
        setPastorName('');
        setPastorPhone('');
        setPersonalTestimony('');
        setMinistryCalling('');
        setFormStep(1);
      } catch (err: any) {
        setFormError(err?.message || 'Error submitting application. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const match = applications.find(
      a =>
        a.applicationNo.toLowerCase().trim() === trackQuery.toLowerCase().trim() ||
        a.email.toLowerCase().trim() === trackQuery.toLowerCase().trim()
    );
    setFoundApplication(match || null);
  };

  return (
    <div className="space-y-12 pb-16 font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white py-14 border-b border-amber-600/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
            Admissions Office • Session 2026–2027
          </span>
          <h1 className="font-cinzel text-3xl sm:text-5xl font-extrabold tracking-tight">
            Admissions & Enrollment
          </h1>
          <p className="font-serif italic text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            “He who calls you is faithful; he will surely do it.” — 1 Thessalonians 5:24
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-2 border-b border-stone-200 pb-4">
          <button
            onClick={() => setActiveTab('application')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all flex items-center ${
              activeTab === 'application'
                ? 'bg-blue-900 text-amber-300 shadow-md'
                : 'text-stone-600 hover:text-slate-900 hover:bg-stone-100'
            }`}
          >
            <GraduationCap className="w-4 h-4 mr-1.5" />
            <span>Online Application</span>
          </button>

          <button
            onClick={() => setActiveTab('eligibility')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all flex items-center ${
              activeTab === 'eligibility'
                ? 'bg-blue-900 text-amber-300 shadow-md'
                : 'text-stone-600 hover:text-slate-900 hover:bg-stone-100'
            }`}
          >
            <FileCheck className="w-4 h-4 mr-1.5" />
            <span>Eligibility Criteria</span>
          </button>

          <button
            onClick={() => setActiveTab('fees')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all flex items-center ${
              activeTab === 'fees'
                ? 'bg-blue-900 text-amber-300 shadow-md'
                : 'text-stone-600 hover:text-slate-900 hover:bg-stone-100'
            }`}
          >
            <CreditCard className="w-4 h-4 mr-1.5" />
            <span>Fees & Scholarships</span>
          </button>

          <button
            onClick={() => setActiveTab('track')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all flex items-center ${
              activeTab === 'track'
                ? 'bg-blue-900 text-amber-300 shadow-md'
                : 'text-stone-600 hover:text-slate-900 hover:bg-stone-100'
            }`}
          >
            <Search className="w-4 h-4 mr-1.5" />
            <span>Track Application</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* TAB 1: Online Application */}
        {activeTab === 'application' && (
          <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-200">
            {submissionSuccessNo ? (
              <div className="bg-white rounded-3xl p-8 sm:p-10 border border-emerald-300 shadow-xl text-center space-y-5">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl">
                  ✓
                </div>
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-widest text-emerald-700 font-bold">
                    Application Submitted Successfully
                  </span>
                  <h3 className="font-cinzel text-2xl font-bold text-slate-900">
                    Welcome to the ICBC Admissions Process
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto">
                    Your application has been received by the Admissions Committee at Image of Christ Bible College, Vellore.
                  </p>
                </div>

                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 max-w-sm mx-auto">
                  <span className="text-xs text-stone-500 font-medium block">
                    Your Application Reference Number:
                  </span>
                  <span className="font-cinzel text-xl font-bold text-slate-900 tracking-wider">
                    {submissionSuccessNo}
                  </span>
                </div>

                <div className="text-xs text-stone-600 max-w-md mx-auto space-y-1">
                  <p>• Our Registrar will contact you and your pastor within 3–5 working days.</p>
                  <p>• Entrance oral interview dates are held on Saturdays at the Vellore campus or via online video call.</p>
                </div>

                <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setTrackQuery(submissionSuccessNo);
                      setActiveTab('track');
                      setSubmissionSuccessNo(null);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-amber-300 font-semibold text-xs transition-colors"
                  >
                    Track Status Now
                  </button>
                  <button
                    onClick={() => setSubmissionSuccessNo(null)}
                    className="px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs transition-colors"
                  >
                    Submit Another Application
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-xl space-y-8">
                {/* Stepper Header */}
                <div className="space-y-4">
                  <div className="text-center space-y-1">
                    <span className="text-xs uppercase tracking-widest text-amber-800 font-bold">
                      Formal Application Portal
                    </span>
                    <h2 className="font-cinzel text-2xl font-bold text-slate-900">
                      Admission Form 2026–2027
                    </h2>
                    <p className="text-xs text-stone-500">
                      Step {formStep} of 3: {formStep === 1 ? 'Personal Contact Details' : formStep === 2 ? 'Academic & Course Program' : 'Spiritual Testimony & Pastoral Recommendation'}
                    </p>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="flex items-center justify-between relative max-w-md mx-auto pt-2">
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-stone-200 -translate-y-1/2 -z-0"></div>
                    <div
                      className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        formStep >= 1 ? 'bg-blue-900 text-amber-300 shadow' : 'bg-stone-300 text-stone-600'
                      }`}
                    >
                      1
                    </div>
                    <div
                      className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        formStep >= 2 ? 'bg-blue-900 text-amber-300 shadow' : 'bg-stone-300 text-stone-600'
                      }`}
                    >
                      2
                    </div>
                    <div
                      className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        formStep >= 3 ? 'bg-blue-900 text-amber-300 shadow' : 'bg-stone-300 text-stone-600'
                      }`}
                    >
                      3
                    </div>
                  </div>
                </div>

                <form onSubmit={handleNextStep} className="space-y-6">
                  {formError && (
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center justify-between animate-in fade-in">
                      <span>{formError}</span>
                      <button
                        type="button"
                        onClick={() => setFormError(null)}
                        className="text-rose-500 hover:text-rose-700 ml-2 font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  {/* Step 1: Personal Details */}
                  {formStep === 1 && (
                    <div className="space-y-4 animate-in fade-in duration-150">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Full Legal Name (as in certificates) *
                        </label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={e => setFullName(e.target.value)}
                          placeholder="e.g. Paulraj Stephen"
                          className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="applicant@gmail.com"
                            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            WhatsApp / Mobile Number *
                          </label>
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            placeholder="+91 98765 43210"
                            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Date of Birth *
                          </label>
                          <input
                            type="date"
                            required
                            value={dateOfBirth}
                            onChange={e => setDateOfBirth(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Gender *
                          </label>
                          <select
                            value={gender}
                            onChange={e => setGender(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500"
                          >
                            <option value="Male">Male (Men’s Hall of Residence)</option>
                            <option value="Female">Female (Women’s Hall of Residence)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Course & Academic Selection */}
                  {formStep === 2 && (
                    <div className="space-y-4 animate-in fade-in duration-150">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Desired Course of Study *
                        </label>
                        <select
                          value={selectedCourse}
                          onChange={e => setSelectedCourse(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500"
                        >
                          {courses.map(c => (
                            <option key={c.id} value={c.id}>
                              {c.title} ({c.duration})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Highest Academic Qualification & Marks/Grade *
                        </label>
                        <input
                          type="text"
                          required
                          value={previousEducation}
                          onChange={e => setPreviousEducation(e.target.value)}
                          placeholder="e.g. Higher Secondary (+2) Pass with 74% / B.Com Degree with 68%"
                          className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500"
                        />
                        <p className="text-[11px] text-stone-500 mt-1">
                          Note: B.Th requires 10+2; M.Div requires any recognized Bachelor’s Degree or B.Th.
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Specific Ministry Calling & Vocational Goals
                        </label>
                        <textarea
                          rows={3}
                          value={ministryCalling}
                          onChange={e => setMinistryCalling(e.target.value)}
                          placeholder="Describe whether you are called to pastoral ministry, church planting, youth counseling, or missions..."
                          className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 3: Spiritual Life & Pastor Reference */}
                  {formStep === 3 && (
                    <div className="space-y-4 animate-in fade-in duration-150">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Home Church Name & Denomination *
                        </label>
                        <input
                          type="text"
                          required
                          value={homeChurch}
                          onChange={e => setHomeChurch(e.target.value)}
                          placeholder="e.g. Calvary Baptist Church, Vellore"
                          className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Pastor’s Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={pastorName}
                            onChange={e => setPastorName(e.target.value)}
                            placeholder="Pastor John Samuel"
                            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Pastor’s Contact Phone *
                          </label>
                          <input
                            type="tel"
                            required
                            value={pastorPhone}
                            onChange={e => setPastorPhone(e.target.value)}
                            placeholder="+91 94440 12345"
                            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Personal Salvation Testimony (How you came to faith in Christ) *
                        </label>
                        <textarea
                          rows={4}
                          required
                          value={personalTestimony}
                          onChange={e => setPersonalTestimony(e.target.value)}
                          placeholder="Briefly share how God saved you, your water baptism experience, and what prompted you to seek biblical training at ICBC..."
                          className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                  )}

                  {/* Form Footer Buttons */}
                  <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                    {formStep > 1 ? (
                      <button
                        type="button"
                        onClick={() => setFormStep((formStep - 1) as any)}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                      >
                        ← Back
                      </button>
                    ) : (
                      <div></div>
                    )}

                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center"
                    >
                      <span>{formStep === 3 ? 'Complete & Submit Application' : 'Proceed to Next Step'}</span>
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Eligibility */}
        {activeTab === 'eligibility' && (
          <div className="space-y-8 animate-in fade-in duration-200 max-w-4xl mx-auto">
            <div className="text-center space-y-2">
              <span className="text-xs uppercase tracking-widest text-amber-800 font-bold">
                Standards of Admission
              </span>
              <h2 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-slate-900">
                Course Eligibility & Admission Criteria
              </h2>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-cinzel text-lg font-bold text-blue-900">
                    Bachelor of Theology (B.Th) – 3 Years
                  </h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 font-bold">
                    Undergraduate
                  </span>
                </div>
                <ul className="text-xs space-y-2 text-stone-700">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span><strong>Academic:</strong> Higher Secondary Course (10+2 / Intermediate / HSC) pass from any recognized State or Central Board with minimum 45% marks.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span><strong>Spiritual:</strong> Clear personal testimony of salvation, believer’s water baptism by immersion, and active church membership.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span><strong>Endorsement:</strong> Confidential recommendation letter signed by the candidate’s local church pastor.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-cinzel text-lg font-bold text-blue-900">
                    Master of Divinity (M.Div) – 3 Years (2 Yrs for B.Th)
                  </h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 font-bold">
                    Post-Graduate
                  </span>
                </div>
                <ul className="text-xs space-y-2 text-stone-700">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span><strong>Academic:</strong> Any recognized secular Bachelor’s Degree (B.A, B.Sc, B.Com, B.Tech, etc.) or a B.Th degree with a minimum Grade B average from a recognized theological institution.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span><strong>Ministry Call:</strong> Evident calling to pastoral ministry, cross-cultural missions, or theological education.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-cinzel text-lg font-bold text-blue-900">
                    Certificate in Biblical Studies (CBS) – 1 Year
                  </h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">
                    Certificate
                  </span>
                </div>
                <ul className="text-xs space-y-2 text-stone-700">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span><strong>Academic:</strong> 10th Standard (SSLC) pass or equivalent. Basic ability to read and write in Tamil or English.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span><strong>Target Audience:</strong> Lay leaders, elders, Sunday School mentors, youth leaders, and marketplace witnesses.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => setActiveTab('application')}
                className="px-6 py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-amber-300 font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Proceed to Online Application Form
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: Fees & Scholarships */}
        {activeTab === 'fees' && (
          <div className="space-y-8 animate-in fade-in duration-200 max-w-4xl mx-auto">
            <div className="text-center space-y-2">
              <span className="text-xs uppercase tracking-widest text-amber-800 font-bold">
                Transparent & Subsidized
              </span>
              <h2 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-slate-900">
                Tuition Fee Schedule & Financial Aid
              </h2>
              <p className="text-xs text-stone-600 max-w-xl mx-auto">
                Image of Christ Bible College operates as a non-profit ministry trust. Tuition and boarding fees are heavily subsidized by generous evangelical partners.
              </p>
            </div>

            {/* Fee Comparison Table */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-amber-300 uppercase tracking-wider font-cinzel text-[11px]">
                    <tr>
                      <th className="p-4">Program</th>
                      <th className="p-4">Tuition (Per Year)</th>
                      <th className="p-4">Hostel & Mess (Optional)</th>
                      <th className="p-4">Total Subsidized Fee</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 text-stone-700">
                    <tr className="hover:bg-stone-50">
                      <td className="p-4 font-bold text-slate-900">Bachelor of Theology (B.Th)</td>
                      <td className="p-4">₹18,500</td>
                      <td className="p-4">₹10,000 / year</td>
                      <td className="p-4 font-bold text-amber-800">₹28,500 / year</td>
                    </tr>
                    <tr className="hover:bg-stone-50">
                      <td className="p-4 font-bold text-slate-900">Master of Divinity (M.Div)</td>
                      <td className="p-4">₹24,000</td>
                      <td className="p-4">₹12,000 / year</td>
                      <td className="p-4 font-bold text-amber-800">₹36,000 / year</td>
                    </tr>
                    <tr className="hover:bg-stone-50">
                      <td className="p-4 font-bold text-slate-900">Certificate in Biblical Studies</td>
                      <td className="p-4">₹10,500</td>
                      <td className="p-4">₹4,000 / year</td>
                      <td className="p-4 font-bold text-amber-800">₹14,500 total</td>
                    </tr>
                    <tr className="hover:bg-stone-50">
                      <td className="p-4 font-bold text-slate-900">Modular Short Courses</td>
                      <td className="p-4">₹3,500 – ₹4,500</td>
                      <td className="p-4">Day Scholar Track</td>
                      <td className="p-4 font-bold text-amber-800">Per Course Fee</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Scholarships & Financial Assistance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200 space-y-3">
                <span className="text-xl">🤝</span>
                <h4 className="font-cinzel text-base font-bold text-amber-950">
                  Missionary & Pastor’s Child Scholarship
                </h4>
                <p className="text-xs text-amber-900 leading-relaxed">
                  Children of full-time rural pastors, evangelists, and pioneer missionaries serving in unreached villages are eligible for up to <strong>50% tuition remission</strong> upon recommendation of their mission board.
                </p>
              </div>

              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200 space-y-3">
                <span className="text-xl">🌾</span>
                <h4 className="font-cinzel text-base font-bold text-blue-950">
                  Work-Scholarship Campus Program
                </h4>
                <p className="text-xs text-blue-900 leading-relaxed">
                  Eligible residential students may assist 8 hours per week in the college library, campus horticulture, and administrative archives to cover their boarding costs.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Track Application Status */}
        {activeTab === 'track' && (
          <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-200">
            <div className="text-center space-y-2">
              <span className="text-xs uppercase tracking-widest text-amber-800 font-bold">
                Live Status Portal
              </span>
              <h2 className="font-cinzel text-2xl font-bold text-slate-900">
                Track Your Application Status
              </h2>
              <p className="text-xs text-stone-600">
                Enter your Application Reference Number (e.g. <code>ICBC-2026-0811</code>) or your registered Email Address.
              </p>
            </div>

            <form onSubmit={handleTrackSubmit} className="flex gap-2">
              <input
                type="text"
                required
                value={trackQuery}
                onChange={e => setTrackQuery(e.target.value)}
                placeholder="Enter Application No (e.g. ICBC-2026-0811)"
                className="flex-1 px-4 py-3 rounded-xl border border-stone-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-amber-300 font-bold text-xs uppercase tracking-wider transition-colors flex items-center"
              >
                <Search className="w-4 h-4 mr-1.5" />
                <span>Search</span>
              </button>
            </form>

            {searched && (
              <div>
                {foundApplication ? (
                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-md space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-4">
                      <div>
                        <span className="text-xs text-stone-500 font-medium">Application Ref</span>
                        <h4 className="font-cinzel text-xl font-bold text-slate-900">
                          {foundApplication.applicationNo}
                        </h4>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          foundApplication.status === 'Admitted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : foundApplication.status === 'Interview Scheduled'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {foundApplication.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-stone-500 block">Applicant Name:</span>
                        <span className="font-bold text-slate-800">{foundApplication.fullName}</span>
                      </div>
                      <div>
                        <span className="text-stone-500 block">Program Applied:</span>
                        <span className="font-bold text-slate-800 uppercase">{foundApplication.courseId}</span>
                      </div>
                      <div>
                        <span className="text-stone-500 block">Submission Date:</span>
                        <span className="text-slate-700">{foundApplication.submittedAt}</span>
                      </div>
                      <div>
                        <span className="text-stone-500 block">Home Church:</span>
                        <span className="text-slate-700">{foundApplication.homeChurch}</span>
                      </div>
                    </div>

                    {foundApplication.notes && (
                      <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs space-y-1">
                        <span className="font-bold text-slate-900">Admissions Committee Notes:</span>
                        <p className="text-stone-700">{foundApplication.notes}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-stone-50 p-8 rounded-2xl border border-stone-200 text-center text-xs text-stone-600 space-y-2">
                    <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
                    <p className="font-semibold text-slate-800">
                      No application found matching “{trackQuery}”.
                    </p>
                    <p>
                      Please verify your Application Number or contact our admissions office at{' '}
                      <strong>vellorebiblecollege5@gmail.com</strong>.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
