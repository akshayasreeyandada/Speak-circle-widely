import React, { useState } from 'react';
import {
  BarChart2,
  Clock,
  MapPin,
  Flame,
  Award,
  Sparkles,
  Smile,
  ShieldCheck,
  Star
} from 'lucide-react';
import { UserProfile } from '../types';
import { getFeedbackHistory, saveStoredUser } from '../services/storage';
import { ALL_STATES } from '../data/regions';

interface ProgressScreenProps {
  user: UserProfile;
  onUpdateUser: (u: UserProfile) => void;
}

export const ProgressScreen: React.FC<ProgressScreenProps> = ({ user, onUpdateUser }) => {
  const feedbacks = getFeedbackHistory();
  const [rating, setRating] = useState<number>(user.confidenceRating || 3);

  const handleUpdateConfidence = (newVal: number) => {
    setRating(newVal);
    const updated = { ...user, confidenceRating: newVal };
    saveStoredUser(updated);
    onUpdateUser(updated);
  };

  const uniqueStatesCount = new Set([...user.statesSpokenWith, user.state]).size;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 pb-24 text-left space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
          My Confidence Journey
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Track your personal speaking growth. Progress over perfection.
        </p>
      </div>

      {/* Encouraging Headline Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-700 to-emerald-800 text-white shadow-sm space-y-2">
        <div className="flex items-center gap-1.5 text-xs text-teal-200 font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Consistency Milestone</span>
        </div>
        <h2 className="text-lg sm:text-xl font-bold font-display">
          You've practiced {user.totalSpeakingMinutes} minutes across {uniqueStatesCount} Indian states!
        </h2>
        <p className="text-xs text-teal-100 max-w-xl leading-relaxed">
          Remember how nervous your first conversation felt? You are actively rewiring your brain to speak English naturally without fear.
        </p>
      </div>

      {/* Core Quantitative Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <Clock className="w-3.5 h-3.5 text-teal-600" />
            <span>Speaking Time</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono">{user.totalSpeakingMinutes}</p>
          <span className="text-[11px] text-slate-400">minutes total</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>Sessions</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono">{user.completedConversations}</p>
          <span className="text-[11px] text-slate-400">conversations</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span>Streak</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono">{user.currentStreakDays}</p>
          <span className="text-[11px] text-slate-400">days active</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <MapPin className="w-3.5 h-3.5 text-indigo-500" />
            <span>States Met</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono">{uniqueStatesCount}</p>
          <span className="text-[11px] text-slate-400">Indian states</span>
        </div>
      </div>

      {/* Confidence Self-Rating */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-1">
          How Confident Do You Feel Speaking English Today?
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Self-rating helps you see your own psychological shift over time.
        </p>

        <div className="flex items-center gap-3">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              onClick={() => handleUpdateConfidence(star)}
              className="p-2 rounded-xl hover:bg-slate-100 transition-colors flex flex-col items-center gap-1"
            >
              <Star
                className={`w-6 h-6 transition-colors ${
                  star <= rating
                    ? 'text-amber-500 fill-amber-500'
                    : 'text-slate-300'
                }`}
              />
              <span className="text-[10px] text-slate-500">
                {star === 1 && 'Hesitant'}
                {star === 2 && 'Tentative'}
                {star === 3 && 'Growing'}
                {star === 4 && 'Comfortable'}
                {star === 5 && 'Fear-Free'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* States Spoken With Showcase */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            States You Have Connected With
          </h3>
          <span className="text-xs text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded-md">
            {user.statesSpokenWith.length} States
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {user.statesSpokenWith.map(st => (
            <span
              key={st}
              className="px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-900 text-xs font-medium flex items-center gap-1.5"
            >
              <MapPin className="w-3 h-3 text-teal-600" />
              <span>{st}</span>
            </span>
          ))}
          {user.statesSpokenWith.length === 0 && (
            <p className="text-xs text-slate-400">Complete your first call to unlock states here!</p>
          )}
        </div>
      </div>

      {/* Past Feedback Log */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          Recent Practice Notes
        </h3>

        {feedbacks.length > 0 ? (
          <div className="space-y-3">
            {feedbacks.map((f, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">
                    Spoke with {f.partnerName} · {f.mode} mode
                  </span>
                  <span className="text-[11px] font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                    {f.rating}
                  </span>
                </div>
                {f.suggestions.map((s, idx) => (
                  <p key={idx} className="text-slate-600 text-[11px]">
                    • {s}
                  </p>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400">No practice notes yet. Start your first session!</p>
        )}
      </div>
    </div>
  );
};
