import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  Clock,
  Sparkles,
  Search,
  PlusCircle,
  MessageSquare,
  Award,
  Video,
  MapPin,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Star,
  Users,
  ShieldCheck,
  Zap,
  ShieldAlert,
  AlertTriangle,
  UserX,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    currentUser,
    users,
    disputeReports,
    helpPosts,
    sessions,
    chatThreads,
    setActiveTab,
    toggleActiveRole,
    setHelpPostModalOpen,
    setSelectedTutor,
    startChatWithTutor,
    markSessionCompleted,
    markSessionNoShow,
    simulateReminderNotification,
    getRecommendedTutors,
  } = useApp();

  const isLearner = currentUser.activeRole === 'learner';

  // Filter user's help posts
  const myHelpPosts = helpPosts.filter((p) => p.learnerId === currentUser.id);

  // Filter user's upcoming sessions by active role
  const upcomingSessions = sessions.filter(
    (s) =>
      s.status === 'upcoming' &&
      (isLearner ? s.learnerId === currentUser.id : s.tutorId === currentUser.id)
  );

  // Filter completed sessions by active role
  const completedSessions = sessions.filter(
    (s) =>
      s.status === 'completed' &&
      (isLearner ? s.learnerId === currentUser.id : s.tutorId === currentUser.id)
  );

  // Recommended tutors for learners
  const recommendedTutors = getRecommendedTutors().slice(0, 3);

  // Open student help requests for tutors
  const openStudentRequests = helpPosts
    .filter((p) => p.learnerId !== currentUser.id)
    .slice(0, 3);

  // Recent chat negotiations
  const recentNegotiations = chatThreads
    .filter((ct) => ct.learnerId === currentUser.id || ct.tutorId === currentUser.id)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Top Welcome & Role Context Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-14 h-14 rounded-xl object-cover border border-slate-200 shadow-2xs"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Welcome back, {currentUser.name}!
                </h1>
                {currentUser.isAdmin ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-md border border-purple-200">
                    <ShieldAlert className="w-3 h-3 text-purple-700" /> University Staff Admin
                  </span>
                ) : currentUser.institutionalEmailVerified ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                    <ShieldCheck className="w-3 h-3" /> Verified Student
                  </span>
                ) : null}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {currentUser.isAdmin
                  ? 'Academic Administration & Student Affairs'
                  : `${currentUser.department} • ${currentUser.batch} (${currentUser.levelTerm})`}{' '}
                • ID: <span className="font-mono text-slate-600">{currentUser.studentId}</span>
              </p>
              {currentUser.isAdmin ? (
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-800 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                    Staff Authority: Full Incident & Suspension Jurisdiction
                  </span>
                  <button
                    onClick={() => setActiveTab('admin')}
                    className="text-xs text-purple-700 hover:text-purple-900 font-semibold underline underline-offset-2 ml-1"
                  >
                    Go to Admin Console →
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                    Active Mode:
                    <strong className={isLearner ? 'text-teal-700 ml-1' : 'text-indigo-700 ml-1'}>
                      {isLearner ? '🎓 Learner' : '👨‍🏫 Peer Tutor'}
                    </strong>
                  </span>
                  <button
                    onClick={toggleActiveRole}
                    className="text-xs text-teal-600 hover:text-teal-800 font-medium underline underline-offset-2 ml-1"
                  >
                    Switch to {isLearner ? 'Tutor View' : 'Learner View'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Metrics Bar - Visible only in Tutor View for non-admin */}
          {!isLearner && !currentUser.isAdmin && (
            <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200 self-start md:self-auto">
              <div className="text-center px-3 border-r border-slate-200">
                <div className="text-lg font-bold text-teal-700">{currentUser.points}</div>
                <div className="text-[10px] text-slate-500 font-medium">Reward Pts</div>
              </div>
              <div className="text-center px-3 border-r border-slate-200">
                <div className="text-lg font-bold text-slate-800">{currentUser.teachingHours}h</div>
                <div className="text-[10px] text-slate-500 font-medium">Teaching Hrs</div>
              </div>
              <div className="text-center px-3">
                <div className="text-lg font-bold text-amber-600 flex items-center justify-center gap-0.5">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  {currentUser.rating}
                </div>
                <div className="text-[10px] text-slate-500 font-medium">({currentUser.ratingCount} revs)</div>
              </div>
            </div>
          )}

          {/* Quick Admin Platform Indicators for Staff */}
          {currentUser.isAdmin && (
            <div className="flex items-center gap-3 bg-purple-50 p-2.5 rounded-xl border border-purple-200 self-start md:self-auto">
              <div className="text-center px-3 border-r border-purple-200">
                <div className="text-lg font-bold text-purple-900">{users.length}</div>
                <div className="text-[10px] text-purple-700 font-medium">Total Users</div>
              </div>
              <div className="text-center px-3 border-r border-purple-200">
                <div className="text-lg font-bold text-amber-600">
                  {disputeReports.filter((r) => r.status === 'pending').length}
                </div>
                <div className="text-[10px] text-slate-600 font-medium">Pending Disputes</div>
              </div>
              <div className="text-center px-3">
                <div className="text-lg font-bold text-rose-700">
                  {users.filter((u) => u.accountStatus === 'suspended' || u.strikes >= 3).length}
                </div>
                <div className="text-[10px] text-slate-600 font-medium">Suspended</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Admin Fast-Action Banner for Staff */}
      {currentUser.isAdmin && (
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-800 text-white rounded-xl p-5 shadow-sm border border-purple-700/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-purple-500/25 border border-purple-400/40 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-6 h-6 text-purple-200" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base font-bold text-white tracking-tight">
                    University Staff Moderation & Safety Center
                  </h2>
                  <span className="text-[10px] bg-purple-400/30 text-purple-200 px-2 py-0.5 rounded-full font-bold border border-purple-400/40">
                    Feature #36
                  </span>
                </div>
                <p className="text-xs text-purple-200/90 mt-1 max-w-2xl leading-relaxed">
                  As an authorized university moderator, you have permissions to audit dispute incident queues, inspect 3-strike no-show infractions, and execute user suspensions or reactivations.
                </p>
                <div className="flex items-center gap-2.5 mt-3 text-xs text-purple-100 flex-wrap">
                  <span className="bg-purple-800/80 px-2.5 py-1 rounded-md border border-purple-700/60 font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    {disputeReports.filter((r) => r.status === 'pending').length} Pending Reports
                  </span>
                  <span className="bg-purple-800/80 px-2.5 py-1 rounded-md border border-purple-700/60 font-semibold">
                    {users.filter((u) => u.accountStatus === 'suspended' || u.strikes >= 3).length} Flagged / Suspended
                  </span>
                  <span className="bg-purple-800/80 px-2.5 py-1 rounded-md border border-purple-700/60 font-semibold">
                    {sessions.length} Platform Sessions
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('admin')}
              className="px-4 py-2.5 bg-white text-purple-900 hover:bg-purple-50 text-xs font-bold rounded-xl shadow-xs transition shrink-0 flex items-center gap-1.5 self-start sm:self-center"
            >
              <span>Open Staff Console</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Dedicated Admin Platform Dashboard vs. Student/Tutor Grid */}
      {currentUser.isAdmin ? (
        <div className="space-y-6">
          {/* Admin KPI Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-purple-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Pending Disputes</span>
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-2">
                {disputeReports.filter((r) => r.status === 'pending').length}
              </div>
              <div className="text-[11px] text-amber-600 font-medium mt-1">Requires staff investigation</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-purple-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Flagged & Suspended</span>
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                  <UserX className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-rose-700 mt-2">
                {users.filter((u) => u.accountStatus === 'suspended' || u.strikes >= 3).length}
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-1">Under disciplinary restriction</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-purple-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Registered Users</span>
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-purple-900 mt-2">{users.length}</div>
              <div className="text-[11px] text-slate-500 font-medium mt-1">Students & peer tutors</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-purple-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Total Tutoring Sessions</span>
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-teal-800 mt-2">{sessions.length}</div>
              <div className="text-[11px] text-teal-600 font-medium mt-1">Platform-wide sessions</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Incident Queue & Campus Tutoring Audit Log */}
            <div className="lg:col-span-2 space-y-6">
              {/* Incident Moderation Queue */}
              <div className="bg-white rounded-xl border border-purple-200 p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-purple-600" />
                    <h2 className="font-bold text-base text-slate-900">Urgent Incident & Dispute Queue</h2>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                      {disputeReports.filter((r) => r.status === 'pending').length} Action Required
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveTab('admin')}
                    className="text-xs font-semibold text-purple-700 hover:text-purple-900 flex items-center gap-0.5"
                  >
                    Open Moderation Console <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {disputeReports.slice(0, 3).map((report) => (
                    <div
                      key={report.id}
                      className="p-3.5 rounded-xl border border-slate-200 hover:border-purple-300 transition bg-slate-50/50"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-900 text-xs">{report.reportedUserName}</span>
                            <span className="text-[10px] px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded font-semibold uppercase">
                              {report.reason}
                            </span>
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                                report.status === 'pending'
                                  ? 'bg-amber-100 text-amber-800'
                                  : report.status === 'investigating'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              Status: {report.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2">{report.details}</p>
                          <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
                            <span>Reported by: {report.reporterName}</span>
                            <span>•</span>
                            <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => setActiveTab('admin')}
                          className="px-3 py-1.5 text-xs font-semibold bg-purple-600 text-white hover:bg-purple-700 rounded-lg shadow-2xs transition shrink-0"
                        >
                          Review Case
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Campus-Wide Sessions Monitor */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-slate-700" />
                    <h2 className="font-bold text-base text-slate-900">Campus Tutoring Sessions Monitor</h2>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {sessions.length} Recorded
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">Live Campus Feed</span>
                </div>

                <div className="divide-y divide-slate-100">
                  {sessions.slice(0, 5).map((s) => (
                    <div key={s.id} className="py-3 flex items-center justify-between text-xs">
                      <div className="min-w-0 pr-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-900">{s.courseCode}</span>
                          <span className="text-slate-500">• {s.courseTitle}</span>
                          <span
                            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                              s.status === 'upcoming'
                                ? 'bg-blue-50 text-blue-700'
                                : s.status === 'completed'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-rose-50 text-rose-700'
                            }`}
                          >
                            {s.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Tutor: <strong className="text-slate-700">{s.tutorName}</strong> • Learner:{' '}
                          <strong className="text-slate-700">{s.learnerName}</strong> • {s.mode} ({s.duration})
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-semibold text-slate-700">
                          {s.paymentType === 'free' ? 'Community' : `${s.price} BDT`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Strike Watchlist & Policy Controls */}
            <div className="space-y-6">
              {/* Flagged Users Watchlist */}
              <div className="bg-white rounded-xl border border-rose-200 p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <UserX className="w-4 h-4 text-rose-600" />
                    <h3 className="font-bold text-sm text-slate-900">Student Strike Watchlist</h3>
                  </div>
                  <span className="text-[10px] bg-rose-50 text-rose-700 font-bold px-1.5 py-0.5 rounded border border-rose-200">
                    3-Strike Rule
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-3">
                  Students accumulating no-show or behavioral strikes requiring staff review.
                </p>

                <div className="space-y-2.5">
                  {users
                    .filter((u) => u.strikes > 0 || u.accountStatus === 'suspended')
                    .map((target) => (
                      <div
                        key={target.id}
                        className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <img
                            src={target.avatar}
                            alt={target.name}
                            className="w-7 h-7 rounded-md object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="font-bold text-xs text-slate-900 truncate">{target.name}</div>
                            <div className="text-[10px] text-slate-500">ID: {target.studentId}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              target.strikes >= 3
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {target.strikes} Strikes
                          </span>
                          <button
                            onClick={() => setActiveTab('admin')}
                            className="text-[11px] font-semibold text-purple-700 hover:text-purple-900 underline"
                          >
                            Manage
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Administrative Policy & Jurisdiction */}
              <div className="bg-purple-50/60 rounded-xl border border-purple-200 p-4">
                <h4 className="font-bold text-xs text-purple-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-purple-700" /> Staff Moderation Protocol
                </h4>
                <ul className="text-[11px] text-purple-900/90 mt-2 space-y-1.5 list-disc list-inside">
                  <li>3 verified no-shows trigger automated booking lock.</li>
                  <li>Dispute reviews must cite student session chat transcripts.</li>
                  <li>Reactivation requires disciplinary counseling clearance.</li>
                </ul>
                <button
                  onClick={() => setActiveTab('admin')}
                  className="w-full mt-3 py-2 text-xs font-bold bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-center transition"
                >
                  Go to Moderation Console →
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Regular Student/Tutor Grid: Upcoming Sessions & Quick Actions */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Upcoming Sessions & Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Sessions Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className={`w-5 h-5 ${isLearner ? 'text-teal-600' : 'text-indigo-600'}`} />
                <h2 className="font-bold text-base text-slate-900">
                  {isLearner ? 'Upcoming Learning Sessions' : 'Upcoming Teaching Schedule'}
                </h2>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isLearner ? 'bg-teal-50 text-teal-700' : 'bg-indigo-50 text-indigo-700'}`}>
                  {upcomingSessions.length} Scheduled
                </span>
              </div>
              <button
                onClick={() => setActiveTab('sessions')}
                className={`text-xs font-semibold flex items-center gap-0.5 ${isLearner ? 'text-teal-600 hover:text-teal-800' : 'text-indigo-600 hover:text-indigo-800'}`}
              >
                View all <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {upcomingSessions.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Clock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">
                  {isLearner ? 'No learning sessions scheduled right now' : 'No teaching classes scheduled right now'}
                </p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  {isLearner
                    ? 'Find verified campus tutors in the directory or negotiate times in messages to schedule your next session.'
                    : 'Browse open student help requests to offer tutoring or configure your available teaching slots.'}
                </p>
                <button
                  onClick={() => setActiveTab(isLearner ? 'tutors' : 'help-posts')}
                  className={`mt-3 px-3.5 py-1.5 text-xs font-semibold text-white rounded-lg transition ${isLearner ? 'bg-teal-600 hover:bg-teal-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                >
                  {isLearner ? 'Browse Tutor Directory' : 'Browse Student Help Requests'}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingSessions.map((sess) => {
                  const isUserLearner = sess.learnerId === currentUser.id;
                  const partnerName = isUserLearner ? sess.tutorName : sess.learnerName;
                  const partnerAvatar = isUserLearner ? sess.tutorAvatar : sess.learnerAvatar;

                  return (
                    <div
                      key={sess.id}
                      className="p-4 rounded-xl border border-slate-200 hover:border-teal-300 transition bg-white shadow-2xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <img
                            src={partnerAvatar}
                            alt={partnerName}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-slate-900 text-sm">{sess.courseCode}</span>
                              <span className="text-xs text-slate-500 font-medium">• {sess.courseTitle}</span>
                              <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                                sess.mode === 'online'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : sess.mode === 'offline'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-purple-50 text-purple-700 border border-purple-200'
                              }`}>
                                {sess.mode} Session
                              </span>
                              {sess.isGroup && (
                                <span className="text-[10px] font-semibold px-2 py-0.5 bg-amber-50 text-amber-700 rounded-md border border-amber-200">
                                  Group Class
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-slate-600 mt-1">
                              With <strong className="text-slate-800">{partnerName}</strong> ({isUserLearner ? 'Tutor' : 'Student'})
                              <span className="text-slate-400 mx-1.5">|</span>
                              <span className="font-mono text-slate-700">{sess.duration}</span>
                              <span className="text-slate-400 mx-1.5">|</span>
                              <span className="font-semibold text-slate-800">
                                {sess.paymentType === 'free' ? 'Free (Community)' : `${sess.price} BDT`}
                              </span>
                            </p>

                            <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                              <span className="flex items-center gap-1 font-medium text-slate-700">
                                <Clock className="w-3.5 h-3.5 text-teal-600" />
                                {new Date(sess.scheduledTime).toLocaleDateString([], {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                              <span className="flex items-center gap-1 truncate max-w-xs text-slate-500">
                                {sess.mode === 'online' ? (
                                  <Video className="w-3.5 h-3.5 text-blue-600" />
                                ) : (
                                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                                )}
                                <span className="truncate">{sess.meetingDetails}</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action buttons on card */}
                        <div className="flex items-center sm:flex-col gap-2 shrink-0">
                          <button
                            onClick={() => markSessionCompleted(sess.id)}
                            className="flex-1 sm:w-full px-3 py-1.5 text-xs font-semibold rounded-lg bg-teal-600 text-white hover:bg-teal-700 shadow-2xs transition flex items-center justify-center gap-1"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Mark Complete
                          </button>
                          <div className="flex items-center gap-1 w-full">
                            <button
                              onClick={() => simulateReminderNotification(sess.id)}
                              className="px-2 py-1 text-[11px] font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition"
                              title="Send simulated reminder notification"
                            >
                              Remind
                            </button>
                            <button
                              onClick={() => markSessionNoShow(sess.id, isUserLearner ? 'learner' : 'tutor')}
                              className="px-2 py-1 text-[11px] font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md transition"
                              title="Mark No-Show (issues safety strike)"
                            >
                              No-Show Strike
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* User's Public Help-Posts (Learner) or Student Requests Needing Tutors (Tutor) */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className={`w-5 h-5 ${isLearner ? 'text-teal-600' : 'text-indigo-600'}`} />
                <h2 className="font-bold text-base text-slate-900">
                  {isLearner ? 'My Help-Posts & Inquiries' : 'Open Student Help Requests'}
                </h2>
                <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full">
                  {isLearner ? `${myHelpPosts.length} Active` : `${openStudentRequests.length} Open`}
                </span>
              </div>
              {isLearner ? (
                <button
                  onClick={() => setHelpPostModalOpen(true)}
                  className="text-xs font-semibold text-teal-600 hover:text-teal-800 flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> Post New Need
                </button>
              ) : (
                <button
                  onClick={() => setActiveTab('help-posts')}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  View All Requests <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {isLearner ? (
              myHelpPosts.length === 0 ? (
                <div className="p-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <p className="text-xs text-slate-500">You haven’t posted any public tutoring needs yet.</p>
                  <button
                    onClick={() => setHelpPostModalOpen(true)}
                    className="mt-2.5 px-3 py-1.5 text-xs font-semibold bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                  >
                    Create Help-Post
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {myHelpPosts.map((post) => (
                    <div
                      key={post.id}
                      className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 transition"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-xs px-2 py-0.5 bg-white border border-slate-200 rounded-md">
                              {post.courseCode}
                            </span>
                            <span className="font-semibold text-slate-800 text-xs">{post.topic}</span>
                            <span className="text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md font-medium">
                              {post.preferredMode}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-1">{post.description}</p>
                          <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
                            <span>Duration: {post.preferredDuration}</span>
                            <span>•</span>
                            <span>Budget: {post.budgetType === 'free' ? 'Free' : `${post.budgetAmount} BDT`}</span>
                            <span>•</span>
                            <span className="text-teal-700 font-semibold">{post.offersCount} tutor inquiries received</span>
                          </div>
                        </div>

                        <button
                          onClick={() => setActiveTab('help-posts')}
                          className="text-xs font-medium text-teal-600 hover:text-teal-800 shrink-0"
                        >
                          Manage
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              openStudentRequests.length === 0 ? (
                <div className="p-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <p className="text-xs text-slate-500">No open student requests at the moment.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {openStudentRequests.map((post) => (
                    <div
                      key={post.id}
                      className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 bg-slate-50/50 transition"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-900 text-xs px-2 py-0.5 bg-white border border-slate-200 rounded-md">
                              {post.courseCode}
                            </span>
                            <span className="font-semibold text-slate-800 text-xs">{post.topic}</span>
                            <span className="text-[10px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md font-medium">
                              From: {post.learnerName} ({post.learnerBatch})
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-1">{post.description}</p>
                          <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
                            <span>Mode: {post.preferredMode}</span>
                            <span>•</span>
                            <span>Duration: {post.preferredDuration}</span>
                            <span>•</span>
                            <span className="font-semibold text-slate-700">Budget: {post.budgetType === 'free' ? 'Free Mentorship' : `${post.budgetAmount} BDT`}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => startChatWithTutor(post.learnerId)}
                          className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg shadow-2xs transition shrink-0"
                        >
                          Offer Tutoring
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>

          {/* Recent Completed Sessions & Points Earned */}
          {completedSessions.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <h2 className="font-bold text-base text-slate-900">Recent Completed Sessions</h2>
                </div>
                <button
                  onClick={() => setActiveTab('sessions')}
                  className="text-xs font-semibold text-teal-600 hover:text-teal-800"
                >
                  All History
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {completedSessions.slice(0, 2).map((s) => (
                  <div key={s.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900">{s.courseCode}</span> - {s.topic}
                      <div className="text-[11px] text-slate-400">
                        With {s.learnerId === currentUser.id ? s.tutorName : s.learnerName} • {s.duration}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md text-[11px]">
                        +{s.pointsAwarded || 25} Pts Awarded
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Smart Matches & Pre-booking Negotiations */}
        <div className="space-y-6">
          {/* Smart Tutor Recommendations (Learner) or Teaching Rates & Availability (Tutor) */}
          {isLearner ? (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <h3 className="font-bold text-sm text-slate-900">Recommended for You</h3>
                </div>
                <span className="text-[10px] text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded font-semibold">
                  Smart Match
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-3">
                Matched by your department ({currentUser.department.slice(0, 3)}) and active course needs.
              </p>

              <div className="space-y-3">
                {recommendedTutors.map((tutor) => (
                  <div
                    key={tutor.id}
                    className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-teal-200 transition"
                  >
                    <div className="flex items-start gap-2.5">
                      <img
                        src={tutor.avatar}
                        alt={tutor.name}
                        className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-xs text-slate-900 truncate">{tutor.name}</h4>
                          <div className="flex items-center text-amber-500 text-[11px] font-semibold shrink-0">
                            <Star className="w-3 h-3 fill-amber-400" />
                            {tutor.rating}
                          </div>
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium">
                          {tutor.batch} • {tutor.coursesTaught[0]?.split(':')[0]}
                        </div>
                        <p className="text-[11px] text-slate-600 line-clamp-1 mt-1">
                          {tutor.bio}
                        </p>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60">
                          <span className="text-xs font-semibold text-slate-800">
                            {tutor.paymentPreference === 'free' ? 'Free Peer' : `${tutor.hourlyRate} BDT/hr`}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setSelectedTutor(tutor)}
                              className="px-2 py-0.5 text-[11px] font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-md"
                            >
                              Portfolio
                            </button>
                            <button
                              onClick={() => startChatWithTutor(tutor.id)}
                              className="px-2 py-0.5 text-[11px] font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-md"
                            >
                              Chat
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setActiveTab('tutors')}
                className="w-full mt-3 py-2 text-xs font-semibold text-teal-700 hover:text-teal-900 bg-teal-50/70 rounded-lg text-center block transition"
              >
                Search All Campus Tutors →
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-indigo-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-indigo-600" />
                  <h3 className="font-bold text-sm text-slate-900">My Teaching Rates & Setup</h3>
                </div>
                <span className="text-[10px] text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded font-semibold border border-indigo-200">
                  Tutor Active
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-3">
                Current rates and availability presented to students booking your sessions.
              </p>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-600 font-medium">Standard Hourly Rate:</span>
                  <span className="font-bold text-slate-900">
                    {currentUser.paymentPreference === 'free' ? 'Free (Peer Volunteer)' : `${currentUser.hourlyRate || 300} BDT/hr`}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-600 font-medium">Delivery Mode:</span>
                  <span className="font-bold text-slate-900 capitalize">{currentUser.deliveryMode}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-600 font-medium">Group Discount:</span>
                  <span className="font-bold text-emerald-700">{currentUser.groupDiscountPercent || 20}% Off</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-600 font-medium">Package Bundles:</span>
                  <span className="font-bold text-slate-900">{currentUser.packageOffers?.length || 0} Listed</span>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('profile')}
                className="w-full mt-4 py-2 text-xs font-semibold text-indigo-700 hover:text-indigo-900 bg-indigo-50 rounded-lg text-center block border border-indigo-200 transition"
              >
                Edit Rates, Packages & Availability →
              </button>
            </div>
          )}

          {/* Active Pre-booking Negotiations */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-teal-600" />
                <h3 className="font-bold text-sm text-slate-900">Pre-booking Chats</h3>
              </div>
              <button
                onClick={() => setActiveTab('messages')}
                className="text-xs font-semibold text-teal-600 hover:text-teal-800"
              >
                Open Inbox
              </button>
            </div>

            <div className="space-y-2">
              {recentNegotiations.map((thread) => {
                const partnerName = thread.learnerId === currentUser.id ? thread.tutorName : thread.learnerName;
                const partnerAvatar = thread.learnerId === currentUser.id ? thread.tutorAvatar : thread.learnerAvatar;

                return (
                  <div
                    key={thread.id}
                    onClick={() => {
                      startChatWithTutor(thread.learnerId === currentUser.id ? thread.tutorId : thread.learnerId);
                    }}
                    className="p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer transition flex items-center gap-2.5"
                  >
                    <img
                      src={partnerAvatar}
                      alt={partnerName}
                      className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0 flex-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 truncate">{partnerName}</span>
                        <span className="text-[10px] text-slate-400">{thread.lastMessageTime}</span>
                      </div>
                      <div className="text-[11px] text-teal-700 font-medium">{thread.courseCode}</div>
                      <p className="text-[11px] text-slate-500 truncate">{thread.lastMessage}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Platform Guidelines Card */}
          <div className="bg-teal-50/50 rounded-xl border border-teal-200/70 p-4">
            <h4 className="font-bold text-xs text-teal-900 flex items-center gap-1">
              <Award className="w-4 h-4 text-teal-700" /> Peer Tutoring Ethics
            </h4>
            <ul className="text-[11px] text-teal-800 mt-2 space-y-1.5 list-disc list-inside">
              <li>Always negotiate duration and schedule in chat before confirming.</li>
              <li>Free sessions reward <strong className="text-teal-950">+50 Community Points</strong> to tutor.</li>
              <li>3 No-Show strikes automatically flag accounts for academic review.</li>
            </ul>
          </div>
        </div>
      </div>
    )}
  </div>
);
};
