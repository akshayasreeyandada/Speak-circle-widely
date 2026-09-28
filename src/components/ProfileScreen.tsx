import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  HeartHandshake,
  Clock,
  Ban,
  Trash2,
  Edit3,
  Check,
  Eye,
  AlertCircle
} from 'lucide-react';
import { UserProfile, ConversationDuration, EnglishLevel } from '../types';
import { getBlockedUserIds, unblockUser, saveStoredUser } from '../services/storage';
import { MOCK_PEERS } from '../data/mockPeers';

interface ProfileScreenProps {
  user: UserProfile;
  onUpdateUser: (u: UserProfile) => void;
  onOpenSafety: () => void;
  onOpenAdmin: () => void;
  onResetAccount: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  onUpdateUser,
  onOpenSafety,
  onOpenAdmin,
  onResetAccount
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [displayName, setDisplayName] = useState<string>(user.displayName);
  const [englishLevel, setEnglishLevel] = useState<EnglishLevel>(user.englishLevel);
  const [preferredDuration, setPreferredDuration] = useState<ConversationDuration>(user.preferredDuration);
  const [fearFreeMode, setFearFreeMode] = useState<boolean>(user.fearFreeMode);
  const [blockedIds, setBlockedIds] = useState<string[]>(getBlockedUserIds());

  const handleSave = () => {
    const updated: UserProfile = {
      ...user,
      displayName: displayName.trim() || user.displayName,
      englishLevel,
      preferredDuration,
      fearFreeMode
    };
    saveStoredUser(updated);
    onUpdateUser(updated);
    setIsEditing(false);
  };

  const handleUnblock = (id: string) => {
    unblockUser(id);
    setBlockedIds(getBlockedUserIds());
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 pb-24 text-left space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
            My Account & Privacy
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Control your presence and safety preferences
          </p>
        </div>
        <button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors"
        >
          {isEditing ? (
            <>
              <Check className="w-3.5 h-3.5 text-teal-600" />
              <span>Save Changes</span>
            </>
          ) : (
            <>
              <Edit3 className="w-3.5 h-3.5 text-slate-500" />
              <span>Edit Settings</span>
            </>
          )}
        </button>
      </div>

      {/* What Others See Card (Minimal Profile Spec from Prompt 14) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <Eye className="w-4 h-4 text-teal-600" />
            <span>What Your Practice Partner Sees:</span>
          </div>
          <span className="text-[11px] text-teal-700 font-medium bg-teal-50 px-2 py-0.5 rounded-md">
            Safe Minimal Card
          </span>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-teal-600 text-white font-bold text-xl flex items-center justify-center shadow-xs shrink-0">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">{displayName}</h3>
              {user.trustedBadge && (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  <span>Trusted Communicator</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600">
              India · {user.region} ({user.state})
            </p>
            <p className="text-xs text-slate-500">
              English Level: <strong className="text-slate-800">{englishLevel}</strong>
            </p>
            <p className="text-xs text-slate-500">
              Interested in: {user.interests.join(' · ')}
            </p>
          </div>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center gap-2 text-[11px] text-slate-500">
          <Lock className="w-4 h-4 text-teal-600 shrink-0" />
          <span>Never shown: Phone number, email address, college, company, exact address, social media accounts.</span>
        </div>
      </div>

      {/* Editable Preferences */}
      {isEditing && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Edit Preferences</h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              English Speaking Level
            </label>
            <select
              value={englishLevel}
              onChange={e => setEnglishLevel(e.target.value as EnglishLevel)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
            >
              {(['Beginner', 'Basic', 'Intermediate', 'Comfortable', 'Advanced'] as EnglishLevel[]).map(l => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Default Call Duration
            </label>
            <div className="flex gap-2">
              {([5, 10, 15] as ConversationDuration[]).map(d => (
                <button
                  key={d}
                  onClick={() => setPreferredDuration(d)}
                  className={`flex-1 py-1.5 rounded-lg border text-xs font-medium ${
                    preferredDuration === d
                      ? 'bg-slate-900 text-white'
                      : 'border-slate-200 text-slate-700'
                  }`}
                >
                  {d}m
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Fear-Free Mode Setting */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center justify-between">
        <div className="pr-4">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-amber-600" />
            <h4 className="text-sm font-bold text-slate-900">Fear-Free Mode</h4>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Recommends 5-minute shorter calls and patient prompts if you feel shy or nervous with strangers.
          </p>
        </div>
        <button
          onClick={() => {
            const val = !fearFreeMode;
            setFearFreeMode(val);
            const updated = { ...user, fearFreeMode: val };
            saveStoredUser(updated);
            onUpdateUser(updated);
          }}
          className={`w-11 h-6 rounded-full transition-colors relative shrink-0 p-0.5 ${
            fearFreeMode ? 'bg-amber-600' : 'bg-slate-300'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white transition-transform ${
              fearFreeMode ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Blocked Users Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ban className="w-4 h-4 text-rose-600" />
            <h4 className="text-sm font-bold text-slate-900">Blocked Users</h4>
          </div>
          <span className="text-xs text-slate-500">{blockedIds.length} blocked</span>
        </div>

        {blockedIds.length > 0 ? (
          <div className="space-y-2">
            {blockedIds.map(id => {
              const peer = MOCK_PEERS.find(p => p.id === id);
              const label = peer ? peer.displayName : `User (${id})`;
              return (
                <div
                  key={id}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50 text-xs"
                >
                  <span className="font-medium text-slate-700">{label}</span>
                  <button
                    onClick={() => handleUnblock(id)}
                    className="px-2.5 py-1 text-[11px] font-semibold text-teal-700 hover:bg-white rounded-lg transition-colors"
                  >
                    Unblock
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-slate-400">You haven't blocked anyone.</p>
        )}
      </div>

      {/* Community Links & Admin Access */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={onOpenSafety}
          className="w-full sm:flex-1 py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-colors"
        >
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span>Safety Center & Community Guidelines</span>
        </button>

        <button
          onClick={onOpenAdmin}
          className="w-full sm:w-auto py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <span>Moderation Console</span>
        </button>
      </div>

      {/* Reset Account Option */}
      <div className="pt-4 border-t border-slate-200 text-center">
        <button
          onClick={onResetAccount}
          className="text-xs text-rose-600 hover:text-rose-700 font-medium"
        >
          Reset practice profile and history
        </button>
      </div>
    </div>
  );
};
