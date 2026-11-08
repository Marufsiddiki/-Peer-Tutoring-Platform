import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Calendar, Clock, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

export const ScheduleMatchModal: React.FC = () => {
  const {
    scheduleMatchModalOpen,
    setScheduleMatchModalOpen,
    scheduleMatchTutor,
    currentUser,
    startChatWithTutor,
    setBookingPreset,
    setBookingModalOpen,
  } = useApp();

  if (!scheduleMatchModalOpen || !scheduleMatchTutor) return null;

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

  // Extract learner and tutor slots
  const learnerSlots = currentUser.availability || [];
  const tutorSlots = scheduleMatchTutor.availability || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 relative bg-slate-50/50">
          <button
            onClick={() => setScheduleMatchModalOpen(false)}
            className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-bold text-slate-900">Schedule-Matching Tool</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
              Live Availability Check
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Comparing overlapping free study windows between <strong>{currentUser.name}</strong> (You) and <strong>{scheduleMatchTutor.name}</strong>.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="p-6 space-y-4 text-xs">
          <div className="flex items-center justify-between bg-teal-50/50 p-3 rounded-xl border border-teal-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="font-semibold text-teal-900">
                Overlapping slots guarantee faster booking confirmation without schedule conflicts.
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {days.map((day) => {
              const lSlot = learnerSlots.find((s) => s.day === day);
              const tSlot = tutorSlots.find((s) => s.day === day);
              const hasOverlap = !!lSlot && !!tSlot;

              if (!lSlot && !tSlot) return null;

              return (
                <div
                  key={day}
                  className={`p-4 rounded-xl border transition ${
                    hasOverlap
                      ? 'bg-teal-50/40 border-teal-300 ring-1 ring-teal-200'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      {day}
                      {hasOverlap && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-teal-700" />
                          Mutual Free Match
                        </span>
                      )}
                    </span>

                    {hasOverlap && (
                      <button
                        onClick={() => {
                          setScheduleMatchModalOpen(false);
                          setBookingPreset({
                            tutorId: scheduleMatchTutor.id,
                            tutorName: scheduleMatchTutor.name,
                            tutorAvatar: scheduleMatchTutor.avatar,
                            courseCode: scheduleMatchTutor.coursesTaught[0]?.split(':')[0] || 'CSE 205',
                            duration: '1 hr',
                            mode: scheduleMatchTutor.deliveryMode,
                            price: scheduleMatchTutor.paymentPreference === 'free' ? 0 : scheduleMatchTutor.hourlyRate,
                            paymentType: scheduleMatchTutor.paymentPreference,
                          });
                          setBookingModalOpen(true);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold bg-teal-600 text-white hover:bg-teal-700 rounded-lg shadow-2xs transition flex items-center gap-1"
                      >
                        <span>Select this Slot</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mt-2">
                    <div className="bg-white p-2.5 rounded-lg border border-slate-100">
                      <div className="text-[10px] font-semibold text-slate-400 uppercase">Your Available Times</div>
                      <div className="font-medium text-slate-700 mt-0.5">
                        {lSlot ? lSlot.timeSlots.join(', ') : <span className="text-slate-400 italic">Not available</span>}
                      </div>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-slate-100">
                      <div className="text-[10px] font-semibold text-slate-400 uppercase">{scheduleMatchTutor.name}'s Free Hours</div>
                      <div className="font-medium text-slate-700 mt-0.5">
                        {tSlot ? tSlot.timeSlots.join(', ') : <span className="text-slate-400 italic">Not available</span>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => setScheduleMatchModalOpen(false)}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
          >
            Close
          </button>

          <button
            onClick={() => {
              setScheduleMatchModalOpen(false);
              startChatWithTutor(scheduleMatchTutor.id);
            }}
            className="px-4 py-2 text-xs font-semibold bg-teal-600 text-white hover:bg-teal-700 rounded-lg shadow-2xs transition"
          >
            Open Negotiation Chat
          </button>
        </div>
      </div>
    </div>
  );
};
