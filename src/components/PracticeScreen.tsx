import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Mic,
  MicOff,
  RotateCcw,
  CheckCircle2,
  Clock,
  Shuffle,
  Volume2,
  Bot,
  MessageSquare
} from 'lucide-react';
import { DAILY_CHALLENGES } from '../data/challenges';
import { CONVERSATION_TOPICS } from '../data/topics';
import { SpeakingChallenge } from '../types';
import { AudioController } from '../services/audioService';

interface PracticeScreenProps {
  onStartChallengeCall: (challenge: SpeakingChallenge) => void;
}

export const PracticeScreen: React.FC<PracticeScreenProps> = ({ onStartChallengeCall }) => {
  const [activeDay, setActiveDay] = useState<number>(1);
  const [isRecordingWarmup, setIsRecordingWarmup] = useState<boolean>(false);
  const [warmupSeconds, setWarmupSeconds] = useState<number>(60);
  const [volumeLevel, setVolumeLevel] = useState<number>(0);
  const [warmupDone, setWarmupDone] = useState<boolean>(false);
  const [rouletteTopic, setRouletteTopic] = useState<string>(
    'If you could start any business tomorrow in India, what would it be?'
  );

  const audioControllerRef = useRef<AudioController | null>(null);

  const currentChallenge = DAILY_CHALLENGES.find(c => c.day === activeDay) || DAILY_CHALLENGES[0];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecordingWarmup && warmupSeconds > 0) {
      timer = setInterval(() => {
        setWarmupSeconds(prev => {
          if (prev <= 1) {
            setIsRecordingWarmup(false);
            setWarmupDone(true);
            if (audioControllerRef.current) audioControllerRef.current.cleanup();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecordingWarmup, warmupSeconds]);

  const toggleWarmup = async () => {
    if (!isRecordingWarmup) {
      const audio = new AudioController();
      audioControllerRef.current = audio;
      const res = await audio.requestMicrophone();
      if (res.success) {
        setIsRecordingWarmup(true);
        setWarmupDone(false);
        setWarmupSeconds(60);

        const volLoop = setInterval(() => {
          if (audioControllerRef.current) {
            setVolumeLevel(audioControllerRef.current.getVolumeLevel());
          }
        }, 100);

        setTimeout(() => clearInterval(volLoop), 60000);
      }
    } else {
      setIsRecordingWarmup(false);
      if (audioControllerRef.current) {
        audioControllerRef.current.cleanup();
      }
    }
  };

  const spinRoulette = () => {
    const allQuestions = CONVERSATION_TOPICS.map(t => t.question);
    const chosen = allQuestions[Math.floor(Math.random() * allQuestions.length)];
    setRouletteTopic(chosen);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 pb-24 text-left space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
          Speaking Practice Hub
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Build fluency at your own pace with structured daily missions and warmups.
        </p>
      </div>

      {/* 60-Second Solo Mic Warmup */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">60-Second Solo Warmup</h3>
              <p className="text-[11px] text-slate-500">Test your microphone & loosen your tongue before talking with a peer</p>
            </div>
          </div>
          <div className="font-mono text-sm font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg">
            {warmupSeconds}s
          </div>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 mb-4">
          <p className="text-xs font-semibold text-slate-800">
            Prompt: "What did you have for breakfast, and what are your plans for the rest of the day?"
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Speak out loud for 60 seconds without stopping. Ignore minor slips.
          </p>
        </div>

        {/* Volume feedback visualizer */}
        {isRecordingWarmup && (
          <div className="mb-4 flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-teal-600 animate-pulse" />
            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-600 transition-all duration-75"
                style={{ width: `${Math.min(100, Math.max(10, volumeLevel * 180))}%` }}
              />
            </div>
            <span className="text-[11px] font-mono text-slate-500">Speaking...</span>
          </div>
        )}

        {warmupDone && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Great warmup! Your vocal cords are ready for a real conversation.</span>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={toggleWarmup}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              isRecordingWarmup
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-teal-600 hover:bg-teal-700 text-white shadow-sm'
            }`}
          >
            {isRecordingWarmup ? (
              <>
                <MicOff className="w-4 h-4" />
                <span>Stop Warmup</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                <span>{warmupDone ? 'Try Again' : 'Start 60s Warmup'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* n8n AI English Practice Partner Card */}
      <div className="bg-gradient-to-r from-teal-50 via-emerald-50/50 to-slate-50 border border-teal-200/80 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">AI Practice Chatbot</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">
                  Powered by n8n
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Practice interview answers, test questions, or chat without stage fright before calling peers.
              </p>
            </div>
          </div>
          <button
            onClick={() => window.openSpeakCircleAiChat?.()}
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-xs shrink-0 hover:scale-102"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat with AI Coach</span>
          </button>
        </div>
      </div>

      {/* 7-Day Speaking Challenge Roadmap */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>7-Day Speaking Challenge</span>
            </h3>
            <p className="text-[11px] text-slate-500">A progressive journey to overcome fear step-by-step</p>
          </div>
          <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
            Day {activeDay} of 7
          </span>
        </div>

        {/* Day Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {DAILY_CHALLENGES.map(c => (
            <button
              key={c.day}
              onClick={() => setActiveDay(c.day)}
              className={`w-10 h-10 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center justify-center ${
                activeDay === c.day
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              D{c.day}
            </button>
          ))}
        </div>

        {/* Selected Challenge Details */}
        <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
              {currentChallenge.category}
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {currentChallenge.timeSeconds} seconds
            </span>
          </div>

          <h4 className="text-base font-bold text-slate-900">
            {currentChallenge.title}
          </h4>

          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            "{currentChallenge.prompt}"
          </p>

          <div className="space-y-1 pt-1">
            <span className="text-[11px] font-semibold text-slate-600">Helpful Hints:</span>
            <ul className="text-[11px] text-slate-600 list-disc pl-4 space-y-0.5">
              {currentChallenge.hints.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onStartChallengeCall(currentChallenge)}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <span>Practice This With a Partner</span>
            </button>
          </div>
        </div>
      </div>

      {/* Topic Roulette */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold font-display flex items-center gap-2">
            <Shuffle className="w-4 h-4 text-teal-400" />
            <span>Topic Roulette</span>
          </h3>
          <button
            onClick={spinRoulette}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-teal-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Spin Again</span>
          </button>
        </div>

        <p className="text-sm font-medium text-slate-200 leading-snug py-2">
          "{rouletteTopic}"
        </p>

        <p className="text-[11px] text-slate-400 mt-2">
          Can you speak about this for 2 continuous minutes? Try phrasing your initial response in your mind!
        </p>
      </div>
    </div>
  );
};
