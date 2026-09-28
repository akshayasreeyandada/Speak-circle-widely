/**
 * Audio Service for SpeakCircle
 * Manages user microphone stream, real-time volume analysis, WebRTC/Broadcast signaling,
 * and audio responsiveness.
 */

export class AudioController {
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private micStream: MediaStream | null = null;
  private isMuted: boolean = false;
  private animationFrameId: number | null = null;

  async requestMicrophone(): Promise<{ success: boolean; error?: string }> {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return { success: false, error: 'Audio input is not supported in this browser.' };
      }

      this.micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
      const source = this.audioCtx.createMediaStreamSource(this.micStream);
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.6;
      source.connect(this.analyser);

      return { success: true };
    } catch (err: unknown) {
      console.warn('Microphone access note:', err);
      const message = err instanceof Error ? err.message : 'Permission denied or no microphone found.';
      return { success: false, error: message };
    }
  }

  getVolumeLevel(): number {
    if (!this.analyser || this.isMuted) return 0;
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    const average = sum / dataArray.length;
    // Normalized 0 to 1
    return Math.min(1, Math.max(0, average / 128));
  }

  toggleMute(): boolean {
    if (this.micStream) {
      this.micStream.getAudioTracks().forEach(track => {
        track.enabled = this.isMuted; // Toggle: if currently muted, enable track
      });
    }
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  getIsMuted(): boolean {
    return this.isMuted;
  }

  speakPartnerMessage(text: string, onEnd?: () => void) {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95; // Calm, steady pace
      utterance.pitch = 1.0;
      utterance.lang = 'en-IN'; // Indian English voice if available in system
      
      const voices = window.speechSynthesis.getVoices();
      const indianVoice = voices.find(v => v.lang.includes('en-IN') || v.name.includes('India') || v.lang === 'en_IN');
      if (indianVoice) {
        utterance.voice = indianVoice;
      }

      if (onEnd) {
        utterance.onend = onEnd;
      }
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis note:', e);
    }
  }

  stopPartnerVoice() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  cleanup() {
    this.stopPartnerVoice();
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.micStream) {
      this.micStream.getTracks().forEach(track => track.stop());
      this.micStream = null;
    }
    if (this.audioCtx && this.audioCtx.state !== 'closed') {
      this.audioCtx.close().catch(() => {});
      this.audioCtx = null;
    }
  }
}
