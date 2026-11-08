import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HelpPost, DeliveryMode, PaymentPreference } from '../types';
import {
  Sparkles,
  PlusCircle,
  Search,
  BookOpen,
  Clock,
  DollarSign,
  MessageSquare,
  Users,
  Filter,
} from 'lucide-react';

export const HelpPostsView: React.FC = () => {
  const {
    helpPosts,
    currentUser,
    setHelpPostModalOpen,
    startChatWithTutor,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | DeliveryMode>('all');
  const [filterBudget, setFilterBudget] = useState<'all' | PaymentPreference>('all');

  const filteredPosts = helpPosts.filter((post) => {
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      const matchCourse = post.courseCode.toLowerCase().includes(q);
      const matchTitle = post.courseTitle.toLowerCase().includes(q);
      const matchTopic = post.topic.toLowerCase().includes(q);
      const matchLearner = post.learnerName.toLowerCase().includes(q);
      if (!matchCourse && !matchTitle && !matchTopic && !matchLearner) return false;
    }

    if (filterMode !== 'all' && post.preferredMode !== filterMode && post.preferredMode !== 'hybrid') {
      return false;
    }

    if (filterBudget !== 'all' && post.budgetType !== filterBudget) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-600" />
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Public Help-Posts & Inquiries</h1>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                {filteredPosts.length} Active Requests
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Students post specific academic challenges, quiz preps, and lab debugging requests. Peer tutors can browse and send direct help offers.
            </p>
          </div>

          <button
            onClick={() => setHelpPostModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold bg-teal-600 text-white hover:bg-teal-700 rounded-lg shadow-2xs transition flex items-center gap-1.5 self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Help-Post</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by course code, topic, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div>
            <select
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none"
            >
              <option value="all">All Delivery Modes</option>
              <option value="online">Online Preferred</option>
              <option value="offline">Offline Preferred</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          <div>
            <select
              value={filterBudget}
              onChange={(e) => setFilterBudget(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none"
            >
              <option value="all">All Budget Types</option>
              <option value="paid">Paid</option>
              <option value="free">Free Community</option>
              <option value="negotiable">Negotiable</option>
            </select>
          </div>
        </div>
      </div>

      {/* Help-Posts Feed */}
      {filteredPosts.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No help posts found</h3>
          <p className="text-xs text-slate-500 mt-1">Be the first to post a study request or adjust your search filter.</p>
          <button
            onClick={() => setHelpPostModalOpen(true)}
            className="mt-3 px-3.5 py-1.5 text-xs font-semibold bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            Create Help-Post Now
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => {
            const isMyPost = post.learnerId === currentUser.id;

            return (
              <div
                key={post.id}
                className="bg-white rounded-xl border border-slate-200 hover:border-teal-300 transition p-5 shadow-xs"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5 flex-1">
                    <img
                      src={post.learnerAvatar}
                      alt={post.learnerName}
                      className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0"
                    />

                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 text-xs px-2.5 py-1 bg-slate-100 rounded-md border border-slate-200 font-mono">
                          {post.courseCode}
                        </span>
                        <h3 className="font-bold text-sm text-slate-900">{post.topic}</h3>
                        <span
                          className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md ${
                            post.preferredMode === 'online'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : post.preferredMode === 'offline'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-purple-50 text-purple-700 border border-purple-200'
                          }`}
                        >
                          {post.preferredMode}
                        </span>
                        <span className="text-[10px] font-medium text-slate-500">
                          {new Date(post.createdAt).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>

                      <div className="text-xs text-slate-500 mt-1">
                        Posted by <strong className="text-slate-800">{post.learnerName}</strong> ({post.learnerDepartment} • {post.learnerBatch})
                      </div>

                      <p className="text-xs text-slate-700 mt-2.5 leading-relaxed bg-slate-50/70 p-3 rounded-lg border border-slate-100">
                        {post.description}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-slate-500 mt-3 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-teal-600" />
                          Duration: <strong className="text-slate-700">{post.preferredDuration}</strong>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-semibold text-slate-800">
                          <DollarSign className="w-3.5 h-3.5 text-teal-600" />
                          Budget: {post.budgetType === 'free' ? 'Free Peer Session' : `${post.budgetAmount} BDT (${post.budgetType})`}
                        </span>
                        <span>•</span>
                        <span>
                          Schedule: <span className="text-slate-700 font-medium">{post.preferredSchedule}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Action */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <span className="text-xs text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                      {post.offersCount} Tutors Inquired
                    </span>

                    {isMyPost ? (
                      <span className="text-xs text-slate-400 font-medium py-1">
                        (Your Help-Post)
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          startChatWithTutor(
                            post.learnerId,
                            post.courseCode,
                            `Hi ${post.learnerName}! I saw your help post for ${post.courseCode} (${post.topic}). I would be happy to tutor you on this!`
                          );
                        }}
                        className="px-3.5 py-2 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow-2xs transition flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Offer Help & Chat</span>
                      </button>
                    )}
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
