import { ConversationMode, ConversationTopic } from '../types';

export const CONVERSATION_TOPICS: ConversationTopic[] = [
  // Casual
  {
    id: 'c1',
    category: 'casual',
    subcategory: 'Hobbies & Passions',
    title: 'Weekend Passions',
    question: 'What is something you love doing on a free Sunday afternoon?',
    starterPrompts: [
      'Do you prefer indoor activities or outdoor hobbies?',
      'Is there a new hobby you want to start this year?',
      'How do you unwind after a long day of study or work?'
    ]
  },
  {
    id: 'c2',
    category: 'casual',
    subcategory: 'Movies & Stories',
    title: 'Cinema & Series',
    question: 'What is the last movie or web series that made a strong impression on you?',
    starterPrompts: [
      'What genre do you enjoy the most — thriller, comedy, or drama?',
      'Do you watch regional cinema with subtitles or Bollywood/Hollywood?',
      'If you could recommend one movie to anyone, what would it be?'
    ]
  },
  {
    id: 'c3',
    category: 'casual',
    subcategory: 'Food & Flavors',
    title: 'Comfort Food from Home',
    question: 'What is your favorite dish from your home state that everyone should try?',
    starterPrompts: [
      'Do you like cooking, or do you prefer eating out?',
      'Street food vs home-cooked food — which one wins for you?',
      'What is the spiciest food you have ever tasted?'
    ]
  },
  {
    id: 'c4',
    category: 'casual',
    subcategory: 'Travel & Exploration',
    title: 'Dream Destination in India',
    question: 'If you had a free ticket to travel anywhere in India tomorrow, where would you go?',
    starterPrompts: [
      'Do you love mountains or beaches more?',
      'Tell me about your most memorable journey so far.',
      'Do you prefer solo trips or traveling with family and friends?'
    ]
  },
  {
    id: 'c5',
    category: 'casual',
    subcategory: 'College & Life',
    title: 'Student Life Memories',
    question: 'What is one funny or memorable memory from your school or college days?',
    starterPrompts: [
      'Which subject was your absolute favorite, and which was the toughest?',
      'What is one life lesson you learned outside of textbooks?',
      'Do you keep in touch with your childhood friends?'
    ]
  },

  // Interview Practice
  {
    id: 'i1',
    category: 'interview',
    subcategory: 'Core Introductions',
    title: 'Tell Me About Yourself',
    question: 'How would you introduce your background, skills, and aspirations in 2 minutes?',
    starterPrompts: [
      'Start with your academic/work foundation.',
      'Highlight 1-2 major achievements or projects.',
      'Explain what kind of work excites you right now.'
    ]
  },
  {
    id: 'i2',
    category: 'interview',
    subcategory: 'Self-Awareness',
    title: 'Key Strengths & Growth Areas',
    question: 'What is your greatest professional or personal strength, and how has it helped you?',
    starterPrompts: [
      'Can you share a specific situation where this strength made a difference?',
      'What is one skill you are actively working to improve this month?',
      'How do you handle constructive feedback from others?'
    ]
  },
  {
    id: 'i3',
    category: 'interview',
    subcategory: 'Value & Impact',
    title: 'Why Should We Hire You?',
    question: 'What makes your approach to work or learning unique and valuable for a team?',
    starterPrompts: [
      'Think about your curiosity, discipline, or problem-solving mindset.',
      'How quickly do you adapt when something new is assigned to you?',
      'Give an example of going beyond what was asked.'
    ]
  },
  {
    id: 'i4',
    category: 'interview',
    subcategory: 'Future Vision',
    title: 'Five-Year Vision',
    question: 'Where do you see yourself growing professionally over the next five years?',
    starterPrompts: [
      'What kind of responsibilities do you look forward to taking on?',
      'How do you plan to keep your skills modern and relevant?',
      'What does personal success look like to you?'
    ]
  },
  {
    id: 'i5',
    category: 'interview',
    subcategory: 'Project Walkthrough',
    title: 'Describe a Project You Worked On',
    question: 'Explain a project or assignment you worked on from problem to solution.',
    starterPrompts: [
      'What was the main goal and what tools did you use?',
      'What unexpected roadblock did you run into, and how did you solve it?',
      'What would you do differently if you built it again today?'
    ]
  },

  // Knowledge Talk
  {
    id: 'k1',
    category: 'knowledge',
    subcategory: 'Technology & AI',
    title: 'Everyday Technology Shift',
    question: 'How has mobile technology or smartphone apps changed life in your hometown?',
    starterPrompts: [
      'Think about digital payments (UPI), online shopping, or video calls.',
      'Do you think technology makes us more connected or more distracted?',
      'What new tech tool have you recently started using?'
    ]
  },
  {
    id: 'k2',
    category: 'knowledge',
    subcategory: 'Education & Careers',
    title: 'Future of Education in India',
    question: 'Do you think online learning will replace traditional college degrees?',
    starterPrompts: [
      'What are the best parts of studying on YouTube or online platforms?',
      'What do students miss out on when they don’t attend campus in person?',
      'What practical skills should colleges teach more of?'
    ]
  },
  {
    id: 'k3',
    category: 'knowledge',
    subcategory: 'Environment & Cities',
    title: 'Green Living & Clean Cities',
    question: 'What is one simple environmental habit you practice or would like to see in your neighborhood?',
    starterPrompts: [
      'Public transport vs electric two-wheelers in Indian cities.',
      'How can we reduce plastic waste in daily grocery shopping?',
      'Which Indian city do you think manages cleanliness best?'
    ]
  },

  // Discussion & Debate
  {
    id: 'd1',
    category: 'debate',
    subcategory: 'Workplace Trends',
    title: 'Work From Home vs Office Collaboration',
    question: 'Do people work better from home or together in an office space?',
    starterPrompts: [
      'Think about commute time saved vs team bonding.',
      'How does work-from-home affect beginners who need guidance?',
      'What would your ideal hybrid schedule look like?'
    ]
  },
  {
    id: 'd2',
    category: 'debate',
    subcategory: 'Modern Habits',
    title: 'Printed Books vs Digital Screens',
    question: 'Do you absorb knowledge better from physical books or audiobooks and e-readers?',
    starterPrompts: [
      'The tactile feel and focus of paper without phone notifications.',
      'The convenience of carrying 100 books on a Kindle or phone.',
      'How have your reading habits changed over the past 3 years?'
    ]
  },
  {
    id: 'd3',
    category: 'debate',
    subcategory: 'City Life',
    title: 'Metros vs Tier-2 / Hometown Living',
    question: 'Is it better to build a career in a big metro (Bengaluru, Mumbai, Delhi) or in emerging cities?',
    starterPrompts: [
      'Comparing opportunities with cost of living and pollution.',
      'How remote work has empowered talent in smaller cities.',
      'Where do you see yourself living happily long-term?'
    ]
  }
];

export const ICEBREAKER_QUESTIONS = [
  'What is one skill you really want to learn or improve this year?',
  'If you could have dinner with any historical or modern personality from India, who would it be?',
  'What is the most beautiful place in your state that tourists often miss?',
  'What morning habit helps you start your day on a positive note?',
  'If you were invited to give a 10-minute speech on any topic without preparation, what would you speak about?',
  'What is something people often misunderstand about your home city or state?',
  'What was your dream job when you were 10 years old?',
  'What is one podcast, book, or YouTube channel that taught you something valuable recently?'
];

export const FEAR_FREE_TIPS = [
  'Breathe gently. There is no test here — your partner is also practicing.',
  'It is completely okay to pause, say "um", or search for a word.',
  'Focus on making your idea understood, not on grammar rules.',
  'You can tap "Help me continue" anytime if you run out of things to say.'
];
