import React, { useState } from 'react';
import {
  ShieldAlert,
  Users,
  CheckCircle,
  AlertTriangle,
  Ban,
  Clock,
  ArrowLeft,
  Search,
  MessageSquare
} from 'lucide-react';
import { ReportItem } from '../types';
import { getStoredReports, updateReportStatus } from '../services/storage';

interface AdminDashboardProps {
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const [reports, setReports] = useState<ReportItem[]>(getStoredReports());
  const [filter, setFilter] = useState<'all' | 'pending' | 'warning_issued' | 'suspended'>('all');
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);

  const totalUsers = 4820;
  const activeLearners = 384;
  const activeVoiceSessions = 78;
  const suspendedCount = 14;
  const bannedCount = 6;

  const handleAction = (reportId: string, action: ReportItem['status'], note: string) => {
    updateReportStatus(reportId, action, note);
    setReports(getStoredReports());
    setSelectedReport(null);
  };

  const filteredReports = filter === 'all'
    ? reports
    : reports.filter(r => r.status === filter);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-md overflow-y-auto p-4 sm:p-6 text-left">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Top Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-teal-400" />
                <h1 className="text-lg font-bold font-display">SpeakCircle Moderation Console</h1>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Internal Trust & Safety Dashboard · Real-Time Incident Triage
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
          >
            Exit Console
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-5 sm:p-6 bg-slate-50 border-b border-slate-200">
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-[11px] text-slate-500">Total Learners</span>
            <p className="text-xl font-bold text-slate-900 font-mono mt-0.5">{totalUsers.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-[11px] text-slate-500">Active Now</span>
            <p className="text-xl font-bold text-teal-700 font-mono mt-0.5">{activeLearners}</p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-[11px] text-slate-500">Voice Rooms Live</span>
            <p className="text-xl font-bold text-indigo-700 font-mono mt-0.5">{activeVoiceSessions}</p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-[11px] text-slate-500">Pending Reports</span>
            <p className="text-xl font-bold text-rose-700 font-mono mt-0.5">
              {reports.filter(r => r.status === 'pending').length}
            </p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-[11px] text-slate-500">Suspended / Banned</span>
            <p className="text-xl font-bold text-slate-800 font-mono mt-0.5">{suspendedCount + bannedCount}</p>
          </div>
        </div>

        {/* Moderation Queue Section */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Incident Reports Queue</h2>
              <p className="text-xs text-slate-500">Review reported behavior and enforce safety policies</p>
            </div>

            {/* Filter segmented buttons */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                  filter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                All ({reports.length})
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                  filter === 'pending' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter('warning_issued')}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                  filter === 'warning_issued' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Warnings
              </button>
            </div>
          </div>

          {/* Reports Table / Card List */}
          <div className="space-y-3">
            {filteredReports.map(rep => (
              <div
                key={rep.id}
                className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-md">
                      {rep.category}
                    </span>
                    <span className="text-xs font-semibold text-slate-800">
                      Reported User: {rep.reportedUserName} ({rep.reportedUserId})
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    "{rep.description}"
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Reported {new Date(rep.timestamp).toLocaleString()} · Status: <span className="font-semibold text-slate-700">{rep.status}</span>
                    {rep.actionTaken && ` · Action: ${rep.actionTaken}`}
                  </p>
                </div>

                {/* Moderation Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {rep.status === 'pending' && (
                    <>
                      <button
                        onClick={() =>
                          handleAction(
                            rep.id,
                            'warning_issued',
                            'Warning: Soliciting private contacts or inappropriate speech violates community guidelines.'
                          )
                        }
                        className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 rounded-xl text-xs font-semibold transition-colors"
                      >
                        Issue Warning
                      </button>
                      <button
                        onClick={() =>
                          handleAction(
                            rep.id,
                            'suspended',
                            'Temporary 7-day suspension issued after review.'
                          )
                        }
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition-colors"
                      >
                        Suspend User
                      </button>
                    </>
                  )}
                  {rep.status !== 'pending' && (
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
                      Resolved
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Policy & Topic Management Info */}
        <div className="p-5 sm:p-6 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 space-y-2">
          <h4 className="font-bold text-slate-900">Safety Policy Invariants:</h4>
          <p>
            1. No automated instantaneous permanent bans on single uncertain triggers. Escalating review protects authentic learners.
          </p>
          <p>
            2. High-risk violations (severe harassment, explicit content) trigger immediate suspension pending admin review.
          </p>
        </div>
      </div>
    </div>
  );
};
