import React from 'react';
import { X, ShieldCheck, Lock, AlertTriangle, HeartHandshake, UserCheck } from 'lucide-react';

interface SafetyCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SafetyCenterModal: React.FC<SafetyCenterModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-left max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">SpeakCircle Safety Center</h3>
              <p className="text-xs text-slate-500">Your privacy and mental comfort are paramount</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5 my-4 text-xs text-slate-700 leading-relaxed">
          {/* Privacy Rules */}
          <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200 space-y-2">
            <h4 className="font-bold text-teal-950 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-teal-700" />
              <span>1. Total Privacy Shield</span>
            </h4>
            <p className="text-teal-900">
              SpeakCircle will never ask for or expose your phone number, email, college, company, or home city. Practice partners only see your chosen first name, broad Indian region, and practice interests.
            </p>
          </div>

          {/* Golden Rule on Contact Info */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
            <h4 className="font-bold text-amber-950 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              <span>2. Never Share Social or Contact Info</span>
            </h4>
            <p className="text-amber-900">
              If a partner asks for your WhatsApp, Instagram, Telegram, or personal contact details, politely refuse or immediately tap <strong>Report & End Call</strong>. Soliciting private contacts is a violation of our community standards.
            </p>
          </div>

          {/* 5-Step Escalation Ladder */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900">3. Moderation & Escalation Process</h4>
            <p className="text-slate-500">
              Reports are taken seriously through structured human & automated review:
            </p>
            <ol className="space-y-1.5 list-decimal pl-4 text-slate-700">
              <li><strong>Formal Warning:</strong> First minor offense (e.g. asking for socials).</li>
              <li><strong>Temporary Restriction:</strong> Matching queue disabled for 48 hours.</li>
              <li><strong>Human Review:</strong> Moderator reviews report context and reputation flags.</li>
              <li><strong>Temporary Suspension:</strong> 14-day suspension for repeated misbehavior.</li>
              <li><strong>Permanent Ban:</strong> Instant permanent hardware & account ban for harassment, hate speech, or inappropriate sexual conduct.</li>
            </ol>
          </div>

          {/* 18+ Age Policy */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-teal-600" />
              <span>4. Adult Learner Safety (18+)</span>
            </h4>
            <p className="text-slate-500">
              SpeakCircle is restricted to adults aged 18 and older to ensure an appropriate and mature peer practice setting.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
};
