import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Trophy, Medal, Star, Clock, Sparkles, MessageSquare, BookOpen, ShieldCheck, ArrowRight } from 'lucide-react';

export const LeaderboardView: React.FC = () => {
  const { users, setSelectedTutor, startChatWithTutor } = useApp();
  const [sortBy, setSortBy] = useState<'points' | 'stars' | 'sessions' | 'hours'>('points');

  // Filter tutors and sort based on class diagram attributes (#34)
  const tutors = users
    .filter((u) => u.isTutorActive)
    .sort((a, b) => {
      if (sortBy === 'stars') return (b.rating || 0) - (a.rating || 0) || b.points - a.points;
      if (sortBy === 'sessions') return (b.completedSessionsCount || 0) - (a.completedSessionsCount || 0);
      if (sortBy === 'hours') return (b.teachingHours || 0) - (a.teachingHours || 0);
      return b.points - a.points || b.rating - a.rating;
    });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <Trophy className="w-6 h-6 text-amber-500" />
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Top-Tutor Leaderboard</h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                Honor Roll
              </span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-teal-100 text-teal-800 rounded-md">
                Feature #34
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Ranked peer tutors based on TutorProfile fields (successfulSessions, totalHoursTaught), review ratings (stars), and points.
            </p>
          </div>

          {/* Ranking Metric Sorter (#34) */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs flex-wrap self-start sm:self-auto">
            <button
              onClick={() => setSortBy('points')}
              className={`px-3 py-1.5 font-semibold rounded-lg transition ${
                sortBy === 'points' ? 'bg-white text-teal-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Points & Badges
            </button>
            <button
              onClick={() => setSortBy('stars')}
              className={`px-3 py-1.5 font-semibold rounded-lg transition ${
                sortBy === 'stars' ? 'bg-white text-teal-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Review Stars
            </button>
            <button
              onClick={() => setSortBy('sessions')}
              className={`px-3 py-1.5 font-semibold rounded-lg transition ${
                sortBy === 'sessions' ? 'bg-white text-teal-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Successful Sessions
            </button>
            <button
              onClick={() => setSortBy('hours')}
              className={`px-3 py-1.5 font-semibold rounded-lg transition ${
                sortBy === 'hours' ? 'bg-white text-teal-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Total Hours Taught
            </button>
          </div>
        </div>
      </div>

      {/* Podium for Top 3 Tutors */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {tutors.slice(0, 3).map((tutor, idx) => {
          const medalColors = [
            'from-amber-100 to-amber-50 border-amber-300 text-amber-900',
            'from-slate-100 to-slate-50 border-slate-300 text-slate-800',
            'from-amber-50 to-orange-50 border-orange-200 text-orange-900',
          ];
          const rankTitles = ['#1 Campus Champion', '#2 Lead Mentor', '#3 Peer Fellow'];

          return (
            <div
              key={tutor.id}
              className={`rounded-xl border p-5 bg-gradient-to-b ${medalColors[idx]} shadow-xs flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 bg-white/80 rounded-md border border-black/5 shadow-2xs">
                    {rankTitles[idx]}
                  </span>
                  <div className="flex items-center gap-1 font-bold text-sm text-teal-800">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    {tutor.points} pts
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={tutor.avatar}
                    alt={tutor.name}
                    className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-xs"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{tutor.name}</h3>
                    <div className="text-xs text-slate-600">
                      {tutor.department.slice(0, 22)}... • <span className="font-semibold">{tutor.batch}</span>
                    </div>
                  </div>
                </div>

                {/* Class Diagram Attributes Card (#34) */}
                <div className="grid grid-cols-3 gap-2 bg-white/70 p-2.5 rounded-lg border border-black/5 text-center text-xs mb-3">
                  <div>
                    <div className="font-bold text-amber-600 flex items-center justify-center gap-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {tutor.rating}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">Review.stars</div>
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">{tutor.teachingHours}h</div>
                    <div className="text-[10px] text-slate-500 font-mono">totalHoursTaught</div>
                  </div>
                  <div>
                    <div className="font-bold text-teal-700">{tutor.completedSessionsCount}</div>
                    <div className="text-[10px] text-slate-500 font-mono">successfulSessions</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-black/5">
                <button
                  onClick={() => setSelectedTutor(tutor)}
                  className="flex-1 py-1.5 text-xs font-semibold bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-800 transition shadow-2xs"
                >
                  Visit Profile (#34)
                </button>
                <button
                  onClick={() => startChatWithTutor(tutor.id)}
                  className="flex-1 py-1.5 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition"
                >
                  Book Session
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Leaderboard Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h2 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
            All Ranked Peer Mentors (#34)
          </h2>
          <span className="text-xs text-slate-500">{tutors.length} tutors evaluated</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Tutor Profile</th>
                <th className="py-3 px-4">Department & Batch</th>
                <th className="py-3 px-4 text-center">Stars (Review)</th>
                <th className="py-3 px-4 text-center">Total Hours Taught</th>
                <th className="py-3 px-4 text-center">Successful Sessions</th>
                <th className="py-3 px-4 text-right">Points (#33)</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tutors.map((tutor, idx) => (
                <tr key={tutor.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4 font-bold text-slate-700">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-md text-xs ${
                      idx === 0
                        ? 'bg-amber-100 text-amber-800 font-bold'
                        : idx === 1
                        ? 'bg-slate-200 text-slate-800'
                        : idx === 2
                        ? 'bg-orange-100 text-orange-800'
                        : 'text-slate-400'
                    }`}>
                      #{idx + 1}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={tutor.avatar}
                        alt={tutor.name}
                        className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                      />
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-1">
                          {tutor.name}
                          {tutor.institutionalEmailVerified && (
                            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {tutor.coursesTaught[0]?.split(':')[0] || 'Peer Mentor'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <div>{tutor.department}</div>
                    <div className="text-[10px] font-medium text-slate-500">{tutor.batch}</div>
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-amber-600">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {tutor.rating}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center font-semibold text-slate-700">
                    {tutor.teachingHours} hrs
                  </td>
                  <td className="py-3 px-4 text-center text-slate-600 font-medium">
                    {tutor.completedSessionsCount} sessions
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                      {tutor.points} pts
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedTutor(tutor)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-md transition"
                      >
                        Visit Profile (#34)
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
