import React from 'react';
import { CollegeProvider, useCollege } from './context/CollegeContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { LiquidCoolingProvider } from './context/LiquidCoolingContext';
import { LiquidCoolingEffect } from './components/LiquidCoolingEffect';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DocumentModal } from './components/DocumentModal';
import { HomeView } from './views/HomeView';
import { AboutView } from './views/AboutView';
import { CoursesView } from './views/CoursesView';
import { AdmissionsView } from './views/AdmissionsView';
import { FacultyView } from './views/FacultyView';
import { StudentsView } from './views/StudentsView';
import { EventsView } from './views/EventsView';
import { GalleryView } from './views/GalleryView';
import { DownloadsView } from './views/DownloadsView';
import { ContactView } from './views/ContactView';
import { AdminView } from './views/AdminView';

const MainContent: React.FC = () => {
  const { activePage } = useCollege();
  const { theme } = useTheme();

  const renderCurrentView = () => {
    if (activePage === 'home') return <HomeView />;
    if (activePage.startsWith('about')) return <AboutView />;
    if (activePage.startsWith('courses')) return <CoursesView />;
    if (activePage.startsWith('admissions')) return <AdmissionsView />;
    if (activePage === 'faculty') return <FacultyView />;
    if (activePage.startsWith('students')) return <StudentsView />;
    if (activePage === 'events') return <EventsView />;
    if (activePage === 'gallery') return <GalleryView />;
    if (activePage === 'downloads') return <DownloadsView />;
    if (activePage === 'contact') return <ContactView />;
    if (activePage === 'admin' || activePage === 'login-user' || activePage === 'login-admin') return <AdminView />;
    return <HomeView />;
  };

  const getThemeBgClass = () => {
    switch (theme) {
      case 'pure-light':
        return 'bg-white text-slate-900 selection:bg-blue-600 selection:text-white';
      case 'heritage-light':
        return 'bg-[#faf8f5] text-slate-800 selection:bg-amber-600 selection:text-white';
      case 'cryo-cyan':
        return 'bg-[#05101f] text-slate-100 selection:bg-cyan-500 selection:text-slate-950';
      case 'emerald-eden':
        return 'bg-[#04160d] text-emerald-100 selection:bg-emerald-500 selection:text-slate-950';
      case 'crimson-theology':
        return 'bg-[#16080d] text-rose-100 selection:bg-rose-500 selection:text-white';
      case 'midnight-regal':
      default:
        return 'bg-[#0b132b] text-slate-100 selection:bg-amber-500 selection:text-slate-950';
    }
  };

  return (
    <div className={`min-h-screen flex flex-col antialiased relative transition-colors duration-300 ${getThemeBgClass()}`}>
      <LiquidCoolingEffect />
      <Navbar />
      <main className="flex-1">
        {renderCurrentView()}
      </main>
      <Footer />
      <DocumentModal />
    </div>
  );
};

export default function App() {
  return (
    <CollegeProvider>
      <ThemeProvider>
        <LiquidCoolingProvider>
          <MainContent />
        </LiquidCoolingProvider>
      </ThemeProvider>
    </CollegeProvider>
  );
}

