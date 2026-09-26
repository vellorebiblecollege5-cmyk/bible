import React, { useState, useEffect } from 'react';
import { useCollege, ActivePage } from '../context/CollegeContext';
import { Course } from '../types';
import {
  BookOpen,
  Clock,
  Award,
  CheckCircle,
  ArrowRight,
  GraduationCap,
  Sparkles,
  Layers,
  FileText
} from 'lucide-react';

export const CoursesView: React.FC = () => {
  const {
    activePage,
    setActivePage,
    courses,
    subjectsList,
    setSelectedCourseForApply,
    setActiveDocumentPreview
  } = useCollege();

  const [selectedFilter, setSelectedFilter] = useState<'All' | 'C.Th' | 'D.Th' | 'B.Th' | 'M.Div' | 'Short Course'>('All');
  const [selectedCourseModal, setSelectedCourseModal] = useState<Course | null>(null);

  useEffect(() => {
    if (activePage === 'courses-bth') setSelectedFilter('B.Th');
    else if (activePage === 'courses-mdiv') setSelectedFilter('M.Div');
    else if (activePage === 'courses-cert') setSelectedFilter('C.Th');
    else if (activePage === 'courses-short') setSelectedFilter('Short Course');
    else setSelectedFilter('All');
  }, [activePage]);

  const filteredCourses =
    selectedFilter === 'All'
      ? courses
      : selectedFilter === 'Short Course'
      ? courses.filter(c => c.level === 'Short Course')
      : courses.filter(c => c.code.toLowerCase().includes(selectedFilter.toLowerCase().replace('.', '')) || c.code.toLowerCase().includes(selectedFilter.toLowerCase()));

  const handleApply = (courseId: string) => {
    setSelectedCourseForApply(courseId);
    setActivePage('admissions-application');
  };

  return (
    <div className="space-y-12 pb-16 font-sans">
      {/* Header Banner */}
      <div className="bg-[#0a1426] text-white py-14 border-b border-amber-600/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
            Theological Curriculum & Programs
          </span>
          <h1 className="font-cinzel text-3xl sm:text-5xl font-extrabold tracking-tight">
            Academic Courses & Degrees
          </h1>
          <p className="font-serif italic text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            “Be diligent to present yourself approved to God, a worker who does not need to be ashamed”
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-2 border-b border-stone-200 pb-4">
          <button
            onClick={() => setSelectedFilter('All')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              selectedFilter === 'All'
                ? 'bg-[#0f2444] text-amber-300 shadow-md'
                : 'text-stone-600 hover:text-slate-900 hover:bg-stone-100'
            }`}
          >
            All Programs ({courses.length})
          </button>
          <button
            onClick={() => setSelectedFilter('C.Th')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              selectedFilter === 'C.Th'
                ? 'bg-[#0f2444] text-amber-300 shadow-md'
                : 'text-stone-600 hover:text-slate-900 hover:bg-stone-100'
            }`}
          >
            C.Th (Certificate in Theology)
          </button>
          <button
            onClick={() => setSelectedFilter('D.Th')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              selectedFilter === 'D.Th'
                ? 'bg-[#0f2444] text-amber-300 shadow-md'
                : 'text-stone-600 hover:text-slate-900 hover:bg-stone-100'
            }`}
          >
            D.Th (Diploma in Theology)
          </button>
          <button
            onClick={() => setSelectedFilter('B.Th')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              selectedFilter === 'B.Th'
                ? 'bg-[#0f2444] text-amber-300 shadow-md'
                : 'text-stone-600 hover:text-slate-900 hover:bg-stone-100'
            }`}
          >
            B.Th (Bachelor of Theology)
          </button>
          <button
            onClick={() => setSelectedFilter('M.Div')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              selectedFilter === 'M.Div'
                ? 'bg-[#0f2444] text-amber-300 shadow-md'
                : 'text-stone-600 hover:text-slate-900 hover:bg-stone-100'
            }`}
          >
            M.Div (Master of Divinity)
          </button>
          <button
            onClick={() => setSelectedFilter('Short Course')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              selectedFilter === 'Short Course'
                ? 'bg-[#0f2444] text-amber-300 shadow-md'
                : 'text-stone-600 hover:text-slate-900 hover:bg-stone-100'
            }`}
          >
            Short Courses
          </button>
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredCourses.map(course => (
            <div
              key={course.id}
              className="bg-white rounded-3xl border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group hover:border-amber-400"
            >
              <div className="p-6 sm:p-8 space-y-4">
                {/* Course Badges */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-900 text-amber-300 uppercase tracking-wider">
                      {course.code}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-700">
                      {course.level}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-amber-800 flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    {course.duration}
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-xs text-stone-500 font-medium mt-1">
                    Medium: {course.language} • {course.mode}
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {course.description}
                </p>

                {/* Eligibility & Credits Strip */}
                <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-2 text-xs">
                  <div>
                    <span className="font-bold text-slate-900">Eligibility: </span>
                    <span className="text-stone-700">{course.eligibility}</span>
                  </div>
                  <div className="flex flex-wrap items-center justify-between pt-1 border-t border-stone-200/60">
                    <span className="text-stone-600 font-medium">
                      Total Credits: <strong>{course.totalCredits} Credit Hours</strong>
                    </span>
                    <span className="text-amber-800 font-bold">
                      {course.annualTuition}
                    </span>
                  </div>
                </div>

                {/* Curriculum Year Preview */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                    Curriculum Highlights:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {course.curriculum.slice(0, 2).map((yr, idx) => (
                      <div key={idx} className="bg-stone-50/80 p-3 rounded-xl border border-stone-100 text-xs">
                        <span className="font-bold text-blue-950 block mb-1 text-[11px] uppercase">
                          {yr.year}
                        </span>
                        <ul className="space-y-1 text-[11px] text-stone-600">
                          {yr.courses.slice(0, 3).map((sub, sIdx) => (
                            <li key={sIdx} className="truncate flex items-center">
                              <span className="text-amber-600 mr-1.5">•</span>
                              {sub}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-4 sm:p-6 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => setSelectedCourseModal(course)}
                  className="inline-flex items-center text-xs font-semibold text-blue-900 hover:text-blue-700 transition-colors"
                >
                  <FileText className="w-4 h-4 mr-1.5 text-blue-800" />
                  <span>View Full Syllabus & Outcomes</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      setActiveDocumentPreview({
                        title: `${course.title} Detailed Syllabus`,
                        type: 'Syllabus',
                        content: `Official Curriculum syllabus for ${course.title} at Image of Christ Bible College, Vellore. Total Credits: ${course.totalCredits}. Designed in concordance with Asia Theological Association standards.`
                      })
                    }
                    className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-slate-900 hover:bg-stone-100 transition-colors"
                    title="Download Syllabus PDF"
                  >
                    <BookOpen className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleApply(course.id)}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center"
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Curriculum Subjects Directory (Live from Admin Panel) */}
      {subjectsList.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#faf8f5]">
              <div>
                <span className="text-xs uppercase tracking-widest text-amber-800 font-bold block">
                  Theological Course Modules
                </span>
                <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[#0f2444]">
                  Curriculum Subjects & Credit Directory ({subjectsList.length})
                </h2>
              </div>
              <span className="px-3 py-1.5 rounded-xl bg-blue-900 text-amber-300 text-xs font-bold uppercase tracking-wider w-fit">
                Updated Live from Academic Office
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-slate-700 font-bold uppercase tracking-wider border-b border-stone-200">
                  <tr>
                    <th className="px-5 py-3.5">Subject Code</th>
                    <th className="px-5 py-3.5">Subject Title</th>
                    <th className="px-5 py-3.5">Program</th>
                    <th className="px-5 py-3.5">Semester / Year</th>
                    <th className="px-5 py-3.5">Credits</th>
                    <th className="px-5 py-3.5">Assigned Faculty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {subjectsList.map(sub => (
                    <tr key={sub.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="px-5 py-3.5 font-mono font-bold text-blue-950">{sub.subjectCode}</td>
                      <td className="px-5 py-3.5 font-bold text-slate-900">{sub.subjectName}</td>
                      <td className="px-5 py-3.5">
                        <span className="px-2.5 py-1 rounded-lg bg-stone-100 font-semibold uppercase text-stone-700">
                          {sub.courseId}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-stone-600">{sub.semesterOrYear}</td>
                      <td className="px-5 py-3.5 font-bold text-amber-800">{sub.credits} Credits</td>
                      <td className="px-5 py-3.5 text-stone-700">{sub.facultyName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Course Detail Modal */}
      {selectedCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-stone-200">
            {/* Header */}
            <div className="bg-slate-950 text-white p-6 flex items-center justify-between border-b border-amber-600/30">
              <div>
                <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
                  {selectedCourseModal.level} Program Curriculum
                </span>
                <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white mt-1">
                  {selectedCourseModal.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCourseModal(null)}
                className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm text-stone-700 font-sans">
              <div className="space-y-2">
                <h4 className="font-cinzel text-base font-bold text-slate-900">
                  Course Description & Objectives
                </h4>
                <p className="text-xs leading-relaxed text-stone-600">
                  {selectedCourseModal.description}
                </p>
              </div>

              {/* Complete Curriculum Breakdown */}
              <div className="space-y-4">
                <h4 className="font-cinzel text-base font-bold text-slate-900">
                  Complete Subject Modules & Curriculum
                </h4>
                <div className="space-y-3">
                  {selectedCourseModal.curriculum.map((item, idx) => (
                    <div key={idx} className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                      <span className="font-cinzel font-bold text-blue-950 text-xs sm:text-sm uppercase tracking-wide">
                        {item.year}
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {item.courses.map((cName, cIdx) => (
                          <div key={cIdx} className="text-xs text-stone-700 flex items-start">
                            <span className="text-amber-600 mr-2 font-bold">•</span>
                            <span>{cName}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Outcomes */}
              <div className="space-y-2">
                <h4 className="font-cinzel text-base font-bold text-slate-900">
                  Ministry Career & Vocational Outcomes
                </h4>
                <ul className="text-xs space-y-1.5 text-stone-600">
                  {selectedCourseModal.outcomes.map((out, idx) => (
                    <li key={idx} className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-emerald-600 mr-2 flex-shrink-0" />
                      <span>{out}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Fees */}
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-1">
                <span className="font-bold">Tuition & Financial Considerations:</span>
                <p>{selectedCourseModal.annualTuition}. Subsidized hostel and mess accommodation provided on Calvary Hill campus.</p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="bg-stone-50 p-4 border-t border-stone-200 flex items-center justify-between">
              <button
                onClick={() => setSelectedCourseModal(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedCourseModal(null);
                  handleApply(selectedCourseModal.id);
                }}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
              >
                Apply for this Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
