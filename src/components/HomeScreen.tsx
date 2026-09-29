import React, { useState } from 'react';
import {
  MessageSquare,
  Briefcase,
  BookOpen,
  Scale,
  Shuffle,
  Sparkles,
  HeartHandshake,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Bot
} from 'lucide-react';
import { ConversationMode, RegionPreference, ConversationDuration, UserProfile } from '../types';
import { DAILY_CHALLENGES } from '../data/challenges';

interface HomeScreenProps {
  user: UserProfile;
  onStartMatching: (params: {
    mode: ConversationMode;
    regionPreference: RegionPreference;
    duration: ConversationDuration;
    fearFree: boolean;
  }) => void;
  onOpenPractice: () => void;
  onOpenDiscover: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  user,
  onStartMatching,
  onOpenPractice,
  onOpenDiscover
}) => {
  const [selectedMode, setSelectedMode] = useState<ConversationMode>(user.preferredModes[0] || 'casual');
  const [regionPref, setRegionPref] = useState<RegionPreference>('different_region');
  const [duration, setDuration] = useState<ConversationDuration>(user.preferredDuration || 10);
  const [fearFree, setFearFree] = useState<boolean>(user.fearFreeMode || false);

  const modeOptions: { id: ConversationMode; label: string; icon: React.ElementType; desc: string }[] = [
    { id: 'casual', label: 'Casual', icon: MessageSquare, desc: 'Hobbies, movies, food, college life' },
    { id: 'interview', label: 'Interview Practice', icon: Briefcase, desc: 'Placement & HR mock questions' },
    { id: 'knowledge', label: 'Knowledge Talk', icon: BookOpen, desc: 'Tech, science & current affairs' },
    { id: 'debate', label: 'Debate / Discussion', icon: Scale, desc: 'Thoughtful, respectful exchanges' },
    { id: 'random', label: 'Random Topic', icon: Shuffle, desc: 'Surprise prompt to break silence' },
    { id: 'challenge', label: 'Daily Challenge', icon: Sparkles, desc: '60-second speaking mission' }
  ];

  const regionPrefOptions: { id: RegionPreference; label: string; desc: string }[] = [
    { id: 'different_region', label: 'Different Region (Recommended)', desc: 'Practice with other accents across India' },
    { id: 'any', label: 'Anywhere in India', desc: 'Fastest match with any ready learner' },
    { id: 'same_region', label: 'Same Region', desc: `Peers near ${user.region}` }
  ];

  const todayChallenge = DAILY_CHALLENGES[0];

  const handleStart = () => {
    onStartMatching({
      mode: selectedMode,
      regionPreference: regionPref,
      duration: fearFree ? 5 : duration,
      fearFree
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 pb-24 text-left space-y-6">
      {/* Top Greeting & Community Signal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
            Ready to Speak, {user.displayName}?
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {user.state} · {user.region} · {user.englishLevel} Level
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600 bg-teal-50/80 border border-teal-100 px-3 py-1.5 rounded-full self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
          <span>380+ learners available now</span>
        </div>
      </div>

      {/* Main Practice Setup Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-6">
        {/* 1. Conversation Mode */}
        <div>
          <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2">
            1. Select Conversation Mode
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {modeOptions.map(item => {
              const Icon = item.icon;
              const isSelected = selectedMode === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedMode(item.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-teal-600 bg-teal-50/60 ring-1 ring-teal-500'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-teal-700' : 'text-slate-500'}`} />
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />}
                  </div>
                  <p className="text-xs font-semibold text-slate-900 leading-tight">{item.label}</p>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{item.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Regional Discovery Preference */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider">
              2. Partner Region Preference
            </label>
            <button
              onClick={onOpenDiscover}
              className="text-[11px] font-medium text-teal-700 hover:underline flex items-center gap-1"
            >
              <MapPin className="w-3 h-3" />
              <span>Explore states</span>
            </button>
          </div>
          <div className="space-y-2">
            {regionPrefOptions.map(pref => {
              const isSelected = regionPref === pref.id;
              return (
                <button
                  key={pref.id}
                  onClick={() => setRegionPref(pref.id)}
                  className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                    isSelected
                      ? 'border-teal-600 bg-teal-50/50 ring-1 ring-teal-500'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <span className="text-xs font-semibold text-slate-900">{pref.label}</span>
                    <span className="block text-[11px] text-slate-500">{pref.desc}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Duration & Fear-Free Mode */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Call Duration</span>
            </label>
            <div className="flex gap-2">
              {([5, 10, 15] as ConversationDuration[]).map(d => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`flex-1 py-2 text-xs font-medium rounded-xl border transition-all ${
                    duration === d
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {d}m
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1.5 flex items-center gap-1.5">
              <HeartHandshake className="w-3.5 h-3.5 text-amber-600" />
              <span>Fear-Free Mode</span>
            </label>
            <button
              onClick={() => setFearFree(!fearFree)}
              className={`w-full p-2 rounded-xl border text-left flex items-center justify-between transition-all ${
                fearFree
                  ? 'border-amber-400 bg-amber-50 text-amber-900'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="text-xs font-medium">
                {fearFree ? 'Enabled (5 min + easy prompts)' : 'Normal pace'}
              </span>
              <span className={`text-[11px] font-semibold ${fearFree ? 'text-amber-700' : 'text-slate-400'}`}>
                {fearFree ? 'Active' : 'Turn on'}
              </span>
            </button>
          </div>
        </div>

        {/* Prominent CTA Button */}
        <div className="pt-2">
          <button
            onClick={handleStart}
            className="w-full py-4 bg-teal-600 hover:bg-teal-700 active:scale-[0.99] text-white font-bold text-sm sm:text-base rounded-xl shadow-md shadow-teal-700/10 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>I'm Ready to Talk</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <p className="text-center text-[11px] text-slate-500 mt-2.5 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Speak without fear. No personal contact details will ever be shown.</span>
          </p>

          <div className="mt-3 flex items-center justify-center">
            <button
              type="button"
              onClick={() => window.openSpeakCircleAiChat?.()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200/80 transition-all hover:scale-102"
            >
              <Bot className="w-3.5 h-3.5 text-teal-600" />
              <span>Nervous? Warm up with our n8n AI Coach first</span>
            </button>
          </div>
        </div>
      </div>

      {/* Daily Challenge Spotlight Card */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Today's 60-Second Challenge</span>
          </div>
          <h3 className="text-sm font-bold text-slate-900">{todayChallenge.title}</h3>
          <p className="text-xs text-slate-600 max-w-lg line-clamp-2">
            {todayChallenge.prompt}
          </p>
        </div>
        <button
          onClick={onOpenPractice}
          className="self-start sm:self-auto px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold whitespace-nowrap transition-colors"
        >
          View Challenges
        </button>
      </div>
    </div>
  );
};
