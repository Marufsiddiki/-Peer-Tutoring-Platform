import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, ShieldAlert, AlertTriangle } from 'lucide-react';
import { DisputeReport } from '../types';

export const ReportModal: React.FC = () => {
  const { reportModalOpen, setReportModalOpen, reportTarget, setReportTarget, submitDisputeReport } = useApp();

  const [reason, setReason] = useState<DisputeReport['reason']>('no_show');
  const [details, setDetails] = useState('');

  if (!reportModalOpen || !reportTarget) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) return;

    submitDisputeReport({
      reportedUserId: reportTarget.userId,
      reportedUserName: reportTarget.userName,
      sessionId: reportTarget.sessionId,
      reason,
      details: details.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-rose-100 relative bg-rose-50/40">
          <button
            onClick={() => {
              setReportModalOpen(false);
              setReportTarget(null);
            }}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <h2 className="text-base font-bold text-slate-900">File Incident or Dispute Report</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Report regarding: <strong className="text-slate-800">{reportTarget.userName}</strong>
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Reason for Report <span className="text-rose-500">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as DisputeReport['reason'])}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
            >
              <option value="no_show">No-Show / Unannounced Absence</option>
              <option value="payment_dispute">Payment Dispute or Overcharging</option>
              <option value="unprepared">Completely Unprepared / Low Effort</option>
              <option value="unprofessional">Unprofessional Behavior or Harassment</option>
              <option value="academic_misconduct">Academic Integrity / Plagiarism Violation</option>
              <option value="other">Other Campus Violation</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Incident Details & Statement <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="State what occurred, time of scheduled meeting, and any pertinent details for university admin review..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white leading-relaxed"
              required
            />
          </div>

          <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-amber-800 text-[11px] flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              All reports are logged into the Admin Moderation Queue. False reports may also result in account warnings.
            </span>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setReportModalOpen(false);
                setReportTarget(null);
              }}
              className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 rounded-lg shadow-2xs transition"
            >
              Submit to Admin Queue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
