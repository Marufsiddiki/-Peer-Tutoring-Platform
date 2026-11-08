import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TutoringSession } from '../types';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Star,
  Users,
  Sparkles,
  PlusCircle,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  DollarSign,
  Ban,
  RefreshCw,
  Bell,
  BookOpen,
} from 'lucide-react';

export const SessionsView: React.FC = () => {
  const {
    sessions,
    currentUser,
    setActiveTab,
    markSessionCompleted,
    markSessionNoShow,
    confirmBooking,
    declineBooking,
    cancelSession,
    rescheduleSession,
    simulateReminderNotification,
    setBookingModalOpen,
    setReviewSession,
    setReviewModalOpen,
    setReportTarget,
    setReportModalOpen,
    setPointHistoryModalOpen,
  } = useApp();

  const [filterTab, setFilterTab] = useState<'pending' | 'upcoming' | 'completed' | 'cancelled_noshow'>('upcoming');
  const [reschedulingSessionId, setReschedulingSessionId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState('2026-10-29');
  const [newTime, setNewTime] = useState('17:00');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const isLearner = currentUser.activeRole === 'learner';
  const [roleModeFilter, setRoleModeFilter] = useState<'active_role' | 'all'>('active_role');

  // Filter sessions involving current user based on active role
  const userSessions = sessions.filter((s) => {
    if (roleModeFilter === 'all') {
      return s.learnerId === currentUser.id || s.tutorId === currentUser.id;
    }
    return isLearner ? s.learnerId === currentUser.id : s.tutorId === currentUser.id;
  });

  const displayedSessions = userSessions.filter((s) => {
    if (filterTab === 'pending') return s.status === 'pending_confirmation';
    if (filterTab === 'upcoming') return s.status === 'upcoming';
    if (filterTab === 'completed') return s.status === 'completed';
    if (filterTab === 'cancelled_noshow') return s.status === 'no_show' || s.status === 'cancelled';
    return true;
  });

  const handleRescheduleSubmit = (sessionId: string) => {
    const combinedIso = new Date(`${newDate}T${newTime}:00`).toISOString();
    const result = rescheduleSession(sessionId, combinedIso);
    if (!result.success && result.error) {
      setActionMessage(`Error: ${result.error}`);
    } else {
      setActionMessage('Session rescheduled successfully (#38). Reminders updated.');
      setReschedulingSessionId(null);
    }
    setTimeout(() => setActionMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <Calendar className={`w-5 h-5 ${isLearner ? 'text-teal-600' : 'text-indigo-600'}`} />
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                {isLearner ? 'My Learning Sessions (Booked as Student)' : 'My Teaching Schedule (Tutoring Classes)'}
              </h1>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${isLearner ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'bg-indigo-50 text-indigo-700 border border-indigo-200'}`}>
                {userSessions.length} {isLearner ? 'Learning' : 'Teaching'} Records
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {isLearner
                ? 'Your booked learning appointments with peer mentors. Includes automatic reminder alerts and no-show strike protection.'
                : 'Tutoring appointments you are conducting for students. Manage attendee check-ins, complete sessions, and earn reward points.'}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* View Point History Button (#33) */}
            <button
              onClick={() => setPointHistoryModalOpen(true)}
              className="px-3 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Points Ledger ({currentUser.points} pts)</span>
            </button>

            <button
              onClick={() => simulateReminderNotification()}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition flex items-center gap-1.5"
              title="Test simulated session reminder notification"
            >
              <Bell className="w-3.5 h-3.5 text-teal-600" />
              <span>Simulate Reminder</span>
            </button>

            {isLearner ? (
              <button
                onClick={() => setBookingModalOpen(true)}
                className="px-3.5 py-1.5 text-xs font-semibold bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition flex items-center gap-1.5 shadow-2xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Book Session (#26)</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveTab('help-posts')}
                className="px-3.5 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-1.5 shadow-2xs"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Browse Student Requests</span>
              </button>
            )}
          </div>
        </div>

        {actionMessage && (
          <div className="mt-4 p-3 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-xs font-medium animate-fadeIn">
            {actionMessage}
          </div>
        )}

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 mt-5 pt-3 border-t border-slate-100 text-xs flex-wrap">
          {userSessions.filter((s) => s.status === 'pending_confirmation').length > 0 && (
            <button
              onClick={() => setFilterTab('pending')}
              className={`px-3 py-1.5 font-bold rounded-lg transition flex items-center gap-1.5 ${
                filterTab === 'pending'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5 animate-pulse text-amber-600" />
              <span>Pending Requests ({userSessions.filter((s) => s.status === 'pending_confirmation').length})</span>
            </button>
          )}
          <button
            onClick={() => setFilterTab('upcoming')}
            className={`px-3 py-1.5 font-semibold rounded-lg transition ${
              filterTab === 'upcoming'
                ? 'bg-teal-50 text-teal-700 shadow-2xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Confirmed Upcoming ({userSessions.filter((s) => s.status === 'upcoming').length})
          </button>
          <button
            onClick={() => setFilterTab('completed')}
            className={`px-3 py-1.5 font-semibold rounded-lg transition ${
              filterTab === 'completed'
                ? 'bg-teal-50 text-teal-700 shadow-2xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Completed & Reviewed ({userSessions.filter((s) => s.status === 'completed').length})
          </button>
          <button
            onClick={() => setFilterTab('cancelled_noshow')}
            className={`px-3 py-1.5 font-semibold rounded-lg transition ${
              filterTab === 'cancelled_noshow'
                ? 'bg-slate-100 text-slate-700 shadow-2xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Cancelled & No-Shows ({userSessions.filter((s) => s.status === 'no_show' || s.status === 'cancelled').length})
          </button>
        </div>
      </div>

      {/* Sessions Grid */}
      {displayedSessions.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Clock className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">
            No {filterTab.replace('_', ' / ')} sessions found
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {filterTab === 'upcoming'
              ? 'You have no pending upcoming tutoring sessions. Find a tutor or negotiate in chat to schedule one.'
              : 'Past sessions and completed evaluations will show up here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedSessions.map((sess) => {
            const isUserLearner = sess.learnerId === currentUser.id;
            const isUserTutor = sess.tutorId === currentUser.id;
            const partnerName = isUserLearner ? sess.tutorName : sess.learnerName;
            const partnerAvatar = isUserLearner ? sess.tutorAvatar : sess.learnerAvatar;
            const partnerId = isUserLearner ? sess.tutorId : sess.learnerId;

            return (
              <div
                key={sess.id}
                className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition p-5 shadow-xs"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left Info */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <img
                      src={partnerAvatar}
                      alt={partnerName}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 text-sm font-mono">{sess.courseCode}</span>
                        <span className="text-xs text-slate-600 font-medium truncate">• {sess.courseTitle}</span>
                        <span
                          className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md ${
                            sess.mode === 'online'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : sess.mode === 'offline'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-purple-50 text-purple-700 border border-purple-200'
                          }`}
                        >
                          {sess.mode}
                        </span>

                        {sess.isGroup && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 bg-amber-50 text-amber-700 rounded-md border border-amber-200 flex items-center gap-1">
                            <Users className="w-3 h-3" /> Group Pricing ({sess.groupStudentCount || 2} students) (#32)
                          </span>
                        )}

                        <span
                          className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md ${
                            sess.status === 'pending_confirmation'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : sess.status === 'upcoming'
                              ? 'bg-teal-50 text-teal-700 border border-teal-200'
                              : sess.status === 'completed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : sess.status === 'cancelled'
                              ? 'bg-slate-100 text-slate-600 border border-slate-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {sess.status === 'no_show'
                            ? 'No-Show Striked (#27)'
                            : sess.status === 'pending_confirmation'
                            ? 'Pending Confirmation (Step 8)'
                            : sess.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 mt-1">
                        Topic: <strong className="text-slate-900">{sess.topic}</strong>
                      </p>

                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-2 flex-wrap">
                        <span className="flex items-center gap-1 font-semibold text-slate-800">
                          <Clock className="w-3.5 h-3.5 text-teal-600" />
                          {new Date(sess.scheduledTime).toLocaleString([], {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <span>•</span>
                        <span className="font-mono text-slate-700">Duration: {sess.duration}</span>
                        <span>•</span>
                        <span className="font-semibold text-slate-800">
                          {sess.paymentType === 'free' ? (
                            <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-medium">
                              Free Community Peer Session (#30)
                            </span>
                          ) : (
                            <span>
                              {sess.price} BDT ({sess.rateType})
                              {sess.isGroup && sess.groupPricePerStudent && (
                                <span className="text-slate-500 font-normal ml-1">
                                  ({sess.groupPricePerStudent} BDT/student)
                                </span>
                              )}
                            </span>
                          )}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-2 flex-wrap">
                        <span className="flex items-center gap-1">
                          {sess.mode === 'online' ? (
                            <Video className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          ) : (
                            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          )}
                          <span className="font-medium text-slate-700">{sess.meetingDetails}</span>
                        </span>

                        {/* Reminder Status Badge (#38) */}
                        {sess.status === 'upcoming' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                            <Bell className="w-3 h-3 text-teal-600" />
                            {sess.reminderSent ? 'Reminder Dispatched' : 'Reminder Armed (15m prior) (#38)'}
                          </span>
                        )}

                        {sess.status === 'pending_confirmation' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
                            Booking Request Forwarded to Tutor
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions depending on status */}
                  <div className="flex flex-col sm:items-end justify-center gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    {sess.status === 'pending_confirmation' && (
                      <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
                        {isUserTutor ? (
                          <>
                            <span className="text-[11px] text-amber-800 font-semibold flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-amber-600" />
                              Student Booking Request Received from {sess.learnerName}
                            </span>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <button
                                onClick={() => confirmBooking(sess.id)}
                                className="px-3.5 py-1.5 text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg shadow-2xs transition flex items-center gap-1 cursor-pointer"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>Accept & Confirm Session</span>
                              </button>
                              <button
                                onClick={() => declineBooking(sess.id, 'Schedule conflict')}
                                className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition cursor-pointer"
                              >
                                Decline
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <span className="text-[11px] text-amber-800 font-semibold flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                              <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                              Awaiting Tutor Confirmation ({sess.tutorName} must accept)
                            </span>
                            <button
                              onClick={() => cancelSession(sess.id, 'Student cancelled pending request')}
                              className="px-2.5 py-1 text-xs text-rose-600 hover:text-rose-800 hover:bg-rose-50 border border-rose-200 rounded-lg transition"
                            >
                              Cancel Request
                            </button>
                          </>
                        )}
                      </div>
                    )}
                    {sess.status === 'upcoming' && (
                      <>
                        <button
                          onClick={() => markSessionCompleted(sess.id)}
                          className="w-full sm:w-auto px-4 py-2 text-xs font-semibold bg-teal-600 text-white hover:bg-teal-700 rounded-lg shadow-2xs transition flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Mark as Completed</span>
                        </button>

                        <div className="flex items-center gap-1.5 w-full sm:w-auto flex-wrap">
                          <button
                            onClick={() => simulateReminderNotification(sess.id)}
                            className="px-2.5 py-1.5 text-[11px] font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                            title="Send simulated reminder notification (#38)"
                          >
                            Remind (#38)
                          </button>

                          <button
                            onClick={() => setReschedulingSessionId(sess.id)}
                            className="px-2.5 py-1.5 text-[11px] font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition flex items-center gap-1"
                            title="Reschedule session and update reminders (#38)"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Reschedule</span>
                          </button>

                          <button
                            onClick={() => cancelSession(sess.id, 'User requested schedule cancellation')}
                            className="px-2.5 py-1.5 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition flex items-center gap-1"
                            title="Cancel session and disarm reminders (#38)"
                          >
                            <Ban className="w-3 h-3 text-slate-500" />
                            <span>Cancel</span>
                          </button>

                          <button
                            onClick={() => markSessionNoShow(sess.id, isUserLearner ? 'learner' : 'tutor')}
                            className="px-2.5 py-1.5 text-[11px] font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition flex items-center gap-1"
                            title="Mark No-Show: Excludes cancelled sessions & prevents duplicate strikes (#27)"
                          >
                            <AlertTriangle className="w-3 h-3 text-rose-500" />
                            <span>No-Show Strike (#27)</span>
                          </button>
                        </div>
                      </>
                    )}

                    {sess.status === 'completed' && (
                      <div className="flex flex-col sm:items-end gap-1.5">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <CheckCircle className="w-3.5 h-3.5" /> Session Completed
                        </span>
                        <div className="text-[11px] text-teal-700 font-medium">
                          +{sess.pointsAwarded || (sess.paymentType === 'free' ? 50 : 25)} Reward Points Logged (#33)
                        </div>

                        {/* Only student (learner) can submit feedback/rating for the tutor */}
                        {!sess.hasReview ? (
                          isUserLearner ? (
                            <button
                              onClick={() => {
                                setReviewSession(sess);
                                setReviewModalOpen(true);
                              }}
                              className="mt-1 px-3 py-1.5 text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 rounded-lg transition flex items-center gap-1 cursor-pointer"
                            >
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span>Leave Rating & Review for Tutor</span>
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-400 font-medium italic mt-1">
                              Awaiting Student Rating & Feedback
                            </span>
                          )
                        ) : (
                          <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 mt-1">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            {isUserLearner ? 'Your Review & Rating Submitted' : 'Student Review & Rating Received'}
                          </span>
                        )}
                      </div>
                    )}

                    {sess.status === 'cancelled' && (
                      <div className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200 max-w-xs">
                        <div className="font-semibold text-slate-700 flex items-center gap-1">
                          <Ban className="w-3.5 h-3.5 text-slate-400" /> Session Cancelled
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Reminders disarmed (#38). Excluded from strike penalties (#27).
                        </p>
                      </div>
                    )}

                    {sess.status === 'no_show' && (
                      <div className="text-xs text-rose-700 bg-rose-50 p-2.5 rounded-lg border border-rose-200 max-w-xs">
                        <div className="font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> No-Show Incident Recorded (#27)
                        </div>
                        <p className="text-[11px] text-rose-600 mt-1">
                          Strike logged on account (noShowCount: {sess.noShowCount || 1}). 3 strikes trigger administrative flag.
                        </p>
                        <button
                          onClick={() => {
                            setReportTarget({
                              userId: partnerId,
                              userName: partnerName,
                              sessionId: sess.id,
                            });
                            setReportModalOpen(true);
                          }}
                          className="mt-2 text-[11px] text-rose-800 underline font-semibold block"
                        >
                          Submit Dispute Statement to Admin Queue (#35) →
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Inline Reschedule Form (#38) */}
                {reschedulingSessionId === sess.id && (
                  <div className="mt-4 pt-3 border-t border-slate-200 bg-indigo-50/50 p-3.5 rounded-xl border border-indigo-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span className="font-bold text-indigo-900">Reschedule Session Date & Time (#38):</span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <input
                        type="date"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                      />
                      <input
                        type="time"
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                      />
                      <button
                        onClick={() => handleRescheduleSubmit(sess.id)}
                        className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
                      >
                        Save New Slot
                      </button>
                      <button
                        onClick={() => setReschedulingSessionId(null)}
                        className="px-2.5 py-1.5 text-slate-600 hover:text-slate-800"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
