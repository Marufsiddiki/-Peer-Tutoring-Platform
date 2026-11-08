import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Star,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Video,
  Calendar,
  BookOpen,
  MessageSquare,
  Award,
  Sparkles,
  Users,
} from 'lucide-react';

export const TutorPortfolioModal: React.FC = () => {
  const {
    selectedTutor,
    setSelectedTutor,
    startChatWithTutor,
    getBatchRelation,
    setScheduleMatchTutor,
    setScheduleMatchModalOpen,
    setVideoToPlay,
    setVideoPlayerModalOpen,
    setBookingPreset,
    setBookingModalOpen,
  } = useApp();

  if (!selectedTutor) return null;

  const relation = getBatchRelation(selectedTutor);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 relative bg-slate-50/50">
          <button
            onClick={() => setSelectedTutor(null)}
            className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4">
            <img
              src={selectedTutor.avatar}
              alt={selectedTutor.name}
              className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-2xs"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-slate-900">{selectedTutor.name}</h2>
                <span
                  className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md ${
                    relation === 'senior'
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : relation === 'batchmate'
                      ? 'bg-teal-50 text-teal-700 border border-teal-200'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {relation}
                </span>
                {selectedTutor.institutionalEmailVerified && (
                  <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Email Verified
                  </span>
                )}
                {selectedTutor.studentIdVerification === 'verified' && (
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    ID Verified
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-500 mt-1">
                {selectedTutor.department} • <strong className="text-slate-700">{selectedTutor.batch}</strong> ({selectedTutor.levelTerm}) • Student ID: <span className="font-mono text-slate-600">{selectedTutor.studentId}</span>
              </p>

              <div className="flex items-center gap-3 mt-2 text-xs">
                <span className="font-bold text-amber-600 flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  {selectedTutor.rating} ({selectedTutor.ratingCount} reviews)
                </span>
                <span className="text-slate-300">•</span>
                <span className="font-semibold text-slate-700 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-teal-600" />
                  {selectedTutor.teachingHours} Hours Taught
                </span>
                <span className="text-slate-300">•</span>
                <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                  {selectedTutor.points} Reward Points
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-xs">
          {/* Bio */}
          <div>
            <h3 className="font-bold text-slate-900 mb-1">About & Teaching Style</h3>
            <p className="text-slate-600 leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-100">
              {selectedTutor.bio}
            </p>
          </div>

          {/* Pricing & Formats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
            <div>
              <div className="font-bold text-slate-900 text-sm">
                {selectedTutor.paymentPreference === 'free' ? 'Free Mentorship' : `${selectedTutor.hourlyRate} BDT/hr`}
              </div>
              <div className="text-[10px] text-slate-500 uppercase mt-0.5">Pricing Model</div>
            </div>
            <div>
              <div className="font-bold text-slate-900 capitalize text-sm">{selectedTutor.rateType}</div>
              <div className="text-[10px] text-slate-500 uppercase mt-0.5">Rate Format</div>
            </div>
            <div>
              <div className="font-bold text-slate-900 capitalize text-sm">{selectedTutor.deliveryMode}</div>
              <div className="text-[10px] text-slate-500 uppercase mt-0.5">Session Mode</div>
            </div>
            <div>
              <div className="font-bold text-teal-700 text-sm">{selectedTutor.groupDiscountPercent}% Off</div>
              <div className="text-[10px] text-slate-500 uppercase mt-0.5">Group Discount</div>
            </div>
          </div>

          {/* Featured Demo Video */}
          {selectedTutor.demoVideo && (
            <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{selectedTutor.demoVideo.title}</h4>
                  <div className="text-[11px] text-slate-500">
                    Topic: {selectedTutor.demoVideo.topic} • Duration: {selectedTutor.demoVideo.duration}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setVideoToPlay(selectedTutor.demoVideo!);
                  setVideoPlayerModalOpen(true);
                }}
                className="px-3 py-1.5 text-xs font-semibold bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition shrink-0 ml-2 shadow-2xs"
              >
                Watch Demo
              </button>
            </div>
          )}

          {/* Courses Taught */}
          <div>
            <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-teal-600" />
              Courses Offered
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedTutor.coursesTaught.map((c, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-white border border-slate-200 text-slate-800 rounded-lg font-medium shadow-2xs"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Availability Overview & Schedule Match Button */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="font-bold text-slate-900 flex items-center gap-1">
                <Calendar className="w-4 h-4 text-teal-600" />
                Weekly Free Windows
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {selectedTutor.availability?.map((a) => `${a.day} (${a.timeSlots.join(', ')})`).join(' • ') || 'Flexible scheduling'}
              </p>
            </div>
            <button
              onClick={() => {
                setScheduleMatchTutor(selectedTutor);
                setScheduleMatchModalOpen(true);
              }}
              className="px-3 py-1.5 text-xs font-semibold text-teal-700 bg-white border border-teal-200 hover:bg-teal-50 rounded-lg transition shrink-0"
            >
              Check Overlap
            </button>
          </div>

          {/* Reviews List */}
          <div>
            <h3 className="font-bold text-slate-900 mb-2">
              Verified Student Reviews ({selectedTutor.reviews.length})
            </h3>
            {selectedTutor.reviews.length === 0 ? (
              <p className="text-slate-400 text-xs italic">No reviews yet for this tutor.</p>
            ) : (
              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {selectedTutor.reviews.map((r) => (
                  <div key={r.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <img src={r.reviewerAvatar} alt={r.reviewerName} className="w-5 h-5 rounded-md object-cover" />
                        <span className="font-bold text-slate-800">{r.reviewerName}</span>
                        <span className="text-[10px] text-slate-400">({r.courseCode})</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500 font-semibold text-[11px]">
                        <Star className="w-3 h-3 fill-amber-400" />
                        {r.rating}.0
                      </div>
                    </div>
                    <p className="text-slate-600 text-[11px]">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={() => setSelectedTutor(null)}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedTutor(null);
                startChatWithTutor(selectedTutor.id);
              }}
              className="px-4 py-2 text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg transition flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat & Negotiate</span>
            </button>

            <button
              onClick={() => {
                const course = selectedTutor.coursesTaught[0]?.split(':')[0] || 'CSE 205';
                setBookingPreset({
                  tutorId: selectedTutor.id,
                  tutorName: selectedTutor.name,
                  tutorAvatar: selectedTutor.avatar,
                  courseCode: course,
                  rateType: selectedTutor.rateType,
                  price: selectedTutor.paymentPreference === 'free' ? 0 : selectedTutor.hourlyRate,
                  paymentType: selectedTutor.paymentPreference,
                  mode: selectedTutor.deliveryMode,
                });
                setSelectedTutor(null);
                setBookingModalOpen(true);
              }}
              className="px-4 py-2 text-xs font-semibold bg-teal-600 text-white hover:bg-teal-700 rounded-lg shadow-2xs transition"
            >
              Request Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
