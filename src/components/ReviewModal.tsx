import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Star, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';

export const ReviewModal: React.FC = () => {
  const {
    reviewModalOpen,
    setReviewModalOpen,
    reviewSession,
    setReviewSession,
    currentUser,
    submitReview,
  } = useApp();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  if (!reviewModalOpen || !reviewSession) return null;

  // Prevent tutor from reviewing themselves
  if (reviewSession.tutorId === currentUser.id) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
        <div className="bg-white rounded-2xl border border-slate-200 max-w-sm w-full p-6 text-center space-y-3 shadow-2xl">
          <div className="w-12 h-12 mx-auto rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Student Feedback Only</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Tutors cannot leave reviews for their own classes. Student <strong>{reviewSession.learnerName}</strong> must provide the feedback and rating.
          </p>
          <button
            onClick={() => {
              setReviewModalOpen(false);
              setReviewSession(null);
            }}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    submitReview(reviewSession.id, rating, comment.trim());
    setComment('');
    setReviewModalOpen(false);
    setReviewSession(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 relative bg-slate-50/50">
          <button
            onClick={() => {
              setReviewModalOpen(false);
              setReviewSession(null);
            }}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
            <h2 className="text-base font-bold text-slate-900">Rate & Review Peer Tutor (Step 11)</h2>
            <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full">
              Step 11 & 12
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Session for <strong>{reviewSession.courseCode}</strong> with <strong>{reviewSession.tutorName}</strong>. Submitting updates tutor's rating, badges, and leaderboard rankings (Step 12).
          </p>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Star selector */}
          <div className="text-center py-2 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-[11px] font-semibold text-slate-500 mb-2">
              Overall Experience Rating
            </div>
            <div className="flex items-center justify-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 focus:outline-none transition transform hover:scale-110"
                >
                  <Star
                    className={`w-7 h-7 ${
                      (hoverRating || rating) >= star
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-200'
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="text-xs font-bold text-amber-700 mt-1">
              {rating === 5 && 'Outstanding Mentorship (5 Stars)'}
              {rating === 4 && 'Very Helpful & Clear (4 Stars)'}
              {rating === 3 && 'Good Session (3 Stars)'}
              {rating === 2 && 'Needs Improvement (2 Stars)'}
              {rating === 1 && 'Unsatisfactory (1 Star)'}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Written Review & Feedback <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Explain how the tutor explained concepts, solved your doubts, or helped with assignments..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-teal-500 leading-relaxed"
              required
            />
          </div>

          <div className="flex items-center gap-2 p-2.5 bg-teal-50 rounded-lg text-teal-800 text-[11px]">
            <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
            <span>Submitting a review automatically awards <strong className="font-semibold">+25 points</strong> to the tutor!</span>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setReviewModalOpen(false);
                setReviewSession(null);
              }}
              className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
            >
              Skip
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-teal-600 text-white hover:bg-teal-700 rounded-lg shadow-2xs transition"
            >
              Publish Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
