import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  Search,
  MessageSquare,
  Calendar,
  Trophy,
  ShieldAlert,
  Bell,
  PlusCircle,
  User,
  ArrowRightLeft,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ChevronDown,
  LogOut,
  SlidersHorizontal,
  BookOpen,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    users,
    notifications,
    chatThreads,
    activeTab,
    setActiveTab,
    toggleActiveRole,
    switchUser,
    setHelpPostModalOpen,
    setAuthModalOpen,
    simulateReminderNotification,
    markNotificationRead,
    markAllNotificationsRead,
    setPointHistoryModalOpen,
  } = useApp();

  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const unreadNotifs = notifications.filter((n) => !n.read).length;
  const unreadChats = chatThreads.reduce((sum, ct) => sum + ct.unreadCount, 0);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Banner if user has strikes or is flagged */}
      {currentUser.strikes > 0 && (
        <div className={`px-4 py-2 text-xs font-medium border-b ${
          currentUser.strikes >= 3
            ? 'bg-amber-100 text-amber-900 border-amber-300'
            : 'bg-slate-100 text-slate-700 border-slate-200'
        }`}>
          <div className="flex flex-wrap items-center justify-between gap-2 max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="truncate">
                <strong>Platform Notice:</strong> Account has {currentUser.strikes} {currentUser.strikes === 1 ? 'strike' : 'strikes'} on record (no-show policy: 3 strikes auto-flags account for suspension).
              </span>
            </div>
            {currentUser.accountStatus === 'flagged' && (
              <span className="font-semibold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-200 text-[11px] shrink-0">
                Flagged for Administrative Review
              </span>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[72px] sm:min-h-[76px] py-2 gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center gap-4 lg:gap-6 shrink-0">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-3 text-left group"
            >
              <div className="w-11 h-11 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-xs group-hover:bg-teal-700 transition shrink-0">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <span className="font-bold text-slate-900 text-xl tracking-tight leading-none">CampusTutor</span>
              </div>
            </button>

            {/* Dual-Role Toggle (Learner / Tutor) or Admin Staff Badge */}
            {currentUser.isAdmin ? (
              <div className="flex items-center gap-2 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200 shrink-0">
                <ShieldAlert className="w-4 h-4 text-purple-600 shrink-0" />
                <span className="text-xs font-bold text-purple-900">University Staff Admin</span>
                <span className="text-[10px] bg-purple-200 text-purple-800 font-bold px-1.5 py-0.5 rounded">
                  Moderator
                </span>
              </div>
            ) : (
              <div className="flex items-center bg-slate-100 p-1 sm:p-1.5 rounded-xl border border-slate-200 shrink-0">
                <button
                  onClick={() => currentUser.activeRole !== 'learner' && toggleActiveRole()}
                  className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
                    currentUser.activeRole === 'learner'
                      ? 'bg-white text-teal-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${currentUser.activeRole === 'learner' ? 'bg-teal-500' : 'bg-transparent'}`} />
                  <span>Learner View</span>
                </button>
                <button
                  onClick={() => currentUser.activeRole !== 'tutor' && toggleActiveRole()}
                  className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
                    currentUser.activeRole === 'tutor'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${currentUser.activeRole === 'tutor' ? 'bg-indigo-500' : 'bg-transparent'}`} />
                  <span>Tutor View</span>
                </button>
                <button
                  onClick={toggleActiveRole}
                  title="Switch active role mode"
                  className="p-1 sm:p-1.5 text-slate-400 hover:text-slate-700 rounded-md ml-0.5 transition"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Right Action Icons & Persona Switcher */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Contextual Action Button based on Active Role & Admin status */}
            {currentUser.isAdmin ? (
              <button
                onClick={() => setActiveTab('admin')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs xl:text-sm font-semibold rounded-lg bg-purple-600 text-white hover:bg-purple-700 shadow-xs transition whitespace-nowrap shrink-0"
              >
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>Staff Moderation</span>
              </button>
            ) : currentUser.activeRole === 'learner' ? (
              <button
                onClick={() => setHelpPostModalOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs xl:text-sm font-semibold rounded-lg bg-teal-600 text-white hover:bg-teal-700 shadow-xs transition whitespace-nowrap shrink-0"
              >
                <PlusCircle className="w-4 h-4 shrink-0" />
                <span>Create Help-Post</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveTab('profile')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs xl:text-sm font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs transition whitespace-nowrap shrink-0"
              >
                <SlidersHorizontal className="w-4 h-4 shrink-0" />
                <span>Tutor Rates & Bio</span>
              </button>
            )}

            {/* Notifications Dropdown */}
            <div className="relative shrink-0" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition border border-transparent hover:border-slate-200"
                title="Notifications & Reminders"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifs > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-rose-500 rounded-full">
                    {unreadNotifs}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-96 max-w-sm bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50">
                  <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Bell className="w-4 h-4 text-teal-600" />
                      <span className="font-semibold text-xs text-slate-900">Notifications & Reminders</span>
                      <span className="text-[11px] text-slate-500">({notifications.length})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-[11px] text-teal-600 hover:text-teal-800 font-medium"
                      >
                        Mark all read
                      </button>
                    </div>
                  </div>

                  {/* Quick simulated reminder trigger test button */}
                  <div className="p-2 bg-teal-50/50 border-b border-teal-100 flex items-center justify-between text-xs">
                    <span className="text-teal-800 font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-teal-600" /> Test Session Reminder:
                    </span>
                    <button
                      onClick={() => simulateReminderNotification()}
                      className="px-2 py-1 text-[11px] font-semibold bg-white border border-teal-200 text-teal-700 rounded-md hover:bg-teal-50 transition shadow-2xs"
                    >
                      Trigger Reminder
                    </button>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            markNotificationRead(notif.id);
                            if (notif.sessionId) {
                              setActiveTab('sessions');
                              setNotifOpen(false);
                            }
                          }}
                          className={`p-3 hover:bg-slate-50 cursor-pointer transition text-xs ${
                            !notif.read ? 'bg-teal-50/30' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-semibold text-slate-800 flex items-center gap-1">
                              {notif.type === 'reminder' && <Clock className="w-3 h-3 text-amber-500" />}
                              {notif.type === 'strike' && <AlertTriangle className="w-3 h-3 text-rose-500" />}
                              {notif.type === 'reward' && <Sparkles className="w-3 h-3 text-teal-600" />}
                              {notif.title}
                            </span>
                            <span className="text-[10px] text-slate-400 shrink-0">{notif.timestamp}</span>
                          </div>
                          <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Demo User Switcher & Profile Dropdown */}
            <div className="relative shrink-0" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 p-1.5 sm:px-2.5 sm:py-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition max-w-[190px] sm:max-w-[230px]"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-lg object-cover shrink-0"
                />
                <div className="hidden sm:block text-left text-xs leading-tight min-w-0">
                  <div className="font-semibold text-slate-800 flex items-center gap-1">
                    <span className="truncate max-w-[100px]">{currentUser.name}</span>
                    {currentUser.institutionalEmailVerified && (
                      <span title="Verified University Student" className="shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">
                    {currentUser.activeRole === 'learner' ? 'Learner' : 'Tutor'} • {currentUser.batch}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 max-w-sm bg-white rounded-xl shadow-xl border border-slate-200 overflow-y-auto max-h-[calc(100vh-5.5rem)] sm:max-h-[540px] z-50">
                  <div className="p-3.5 bg-slate-50 border-b border-slate-200 sticky top-0 z-10 backdrop-blur-xs">
                    <div className="text-xs font-semibold text-slate-900 truncate">{currentUser.name}</div>
                    <div className="text-[11px] text-slate-500 truncate">{currentUser.email}</div>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {currentUser.isAdmin ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 font-bold border border-purple-200">
                          Staff Administrator
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            setPointHistoryModalOpen(true);
                            setUserMenuOpen(false);
                          }}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 font-semibold shrink-0 flex items-center gap-1 transition cursor-pointer"
                          title="View Points & Rewards Ledger (#33)"
                        >
                          <Sparkles className="w-3 h-3 text-teal-600" />
                          <span>{currentUser.points} Reward Points</span>
                        </button>
                      )}
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium font-mono shrink-0">
                        {currentUser.studentId}
                      </span>
                    </div>
                  </div>

                  <div className="p-1.5 border-b border-slate-100">
                    {currentUser.isAdmin ? (
                      <>
                        <button
                          onClick={() => {
                            setActiveTab('admin');
                            setUserMenuOpen(false);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 text-xs text-purple-700 hover:bg-purple-50 rounded-lg transition font-medium"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <ShieldAlert className="w-4 h-4 text-purple-600 shrink-0" />
                            <span className="truncate">Staff Moderation Console</span>
                          </div>
                          <span className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded font-semibold ml-1">
                            Admin
                          </span>
                        </button>
                        <button
                          onClick={() => {
                            setActiveTab('dashboard');
                            setUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg transition"
                        >
                          <span className="truncate">Platform Overview</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setActiveTab('profile');
                            setUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg transition"
                        >
                          <User className="w-4 h-4 text-slate-500 shrink-0" />
                          <span className="truncate">My Profile & Teaching Portfolio</span>
                        </button>
                        <button
                          onClick={() => {
                            setPointHistoryModalOpen(true);
                            setUserMenuOpen(false);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-700 hover:bg-teal-50 hover:text-teal-900 rounded-lg transition"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
                            <span className="truncate font-medium">Reward Points Ledger (#33)</span>
                          </div>
                          <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200 shrink-0 ml-1">
                            {currentUser.points} pts
                          </span>
                        </button>
                        <button
                          onClick={() => {
                            toggleActiveRole();
                            setUserMenuOpen(false);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg transition"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <ArrowRightLeft className="w-4 h-4 text-slate-500 shrink-0" />
                            <span className="truncate">Toggle Role View</span>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 bg-slate-100 rounded font-semibold text-slate-600 shrink-0 ml-1">
                            Now: {currentUser.activeRole}
                          </span>
                        </button>
                      </>
                    )}
                  </div>

                  {/* Quick Persona Switcher for Evaluation */}
                  <div className="p-2 bg-slate-50/50">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center gap-1">
                      <SlidersHorizontal className="w-3 h-3" /> Switch Demo Account
                    </div>
                    <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                      {users.map((u) => (
                        <button
                          key={u.id}
                          onClick={() => {
                            switchUser(u.id);
                            setUserMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-xs transition ${
                            u.id === currentUser.id
                              ? 'bg-teal-50 text-teal-800 font-semibold border border-teal-200'
                              : 'text-slate-700 hover:bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <img src={u.avatar} alt={u.name} className="w-5 h-5 rounded-md object-cover shrink-0" />
                            <span className="truncate">{u.name}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-1">
                            {u.isAdmin ? 'Admin' : u.batch}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-1.5 border-t border-slate-100 sticky bottom-0 bg-white">
                    <button
                      onClick={() => {
                        setAuthModalOpen(true);
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    >
                      <LogOut className="w-4 h-4 shrink-0" />
                      <span className="truncate">Log in / Register / Guest Demo</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Bar (Placed below the header) */}
      <div className="border-t border-slate-200 bg-white shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-start md:justify-center gap-1 sm:gap-2 md:gap-3 py-2.5 overflow-x-auto">
            {currentUser.isAdmin ? (
              <>
                {/* Admin Subnav: Exclusively Admin Moderation and Platform Overview */}
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition whitespace-nowrap shrink-0 ${
                    activeTab === 'admin'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4 shrink-0 text-current" />
                  <span>Admin Moderation & Safety</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      activeTab === 'admin' ? 'bg-purple-700 text-white' : 'bg-purple-200 text-purple-800'
                    }`}
                  >
                    Staff
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition whitespace-nowrap shrink-0 ${
                    activeTab === 'dashboard'
                      ? 'bg-purple-100 text-purple-900 font-bold border border-purple-300'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span>Platform Overview</span>
                </button>
              </>
            ) : (
              <>
                {/* Regular Student/Tutor Navigation */}
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition whitespace-nowrap shrink-0 ${
                    activeTab === 'dashboard'
                      ? currentUser.activeRole === 'learner'
                        ? 'bg-teal-50 text-teal-700 font-bold border border-teal-200'
                        : 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Dashboard
                </button>

                {currentUser.activeRole === 'learner' ? (
                  <>
                    {/* Learner Tabs: Find Tutors, Help Posts, My Learning Sessions */}
                    <button
                      onClick={() => setActiveTab('tutors')}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition whitespace-nowrap shrink-0 ${
                        activeTab === 'tutors'
                          ? 'bg-teal-50 text-teal-700 font-bold border border-teal-200'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <Search className="w-4 h-4 shrink-0 text-teal-600" />
                      <span>Find Tutors</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('help-posts')}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition whitespace-nowrap shrink-0 ${
                        activeTab === 'help-posts'
                          ? 'bg-teal-50 text-teal-700 font-bold border border-teal-200'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <BookOpen className="w-4 h-4 shrink-0 text-slate-500" />
                      <span>Help Posts</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('sessions')}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition whitespace-nowrap shrink-0 ${
                        activeTab === 'sessions'
                          ? 'bg-teal-50 text-teal-700 font-bold border border-teal-200'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <Calendar className="w-4 h-4 shrink-0 text-slate-500" />
                      <span>My Learning Sessions</span>
                    </button>
                  </>
                ) : (
                  <>
                    {/* Tutor Tabs: Student Requests, Teaching Schedule, Rates & Availability */}
                    <button
                      onClick={() => setActiveTab('help-posts')}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition whitespace-nowrap shrink-0 ${
                        activeTab === 'help-posts'
                          ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <BookOpen className="w-4 h-4 shrink-0 text-indigo-600" />
                      <span>Student Requests</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('sessions')}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition whitespace-nowrap shrink-0 ${
                        activeTab === 'sessions'
                          ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <Calendar className="w-4 h-4 shrink-0 text-indigo-600" />
                      <span>Teaching Schedule</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('profile')}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition whitespace-nowrap shrink-0 ${
                        activeTab === 'profile'
                          ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <User className="w-4 h-4 shrink-0 text-indigo-600" />
                      <span>My Rates & Availability</span>
                    </button>
                  </>
                )}

                <button
                  onClick={() => setActiveTab('messages')}
                  className={`relative flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition whitespace-nowrap shrink-0 ${
                    activeTab === 'messages'
                      ? currentUser.activeRole === 'learner'
                        ? 'bg-teal-50 text-teal-700 font-bold border border-teal-200'
                        : 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 shrink-0 text-slate-500" />
                  <span>{currentUser.activeRole === 'learner' ? 'Messages' : 'Student Messages'}</span>
                  {unreadChats > 0 && (
                    <span
                      className={`w-2 h-2 rounded-full absolute top-1 right-1 ${
                        currentUser.activeRole === 'learner' ? 'bg-teal-600' : 'bg-indigo-600'
                      }`}
                    />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('leaderboard')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition whitespace-nowrap shrink-0 ${
                    activeTab === 'leaderboard'
                      ? currentUser.activeRole === 'learner'
                        ? 'bg-teal-50 text-teal-700 font-bold border border-teal-200'
                        : 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{currentUser.activeRole === 'learner' ? 'Top Tutors' : 'Tutor Ranks'}</span>
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
