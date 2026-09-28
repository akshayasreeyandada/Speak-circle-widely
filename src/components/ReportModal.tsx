import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle2, Ban } from 'lucide-react';
import { PeerUser, ReportItem } from '../types';
import { submitReport, blockUser } from '../services/storage';

interface ReportModalProps {
  isOpen: boolean;
  peer: PeerUser | null;
  reporterId: string;
  onClose: () => void;
  onReportSubmitted: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  peer,
  reporterId,
  onClose,
  onReportSubmitted
}) => {
  if (!isOpen || !peer) return null;

  const [category, setCategory] = useState<ReportItem['category']>('Asking for personal information');
  const [description, setDescription] = useState<string>('');
  const [alsoBlock, setAlsoBlock] = useState<boolean>(true);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const categories: ReportItem['category'][] = [
    'Asking for personal information',
    'Abusive language',
    'Harassment',
    'Sexual / inappropriate conversation',
    'Hate speech',
    'Threatening behavior',
    'Spam',
    'Repeated unwanted interaction',
    'Other'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReport({
      reporterId,
      reportedUserId: peer.id,
      reportedUserName: peer.displayName,
      category,
      description: description.trim() || 'No additional details provided.'
    });

    if (alsoBlock) {
      blockUser(peer.id);
    }

    setSubmitted(true);
    setTimeout(() => {
      onReportSubmitted();
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-left">
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Report Practice Partner</h3>
                  <p className="text-xs text-slate-500">Report {peer.displayName}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Select Violation Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as ReportItem['category'])}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-slate-50"
              >
                {categories.map(c => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Description (Optional details for moderation team)
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="What happened during the conversation? E.g., repeatedly asked for my WhatsApp number..."
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 bg-slate-50"
              />
            </div>

            <label className="flex items-start gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={alsoBlock}
                onChange={e => setAlsoBlock(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded text-rose-600 focus:ring-rose-500"
              />
              <span className="text-xs text-slate-700">
                <strong>Also block {peer.displayName}</strong>. You will never be matched together again.
              </span>
            </label>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                Submit Report
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-900 font-display">Report Received</h3>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Thank you for keeping SpeakCircle safe. Our moderation team has queued this case for investigation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
