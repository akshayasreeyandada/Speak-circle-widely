import React from 'react';
import { ShieldCheck, UserCheck } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  user: UserProfile;
  onOpenSafety: () => void;
  onOpenAdmin: () => void;
  isInCall: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  user,
  onOpenSafety,
  onOpenAdmin,
  isInCall
}) => {
  if (isInCall) return null; // Distraction-free voice call mode

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onSelectTab('home')}
          className="text-xl font-bold tracking-tight text-slate-900 font-display flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <span className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">
            SC
          </span>
          <span>SpeakCircle</span>
        </button>

        {/* Zone 2: Clean text navigation links (hidden on mobile, visible on desktop) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button
            onClick={() => onSelectTab('home')}
            className={`transition-colors hover:text-slate-900 ${currentTab === 'home' ? 'text-teal-700 font-semibold underline underline-offset-8 decoration-2 decoration-teal-600' : ''}`}
          >
            Home
          </button>
          <button
            onClick={() => onSelectTab('discover')}
            className={`transition-colors hover:text-slate-900 ${currentTab === 'discover' ? 'text-teal-700 font-semibold underline underline-offset-8 decoration-2 decoration-teal-600' : ''}`}
          >
            Discover
          </button>
          <button
            onClick={() => onSelectTab('practice')}
            className={`transition-colors hover:text-slate-900 ${currentTab === 'practice' ? 'text-teal-700 font-semibold underline underline-offset-8 decoration-2 decoration-teal-600' : ''}`}
          >
            Practice
          </button>
          <button
            onClick={() => onSelectTab('progress')}
            className={`transition-colors hover:text-slate-900 ${currentTab === 'progress' ? 'text-teal-700 font-semibold underline underline-offset-8 decoration-2 decoration-teal-600' : ''}`}
          >
            My Progress
          </button>
          <button
            onClick={() => onSelectTab('profile')}
            className={`transition-colors hover:text-slate-900 ${currentTab === 'profile' ? 'text-teal-700 font-semibold underline underline-offset-8 decoration-2 decoration-teal-600' : ''}`}
          >
            Profile
          </button>
        </nav>

        {/* Zone 3: Primary actions & safety */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSafety}
            title="Safety Center & Guidelines"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span className="hidden sm:inline">Safety</span>
          </button>

          <button
            onClick={onOpenAdmin}
            title="Moderation Console"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
          >
            <span>Moderation</span>
          </button>

          <button
            onClick={() => onSelectTab('profile')}
            className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-colors"
            title={`${user.displayName} (${user.region})`}
          >
            <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs ring-2 ring-teal-600/20">
              {user.displayName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden lg:block text-left pr-1">
              <p className="text-xs font-semibold text-slate-800 leading-tight">{user.displayName}</p>
              <p className="text-[11px] text-slate-500 leading-none">{user.englishLevel}</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
