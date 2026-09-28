export type RegionName = 'South India' | 'North India' | 'West India' | 'East India' | 'Northeast India';

export type EnglishLevel = 'Beginner' | 'Basic' | 'Intermediate' | 'Comfortable' | 'Advanced';

export type ConversationMode = 'casual' | 'interview' | 'knowledge' | 'debate' | 'random' | 'challenge';

export type RegionPreference = 'any' | 'different_region' | 'same_region' | 'same_state';

export type ConversationDuration = 5 | 10 | 15;

export interface UserProfile {
  id: string;
  displayName: string;
  avatarId: string;
  state: string;
  region: RegionName;
  englishLevel: EnglishLevel;
  interests: string[];
  preferredDuration: ConversationDuration;
  preferredModes: ConversationMode[];
  fearFreeMode: boolean;
  isAgeConfirmed: boolean;
  guidelinesAccepted: boolean;
  joinedDate: string;
  reputationScore: number;
  trustedBadge: boolean;
  completedConversations: number;
  totalSpeakingMinutes: number;
  currentStreakDays: number;
  statesSpokenWith: string[];
  confidenceRating: number; // 1 to 5
  isSuspended?: boolean;
  isBanned?: boolean;
}

export interface PeerUser {
  id: string;
  displayName: string;
  avatarId: string;
  state: string;
  region: RegionName;
  englishLevel: EnglishLevel;
  interests: string[];
  preferredModes: ConversationMode[];
  trustedBadge: boolean;
  bioTagline: string;
  status: 'online' | 'in_call' | 'ready';
  accentNote: string;
}

export interface ConversationSession {
  id: string;
  partner: PeerUser;
  mode: ConversationMode;
  topicTitle: string;
  topicQuestion: string;
  durationMinutes: ConversationDuration;
  startTime: number;
  elapsedSeconds: number;
  status: 'active' | 'ended';
  role?: 'interviewer' | 'candidate';
  icebreakersUsed: string[];
}

export interface ConversationFeedback {
  sessionId: string;
  partnerId: string;
  partnerName: string;
  rating: 'Comfortable' | 'Helpful' | 'Difficult' | 'Uncomfortable';
  durationMinutes: number;
  mode: ConversationMode;
  notes?: string;
  suggestions: string[];
  timestamp: number;
}

export interface ReportItem {
  id: string;
  reporterId: string;
  reportedUserId: string;
  reportedUserName: string;
  category: 
    | 'Abusive language'
    | 'Harassment'
    | 'Sexual / inappropriate conversation'
    | 'Hate speech'
    | 'Threatening behavior'
    | 'Spam'
    | 'Asking for personal information'
    | 'Repeated unwanted interaction'
    | 'Other';
  description: string;
  timestamp: number;
  status: 'pending' | 'warning_issued' | 'suspended' | 'dismissed';
  actionTaken?: string;
}

export interface SpeakingChallenge {
  id: string;
  day: number;
  title: string;
  prompt: string;
  timeSeconds: number;
  category: string;
  hints: string[];
}

export interface ConversationTopic {
  id: string;
  category: ConversationMode;
  subcategory: string;
  title: string;
  question: string;
  starterPrompts: string[];
}
