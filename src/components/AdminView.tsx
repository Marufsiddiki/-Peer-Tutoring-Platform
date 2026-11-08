import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  UserX,
  CheckCircle,
  XCircle,
  FileText,
  Clock,
  Users,
  Calendar,
  Lock,
  ArrowRight,
  Filter,
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const {
    currentUser,
    users,
    disputeReports,
    sessions,
    updateReportStatus,
    resolveReport,
    suspendUser,
    reactivateUser,
    switchUser,
  } = useApp();

  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'investigating' | 'resolved'>('all');

  // Total metrics
  const totalStrikes = users.reduce((sum, u) => sum + u.strikes, 0);
  const flaggedUsers = users.filter((u) => u.strikes >= 3 || u.accountStatus === 'flagged' || u.accountStatus === 'suspended');
  const pendingReports = disputeReports.filter((r) => r.status === 'pending');

  const filteredReports = disputeReports.filter((r) => {
    if (filterStatus === 'pending') return r.status === 'pending';
    if (filterStatus === 'investigating') return r.status === 'investigating';
    if (filterStatus === 'resolved') return r.status === 'resolved' || r.status === 'dismissed';
    return true;
  });

  // #36 Route Protection for non-admin users
  if (!currentUser.isAdmin) {
    return (
      <div className="bg-white rounded-2xl border border-amber-200 p-8 text-center max-w-xl mx-auto shadow-sm my-8">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-7 h-7" />
        </div>
        <div className="flex items-center justify-center gap-2 mb-1">
          <h2 className="text-lg font-bold text-slate-900">Admin Route Protected</h2>
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-purple-100 text-purple-800 rounded">
            Feature #36
          </span>
        </div>
        <p className="text-xs text-slate-600 mb-6 max-w-md mx-auto leading-relaxed">
          Access to student suspension, strike moderation, and formal dispute resolution queues requires university administrative authorization. You are currently logged in as <strong>{currentUser.name}</strong> ({currentUser.activeRole}).
        </p>
        <button
          onClick={() => switchUser('user-admin')}
          className="px-5 py-2.5 text-xs font-bold bg-purple-600 text-white hover:bg-purple-700 rounded-xl shadow-xs transition flex items-center justify-center gap-2 mx-auto"
        >
          <span>Authenticate as Staff Admin (Dr. Shakil Hasan)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Admin Header */}
      <div className="bg-white rounded-xl border border-purple-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Admin Moderation & Student Safety (#36)
                </h1>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                  Authorized Admin: {currentUser.name}
                </span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                  Features #35, #36
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Investigate student misconduct reports (#35), audit no-show strikes (#27), and execute account suspension / reactivation actions (#36).
              </p>
            </div>
          </div>
        </div>

        {/* Safety Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-4 border-t border-purple-100 text-xs">
          <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-200 text-center">
            <div className="text-lg font-bold text-purple-900">{pendingReports.length}</div>
            <div className="text-[11px] text-purple-700 font-medium">Pending Dispute Cases (#35)</div>
          </div>

          <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200 text-center">
            <div className="text-lg font-bold text-amber-900">{totalStrikes}</div>
            <div className="text-[11px] text-amber-700 font-medium">Total Strikes Logged (#27)</div>
          </div>

          <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-200 text-center">
            <div className="text-lg font-bold text-rose-900">{flaggedUsers.length}</div>
            <div className="text-[11px] text-rose-700 font-medium">Suspended / Flagged Accounts</div>
          </div>

          <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-200 text-center">
            <div className="text-lg font-bold text-teal-900">{sessions.length}</div>
            <div className="text-[11px] text-teal-700 font-medium">Total Platform Sessions</div>
          </div>
        </div>
      </div>

      {/* Account Moderation: Suspend & Reactivate (#36) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            User Account Moderation & Suspension (#36)
          </h2>
          <span className="text-xs text-slate-400">Strict 3-Strike No-Show Policy</span>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Authorized administrators may suspend student or tutor accounts found violating peer tutoring standards or reactivate compliant users.
        </p>

        <div className="divide-y divide-slate-100">
          {users
            .filter((u) => !u.isAdmin)
            .map((user) => (
              <div key={user.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                  />
                  <div>
                    <div className="font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
                      <span>{user.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({user.studentId})</span>
                      {user.accountStatus === 'suspended' ? (
                        <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.2 rounded border border-rose-300">
                          SUSPENDED (#36)
                        </span>
                      ) : user.strikes >= 3 ? (
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.2 rounded border border-amber-300">
                          FLAGGED (3+ Strikes)
                        </span>
                      ) : user.strikes > 0 ? (
                        <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.2 rounded">
                          {user.strikes} Strike on record
                        </span>
                      ) : (
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                          Good Standing
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {user.department} • {user.batch} • {user.points} points
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  {user.accountStatus === 'suspended' ? (
                    <button
                      onClick={() => reactivateUser(user.id)}
                      className="px-3.5 py-1.5 text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg transition flex items-center gap-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Reactivate Account (#36)</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => suspendUser(user.id)}
                      className="px-3.5 py-1.5 text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-lg transition flex items-center gap-1"
                    >
                      <UserX className="w-3.5 h-3.5" />
                      <span>Suspend Account (#36)</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Feature #35 Report System & Case Queue */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                In-App Report System & Incident Queue (#35)
              </h2>
              <span className="text-[10px] font-bold bg-teal-100 text-teal-800 px-2 py-0.2 rounded">
                Feature #35
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Students report problems or inappropriate behavior. Admins review and update statuses.
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs flex-wrap">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                filterStatus === 'all' ? 'bg-white shadow-2xs text-purple-700 font-bold border border-slate-200' : 'text-slate-600'
              }`}
            >
              All ({disputeReports.length})
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                filterStatus === 'pending' ? 'bg-white shadow-2xs text-purple-700 font-bold border border-slate-200' : 'text-slate-600'
              }`}
            >
              Pending ({pendingReports.length})
            </button>
            <button
              onClick={() => setFilterStatus('investigating')}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                filterStatus === 'investigating' ? 'bg-white shadow-2xs text-purple-700 font-bold border border-slate-200' : 'text-slate-600'
              }`}
            >
              Investigating
            </button>
            <button
              onClick={() => setFilterStatus('resolved')}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                filterStatus === 'resolved' ? 'bg-white shadow-2xs text-purple-700 font-bold border border-slate-200' : 'text-slate-600'
              }`}
            >
              Resolved / Dismissed
            </button>
          </div>
        </div>

        {filteredReports.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No incident reports matching this status filter.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredReports.map((rep) => (
              <div key={rep.id} className="p-5 hover:bg-slate-50/50 transition text-xs">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded uppercase tracking-wider text-[10px] border border-rose-200 font-mono">
                        {rep.reason.replace(/_/g, ' ')}
                      </span>
                      <span className="text-slate-500">
                        Reported User: <strong className="text-slate-900">{rep.reportedUserName}</strong>
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500">
                        Reported By: <strong className="text-slate-800">{rep.reporterName}</strong>
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          rep.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : rep.status === 'investigating'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        Status: {rep.status}
                      </span>
                    </div>

                    <p className="text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 mt-2">
                      {rep.details}
                    </p>

                    {rep.actionTaken && (
                      <div className="text-[11px] text-purple-700 font-semibold mt-1">
                        Admin Action Record: {rep.actionTaken}
                      </div>
                    )}
                  </div>

                  {/* Admin Actions (#35, #36) */}
                  <div className="flex sm:flex-col gap-1.5 shrink-0">
                    {rep.status !== 'resolved' && (
                      <>
                        <button
                          onClick={() => resolveReport(rep.id, 'suspend')}
                          className="px-3 py-1.5 text-xs font-semibold bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition"
                        >
                          Suspend User (#36)
                        </button>
                        <button
                          onClick={() => resolveReport(rep.id, 'warn')}
                          className="px-3 py-1.5 text-xs font-medium bg-amber-50 text-amber-800 border border-amber-300 rounded-lg hover:bg-amber-100 transition"
                        >
                          Issue Strike (#27)
                        </button>
                        <button
                          onClick={() => updateReportStatus(rep.id, 'investigating', 'Marked under active staff investigation (#35)')}
                          className="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition"
                        >
                          Investigate (#35)
                        </button>
                      </>
                    )}

                    {rep.status !== 'dismissed' && rep.status !== 'resolved' && (
                      <button
                        onClick={() => resolveReport(rep.id, 'dismiss')}
                        className="px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition"
                      >
                        Dismiss (#35)
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
