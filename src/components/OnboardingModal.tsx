import React, { useState } from 'react';
import { ShieldCheck, HeartHandshake, CheckCircle2, AlertCircle } from 'lucide-react';
import { UserProfile, EnglishLevel, ConversationMode, ConversationDuration } from '../types';
import { ALL_STATES, STATE_TO_REGION_MAP } from '../data/regions';
import { AVATAR_OPTIONS } from '../data/mockPeers';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (user: UserProfile) => void;
  initialUser?: UserProfile;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
  initialUser
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<number>(1);
  const [displayName, setDisplayName] = useState<string>(initialUser?.displayName || '');
  const [selectedState, setSelectedState] = useState<string>(initialUser?.state || 'Karnataka');
  const [englishLevel, setEnglishLevel] = useState<EnglishLevel>(initialUser?.englishLevel || 'Intermediate');
  const [selectedAvatar, setSelectedAvatar] = useState<string>(initialUser?.avatarId || 'avatar-1');
  const [selectedModes, setSelectedModes] = useState<ConversationMode[]>(
    initialUser?.preferredModes || ['casual', 'interview']
  );
  const [preferredDuration, setPreferredDuration] = useState<ConversationDuration>(
    initialUser?.preferredDuration || 10
  );
  const [fearFreeMode, setFearFreeMode] = useState<boolean>(initialUser?.fearFreeMode || false);
  const [ageConfirmed, setAgeConfirmed] = useState<boolean>(initialUser?.isAgeConfirmed || false);
  const [guidelinesAccepted, setGuidelinesAccepted] = useState<boolean>(
    initialUser?.guidelinesAccepted || false
  );
  const [errorMsg, setErrorMsg] = useState<string>('');

  const levels: { level: EnglishLevel; desc: string }[] = [
    { level: 'Beginner', desc: 'I know words but freeze when speaking.' },
    { level: 'Basic', desc: 'Can make short sentences with pauses.' },
    { level: 'Intermediate', desc: 'Can express thoughts comfortably with minor hesitation.' },
    { level: 'Comfortable', desc: 'Speak smoothly in most daily conversations.' },
    { level: 'Advanced', desc: 'Fluent, looking for nuanced debates or career interviews.' }
  ];

  const modes: { id: ConversationMode; label: string; desc: string }[] = [
    { id: 'casual', label: 'Casual Conversation', desc: 'Hobbies, movies, food, college life' },
    { id: 'interview', label: 'Interview Practice', desc: 'Mock HR & technical placement prompts' },
    { id: 'knowledge', label: 'Knowledge Talk', desc: 'Technology, education, science, environment' },
    { id: 'debate', label: 'Discussion / Debate', desc: 'Respectful exchange of viewpoints' },
    { id: 'random', label: 'Random Topic', desc: 'Fun surprise prompts to break routine' }
  ];

  const toggleMode = (m: ConversationMode) => {
    if (selectedModes.includes(m)) {
      if (selectedModes.length > 1) {
        setSelectedModes(selectedModes.filter(item => item !== m));
      }
    } else {
      setSelectedModes([...selectedModes, m]);
    }
  };

  const handleNext = () => {
    setErrorMsg('');
    if (step === 1) {
      if (!displayName.trim()) {
        setErrorMsg('Please enter a display name (first name or nickname).');
        return;
      }
      if (!ageConfirmed) {
        setErrorMsg('Please confirm you are 18 years or older for community safety.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      if (!guidelinesAccepted) {
        setErrorMsg('Please accept the Community Guidelines to continue.');
        return;
      }

      const region = STATE_TO_REGION_MAP[selectedState] || 'South India';
      const updatedUser: UserProfile = {
        id: initialUser?.id || `user_${Date.now()}`,
        displayName: displayName.trim(),
        avatarId: selectedAvatar,
        state: selectedState,
        region,
        englishLevel,
        interests: ['Technology', 'Daily Life', 'Career'],
        preferredDuration,
        preferredModes: selectedModes,
        fearFreeMode,
        isAgeConfirmed: true,
        guidelinesAccepted: true,
        joinedDate: initialUser?.joinedDate || '2026-02-01',
        reputationScore: initialUser?.reputationScore || 100,
        trustedBadge: true,
        completedConversations: initialUser?.completedConversations || 0,
        totalSpeakingMinutes: initialUser?.totalSpeakingMinutes || 0,
        currentStreakDays: initialUser?.currentStreakDays || 1,
        statesSpokenWith: initialUser?.statesSpokenWith || [],
        confidenceRating: initialUser?.confidenceRating || 3
      };

      onComplete(updatedUser);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg p-6 sm:p-8 my-8 text-left">
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-display">
              {step === 1 && 'Welcome to SpeakCircle'}
              {step === 2 && 'Your English Practice Goals'}
              {step === 3 && 'Community Safe Space'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Step {step} of 3 · Setup your safe voice profile
            </p>
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className={`w-7 h-1.5 rounded-full transition-colors ${
                  step >= i ? 'bg-teal-600' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: Basic Profile & Region */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Display Name (First name or friendly alias)
              </label>
              <input
                type="text"
                maxLength={20}
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="e.g. Akash, Sneha, Sam"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Keep it simple. You never need to share your full legal surname.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Choose an Avatar Theme
              </label>
              <div className="flex items-center gap-2.5">
                {AVATAR_OPTIONS.map(av => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setSelectedAvatar(av.id)}
                    className={`w-10 h-10 rounded-full ${av.bg} text-white font-bold text-sm flex items-center justify-center transition-transform ${
                      selectedAvatar === av.id ? 'ring-4 ring-teal-500/30 scale-110' : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    {displayName ? displayName.charAt(0).toUpperCase() : av.initial}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your State in India
              </label>
              <select
                value={selectedState}
                onChange={e => setSelectedState(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              >
                {ALL_STATES.map(item => (
                  <option key={item.state} value={item.state}>
                    {item.state} ({item.region})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 mt-1">
                Used to let you connect with peers from other states for accent exposure.
              </p>
            </div>

            {/* Privacy notice box */}
            <div className="p-3 bg-teal-50 border border-teal-100 rounded-xl flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
              <div className="text-xs text-teal-900 leading-relaxed">
                <span className="font-semibold">Privacy First Guarantee:</span> Your phone number, email, college, company, and exact address are NEVER asked or shared.
              </div>
            </div>

            {/* Age confirmation */}
            <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={ageConfirmed}
                onChange={e => setAgeConfirmed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded text-teal-600 focus:ring-teal-500"
              />
              <span className="text-xs text-slate-700 leading-snug">
                I confirm that I am <strong className="text-slate-900">18 years or older</strong>. SpeakCircle enforces this policy to maintain a safe, adult peer learning environment.
              </span>
            </label>
          </div>
        )}

        {/* STEP 2: English Level & Mode */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Self-Assessed English Speaking Level
              </label>
              <p className="text-[11px] text-slate-500 mb-2">
                There is zero judgment. This helps match you with compatible partners.
              </p>
              <div className="space-y-2">
                {levels.map(lvl => (
                  <button
                    key={lvl.level}
                    type="button"
                    onClick={() => setEnglishLevel(lvl.level)}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-start justify-between transition-all ${
                      englishLevel === lvl.level
                        ? 'border-teal-600 bg-teal-50/50 ring-1 ring-teal-500'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-900">{lvl.level}</p>
                      <p className="text-[11px] text-slate-500">{lvl.desc}</p>
                    </div>
                    {englishLevel === lvl.level && (
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 ml-2" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Conversation Modes You Enjoy (Select at least 1)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {modes.map(m => {
                  const isSelected = selectedModes.includes(m.id);
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => toggleMode(m.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-teal-600 bg-teal-50/60 font-medium text-teal-900'
                          : 'border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <p className="text-xs font-semibold">{m.label}</p>
                      <p className="text-[10px] text-slate-500 line-clamp-1">{m.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Preferred Call Duration
              </label>
              <div className="flex gap-2">
                {([5, 10, 15] as ConversationDuration[]).map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setPreferredDuration(d)}
                    className={`flex-1 py-2 text-xs font-medium rounded-xl border transition-all ${
                      preferredDuration === d
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {d} Minutes
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Fear-Free Mode & Community Guidelines */}
        {step === 3 && (
          <div className="space-y-4">
            {/* Fear-Free Mode Toggle */}
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/70">
              <div className="flex items-start justify-between">
                <div className="pr-3">
                  <div className="flex items-center gap-1.5">
                    <HeartHandshake className="w-4 h-4 text-amber-700" />
                    <span className="text-xs font-bold text-amber-900">Fear-Free Mode</span>
                  </div>
                  <p className="text-[11px] text-amber-800 mt-1 leading-relaxed">
                    Select this if you feel anxious or hesitant talking to strangers. We will give you shorter calls, gentler prompts, and a patient peer.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFearFreeMode(!fearFreeMode)}
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
            </div>

            {/* Community Guidelines Agreement */}
            <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-2 text-xs text-slate-700">
              <h4 className="font-semibold text-slate-900">SpeakCircle Community Code:</h4>
              <ul className="space-y-1.5 list-disc pl-4 text-[11px] text-slate-600">
                <li><strong className="text-slate-800">Speak without fear:</strong> Everyone is here to practice. No mocking, criticism, or grammar shaming.</li>
                <li><strong className="text-slate-800">No contact requests:</strong> Never ask for phone numbers, Instagram, LinkedIn, or private chat links.</li>
                <li><strong className="text-slate-800">Respect and dignity:</strong> Zero tolerance for harassment, sexual comments, or hate speech. Immediate ban.</li>
                <li><strong className="text-slate-800">No-pressure exit:</strong> Either participant may end the call at any second without justification.</li>
              </ul>
            </div>

            <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={guidelinesAccepted}
                onChange={e => setGuidelinesAccepted(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded text-teal-600 focus:ring-teal-500"
              />
              <span className="text-xs text-slate-800 leading-snug">
                I agree to the Community Guidelines and promise to maintain a supportive, polite space for all learners.
              </span>
            </label>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleNext}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm transition-colors"
          >
            {step === 3 ? 'Start Speaking' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};
