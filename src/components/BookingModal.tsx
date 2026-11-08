import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Calendar, Clock, DollarSign, Users, Video, MapPin, CheckCircle, Package, AlertCircle } from 'lucide-react';
import { DeliveryMode, SessionDuration, RateType, PaymentPreference, PackageRateOption } from '../types';

export const BookingModal: React.FC = () => {
  const {
    bookingModalOpen,
    setBookingModalOpen,
    bookingPreset,
    currentUser,
    users,
    bookSession,
    requestBooking,
    calculatePrice,
    setActiveTab,
  } = useApp();

  const [tutorId, setTutorId] = useState('user-ayesha');
  const [courseCode, setCourseCode] = useState('CSE 205');
  const [topic, setTopic] = useState('Graph Traversal and Shortest Path Analysis');
  const [mode, setMode] = useState<DeliveryMode>('hybrid');
  const [meetingDetails, setMeetingDetails] = useState('Library Study Room 402 / Google Meet');
  const [duration, setDuration] = useState<SessionDuration>('1 hr');
  const [rateType, setRateType] = useState<RateType>('hourly');
  const [paymentType, setPaymentType] = useState<PaymentPreference>('paid');
  const [price, setPrice] = useState(350);
  const [selectedPackage, setSelectedPackage] = useState<PackageRateOption | null>(null);
  const [isGroup, setIsGroup] = useState(false);
  const [groupStudentCount, setGroupStudentCount] = useState(2);
  const [groupDiscountPercent, setGroupDiscountPercent] = useState(25);
  const [scheduledDate, setScheduledDate] = useState('2026-10-28');
  const [scheduledTime, setScheduledTime] = useState('16:00');
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Load presets if provided
  useEffect(() => {
    if (bookingPreset) {
      if (bookingPreset.tutorId) setTutorId(bookingPreset.tutorId);
      if (bookingPreset.courseCode) setCourseCode(bookingPreset.courseCode);
      if (bookingPreset.mode) setMode(bookingPreset.mode);
      if (bookingPreset.rateType) setRateType(bookingPreset.rateType);
      if (bookingPreset.price !== undefined) setPrice(bookingPreset.price);
      if (bookingPreset.paymentType) setPaymentType(bookingPreset.paymentType);
      if (bookingPreset.duration) setDuration(bookingPreset.duration);
    }
  }, [bookingPreset]);

  if (!bookingModalOpen) return null;

  const targetTutor = users.find((u) => u.id === tutorId) || users[1];

  // Dynamic price calculation (#32 & #31)
  const priceResult = calculatePrice({
    hourlyRate: targetTutor.hourlyRate || 300,
    duration,
    rateType,
    isGroup,
    studentCount: groupStudentCount,
    groupDiscountPercent,
    packagePrice: selectedPackage?.totalPrice,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError(null);

    const scheduledIso = new Date(`${scheduledDate}T${scheduledTime}:00`).toISOString();

    const result = requestBooking({
      learnerId: currentUser.id,
      learnerName: currentUser.name,
      learnerAvatar: currentUser.avatar,
      tutorId: targetTutor.id,
      tutorName: targetTutor.name,
      tutorAvatar: targetTutor.avatar,
      courseCode,
      courseTitle: `${courseCode} Peer Mentorship`,
      topic: selectedPackage ? `[${selectedPackage.packageTitle}] ${topic}` : topic || 'Peer tutoring session',
      mode,
      meetingDetails: meetingDetails || (mode === 'online' ? 'Google Meet: https://meet.google.com/xyz-tut' : 'Campus Library Study Room'),
      duration,
      scheduledTime: scheduledIso,
      rateType,
      price: paymentType === 'free' ? 0 : priceResult.totalPrice,
      paymentType,
      isGroup,
      groupStudentCount: isGroup ? groupStudentCount : undefined,
      groupPricePerStudent: isGroup ? priceResult.perStudentPrice : undefined,
    });

    if (!result.success && result.error) {
      setBookingError(result.error);
    } else {
      setActiveTab('sessions');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 relative bg-slate-50/50">
          <button
            onClick={() => setBookingModalOpen(false)}
            className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-bold text-slate-900">Session Booking & Confirmation</h2>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-teal-100 text-teal-800 rounded-md">
              Feature #26
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure flexible payment arrangements (#30), package rate options (#31), and group pricing (#32).
          </p>
        </div>

        {/* Error notification for scheduling conflict (#26) */}
        {bookingError && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{bookingError}</div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Tutor Selection */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Select Peer Tutor</label>
            <select
              value={tutorId}
              onChange={(e) => {
                const newTutorId = e.target.value;
                setTutorId(newTutorId);
                const t = users.find((u) => u.id === newTutorId);
                if (t && t.coursesTaught[0]) {
                  setCourseCode(t.coursesTaught[0].split(':')[0]);
                  setPaymentType(t.paymentPreference);
                  setRateType(t.rateType);
                  setMode(t.deliveryMode);
                  setSelectedPackage(null);
                }
              }}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
            >
              {users
                .filter((u) => u.isTutorActive && u.id !== currentUser.id)
                .map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.department.slice(0, 20)}... • {t.batch} • {t.rating}★)
                  </option>
                ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Course Code</label>
              <input
                type="text"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-mono"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Duration Preset
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value as SessionDuration)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
              >
                <option value="30 min">30 min (Quick doubts)</option>
                <option value="1 hr">1 hr (Standard session)</option>
                <option value="1.5 hr">1.5 hr (In-depth problem solving)</option>
                <option value="2+ hr">2+ hr (Full exam review marathon)</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Topic / Agenda</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
              placeholder="e.g. Dynamic Programming, Graph Traversal, AC Circuits"
              required
            />
          </div>

          {/* Delivery Mode & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Delivery Mode</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as DeliveryMode)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
              >
                <option value="hybrid">Hybrid (Online & Campus Meetup)</option>
                <option value="online">Online (Google Meet link)</option>
                <option value="offline">Offline (Campus Room / Library)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Meeting Details / Room</label>
              <input
                type="text"
                value={meetingDetails}
                onChange={(e) => setMeetingDetails(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                placeholder="e.g. Central Library 402 or Meet URL"
              />
            </div>
          </div>

          {/* Feature #30 Flexible Payment Toggle */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-teal-600" />
                Flexible Payment Arrangement (#30)
              </span>
              <span className="text-[10px] text-slate-400 font-mono">PaymentOffer.paymentType</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setPaymentType('paid');
                }}
                className={`py-2 px-2 rounded-lg border text-center font-semibold transition ${
                  paymentType === 'paid'
                    ? 'bg-teal-600 text-white border-teal-600 shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Paid
              </button>
              <button
                type="button"
                onClick={() => {
                  setPaymentType('free');
                  setSelectedPackage(null);
                }}
                className={`py-2 px-2 rounded-lg border text-center font-semibold transition ${
                  paymentType === 'free'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Free (Community)
              </button>
              <button
                type="button"
                onClick={() => {
                  setPaymentType('negotiable');
                }}
                className={`py-2 px-2 rounded-lg border text-center font-semibold transition ${
                  paymentType === 'negotiable'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Negotiable
              </button>
            </div>

            {paymentType === 'free' ? (
              <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-800 text-[11px]">
                ✓ Free Community Session: Student pays 0 BDT. Tutor automatically earns <strong>+50 Community Points</strong> upon completion (#33).
              </div>
            ) : (
              <div className="space-y-3 pt-1">
                {/* Feature #31 Package Rate Options */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-700 flex items-center gap-1">
                      <Package className="w-3.5 h-3.5 text-teal-600" />
                      Rate Format / Package Rate Options (#31)
                    </label>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setRateType('hourly');
                        setSelectedPackage(null);
                      }}
                      className={`py-1.5 px-2 rounded-md border text-center text-[11px] font-semibold ${
                        rateType === 'hourly' && !selectedPackage
                          ? 'bg-teal-50 text-teal-800 border-teal-300'
                          : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      Hourly ({targetTutor.hourlyRate} BDT/h)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRateType('fixed');
                        setSelectedPackage(null);
                      }}
                      className={`py-1.5 px-2 rounded-md border text-center text-[11px] font-semibold ${
                        rateType === 'fixed' && !selectedPackage
                          ? 'bg-teal-50 text-teal-800 border-teal-300'
                          : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      Fixed Per Session
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRateType('package');
                        if (targetTutor.packageOffers && targetTutor.packageOffers.length > 0) {
                          setSelectedPackage(targetTutor.packageOffers[0]);
                        }
                      }}
                      className={`py-1.5 px-2 rounded-md border text-center text-[11px] font-semibold ${
                        rateType === 'package' || selectedPackage
                          ? 'bg-teal-50 text-teal-800 border-teal-300'
                          : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      Package Bundle
                    </button>
                  </div>

                  {/* Available Tutor Packages List */}
                  {targetTutor.packageOffers && targetTutor.packageOffers.length > 0 && (
                    <div className="mt-2 space-y-1.5">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Available Tutor Package Deals:
                      </div>
                      {targetTutor.packageOffers.map((pkg, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setSelectedPackage(pkg);
                            setRateType('package');
                          }}
                          className={`p-2 rounded-lg border cursor-pointer text-[11px] transition flex items-center justify-between ${
                            selectedPackage?.packageTitle === pkg.packageTitle
                              ? 'bg-teal-50 border-teal-400 shadow-2xs'
                              : 'bg-white border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <div>
                            <span className="font-bold text-slate-800">{pkg.packageTitle}</span>
                            <p className="text-[10px] text-slate-500">{pkg.description}</p>
                          </div>
                          <div className="text-right shrink-0 ml-2">
                            <span className="font-bold text-teal-700">{pkg.totalPrice} BDT</span>
                            <span className="block text-[10px] text-emerald-600 font-semibold">
                              Save {pkg.savingsPercent}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Feature #32 Group Session Discounted Pricing */}
                <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                    <input
                      type="checkbox"
                      checked={isGroup}
                      onChange={(e) => setIsGroup(e.target.checked)}
                      className="rounded text-teal-600 w-3.5 h-3.5"
                    />
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-teal-600" />
                      Group Session Discounted Pricing (#32)
                    </span>
                  </label>

                  {isGroup && (
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-1">
                          Number of Students
                        </label>
                        <input
                          type="number"
                          min={2}
                          max={6}
                          value={groupStudentCount}
                          onChange={(e) => setGroupStudentCount(Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-1">
                          Group Discount (%)
                        </label>
                        <input
                          type="number"
                          value={groupDiscountPercent}
                          onChange={(e) => setGroupDiscountPercent(Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                    </div>
                  )}

                  {/* Calculated Price Summary Breakdown (#32) */}
                  <div className="p-2 bg-slate-50 rounded border border-slate-200 flex items-center justify-between text-xs font-medium">
                    <span>
                      {isGroup
                        ? `Group Total (${groupStudentCount} students):`
                        : 'Calculated Price:'}
                    </span>
                    <div className="text-right">
                      <span className="font-bold text-slate-900 text-sm">{priceResult.totalPrice} BDT</span>
                      {isGroup && (
                        <span className="block text-[10px] text-teal-700">
                          {priceResult.perStudentPrice} BDT per student ({priceResult.discountAppliedPercent}% off)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Scheduled Date & Time (#26 & #38) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Date</label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Time</label>
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                required
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Conflict detection enabled (#26)</span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setBookingModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold bg-teal-600 text-white hover:bg-teal-700 rounded-lg shadow-2xs transition flex items-center gap-1.5"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Confirm Booking (#26)</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
