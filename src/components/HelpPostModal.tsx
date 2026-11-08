import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Sparkles, Clock, DollarSign, BookOpen } from 'lucide-react';
import { DeliveryMode, SessionDuration, PaymentPreference } from '../types';

export const HelpPostModal: React.FC = () => {
  const { helpPostModalOpen, setHelpPostModalOpen, createHelpPost } = useApp();

  const [courseCode, setCourseCode] = useState('');
  const [courseTitle, setCourseTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [preferredMode, setPreferredMode] = useState<DeliveryMode>('hybrid');
  const [preferredDuration, setPreferredDuration] = useState<SessionDuration>('1 hr');
  const [budgetType, setBudgetType] = useState<PaymentPreference>('negotiable');
  const [budgetAmount, setBudgetAmount] = useState<number>(300);
  const [preferredSchedule, setPreferredSchedule] = useState('');

  if (!helpPostModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseCode.trim() || !topic.trim() || !description.trim()) return;

    createHelpPost({
      courseCode: courseCode.trim().toUpperCase(),
      courseTitle: courseTitle.trim() || `${courseCode} Mentorship`,
      topic: topic.trim(),
      description: description.trim(),
      preferredMode,
      preferredDuration,
      budgetType,
      budgetAmount: budgetType === 'free' ? 0 : budgetAmount,
      preferredSchedule: preferredSchedule.trim() || 'Flexible / After 4:00 PM',
    });

    // Reset fields
    setCourseCode('');
    setCourseTitle('');
    setTopic('');
    setDescription('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 relative bg-slate-50/50">
          <button
            onClick={() => setHelpPostModalOpen(false)}
            className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-bold text-slate-900">Create Public Help-Post</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Publish your academic question or exam prep need to the university peer tutor directory.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Course Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. CSE 205, MATH 141, EEE 163"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Course Title</label>
              <input
                type="text"
                placeholder="e.g. Data Structures & Algorithms"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Topic / Challenge Area <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. AVL Tree Rotations, Dijkstra Shortest Path, AC Phasors"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Detailed Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Describe where you are getting stuck, lab assignment questions, or upcoming midterm dates..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-teal-500 leading-relaxed"
              required
            />
          </div>

          {/* Session Duration Presets Dropdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Session Duration Preset
              </label>
              <select
                value={preferredDuration}
                onChange={(e) => setPreferredDuration(e.target.value as SessionDuration)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none"
              >
                <option value="30 min">30 min (Quick doubts / debug)</option>
                <option value="1 hr">1 hr (Standard class review)</option>
                <option value="1.5 hr">1.5 hr (In-depth problem solving)</option>
                <option value="2+ hr">2+ hr (Full exam crash review)</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>

            {/* Hybrid Session Support (Online/Offline/Hybrid) */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Preferred Mode
              </label>
              <select
                value={preferredMode}
                onChange={(e) => setPreferredMode(e.target.value as DeliveryMode)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none"
              >
                <option value="hybrid">Hybrid (Either Online or Library)</option>
                <option value="online">Online Only (Google Meet)</option>
                <option value="offline">Offline Only (Campus)</option>
              </select>
            </div>
          </div>

          {/* Flexible Payment Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Payment Preference
              </label>
              <select
                value={budgetType}
                onChange={(e) => setBudgetType(e.target.value as PaymentPreference)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none"
              >
                <option value="negotiable">Negotiable in Chat</option>
                <option value="free">Free (Volunteer Community Points)</option>
                <option value="paid">Paid Fixed / Hourly</option>
              </select>
            </div>

            {budgetType !== 'free' && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Budget (BDT)
                </label>
                <input
                  type="number"
                  value={budgetAmount}
                  onChange={(e) => setBudgetAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none"
                  placeholder="e.g. 300"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Preferred Schedule / Times
            </label>
            <input
              type="text"
              placeholder="e.g. Weekday evenings after 4:00 PM or Saturday morning"
              value={preferredSchedule}
              onChange={(e) => setPreferredSchedule(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setHelpPostModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-teal-600 text-white hover:bg-teal-700 rounded-lg shadow-2xs transition"
            >
              Publish Help-Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
