import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { FindTutorsView } from './components/FindTutorsView';
import { HelpPostsView } from './components/HelpPostsView';
import { SessionsView } from './components/SessionsView';
import { ChatView } from './components/ChatView';
import { LeaderboardView } from './components/LeaderboardView';
import { ProfileView } from './components/ProfileView';
import { AdminView } from './components/AdminView';

// Modals
import { TutorPortfolioModal } from './components/TutorPortfolioModal';
import { ScheduleMatchModal } from './components/ScheduleMatchModal';
import { HelpPostModal } from './components/HelpPostModal';
import { BookingModal } from './components/BookingModal';
import { ReviewModal } from './components/ReviewModal';
import { ReportModal } from './components/ReportModal';
import { AuthModal } from './components/AuthModal';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { PointHistoryModal } from './components/PointHistoryModal';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, currentUser, tryDemo } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Navigation */}
      <Navbar />

      {/* Main App Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'tutors' && <FindTutorsView />}
        {activeTab === 'help-posts' && <HelpPostsView />}
        {activeTab === 'sessions' && <SessionsView />}
        {activeTab === 'messages' && <ChatView />}
        {activeTab === 'leaderboard' && <LeaderboardView />}
        {activeTab === 'profile' && <ProfileView />}
        {activeTab === 'admin' && <AdminView />}
      </main>

      {/* University Platform Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">CampusTutor</span>
            <span>•</span>
            <span>University Peer Tutoring Platform (Learner & Tutor Collaborative Network)</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => tryDemo('learner')}
              className="text-teal-700 hover:text-teal-900 font-semibold"
            >
              Reset to Demo Learner
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className="hover:text-slate-800"
            >
              Top-Tutor Ranks
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => setActiveTab('admin')}
              className="hover:text-slate-800"
            >
              Staff Moderation
            </button>
          </div>
        </div>
      </footer>

      {/* Modals & Overlays */}
      <TutorPortfolioModal />
      <ScheduleMatchModal />
      <HelpPostModal />
      <BookingModal />
      <ReviewModal />
      <ReportModal />
      <AuthModal />
      <VideoPlayerModal />
      <PointHistoryModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
