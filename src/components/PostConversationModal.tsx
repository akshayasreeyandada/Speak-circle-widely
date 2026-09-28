import React, { useState } from 'react';
import {
  Smile,
  ThumbsUp,
  Meh,
  Frown,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  Home,
  CheckCircle2
} from 'lucide-react';
import { ConversationSession, PeerUser, ConversationFeedback } from '../types';

interface PostConversationModalProps {
  session: ConversationSession;
  durationMinutes: number;
  onFinishFeedback: (feedback: ConversationFeedback) => void;
  onTalkAgain: () => void;
  onGoHome: () => void;
  onOpenReport: (peer: PeerUser) => void;
}

export const PostConversationModal: React.FC<PostConversationModalProps> = ({
  session,
  durationMinutes,
  onFinishFeedback,
  onTalkAgain,
  onGoHome,
  onOpenReport
}) => {
  const [rating, setRating] = useState<'Comfortable' | 'Helpful' | 'Difficult' | 'Uncomfortable'>('Comfortable');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const ratings: { id: 'Comfortable' | 'Helpful' | 'Difficult' | 'Uncomfortable'; label: string; icon: React.ElementType }[] = [
    { id: 'Comfortable', label: 'Comfortable', icon: Smile },
    { id: 'Helpful', label: 'Helpful', icon: ThumbsUp },
    { id: 'Difficult', label: 'Difficult', icon: Meh },
    { id: 'Uncomfortable', label: 'Uncomfortable', icon: Frown }
  ];

  const suggestions = [
    'Great natural flow! Keep maintaining eye level and steady breathing.',
    'Try speaking in longer, descriptive sentences to convey your feelings.',
    'Focus on being understood rather than worrying about grammar perfection.'
  ];

  const handleSubmit = () => {
    const feedback: ConversationFeedback = {
      sessionId: session.id,
      partnerId: session.partner.id,
      partnerName: session.partner.displayName,
      rating,
      durationMinutes,
      mode: session.mode,
      suggestions,
      timestamp: Date.now()
    };
    onFinishFeedback(feedback);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-left">
        {!submitted ? (
          <>
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 font-display">
                How was your conversation?
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                You spoke with {session.partner.displayName} ({session.partner.state}) for ~{durationMinutes} minutes.
              </p>
            </div>

            {/* Rating Buttons */}
            <div className="grid grid-cols-2 gap-2.5 mb-6">
              {ratings.map(r => {
                const Icon = r.icon;
                const isSelected = rating === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => setRating(r.id)}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50/60 ring-1 ring-teal-500 font-semibold text-teal-900'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-teal-700' : 'text-slate-400'}`} />
                    <span className="text-xs">{r.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Feedback privacy guarantee */}
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-500 mb-6">
              Your feedback is private and never exposed to the other person.
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={handleSubmit}
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
              >
                Submit & View Progress Tips
              </button>

              <button
                onClick={() => onOpenReport(session.partner)}
                className="w-full py-2 text-xs font-medium text-rose-600 hover:text-rose-700 flex items-center justify-center gap-1.5 transition-colors"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Did something go wrong? Report user safely</span>
              </button>
            </div>
          </>
        ) : (
          /* Post-Submission Summary & English Suggestions */
          <div className="space-y-5 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 font-display">
                Session Completed!
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Every conversation builds your speaking muscle memory.
              </p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-2 text-left">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500">Speaking Time</span>
                <p className="text-base font-bold text-slate-900 font-mono mt-0.5">{durationMinutes} min</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500">Partner Region</span>
                <p className="text-xs font-semibold text-slate-800 mt-1">{session.partner.region}</p>
              </div>
            </div>

            {/* Confidence Practice Suggestions */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-left">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-2">
                <Sparkles className="w-4 h-4 text-amber-700" />
                <span>Encouraging Practice Tips</span>
              </div>
              <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-4">
                <li>Try speaking in longer sentences with connectors (because, although, however).</li>
                <li>Notice how your hesitation decreased after the first 2 minutes.</li>
                <li>Remember: Perfect grammar is not required. Fluency comes from speaking continuously!</li>
              </ul>
            </div>

            {/* Next Steps */}
            <div className="space-y-2 pt-2">
              <button
                onClick={onTalkAgain}
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Find Someone Else to Practice</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onGoHome}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Return to Home</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
