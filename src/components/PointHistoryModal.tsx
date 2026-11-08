import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Sparkles, CheckCircle2, Clock, ShieldCheck, ArrowUpRight, Award } from 'lucide-react';

export const PointHistoryModal: React.FC = () => {
  const { pointHistoryModalOpen, setPointHistoryModalOpen, pointTransactions, currentUser } = useApp();

  if (!pointHistoryModalOpen) return null;

  const userTxs = pointTransactions.filter((tx) => tx.userId === currentUser.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 relative bg-gradient-to-r from-teal-50/60 to-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Reward Points Ledger</h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-teal-100 text-teal-800 rounded-md">
                  Feature #33
                </span>
              </div>
              <p className="text-xs text-slate-500">Transaction history & duplicate award protection</p>
            </div>
          </div>

          <button
            onClick={() => setPointHistoryModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Balance Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Current Available Points
            </div>
            <div className="text-2xl font-bold text-teal-700 mt-0.5 flex items-center gap-1.5">
              <span>{currentUser.points}</span>
              <span className="text-xs font-normal text-slate-500">Peer Credits</span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[11px] font-semibold text-slate-500">Duplicate Prevention</div>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 mt-0.5">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Idempotent Verification Active
            </span>
          </div>
        </div>

        {/* Transaction List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100 text-xs">
          {userTxs.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              No point transactions recorded yet. Complete free tutoring sessions (+50 pts) or reviews (+25 pts) to earn rewards!
            </div>
          ) : (
            userTxs.map((tx) => (
              <div key={tx.id} className="py-3 flex items-start justify-between gap-3">
                <div className="space-y-0.5 flex-1">
                  <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <span className="capitalize">{tx.type.replace(/_/g, ' ')}</span>
                    {tx.sessionId && (
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded">
                        {tx.sessionId}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">{tx.description}</p>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {new Date(tx.timestamp || tx.createdAt || Date.now()).toLocaleString([], {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </div>
                </div>

                <div className="font-bold text-sm text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200 shrink-0 flex items-center gap-0.5">
                  <ArrowUpRight className="w-3.5 h-3.5 text-teal-600" />
                  +{(tx.amount ?? tx.points ?? 0)} pts
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Rules */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-teal-600" />
            <span>Community Rule: 1 transaction per session maximum. Free sessions = +50 pts.</span>
          </div>
          <button
            onClick={() => setPointHistoryModalOpen(false)}
            className="px-3 py-1 bg-white border border-slate-200 rounded-md font-semibold text-slate-700 hover:bg-slate-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
