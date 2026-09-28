import React from 'react';
import { ShieldCheck, Lock, Sparkles, MapPin, Heart, ArrowRight } from 'lucide-react';
import { INDIAN_REGIONS } from '../data/regions';

interface LandingPageProps {
  onStart: () => void;
  onExploreRegions: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onExploreRegions }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Overcome spoken English hesitation with peers across India</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight font-display text-balance leading-tight sm:leading-tight mb-6">
            Speak without fear. <br className="hidden sm:inline" />
            <span className="text-teal-700">Practice without judgment.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8">
            Connect 1-to-1 in private audio rooms with friendly learners from Bengaluru, Delhi, Pune, Kolkata, and beyond. Build fluency through real conversations, zero pressure.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onStart}
              className="w-full sm:w-auto px-7 py-3.5 bg-teal-600 hover:bg-teal-700 active:scale-[0.98] text-white font-semibold text-sm rounded-xl shadow-md shadow-teal-700/10 flex items-center justify-center gap-2 transition-all"
            >
              <span>I'm Ready to Talk</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onExploreRegions}
              className="w-full sm:w-auto px-5 py-3.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium text-sm rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <MapPin className="w-4 h-4 text-slate-500" />
              <span>Explore Indian Regions</span>
            </button>
          </div>

          {/* Clean metadata strip */}
          <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-500 mt-8">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-teal-600" />
              100% Private (No phone or email shared)
            </span>
            <span aria-hidden="true" className="hidden sm:inline">·</span>
            <span className="flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              Fear-Free Mode for beginners
            </span>
            <span aria-hidden="true" className="hidden sm:inline">·</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              18+ Safe Community
            </span>
          </div>
        </div>
      </section>

      {/* The 3 Core Pillars: Safe, Private, Confident */}
      <section className="py-12 bg-white border-y border-slate-200/80 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
              Designed for Natural Confidence
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Why thousands of learners across Indian states speak freely on SpeakCircle
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-left">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">SAFE</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                You control every interaction. A single tap ends any call immediately without awkward explanations. Strict zero-tolerance moderation protects everyone.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-left">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">PRIVATE</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Only your chosen first name, broad region, and practice interests are visible. No social handles, colleges, or contact numbers are ever exposed.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-left">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">CONFIDENT</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Interactive conversation cards and icebreakers prevent awkward silences. Gentle post-call suggestions encourage fluency without grammar shaming.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Regional Exposure Showcase */}
      <section className="py-12 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider">
              Accent Exposure & Diversity
            </span>
            <h2 className="text-2xl font-bold text-slate-900 font-display mt-1">
              Meet India Through Spoken English
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Break language barriers by practicing with learners from 5 major regions across 28 states and territories.
            </p>
          </div>
          <button
            onClick={onStart}
            className="self-start md:self-auto text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
          >
            <span>Start a conversation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(INDIAN_REGIONS).map(([regionName, info]) => (
            <div
              key={regionName}
              className="p-4 rounded-xl bg-white border border-slate-200 hover:border-teal-500/50 transition-colors text-left"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-slate-900">{regionName}</h4>
                <span className="text-[10px] text-teal-700 font-medium px-2 py-0.5 bg-teal-50 rounded-md">
                  Active Peers
                </span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {info.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
