import { UserProfile, ConversationFeedback, ReportItem, PeerUser } from '../types';
import { MOCK_PEERS } from '../data/mockPeers';

const STORAGE_KEYS = {
  CURRENT_USER: 'speakcircle_current_user',
  BLOCKED_IDS: 'speakcircle_blocked_ids',
  INTERACTION_HISTORY: 'speakcircle_interaction_history',
  FEEDBACK_LIST: 'speakcircle_feedback_list',
  REPORTS_LIST: 'speakcircle_reports_list',
  ADMIN_LOGS: 'speakcircle_admin_logs',
  MODERATION_ACTIONS: 'speakcircle_moderation_actions'
};

const DEFAULT_USER: UserProfile = {
  id: 'user_self_01',
  displayName: 'Akash',
  avatarId: 'avatar-1',
  state: 'Andhra Pradesh',
  region: 'South India',
  englishLevel: 'Intermediate',
  interests: ['Technology', 'Movies', 'Interviews'],
  preferredDuration: 10,
  preferredModes: ['casual', 'interview'],
  fearFreeMode: false,
  isAgeConfirmed: true,
  guidelinesAccepted: true,
  joinedDate: '2026-02-14',
  reputationScore: 98,
  trustedBadge: true,
  completedConversations: 8,
  totalSpeakingMinutes: 72,
  currentStreakDays: 3,
  statesSpokenWith: ['Delhi', 'Maharashtra', 'Karnataka', 'West Bengal'],
  confidenceRating: 4
};

export const getStoredUser = (): UserProfile => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read user from storage', e);
  }
  return DEFAULT_USER;
};

export const saveStoredUser = (user: UserProfile) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } catch (e) {
    console.error('Failed to write user to storage', e);
  }
};

export const getBlockedUserIds = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BLOCKED_IDS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return [];
};

export const blockUser = (peerId: string) => {
  const current = getBlockedUserIds();
  if (!current.includes(peerId)) {
    const updated = [...current, peerId];
    localStorage.setItem(STORAGE_KEYS.BLOCKED_IDS, JSON.stringify(updated));
  }
};

export const unblockUser = (peerId: string) => {
  const current = getBlockedUserIds();
  const updated = current.filter(id => id !== peerId);
  localStorage.setItem(STORAGE_KEYS.BLOCKED_IDS, JSON.stringify(updated));
};

export const getInteractionHistory = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INTERACTION_HISTORY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return [];
};

export const recordInteraction = (peerId: string) => {
  const history = getInteractionHistory();
  const updated = [peerId, ...history.filter(id => id !== peerId)].slice(0, 30);
  localStorage.setItem(STORAGE_KEYS.INTERACTION_HISTORY, JSON.stringify(updated));
};

export const getStoredReports = (): ReportItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REPORTS_LIST);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  // Initial realistic sample reports in admin moderation queue
  return [
    {
      id: 'rep-01',
      reporterId: 'peer-2',
      reportedUserId: 'bad-actor-99',
      reportedUserName: 'RandomGuy99',
      category: 'Asking for personal information',
      description: 'The user kept persistently asking for my private WhatsApp phone number even after I declined.',
      timestamp: Date.now() - 1000 * 60 * 60 * 5,
      status: 'pending'
    },
    {
      id: 'rep-02',
      reporterId: 'peer-4',
      reportedUserId: 'troll-42',
      reportedUserName: 'Anonymo',
      category: 'Abusive language',
      description: 'Used disrespectful slurs during debate mode.',
      timestamp: Date.now() - 1000 * 60 * 60 * 18,
      status: 'warning_issued',
      actionTaken: 'Formal 1st Warning Issued. Future incidents will result in suspension.'
    }
  ];
};

export const submitReport = (report: Omit<ReportItem, 'id' | 'timestamp' | 'status'>): ReportItem => {
  const reports = getStoredReports();
  const newReport: ReportItem = {
    ...report,
    id: `rep-${Date.now()}`,
    timestamp: Date.now(),
    status: 'pending'
  };
  const updated = [newReport, ...reports];
  localStorage.setItem(STORAGE_KEYS.REPORTS_LIST, JSON.stringify(updated));
  return newReport;
};

export const updateReportStatus = (reportId: string, status: ReportItem['status'], actionTaken?: string) => {
  const reports = getStoredReports();
  const updated = reports.map(r => (r.id === reportId ? { ...r, status, actionTaken } : r));
  localStorage.setItem(STORAGE_KEYS.REPORTS_LIST, JSON.stringify(updated));
};

export const getFeedbackHistory = (): ConversationFeedback[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FEEDBACK_LIST);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return [
    {
      sessionId: 'sess-prev-1',
      partnerId: 'peer-1',
      partnerName: 'Aarav',
      rating: 'Comfortable',
      durationMinutes: 10,
      mode: 'casual',
      suggestions: ['Great natural flow! Try speaking with slightly longer sentences.'],
      timestamp: Date.now() - 1000 * 60 * 60 * 24
    },
    {
      sessionId: 'sess-prev-2',
      partnerId: 'peer-3',
      partnerName: 'Rohan',
      rating: 'Helpful',
      durationMinutes: 12,
      mode: 'interview',
      suggestions: ['Strong points on the strengths question. Keep steady pacing.'],
      timestamp: Date.now() - 1000 * 60 * 60 * 48
    }
  ];
};

export const saveFeedback = (feedback: ConversationFeedback) => {
  const current = getFeedbackHistory();
  const updated = [feedback, ...current];
  localStorage.setItem(STORAGE_KEYS.FEEDBACK_LIST, JSON.stringify(updated));
};
