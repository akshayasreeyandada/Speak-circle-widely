import React from 'react';
import { MessageSquare, Compass, Sparkles, BarChart2, User } from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isInCall: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab, isInCall }) => {
  if (isInCall) return null; // Distraction-free voice room

  const tabs = [
    { id: 'home', label: 'Speak', icon: MessageSquare },
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'practice', label: 'Practice', icon: Sparkles },
    { id: 'progress', label: 'Progress', icon: BarChart2 },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200">
      <div className="grid grid-cols-5 items-center h-16 max-w-lg mx-auto px-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
                isActive ? 'text-teal-700 font-semibold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className={`p-1 rounded-lg transition-transform ${isActive ? 'scale-110' : ''}`}>
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.3 : 1.8} />
              </div>
              <span className="text-[11px] tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
