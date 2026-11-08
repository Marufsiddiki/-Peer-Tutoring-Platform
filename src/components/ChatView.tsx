import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SessionDuration, DeliveryMode, RateType, PaymentPreference, TutoringSession } from '../types';
import {
  Send,
  Calendar,
  Clock,
  Sparkles,
  Users,
  Video,
  MapPin,
  CheckCircle,
  FileText,
  DollarSign,
  ChevronDown,
  ShieldAlert,
  ArrowRight,
  Star,
  Bell,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Award,
  Check,
} from 'lucide-react';

export const ChatView: React.FC = () => {
  const {
    currentUser,
    users,
    chatThreads,
    activeChatId,
    setActiveChatId,
    sendMessage,
    requestBooking,
    confirmBooking,
    declineBooking,
    confirmAvailabilityAndPrice,
    requestBookingFromChat,
    markSessionCompleted,
    simulateReminderNotification,
    sessions,
    setActiveTab,
    setReviewSession,
    setReviewModalOpen,
    setReportTarget,
    setReportModalOpen,
  } = useApp();

  const [inputText, setInputText] = useState('');
  const [showNegotiationDrawer, setShowNegotiationDrawer] = useState(false);

  // Pre-booking negotiation form state
  const [courseCode, setCourseCode] = useState('CSE 205');
  const [duration, setDuration] = useState<SessionDuration>('1 hr');
  const [mode, setMode] = useState<DeliveryMode>('hybrid');
  const [meetingLocation, setMeetingLocation] = useState('Library Study Room 402 / Google Meet');
  const [rateType, setRateType] = useState<RateType>('hourly');
  const [paymentType, setPaymentType] = useState<PaymentPreference>('paid');
  const [price, setPrice] = useState(350);
  const [isGroup, setIsGroup] = useState(false);
  const [groupPricePerStudent, setGroupPricePerStudent] = useState(250);
  const [scheduledDate, setScheduledDate] = useState('2026-10-28');
  const [scheduledTime, setScheduledTime] = useState('16:00');

  // Active thread
  const activeThread =
    chatThreads.find((ct) => ct.id === activeChatId) || chatThreads[0];

  const partnerId =
    activeThread?.learnerId === currentUser.id
      ? activeThread.tutorId
      : activeThread?.learnerId;
  const partnerUser = users.find((u) => u.id === partnerId);
  const partnerName =
    activeThread?.learnerId === currentUser.id
      ? activeThread.tutorName
      : activeThread?.learnerName;
  const partnerAvatar =
    activeThread?.learnerId === currentUser.id
      ? activeThread.tutorAvatar
      : activeThread?.learnerAvatar;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeThread) return;
    sendMessage(activeThread.id, inputText.trim());
    setInputText('');
  };

  const handleSendProposal = (confirmImmediately: boolean = false) => {
    if (!activeThread) return;
    const combinedIsoTime = new Date(`${scheduledDate}T${scheduledTime}:00`).toISOString();

    const proposal = {
      proposalId: `prop-${Date.now()}`,
      courseCode,
      duration,
      mode,
      rateType,
      price: paymentType === 'free' ? 0 : price,
      paymentType,
      isGroup,
      groupPricePerStudent: isGroup ? groupPricePerStudent : undefined,
      scheduledTime: combinedIsoTime,
      meetingLocation,
      status: confirmImmediately ? ('availability_confirmed' as const) : ('negotiating' as const),
      confirmedByTutor: confirmImmediately,
    };

    sendMessage(
      activeThread.id,
      confirmImmediately
        ? `[Tutor Confirmed Availability & Price]: ${courseCode} (${duration}, ${mode}) on ${new Date(combinedIsoTime).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} at ${
            paymentType === 'free' ? 'Free Community Mentorship' : `${price} BDT (${rateType})`
          }. Ready for session booking request.`
        : `Proposed pre-booking terms for ${courseCode} (${duration}, ${mode}): ${
            paymentType === 'free' ? 'Free Community Peer Session' : `${price} BDT (${rateType})`
          }.`,
      true,
      proposal
    );
    setShowNegotiationDrawer(false);
  };

  const handleAcceptProposalAndBook = (details: NonNullable<typeof activeThread.messages[0]['proposalDetails']>) => {
    if (!activeThread) return;

    const isLearner = currentUser.id === activeThread.learnerId;
    const tutorId = isLearner ? activeThread.tutorId : currentUser.id;
    const tutorName = isLearner ? activeThread.tutorName : currentUser.name;
    const tutorAvatar = isLearner ? activeThread.tutorAvatar : currentUser.avatar;

    const learnerId = isLearner ? currentUser.id : activeThread.learnerId;
    const learnerName = isLearner ? currentUser.name : activeThread.learnerName;
    const learnerAvatar = isLearner ? currentUser.avatar : activeThread.learnerAvatar;

    requestBooking({
      learnerId,
      learnerName,
      learnerAvatar,
      tutorId,
      tutorName,
      tutorAvatar,
      courseCode: details.courseCode,
      courseTitle: details.courseCode + ' Peer Mentorship',
      topic: 'Pre-negotiated peer study session',
      mode: details.mode,
      meetingDetails: details.meetingLocation,
      duration: details.duration,
      scheduledTime: details.scheduledTime,
      rateType: details.rateType,
      price: details.price,
      paymentType: details.paymentType,
      isGroup: details.isGroup,
      groupPricePerStudent: details.groupPricePerStudent,
    });
  };

  if (!activeThread) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <p className="text-sm text-slate-500">No active chat threads found. Start a conversation from the tutor directory!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col md:flex-row h-[750px]">
      {/* Left Column: Chat Threads List */}
      <div className="w-full md:w-80 border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-200 bg-slate-50/70">
          <h2 className="font-bold text-sm text-slate-900">Pre-booking & Private Messages</h2>
          <p className="text-[11px] text-slate-500 mt-0.5">Discuss schedule, syllabus & negotiate rates</p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {chatThreads.map((thread) => {
            const isUserLearner = thread.learnerId === currentUser.id;
            const pName = isUserLearner ? thread.tutorName : thread.learnerName;
            const pAvatar = isUserLearner ? thread.tutorAvatar : thread.learnerAvatar;
            const isSelected = thread.id === activeThread.id;

            return (
              <div
                key={thread.id}
                onClick={() => setActiveChatId(thread.id)}
                className={`p-3.5 cursor-pointer transition flex items-start gap-3 ${
                  isSelected ? 'bg-teal-50/60 border-l-4 border-l-teal-600' : 'hover:bg-slate-50'
                }`}
              >
                <img
                  src={pAvatar}
                  alt={pName}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div className="min-w-0 flex-1 text-xs">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-bold text-slate-900 truncate">{pName}</span>
                    <span className="text-[10px] text-slate-400 shrink-0">{thread.lastMessageTime}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded inline-block mb-1">
                    {thread.courseCode}
                  </span>
                  <p className="text-[11px] text-slate-500 truncate">{thread.lastMessage}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: Active Conversation & Negotiation Panel */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50/40">
        {/* Chat Header */}
        <div className="p-3.5 bg-white border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={partnerAvatar}
              alt={partnerName}
              className="w-10 h-10 rounded-xl object-cover border border-slate-200"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-900">{partnerName}</h3>
                {partnerUser?.institutionalEmailVerified && (
                  <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200">
                    Verified
                  </span>
                )}
                {partnerUser?.strikes ? (
                  <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded">
                    {partnerUser.strikes} Strike
                  </span>
                ) : null}
              </div>
              <div className="text-xs text-slate-500">
                {partnerUser?.department} • <span className="font-medium text-slate-700">{partnerUser?.batch}</span> • Course: <strong className="text-slate-800">{activeThread.courseCode}</strong>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Negotiation Tool Toggle Button */}
            <button
              onClick={() => setShowNegotiationDrawer(!showNegotiationDrawer)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100 transition shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>{showNegotiationDrawer ? 'Hide Negotiation Panel' : 'Pre-Booking Negotiation'}</span>
            </button>

            {/* Safety / Dispute Report Button */}
            <button
              onClick={() => {
                if (partnerUser) {
                  setReportTarget({
                    userId: partnerUser.id,
                    userName: partnerUser.name,
                  });
                  setReportModalOpen(true);
                }
              }}
              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
              title="Report user dispute or misconduct to admin"
            >
              <ShieldAlert className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Embedded Pre-booking Negotiation Panel (Collapsible Drawer) */}
        {showNegotiationDrawer && (
          <div className="bg-white border-b border-slate-200 p-4 shadow-sm animate-fadeIn">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-teal-600" />
                  Pre-Booking Negotiation & Term Setting
                </h4>
                <p className="text-[11px] text-slate-500">
                  Agree on session duration presets, rate type, online/hybrid delivery and group discount before booking.
                </p>
              </div>
              <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                Mutual Hand-off
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
              {/* Course Code */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Course Code</label>
                <input
                  type="text"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white"
                />
              </div>

              {/* Duration Preset Dropdown */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Duration Preset
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value as SessionDuration)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                >
                  <option value="30 min">30 min (Quick doubts)</option>
                  <option value="1 hr">1 hr (Standard)</option>
                  <option value="1.5 hr">1.5 hr (In-depth lab/theory)</option>
                  <option value="2+ hr">2+ hr (Exam prep marathon)</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>

              {/* Delivery Mode (Online/Offline/Hybrid) */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Delivery Mode</label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as DeliveryMode)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                >
                  <option value="hybrid">Hybrid (Both)</option>
                  <option value="online">Online (Google Meet)</option>
                  <option value="offline">Offline (Campus Room/Library)</option>
                </select>
              </div>

              {/* Flexible Payment Preference Toggle */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Pricing Model</label>
                <select
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value as PaymentPreference)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                >
                  <option value="paid">Paid</option>
                  <option value="free">Free (Community Points)</option>
                  <option value="negotiable">Negotiable</option>
                </select>
              </div>

              {/* Rate Type Options (Hourly / Fixed / Package) */}
              {paymentType !== 'free' && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Rate Type</label>
                  <select
                    value={rateType}
                    onChange={(e) => setRateType(e.target.value as RateType)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="hourly">Hourly Rate</option>
                    <option value="fixed">Fixed Rate</option>
                    <option value="package">Package / Multi-Session</option>
                  </select>
                </div>
              )}

              {/* Price Field */}
              {paymentType !== 'free' && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Amount (BDT)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                  />
                </div>
              )}

              {/* Date & Time Picker */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Date</label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Time</label>
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                />
              </div>
            </div>

            {/* Group Session Discounted Pricing Field */}
            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                <input
                  type="checkbox"
                  checked={isGroup}
                  onChange={(e) => setIsGroup(e.target.checked)}
                  className="rounded text-teal-600 w-3.5 h-3.5"
                />
                <span>Group Session Discounted Pricing (2+ students)</span>
              </label>

              {isGroup && (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500">Discounted rate per student:</span>
                  <input
                    type="number"
                    value={groupPricePerStudent}
                    onChange={(e) => setGroupPricePerStudent(Number(e.target.value))}
                    className="w-24 px-2 py-1 text-xs border border-slate-200 rounded-md"
                  />
                  <span className="text-[11px] text-slate-500">BDT</span>
                </div>
              )}

              <div className="flex items-center gap-2 ml-auto flex-wrap">
                <button
                  type="button"
                  onClick={() => setShowNegotiationDrawer(false)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSendProposal(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300 rounded-lg shadow-2xs transition"
                >
                  Post Terms (Negotiate)
                </button>
                <button
                  type="button"
                  onClick={() => handleSendProposal(true)}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-teal-600 text-white hover:bg-teal-700 rounded-lg shadow-2xs transition flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Confirm Availability & Post</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sequence Diagram Visual Lifecycle Tracker */}
        <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between text-[11px] overflow-x-auto shadow-2xs">
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-bold text-slate-800 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Sequence Flow:
            </span>
            <div className="flex items-center gap-1 font-medium text-slate-600">
              <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-800 font-semibold border border-teal-200">
                1. Chat & Negotiate
              </span>
              <span>→</span>
              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-semibold border border-blue-200">
                2. Confirm Availability & Price
              </span>
              <span>→</span>
              <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-semibold border border-amber-200">
                3. Request Booking
              </span>
              <span>→</span>
              <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 font-semibold border border-indigo-200">
                4. Forward Request
              </span>
              <span>→</span>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                5. Confirm Session
              </span>
              <span>→</span>
              <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-800 font-semibold border border-teal-200">
                6. Confirmed + Reminder
              </span>
              <span>→</span>
              <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-800 font-semibold border border-purple-200">
                7. Review & Leaderboard
              </span>
            </div>
          </div>
        </div>

        {/* Message Thread History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeThread.messages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 max-w-[85%] ${
                  isMe ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                <img
                  src={msg.senderAvatar}
                  alt={msg.senderName}
                  className="w-7 h-7 rounded-lg object-cover border border-slate-200 shrink-0 mt-0.5"
                />

                <div className="space-y-1">
                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                      isMe
                        ? 'bg-teal-600 text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                    }`}
                  >
                    <p>{msg.text}</p>

                    {/* Pre-booking Proposal Interactive Card according to Sequence Diagram */}
                    {msg.isOfferProposal && msg.proposalDetails && (() => {
                      const details = msg.proposalDetails;
                      const isLearner = currentUser.id === activeThread.learnerId;
                      const isTutor = currentUser.id === activeThread.tutorId;

                      // Find linked session if one was created
                      const linkedSession = details.sessionId
                        ? sessions.find((s) => s.id === details.sessionId)
                        : sessions.find(
                            (s) =>
                              (s.learnerId === activeThread.learnerId && s.tutorId === activeThread.tutorId) &&
                              s.courseCode === details.courseCode
                          );

                      const effectiveStatus = linkedSession
                        ? linkedSession.status === 'upcoming'
                          ? 'confirmed'
                          : linkedSession.status === 'completed'
                          ? 'completed'
                          : linkedSession.status === 'cancelled'
                          ? 'declined'
                          : 'booking_requested'
                        : details.status || (details.confirmedByTutor ? 'availability_confirmed' : 'negotiating');

                      const isConfirmed = effectiveStatus === 'confirmed';
                      const isCompleted = effectiveStatus === 'completed';
                      const isRequested = effectiveStatus === 'booking_requested';
                      const isDeclined = effectiveStatus === 'declined';
                      const isAvailabilityConfirmed = details.confirmedByTutor || effectiveStatus === 'availability_confirmed' || isRequested || isConfirmed || isCompleted;

                      return (
                        <div
                          className={`mt-3 p-3.5 rounded-xl border text-xs shadow-2xs transition ${
                            isCompleted
                              ? 'bg-purple-900/90 text-white border-purple-400'
                              : isConfirmed
                              ? 'bg-emerald-900/90 text-white border-emerald-400'
                              : isRequested
                              ? 'bg-amber-900/90 text-white border-amber-400'
                              : isMe
                              ? 'bg-teal-700/80 border-teal-500 text-white'
                              : 'bg-white border-teal-400 text-slate-900'
                          }`}
                        >
                          {/* Header & Sequence Step Badge */}
                          <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/20">
                            <div className="flex items-center gap-1.5 font-bold">
                              <Sparkles className="w-4 h-4 text-amber-300" />
                              <span>Negotiated Session Proposal</span>
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider bg-white/20 backdrop-blur-xs">
                              {isCompleted
                                ? 'Completed & Reviewed'
                                : isConfirmed
                                ? 'Confirmed + Reminder'
                                : isRequested
                                ? 'Booking Requested'
                                : isAvailabilityConfirmed
                                ? 'Availability Confirmed'
                                : 'Negotiating Terms'}
                            </span>
                          </div>

                          {/* Sequence Progress Bar Mini */}
                          <div className="mb-3 py-1.5 px-2 bg-black/20 rounded-lg text-[10px] flex items-center justify-between overflow-x-auto gap-1">
                            <span className={`px-1.5 py-0.5 rounded font-semibold shrink-0 ${!isAvailabilityConfirmed ? 'bg-amber-400 text-slate-900 font-bold' : 'text-white/70'}`}>
                              1. Negotiate
                            </span>
                            <span>→</span>
                            <span className={`px-1.5 py-0.5 rounded font-semibold shrink-0 ${isAvailabilityConfirmed && !isRequested && !isConfirmed && !isCompleted ? 'bg-amber-400 text-slate-900 font-bold' : isAvailabilityConfirmed ? 'text-emerald-300' : 'text-white/40'}`}>
                              2. Availability & Price
                            </span>
                            <span>→</span>
                            <span className={`px-1.5 py-0.5 rounded font-semibold shrink-0 ${isRequested ? 'bg-amber-400 text-slate-900 font-bold' : isConfirmed || isCompleted ? 'text-emerald-300' : 'text-white/40'}`}>
                              3. Forward Request
                            </span>
                            <span>→</span>
                            <span className={`px-1.5 py-0.5 rounded font-semibold shrink-0 ${isConfirmed ? 'bg-emerald-400 text-slate-900 font-bold' : isCompleted ? 'text-emerald-300' : 'text-white/40'}`}>
                              4. Confirm + Reminder
                            </span>
                            <span>→</span>
                            <span className={`px-1.5 py-0.5 rounded font-semibold shrink-0 ${isCompleted ? 'bg-purple-300 text-purple-950 font-bold' : 'text-white/40'}`}>
                              5. Review
                            </span>
                          </div>

                          {/* Session Details */}
                          <div className="space-y-1 text-[11px] leading-relaxed">
                            <div className="flex items-center justify-between">
                              <span><strong>Course:</strong> {details.courseCode} ({details.duration})</span>
                              <span className="px-1.5 py-0.2 bg-white/20 rounded text-[10px] uppercase font-semibold">{details.mode}</span>
                            </div>
                            <div>
                              <strong>Pricing:</strong>{' '}
                              {details.paymentType === 'free'
                                ? 'Free Community Mentorship (+50 Community Pts)'
                                : `${details.price} BDT (${details.rateType})`}
                              {details.isGroup && (
                                <span className="ml-1 text-emerald-200 font-medium">
                                  • Group Rate: {details.groupPricePerStudent} BDT/student
                                </span>
                              )}
                            </div>
                            <div>
                              <strong>Scheduled Slot:</strong>{' '}
                              {new Date(details.scheduledTime).toLocaleString([], {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                            <div>
                              <strong>Location / Meeting:</strong> {details.meetingLocation}
                            </div>
                          </div>

                          {/* Sequence Diagram Interactive Actions */}
                          <div className="mt-3 pt-2.5 border-t border-white/20">
                            {/* Step 6: Confirm Availability & Price */}
                            {!isAvailabilityConfirmed && (
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <span className="text-[11px] opacity-90">
                                  {isTutor
                                    ? 'Confirm your availability & pricing to allow student to book:'
                                    : 'Awaiting tutor to confirm availability & pricing terms.'}
                                </span>
                                <button
                                  onClick={() => confirmAvailabilityAndPrice(activeThread.id, msg.id)}
                                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-teal-800 hover:bg-teal-50 shadow-xs transition flex items-center gap-1 self-start sm:self-auto"
                                >
                                  <Check className="w-3.5 h-3.5 text-teal-700" />
                                  <span>Confirm Availability & Price (Step 6)</span>
                                </button>
                              </div>
                            )}

                            {/* Step 7: Request Session Booking */}
                            {isAvailabilityConfirmed && !isRequested && !isConfirmed && !isCompleted && !isDeclined && (
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div className="text-[11px] text-emerald-200 flex items-center gap-1 font-medium">
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  <span>Availability & Price Confirmed!</span>
                                </div>
                                <button
                                  onClick={() => requestBookingFromChat(activeThread.id, msg.id, details)}
                                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-white text-teal-800 hover:bg-teal-50 shadow-xs transition flex items-center gap-1.5 self-start sm:self-auto"
                                >
                                  <span>Request Session Booking (Step 7)</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}

                            {/* Step 8 & 9: Forward Request & Tutor Confirm Session */}
                            {isRequested && (
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-[11px] font-medium text-amber-200 flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5 animate-pulse" />
                                    Request Forwarded to Booking System & Tutor (Step 8)
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 flex-wrap pt-1">
                                  <button
                                    onClick={() => confirmBooking(details.sessionId || linkedSession?.id || '')}
                                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs transition flex items-center gap-1"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Confirm Session (Step 9)</span>
                                  </button>
                                  <button
                                    onClick={() => declineBooking(details.sessionId || linkedSession?.id || '', 'Schedule conflict')}
                                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/20 hover:bg-white/30 text-white transition"
                                  >
                                    Decline
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Step 10: Confirmed + Reminder Sent */}
                            {isConfirmed && (
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-[11px] font-bold text-emerald-200 flex items-center gap-1.5">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                                    Confirmed + Reminder Sent (Step 10)
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 flex-wrap pt-1">
                                  <button
                                    onClick={() => setActiveTab('sessions')}
                                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-emerald-900 hover:bg-emerald-50 shadow-xs transition flex items-center gap-1"
                                  >
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>View in Sessions</span>
                                  </button>
                                  <button
                                    onClick={() => simulateReminderNotification(details.sessionId || linkedSession?.id)}
                                    className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-emerald-700/80 hover:bg-emerald-600 text-white border border-emerald-400/50 transition flex items-center gap-1"
                                    title="Send test reminder notification"
                                  >
                                    <Bell className="w-3.5 h-3.5 text-amber-300" />
                                    <span>Test Reminder</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      const sId = details.sessionId || linkedSession?.id;
                                      if (sId) markSessionCompleted(sId);
                                    }}
                                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-500 hover:bg-purple-600 text-white shadow-xs transition flex items-center gap-1 ml-auto"
                                  >
                                    <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                                    <span>Complete & Review (Step 11)</span>
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Step 11 & 12: Completed & Review */}
                            {isCompleted && (
                              <div className="flex items-center justify-between flex-wrap gap-2">
                                <span className="text-[11px] font-bold text-purple-200 flex items-center gap-1.5">
                                  <Award className="w-4 h-4 text-amber-300" />
                                  Step 12: Rating, Badge & Leaderboard Updated
                                </span>
                                <button
                                  onClick={() => {
                                    if (linkedSession) {
                                      setReviewSession(linkedSession);
                                      setReviewModalOpen(true);
                                    }
                                  }}
                                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-white text-purple-950 hover:bg-purple-50 transition"
                                >
                                  {linkedSession?.hasReview ? 'Review Submitted ⭐' : 'Submit Rating & Review'}
                                </button>
                              </div>
                            )}

                            {isDeclined && (
                              <div className="text-[11px] text-rose-200 font-medium">
                                Booking request was declined. Please propose an alternative slot above.
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  <div
                    className={`text-[10px] text-slate-400 px-1 font-mono ${
                      isMe ? 'text-right' : 'text-left'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Chat Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            placeholder={`Message ${partnerName}... (discuss schedule, syllabus, or propose prices)`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 rounded-xl bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
