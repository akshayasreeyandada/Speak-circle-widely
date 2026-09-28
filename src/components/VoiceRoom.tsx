import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  PhoneOff,
  Sparkles,
  ShieldAlert,
  Ban,
  Clock,
  Volume2,
  RefreshCw,
  AlertTriangle,
  HeartHandshake
} from 'lucide-react';
import { ConversationSession, PeerUser, UserProfile } from '../types';
import { AudioController } from '../services/audioService';
import { ConversationCardsModal } from './ConversationCardsModal';
import { ICEBREAKER_QUESTIONS } from '../data/topics';

interface VoiceRoomProps {
  session: ConversationSession;
  user: UserProfile;
  onEndCall: (durationMinutes: number) => void;
  onReportUser: (peer: PeerUser) => void;
  onBlockUser: (peer: PeerUser) => void;
}

export const VoiceRoom: React.FC<VoiceRoomProps> = ({
  session,
  user,
  onEndCall,
  onReportUser,
  onBlockUser
}) => {
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(session.durationMinutes * 60);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [localVolume, setLocalVolume] = useState<number>(0);
  const [partnerSpeaking, setPartnerSpeaking] = useState<boolean>(true);
  const [currentPrompt, setCurrentPrompt] = useState<string>(session.topicQuestion);
  const [isCardsModalOpen, setIsCardsModalOpen] = useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<'candidate' | 'interviewer'>(
    session.role || 'candidate'
  );
  const [micActive, setMicActive] = useState<boolean>(false);

  const audioControllerRef = useRef<AudioController | null>(null);

  // Initialize Audio
  useEffect(() => {
    const audio = new AudioController();
    audioControllerRef.current = audio;

    audio.requestMicrophone().then(res => {
      if (res.success) {
        setMicActive(true);
      }
    });

    // Speak partner opening greetings
    const greetingText = `Hello ${user.displayName}! I am ${session.partner.displayName} from ${session.partner.state}. Excited to practice together today! Our topic is: ${session.topicTitle}.`;
    audio.speakPartnerMessage(greetingText, () => {
      setPartnerSpeaking(false);
    });

    // Volume polling loop
    const volumeInterval = setInterval(() => {
      if (audioControllerRef.current) {
        const vol = audioControllerRef.current.getVolumeLevel();
        setLocalVolume(vol);
      }
    }, 100);

    // Periodic natural partner conversation simulation
    const partnerVoiceInterval = setInterval(() => {
      // Natural alternation if user is quiet
      if (Math.random() > 0.6 && !partnerSpeaking) {
        setPartnerSpeaking(true);
        setTimeout(() => setPartnerSpeaking(false), 3000);
      }
    }, 8000);

    return () => {
      clearInterval(volumeInterval);
      clearInterval(partnerVoiceInterval);
      audio.cleanup();
    };
  }, [user.displayName, session.partner, session.topicTitle]);

  // Call Countdown Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onEndCall(Math.ceil((session.durationMinutes * 60 - prev) / 60) || 1);
          return 0;
        }
        return prev - 1;
      });
      setElapsedSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [session.durationMinutes, onEndCall]);

  const toggleMute = () => {
    if (audioControllerRef.current) {
      const muted = audioControllerRef.current.toggleMute();
      setIsMuted(muted);
    } else {
      setIsMuted(!isMuted);
    }
  };

  const handleRescueTopic = () => {
    const randomQuestion = ICEBREAKER_QUESTIONS[Math.floor(Math.random() * ICEBREAKER_QUESTIONS.length)];
    setCurrentPrompt(randomQuestion);
    if (audioControllerRef.current) {
      audioControllerRef.current.speakPartnerMessage(
        `Here is an interesting thought: ${randomQuestion}`,
        () => setPartnerSpeaking(false)
      );
    }
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const switchRole = () => {
    setCurrentRole(prev => (prev === 'candidate' ? 'interviewer' : 'candidate'));
  };

  const handleEndCall = () => {
    const actualMinutes = Math.max(1, Math.ceil(elapsedSeconds / 60));
    onEndCall(actualMinutes);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 text-white flex flex-col justify-between p-4 sm:p-6 overflow-hidden">
      {/* Top Header Bar: Clean, distraction-free */}
      <div className="flex items-center justify-between max-w-4xl mx-auto w-full pt-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold tracking-wide text-emerald-400 uppercase">
            Private 1-to-1 Voice
          </span>
          <span className="text-xs text-slate-400 hidden sm:inline">· Unrecorded & Encrypted</span>
        </div>

        {/* Countdown Timer */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/90 border border-slate-700 text-xs font-mono font-medium">
          <Clock className="w-3.5 h-3.5 text-teal-400" />
          <span className={secondsRemaining < 60 ? 'text-rose-400 font-bold' : 'text-slate-200'}>
            {formatTimer(secondsRemaining)} remaining
          </span>
        </div>

        {/* Quick Report & Block triggers */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onReportUser(session.partner)}
            title="Report violation"
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 transition-colors"
          >
            <ShieldAlert className="w-4 h-4" />
          </button>
          <button
            onClick={() => onBlockUser(session.partner)}
            title="Block user"
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 transition-colors"
          >
            <Ban className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Focus Area: Partner Profile & Voice Visualizer */}
      <div className="max-w-2xl mx-auto w-full my-auto text-center space-y-6">
        {/* Partner Avatar & Sound Waves */}
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 mx-auto flex items-center justify-center">
          {/* Animated speaking ripple rings */}
          {partnerSpeaking && (
            <>
              <div className="absolute inset-0 rounded-full border-2 border-teal-500/40 animate-pulse-ring" />
              <div className="absolute -inset-4 rounded-full border border-teal-400/30 animate-ripple" />
            </>
          )}

          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-bold text-3xl sm:text-4xl shadow-2xl relative z-10 border-4 border-slate-800">
            {session.partner.displayName.charAt(0)}
          </div>

          {/* Voice indicator badge */}
          <div className="absolute bottom-2 z-20 px-2.5 py-0.5 rounded-full bg-slate-800/90 border border-slate-700 text-[10px] text-teal-300 font-medium flex items-center gap-1.5 shadow-sm">
            <Volume2 className="w-3 h-3 text-teal-400" />
            <span>{partnerSpeaking ? 'Speaking' : 'Listening'}</span>
          </div>
        </div>

        {/* Partner Minimal Safe Info */}
        <div>
          <h2 className="text-2xl font-bold font-display text-white">
            {session.partner.displayName}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            India · {session.partner.state} ({session.partner.region})
          </p>
          <div className="flex items-center justify-center gap-2 mt-2 text-xs text-slate-400">
            <span>{session.partner.englishLevel} English</span>
            <span aria-hidden="true">·</span>
            <span className="text-teal-400 font-medium">Trusted Communicator</span>
          </div>
        </div>

        {/* Current Conversation Topic Card */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 sm:p-5 max-w-lg mx-auto text-left shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-teal-400 uppercase tracking-wider">
              {session.mode} Mode · {session.topicTitle}
            </span>
            {session.mode === 'interview' && (
              <button
                onClick={switchRole}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-teal-950 border border-teal-800 text-[11px] text-teal-300 hover:bg-teal-900 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Switch Role (Now: {currentRole})</span>
              </button>
            )}
          </div>
          <p className="text-sm sm:text-base font-semibold text-slate-100 leading-snug">
            "{currentPrompt}"
          </p>
        </div>

        {/* Fear-Free / Rescue Buttons */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleRescueTopic}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Need a Topic?</span>
          </button>

          <button
            onClick={() => setIsCardsModalOpen(true)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            <span>Browse Cards</span>
          </button>
        </div>

        {/* Local Mic Volume Indicator */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
          <span>Your Mic:</span>
          <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div
              className={`h-full transition-all duration-100 ${
                isMuted ? 'bg-slate-600' : 'bg-teal-400'
              }`}
              style={{ width: `${isMuted ? 0 : Math.max(10, Math.min(100, localVolume * 150))}%` }}
            />
          </div>
          <span className="text-[11px] font-mono">{isMuted ? 'Muted' : 'Live'}</span>
        </div>
      </div>

      {/* Bottom Voice Controls */}
      <div className="max-w-md mx-auto w-full pb-4 pt-2">
        <div className="flex items-center justify-center gap-6">
          {/* Mute Button */}
          <button
            onClick={toggleMute}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              isMuted
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          {/* End Call Button (No-Pressure Exit) */}
          <button
            onClick={handleEndCall}
            className="h-14 px-8 rounded-full bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
          >
            <PhoneOff className="w-5 h-5" />
            <span>End Call</span>
          </button>
        </div>

        <p className="text-center text-[11px] text-slate-500 mt-4">
          No-pressure exit. You can leave at any second without giving any reason.
        </p>
      </div>

      {/* In-Call Conversation Cards Modal */}
      <ConversationCardsModal
        isOpen={isCardsModalOpen}
        onClose={() => setIsCardsModalOpen(false)}
        onSelectPrompt={p => setCurrentPrompt(p)}
        currentMode={session.mode}
      />
    </div>
  );
};
