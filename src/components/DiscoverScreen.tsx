import React, { useState } from 'react';
import { MapPin, Globe, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { RegionName, PeerUser, ConversationMode } from '../types';
import { INDIAN_REGIONS } from '../data/regions';
import { MOCK_PEERS } from '../data/mockPeers';

interface DiscoverScreenProps {
  onSelectPeerForMatch: (peer: PeerUser) => void;
  onStartWithRegion: (region: RegionName) => void;
}

export const DiscoverScreen: React.FC<DiscoverScreenProps> = ({
  onSelectPeerForMatch,
  onStartWithRegion
}) => {
  const [selectedRegion, setSelectedRegion] = useState<RegionName | 'All'>('All');

  const regionKeys = Object.keys(INDIAN_REGIONS) as RegionName[];

  const filteredPeers = selectedRegion === 'All'
    ? MOCK_PEERS
    : MOCK_PEERS.filter(p => p.region === selectedRegion);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 text-left space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
          Discover Learners Across India
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Practicing with people from different states builds comfort with varied English accents.
        </p>
      </div>

      {/* Accent Exposure Education Banner */}
      <div className="p-4 rounded-2xl bg-teal-50/80 border border-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-teal-600 text-white shrink-0 mt-0.5">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-teal-900">Why Practice with Different States?</h4>
            <p className="text-[11px] text-teal-800 leading-relaxed mt-0.5">
              In real colleges and companies, you will collaborate with colleagues from Karnataka, Bengal, Delhi, Kerala, and Maharashtra. Exposure now removes fear later!
            </p>
          </div>
        </div>
      </div>

      {/* Region Filter Segmented Controls */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedRegion('All')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
            selectedRegion === 'All'
              ? 'bg-slate-900 text-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          All Regions ({MOCK_PEERS.length})
        </button>
        {regionKeys.map(r => (
          <button
            key={r}
            onClick={() => setSelectedRegion(r)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              selectedRegion === r
                ? 'bg-teal-700 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Region Overview Cards */}
      {selectedRegion !== 'All' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 text-xs text-slate-600">
          <div className="flex items-center justify-between mb-1.5">
            <h3 className="font-bold text-slate-900">{selectedRegion}</h3>
            <button
              onClick={() => onStartWithRegion(selectedRegion)}
              className="text-[11px] font-semibold text-teal-700 hover:underline flex items-center gap-1"
            >
              <span>Match someone here</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <p className="text-slate-500">{INDIAN_REGIONS[selectedRegion].description}</p>
        </div>
      )}

      {/* Active Peers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredPeers.map(peer => (
          <div
            key={peer.id}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-teal-500/60 shadow-xs transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-teal-600 text-white font-bold text-sm flex items-center justify-center">
                    {peer.displayName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-slate-900">{peer.displayName}</h4>
                      {peer.trustedBadge && (
                        <span title="Trusted Communicator" className="text-teal-600">
                          <ShieldCheck className="w-4 h-4" />
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{peer.state} · {peer.region}</span>
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                  {peer.englishLevel}
                </span>
              </div>

              <p className="text-xs text-slate-600 mb-2 leading-relaxed">
                "{peer.bioTagline}"
              </p>

              <div className="text-[11px] text-teal-700 bg-teal-50/60 px-2 py-1 rounded-lg mb-3">
                {peer.accentNote}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-[11px] text-slate-400">Ready to speak</span>
              <button
                onClick={() => onSelectPeerForMatch(peer)}
                className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <span>Connect</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
