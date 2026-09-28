import React, { useEffect, useState } from 'react';
import { X, ShieldCheck, HeartHandshake } from 'lucide-react';
import { PeerUser, ConversationMode, RegionPreference, ConversationDuration, UserProfile } from '../types';
import { MOCK_PEERS } from '../data/mockPeers';
import { getBlockedUserIds, getInteractionHistory } from '../services/storage';
import { FEAR_FREE_TIPS } from '../data/topics';

interface MatchingScreenProps {
  user: UserProfile;
  mode: ConversationMode;
  regionPreference: RegionPreference;
  duration: ConversationDuration;
  fearFree: boolean;
  onMatchFound: (partner: PeerUser) => void;
  onCancel: () => void;
}

export const MatchingScreen: React.FC<MatchingScreenProps> = ({
  user,
  mode,
  regionPreference,
  duration,
  fearFree,
  onMatchFound,
  onCancel
}) => {
  const [elapsed, setElapsed] = useState<number>(0);
  const [tipIndex, setTipIndex] = useState<number>(0);
  const [matchingStatus, setMatchingStatus] = useState<string>('Searching for an available practice partner...');

  // Cycle tips
  useEffect(() => {
    const tipInterval = setInterval(() => {
      setTipIndex(prev => (prev + 1) % FEAR_FREE_TIPS.length);
    }, 3500);
    return () => clearInterval(tipInterval);
  }, []);

  // Timer & matching algorithm
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(prev => prev + 1);
    }, 1000);

    // Rule-based matching simulation (settles after 3-5 seconds for realistic, natural feel)
    const matchTimeout = setTimeout(() => {
      const blockedIds = getBlockedUserIds();
      const recentHistory = getInteractionHistory();

      // Filter eligible peers
      let candidates = MOCK_PEERS.filter(p => !blockedIds.includes(p.id));

      // Filter by region preference
      if (regionPreference === 'different_region') {
        const differentRegionCandidates = candidates.filter(p => p.region !== user.region);
        if (differentRegionCandidates.length > 0) candidates = differentRegionCandidates;
      } else if (regionPreference === 'same_region') {
        const sameRegionCandidates = candidates.filter(p => p.region === user.region);
        if (sameRegionCandidates.length > 0) candidates = sameRegionCandidates;
      }

      // Avoid immediate repeat matches if alternative exists
      const nonRecentCandidates = candidates.filter(p => !recentHistory.slice(0, 3).includes(p.id));
      if (nonRecentCandidates.length > 0) {
        candidates = nonRecentCandidates;
      }

      // Filter or sort by mode compatibility
      const modeMatched = candidates.filter(p => p.preferredModes.includes(mode));
      const finalPool = modeMatched.length > 0 ? modeMatched : candidates;

      // Pick best candidate
      const selected = finalPool[Math.floor(Math.random() * finalPool.length)] || MOCK_PEERS[0];

      setMatchingStatus(`Partner found: ${selected.displayName} from ${selected.region}! Connecting private voice room...`);

      setTimeout(() => {
        onMatchFound(selected);
      }, 1000);
    }, 3800);

    return () => {
      clearInterval(timer);
      clearTimeout(matchTimeout);
    };
  }, [user, mode, regionPreference, duration, onMatchFound]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center relative overflow-hidden shadow-2xl">
        {/* Radar Ring Visual */}
        <div className="relative w-36 h-36 mx-auto mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-teal-500/20 animate-pulse-ring" />
          <div className="absolute inset-2 rounded-full border-2 border-teal-500/40 animate-ping opacity-25" />
          <div className="w-20 h-20 rounded-full bg-teal-50 border-4 border-teal-500/20 flex items-center justify-center text-teal-700 shadow-inner">
            <span className="text-xl font-bold font-display">{elapsed}s</span>
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-900 font-display mb-1">
          Finding Your Practice Partner
        </h3>

        <p className="text-xs text-slate-500 mb-4 transition-all">
          {matchingStatus}
        </p>

        {/* Selected parameters review */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs text-slate-600 mb-6 flex items-center justify-center gap-2 flex-wrap">
          <span className="font-semibold text-slate-800 capitalize">{mode} Mode</span>
          <span aria-hidden="true">·</span>
          <span>{duration} Minutes</span>
          <span aria-hidden="true">·</span>
          <span className="capitalize">{regionPreference.replace('_', ' ')}</span>
        </div>

        {/* Anxiety Reduction / Fear Free Tip Card */}
        <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-left mb-6 flex items-start gap-2.5">
          <HeartHandshake className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="text-[11px] text-amber-900 leading-relaxed">
            {FEAR_FREE_TIPS[tipIndex]}
          </p>
        </div>

        {/* Cancel Button */}
        <button
          onClick={onCancel}
          className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors flex items-center justify-center gap-1.5"
        >
          <X className="w-4 h-4 text-slate-400" />
          <span>Cancel Search</span>
        </button>

        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          <span>No phone numbers or social profiles are shared</span>
        </div>
      </div>
    </div>
  );
};
