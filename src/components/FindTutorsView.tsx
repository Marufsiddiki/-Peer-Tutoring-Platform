import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserProfile, BatchRelation, DeliveryMode, PaymentPreference, RateType } from '../types';
import {
  Search,
  Filter,
  Star,
  ShieldCheck,
  Clock,
  Video,
  Calendar,
  Sparkles,
  Users,
  MessageSquare,
  BookOpen,
  Award,
  Layers,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

export const FindTutorsView: React.FC = () => {
  const {
    users,
    currentUser,
    setSelectedTutor,
    startChatWithTutor,
    getBatchRelation,
    setScheduleMatchTutor,
    setScheduleMatchModalOpen,
    setVideoToPlay,
    setVideoPlayerModalOpen,
    setActiveTab,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRelation, setSelectedRelation] = useState<'all' | BatchRelation>('all');
  const [selectedMode, setSelectedMode] = useState<'all' | DeliveryMode>('all');
  const [selectedPayment, setSelectedPayment] = useState<'all' | PaymentPreference>('all');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [smartMatchesOnly, setSmartMatchesOnly] = useState(false);

  // Filter only active tutors, excluding current user
  const allTutors = users.filter((u) => u.isTutorActive && u.id !== currentUser.id);

  const filteredTutors = allTutors.filter((tutor) => {
    // Search query matches tutor name, department, bio, or courses taught
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      const matchName = tutor.name.toLowerCase().includes(q);
      const matchDept = tutor.department.toLowerCase().includes(q);
      const matchCourse = tutor.coursesTaught.some((c) => c.toLowerCase().includes(q));
      const matchBio = tutor.bio.toLowerCase().includes(q);
      if (!matchName && !matchDept && !matchCourse && !matchBio) return false;
    }

    // Relation filter (batchmate, senior, junior)
    if (selectedRelation !== 'all') {
      const rel = getBatchRelation(tutor);
      if (rel !== selectedRelation) return false;
    }

    // Delivery mode filter
    if (selectedMode !== 'all') {
      if (tutor.deliveryMode !== selectedMode && tutor.deliveryMode !== 'hybrid') return false;
    }

    // Payment preference filter
    if (selectedPayment !== 'all') {
      if (tutor.paymentPreference !== selectedPayment) return false;
    }

    // Verified badge filter
    if (onlyVerified) {
      if (!tutor.institutionalEmailVerified || tutor.studentIdVerification !== 'verified') return false;
    }

    // Smart match filter (matches user's department or courses)
    if (smartMatchesOnly) {
      const matchDept = tutor.department.toLowerCase() === currentUser.department.toLowerCase();
      const matchRating = tutor.rating >= 4.9;
      if (!matchDept && !matchRating) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {currentUser.activeRole === 'tutor' && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-indigo-900">
          <div className="flex items-center gap-2">
            <span className="font-bold">Peer Tutor Active:</span>
            <span>Looking for students seeking tutoring? Browse open student help requests to offer sessions.</span>
          </div>
          <button
            onClick={() => setActiveTab('help-posts')}
            className="px-3 py-1.5 bg-white border border-indigo-300 font-semibold text-indigo-700 rounded-lg hover:bg-indigo-50 shrink-0 self-start sm:self-auto shadow-2xs"
          >
            Browse Student Requests →
          </button>
        </div>
      )}

      {/* Top Banner & Search Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Searchable Tutor Directory</h1>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                {filteredTutors.length} Verified Tutors
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Find campus seniors, juniors, or batchmates for structured 1-on-1 and group peer mentoring.
            </p>
          </div>

          {/* Smart Match Quick Switch */}
          <button
            onClick={() => setSmartMatchesOnly(!smartMatchesOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
              smartMatchesOnly
                ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Smart Recommendations {smartMatchesOnly ? '(Active)' : ''}</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by Course Code (e.g. CSE 205, MATH 141), Topic, Department, or Tutor Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
          />
        </div>

        {/* Filters Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100 text-xs">
          {/* Batch Relation Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Batch Relation
            </label>
            <select
              value={selectedRelation}
              onChange={(e) => setSelectedRelation(e.target.value as any)}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="all">All Batches</option>
              <option value="senior">Seniors (Higher Batch)</option>
              <option value="batchmate">Batchmates (Same Batch)</option>
              <option value="junior">Juniors</option>
            </select>
          </div>

          {/* Delivery Mode Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Delivery Mode
            </label>
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value as any)}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="all">All Modes</option>
              <option value="online">Online (Meet/Zoom)</option>
              <option value="offline">Offline (Campus/Library)</option>
              <option value="hybrid">Hybrid (Both)</option>
            </select>
          </div>

          {/* Pricing Preference */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Pricing Type
            </label>
            <select
              value={selectedPayment}
              onChange={(e) => setSelectedPayment(e.target.value as any)}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="all">All Pricing</option>
              <option value="free">Free (Community Points)</option>
              <option value="paid">Paid Standard</option>
              <option value="negotiable">Negotiable</option>
            </select>
          </div>

          {/* Verified Checkbox */}
          <div className="flex items-end pb-1.5">
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={onlyVerified}
                onChange={(e) => setOnlyVerified(e.target.checked)}
                className="rounded text-teal-600 focus:ring-teal-500 w-3.5 h-3.5"
              />
              <span className="text-xs">ID & Email Verified Only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Tutor Cards Grid */}
      {filteredTutors.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No tutors found matching your filters</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search query, batch relation, or mode filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedRelation('all');
              setSelectedMode('all');
              setSelectedPayment('all');
              setOnlyVerified(false);
              setSmartMatchesOnly(false);
            }}
            className="mt-3 px-3 py-1.5 text-xs font-semibold bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredTutors.map((tutor) => {
            const relation = getBatchRelation(tutor);

            return (
              <div
                key={tutor.id}
                className="bg-white rounded-xl border border-slate-200 hover:border-teal-300 hover:shadow-sm transition p-5 flex flex-col justify-between"
              >
                <div>
                  {/* Top card header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <img
                          src={tutor.avatar}
                          alt={tutor.name}
                          className="w-13 h-13 rounded-xl object-cover border border-slate-200 shadow-2xs"
                        />
                        {tutor.institutionalEmailVerified && (
                          <div
                            className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-2xs"
                            title="Institutional Email Verified (.edu)"
                          >
                            <CheckCircle2 className="w-4 h-4 text-teal-600" />
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="font-bold text-sm text-slate-900">{tutor.name}</h3>
                          <span
                            className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
                              relation === 'senior'
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                : relation === 'batchmate'
                                ? 'bg-teal-50 text-teal-700 border border-teal-200'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {relation === 'senior'
                              ? '🎓 Senior'
                              : relation === 'batchmate'
                              ? '🤝 Batchmate'
                              : '🌱 Junior'}
                          </span>
                        </div>

                        <div className="text-xs text-slate-500 mt-0.5">
                          {tutor.department} • <span className="font-semibold text-slate-700">{tutor.batch}</span>
                        </div>

                        {/* Badges row */}
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{tutor.rating}</span>
                            <span className="text-[11px] font-normal text-slate-400">
                              ({tutor.ratingCount} reviews)
                            </span>
                          </div>
                          <span className="text-slate-300">•</span>
                          <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-teal-600" />
                            {tutor.teachingHours} hrs taught
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-[11px] font-medium text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded">
                            {tutor.points} pts
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Mode tag & rate */}
                    <div className="text-right shrink-0">
                      <div className="text-sm font-bold text-slate-900">
                        {tutor.paymentPreference === 'free' ? (
                          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            Free Mentorship
                          </span>
                        ) : (
                          <span>{tutor.hourlyRate} BDT<span className="text-xs text-slate-400 font-normal">/hr</span></span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">
                        {tutor.deliveryMode}
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                    {tutor.bio}
                  </p>

                  {/* Courses Taught List */}
                  <div className="mt-3">
                    <div className="text-[11px] font-semibold text-slate-500 mb-1.5 flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-teal-600" /> Teaches Courses:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {tutor.coursesTaught.map((course, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-medium bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md border border-slate-200"
                        >
                          {course.split(':')[0]}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Demo Video Preview Pill (if uploaded) */}
                  {tutor.demoVideo && (
                    <div className="mt-3 p-2 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 rounded-md bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                          <Video className="w-3.5 h-3.5" />
                        </div>
                        <div className="truncate text-xs">
                          <span className="font-semibold text-slate-800 truncate block">
                            Demo: {tutor.demoVideo.title}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {tutor.demoVideo.duration} • {tutor.demoVideo.topic}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setVideoToPlay(tutor.demoVideo!);
                          setVideoPlayerModalOpen(true);
                        }}
                        className="px-2 py-1 text-[11px] font-semibold bg-white border border-slate-200 hover:border-slate-300 rounded text-slate-700 shrink-0 ml-2"
                      >
                        Watch Video
                      </button>
                    </div>
                  )}
                </div>

                {/* Bottom Actions Row */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  {/* Schedule Matching Tool Button */}
                  <button
                    onClick={() => {
                      setScheduleMatchTutor(tutor);
                      setScheduleMatchModalOpen(true);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                    title="View overlapping free time slots with this tutor"
                  >
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>Check Schedule</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedTutor(tutor)}
                      className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition"
                    >
                      View Portfolio
                    </button>
                    <button
                      onClick={() => startChatWithTutor(tutor.id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-teal-600 text-white hover:bg-teal-700 rounded-lg shadow-2xs transition"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat & Negotiate</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
