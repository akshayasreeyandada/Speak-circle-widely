/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { LandingPage } from './components/LandingPage';
import { HomeScreen } from './components/HomeScreen';
import { DiscoverScreen } from './components/DiscoverScreen';
import { PracticeScreen } from './components/PracticeScreen';
import { ProgressScreen } from './components/ProgressScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { MatchingScreen } from './components/MatchingScreen';
import { VoiceRoom } from './components/VoiceRoom';
import { PostConversationModal } from './components/PostConversationModal';
import { OnboardingModal } from './components/OnboardingModal';
import { SafetyCenterModal } from './components/SafetyCenterModal';
import { ReportModal } from './components/ReportModal';
import { AdminDashboard } from './components/AdminDashboard';
import { N8nChatWidget } from './components/N8nChatWidget';
import {
  UserProfile,
  PeerUser,
  ConversationSession,
  ConversationMode,
  RegionPreference,
  ConversationDuration,
  ConversationFeedback,
  RegionName,
  SpeakingChallenge
} from './types';
import {
  getStoredUser,
  saveStoredUser,
  recordInteraction,
  saveFeedback,
  blockUser
} from './services/storage';
import { CONVERSATION_TOPICS } from './data/topics';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(getStoredUser());
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [showLanding, setShowLanding] = useState<boolean>(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isSafetyOpen, setIsSafetyOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  // Matching & Active Voice Call States
  const [isMatching, setIsMatching] = useState<boolean>(false);
  const [matchingParams, setMatchingParams] = useState<{
    mode: ConversationMode;
    regionPreference: RegionPreference;
    duration: ConversationDuration;
    fearFree: boolean;
  }>({
    mode: 'casual',
    regionPreference: 'different_region',
    duration: 10,
    fearFree: false
  });

  const [activeSession, setActiveSession] = useState<ConversationSession | null>(null);

  // Post-Call Feedback Modal State
  const [endedSessionData, setEndedSessionData] = useState<{
    session: ConversationSession;
    durationMinutes: number;
  } | null>(null);

  // Report Modal State
  const [reportingPeer, setReportingPeer] = useState<PeerUser | null>(null);

  // Save changes to local storage when user updates
  const handleUpdateUser = (updated: UserProfile) => {
    setCurrentUser(updated);
    saveStoredUser(updated);
  };

  const handleStartMatching = (params: {
    mode: ConversationMode;
    regionPreference: RegionPreference;
    duration: ConversationDuration;
    fearFree: boolean;
  }) => {
    setMatchingParams(params);
    setIsMatching(true);
  };

  const handleMatchFound = (partner: PeerUser) => {
    setIsMatching(false);

    // Find topic corresponding to selected mode
    const topicsForMode = CONVERSATION_TOPICS.filter(t => t.category === matchingParams.mode);
    const chosenTopic = topicsForMode.length > 0
      ? topicsForMode[Math.floor(Math.random() * topicsForMode.length)]
      : CONVERSATION_TOPICS[0];

    const session: ConversationSession = {
      id: `call_${Date.now()}`,
      partner,
      mode: matchingParams.mode,
      topicTitle: chosenTopic.title,
      topicQuestion: chosenTopic.question,
      durationMinutes: matchingParams.duration,
      startTime: Date.now(),
      elapsedSeconds: 0,
      status: 'active',
      role: matchingParams.mode === 'interview' ? 'candidate' : undefined,
      icebreakersUsed: []
    };

    recordInteraction(partner.id);
    setActiveSession(session);
  };

  const handleDirectConnectWithPeer = (peer: PeerUser) => {
    const session: ConversationSession = {
      id: `call_${Date.now()}`,
      partner: peer,
      mode: 'casual',
      topicTitle: 'Weekend Passions & Hometown Flavors',
      topicQuestion: `What is something you love doing on a free day in ${peer.state}?`,
      durationMinutes: currentUser.preferredDuration,
      startTime: Date.now(),
      elapsedSeconds: 0,
      status: 'active',
      icebreakersUsed: []
    };

    recordInteraction(peer.id);
    setActiveSession(session);
  };

  const handleStartWithRegion = (region: RegionName) => {
    handleStartMatching({
      mode: 'casual',
      regionPreference: region === currentUser.region ? 'same_region' : 'different_region',
      duration: currentUser.preferredDuration,
      fearFree: currentUser.fearFreeMode
    });
  };

  const handleStartChallengeCall = (challenge: SpeakingChallenge) => {
    setMatchingParams({
      mode: 'challenge',
      regionPreference: 'any',
      duration: 5,
      fearFree: false
    });
    setIsMatching(true);
  };

  const handleEndCall = (actualMinutes: number) => {
    if (!activeSession) return;
    const sessionCopy = { ...activeSession, status: 'ended' as const };
    setActiveSession(null);

    // Update user stats
    const updatedStates = currentUser.statesSpokenWith.includes(sessionCopy.partner.state)
      ? currentUser.statesSpokenWith
      : [...currentUser.statesSpokenWith, sessionCopy.partner.state];

    const updatedUser: UserProfile = {
      ...currentUser,
      completedConversations: currentUser.completedConversations + 1,
      totalSpeakingMinutes: currentUser.totalSpeakingMinutes + actualMinutes,
      statesSpokenWith: updatedStates
    };
    handleUpdateUser(updatedUser);

    setEndedSessionData({
      session: sessionCopy,
      durationMinutes: actualMinutes
    });
  };

  const handleFinishFeedback = (feedback: ConversationFeedback) => {
    saveFeedback(feedback);
  };

  const handleReportUser = (peer: PeerUser) => {
    setReportingPeer(peer);
  };

  const handleBlockUser = (peer: PeerUser) => {
    blockUser(peer.id);
    if (activeSession && activeSession.partner.id === peer.id) {
      handleEndCall(1);
    }
  };

  const handleResetAccount = () => {
    localStorage.clear();
    const freshUser: UserProfile = {
      id: `user_${Date.now()}`,
      displayName: 'Learner',
      avatarId: 'avatar-1',
      state: 'Karnataka',
      region: 'South India',
      englishLevel: 'Intermediate',
      interests: ['Career', 'Daily Life'],
      preferredDuration: 10,
      preferredModes: ['casual'],
      fearFreeMode: false,
      isAgeConfirmed: true,
      guidelinesAccepted: true,
      joinedDate: '2026-02-14',
      reputationScore: 100,
      trustedBadge: true,
      completedConversations: 0,
      totalSpeakingMinutes: 0,
      currentStreakDays: 1,
      statesSpokenWith: [],
      confidenceRating: 3
    };
    saveStoredUser(freshUser);
    setCurrentUser(freshUser);
    setIsOnboardingOpen(true);
  };

  const isInCall = activeSession !== null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Top Bar Contract compliant Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={tab => {
          setShowLanding(false);
          setCurrentTab(tab);
        }}
        user={currentUser}
        onOpenSafety={() => setIsSafetyOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        isInCall={isInCall}
      />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col">
        {showLanding ? (
          <LandingPage
            onStart={() => {
              setShowLanding(false);
              setCurrentTab('home');
            }}
            onExploreRegions={() => {
              setShowLanding(false);
              setCurrentTab('discover');
            }}
          />
        ) : (
          <>
            {currentTab === 'home' && (
              <HomeScreen
                user={currentUser}
                onStartMatching={handleStartMatching}
                onOpenPractice={() => setCurrentTab('practice')}
                onOpenDiscover={() => setCurrentTab('discover')}
              />
            )}

            {currentTab === 'discover' && (
              <DiscoverScreen
                onSelectPeerForMatch={handleDirectConnectWithPeer}
                onStartWithRegion={handleStartWithRegion}
              />
            )}

            {currentTab === 'practice' && (
              <PracticeScreen onStartChallengeCall={handleStartChallengeCall} />
            )}

            {currentTab === 'progress' && (
              <ProgressScreen user={currentUser} onUpdateUser={handleUpdateUser} />
            )}

            {currentTab === 'profile' && (
              <ProfileScreen
                user={currentUser}
                onUpdateUser={handleUpdateUser}
                onOpenSafety={() => setIsSafetyOpen(true)}
                onOpenAdmin={() => setIsAdminOpen(true)}
                onResetAccount={handleResetAccount}
              />
            )}
          </>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={tab => {
          setShowLanding(false);
          setCurrentTab(tab);
        }}
        isInCall={isInCall}
      />

      {/* Matching Screen Overlay */}
      {isMatching && (
        <MatchingScreen
          user={currentUser}
          mode={matchingParams.mode}
          regionPreference={matchingParams.regionPreference}
          duration={matchingParams.duration}
          fearFree={matchingParams.fearFree}
          onMatchFound={handleMatchFound}
          onCancel={() => setIsMatching(false)}
        />
      )}

      {/* Voice Room (Active Call) */}
      {activeSession && (
        <VoiceRoom
          session={activeSession}
          user={currentUser}
          onEndCall={handleEndCall}
          onReportUser={handleReportUser}
          onBlockUser={handleBlockUser}
        />
      )}

      {/* Post-Call Feedback Modal */}
      {endedSessionData && (
        <PostConversationModal
          session={endedSessionData.session}
          durationMinutes={endedSessionData.durationMinutes}
          onFinishFeedback={handleFinishFeedback}
          onTalkAgain={() => {
            setEndedSessionData(null);
            handleStartMatching(matchingParams);
          }}
          onGoHome={() => {
            setEndedSessionData(null);
            setCurrentTab('home');
          }}
          onOpenReport={handleReportUser}
        />
      )}

      {/* Safety Center Modal */}
      <SafetyCenterModal
        isOpen={isSafetyOpen}
        onClose={() => setIsSafetyOpen(false)}
      />

      {/* Report Modal */}
      <ReportModal
        isOpen={reportingPeer !== null}
        peer={reportingPeer}
        reporterId={currentUser.id}
        onClose={() => setReportingPeer(null)}
        onReportSubmitted={() => setReportingPeer(null)}
      />

      {/* Admin Moderation Dashboard */}
      {isAdminOpen && <AdminDashboard onClose={() => setIsAdminOpen(false)} />}

      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onComplete={user => {
          handleUpdateUser(user);
          setIsOnboardingOpen(false);
        }}
        initialUser={currentUser}
      />

      {/* n8n AI English Practice Chatbot Widget */}
      <N8nChatWidget isInCall={activeSession !== null && activeSession.status === 'active'} />
    </div>
  );
}
