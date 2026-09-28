import React, { useState } from 'react';
import { X, Sparkles, Shuffle, Check } from 'lucide-react';

interface ConversationCardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrompt: (prompt: string) => void;
  currentMode: string;
}

export const ConversationCardsModal: React.FC<ConversationCardsModalProps> = ({
  isOpen,
  onClose,
  onSelectPrompt,
  currentMode
}) => {
  if (!isOpen) return null;

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Cards' },
    { id: 'fun', label: 'Fun & Quirky' },
    { id: 'college', label: 'College & Youth' },
    { id: 'career', label: 'Career & Ambition' },
    { id: 'travel', label: 'Travel & Food' },
    { id: 'growth', label: 'Personal Growth' }
  ];

  const cards = [
    { category: 'fun', q: 'If you had to eat only one Indian street food for the rest of your life, which one would it be?' },
    { category: 'fun', q: 'What is one funny superstition or habit someone in your family strictly believes in?' },
    { category: 'college', q: 'What was the most challenging exam or presentation you ever gave, and how did you survive it?' },
    { category: 'college', q: 'If you could change one thing about the Indian university syllabus, what would it be?' },
    { category: 'career', q: 'Tell me about a skill you are learning right now to prepare for your dream job.' },
    { category: 'career', q: 'What kind of work culture excites you: fast-paced startup or structured company?' },
    { category: 'travel', q: 'Which hill station or beach in India made the deepest impression on your mind?' },
    { category: 'travel', q: 'What is one festival in your home state that people from other states must experience once?' },
    { category: 'growth', q: 'What is one habit you started this year that has made you calmer or more productive?' },
    { category: 'growth', q: 'How do you usually handle days when you feel nervous or lack self-confidence?' }
  ];

  const filtered = activeCategory === 'all' ? cards : cards.filter(c => c.category === activeCategory);

  const handlePickRandom = () => {
    const randomCard = cards[Math.floor(Math.random() * cards.length)];
    onSelectPrompt(randomCard.q);
    onClose();
  };

  const handleSelect = (q: string) => {
    setCopiedPrompt(q);
    onSelectPrompt(q);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-xl border border-slate-200 text-left max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>Conversation Rescue Cards</span>
            </h3>
            <p className="text-xs text-slate-500">
              Break awkward silences with an engaging question
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick roulette button */}
        <div className="py-3">
          <button
            onClick={handlePickRandom}
            className="w-full py-2.5 px-4 bg-teal-50 border border-teal-200 hover:bg-teal-100 text-teal-800 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Spin Topic Roulette (Random Card)</span>
          </button>
        </div>

        {/* Categories Tab Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Cards List */}
        <div className="overflow-y-auto space-y-2.5 my-3 pr-1 flex-1">
          {filtered.map((card, idx) => (
            <div
              key={idx}
              onClick={() => handleSelect(card.q)}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/30 cursor-pointer transition-all flex items-start justify-between gap-3 group"
            >
              <p className="text-xs text-slate-800 leading-relaxed font-medium">
                "{card.q}"
              </p>
              <button
                className={`p-1.5 rounded-lg shrink-0 transition-colors ${
                  copiedPrompt === card.q
                    ? 'bg-teal-600 text-white'
                    : 'text-slate-400 group-hover:text-teal-600 group-hover:bg-white'
                }`}
              >
                {copiedPrompt === card.q ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <span className="text-[11px] font-semibold">Use</span>
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            Remember: There are no right or wrong answers. Just share your view!
          </p>
        </div>
      </div>
    </div>
  );
};
