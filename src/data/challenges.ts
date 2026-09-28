import { SpeakingChallenge } from '../types';

export const DAILY_CHALLENGES: SpeakingChallenge[] = [
  {
    id: 'day-1',
    day: 1,
    title: 'The 60-Second Self-Introduction',
    prompt: 'Introduce yourself without stating your company or college. Focus on your passions, where you grew up, and what drives you.',
    timeSeconds: 60,
    category: 'Foundations',
    hints: [
      'Start with: "Hello! My name is..., and I love exploring..."',
      'Mention one unique curiosity you have.',
      'Speak at a steady, relaxed pace.'
    ]
  },
  {
    id: 'day-2',
    day: 2,
    title: 'The Movie That Moved You',
    prompt: 'Speak for 60 seconds about a movie or web series that made you smile, think, or cry. What made the story memorable?',
    timeSeconds: 60,
    category: 'Storytelling',
    hints: [
      'Name the characters or setting briefly.',
      'Describe the main turning point.',
      'Explain how it made you feel afterward.'
    ]
  },
  {
    id: 'day-3',
    day: 3,
    title: 'Your Ideal Career Day',
    prompt: 'Describe what your dream job looks like from morning coffee to the end of the day. What problems do you solve?',
    timeSeconds: 60,
    category: 'Aspiration',
    hints: [
      'Focus on the kind of impact you want to create.',
      'Describe the atmosphere and the teammates around you.',
      'Why does this work give you satisfaction?'
    ]
  },
  {
    id: 'day-4',
    day: 4,
    title: 'A Challenge Students Face',
    prompt: 'Talk about a common hurdle students in India face today (e.g., exam pressure, career confusion, spoken English hesitations) and your perspective.',
    timeSeconds: 60,
    category: 'Critical Thinking',
    hints: [
      'Identify the root cause of the pressure.',
      'Share how you or your friends cope with it.',
      'Suggest one positive change that could help.'
    ]
  },
  {
    id: 'day-5',
    day: 5,
    title: 'A Hometown Treasure',
    prompt: 'Describe your hometown or village to someone who has never been there. Focus on smells, sights, food, and people.',
    timeSeconds: 60,
    category: 'Descriptive',
    hints: [
      'Use vivid sensory adjectives (crisp, lively, fragrant, tranquil).',
      'Mention a specific local market, street corner, or temple/monument.',
      'Why do you hold a special connection with it?'
    ]
  },
  {
    id: 'day-6',
    day: 6,
    title: 'The Skill You Yearn to Master',
    prompt: 'What is one skill (playing an instrument, public speaking, coding, cooking) you wish you had learned earlier in life?',
    timeSeconds: 60,
    category: 'Reflection',
    hints: [
      'What stopped you in the past?',
      'How would having this skill change your daily life today?',
      'What small step can you take this week towards it?'
    ]
  },
  {
    id: 'day-7',
    day: 7,
    title: 'A Kindness You Remember',
    prompt: 'Talk about a small act of kindness you received from a stranger or teacher that you still remember fondly.',
    timeSeconds: 60,
    category: 'Gratitude',
    hints: [
      'Set the scene: what were you worried about?',
      'What did that person say or do?',
      'How did it restore your confidence?'
    ]
  }
];
