/**
 * Web Speech API Engine for VoiceHire AI
 * English-only SpeechRecognition (en-US) & SpeechSynthesis
 * Resilient continuous listening, interim execution, silence timeout,
 * and punctuation-safe command dispatching.
 */

export interface SpeechRecognitionEvent extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
        confidence: number;
      };
      isFinal: boolean;
    };
    length: number;
  };
  resultIndex: number;
}

export type VoiceStatus = 'idle' | 'listening' | 'speaking' | 'unsupported';

export class VoiceEngine {
  private recognition: any = null;
  private synthesis: SpeechSynthesis | null = null;
  private isListening: boolean = false;
  private currentLanguage: string = 'en-US';
  private onCommandCallback: ((transcript: string) => void) | null = null;
  private onInterimCallback: ((interim: string) => void) | null = null;
  private onStatusCallback: ((status: VoiceStatus) => void) | null = null;
  private onErrorCallback: ((errorMsg: string) => void) | null = null;
  
  private restartTimeout: any = null;
  private interimFallbackTimeout: any = null;
  private lastExecutedTranscript: string = '';
  private lastExecutedTime: number = 0;
  private micPermissionGranted: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        try {
          this.recognition = new SpeechRecognition();
          this.recognition.continuous = true;
          this.recognition.interimResults = true;
          this.recognition.maxAlternatives = 1;
          this.recognition.lang = 'en-US';

          this.recognition.onstart = () => {
            this.isListening = true;
            this.micPermissionGranted = true;
            this.notifyStatus('listening');
          };

          this.recognition.onresult = (event: SpeechRecognitionEvent) => {
            let interimTranscript = '';
            let finalTranscript = '';

            // Standard W3C resultIndex processing
            for (let i = event.resultIndex; i < event.results.length; ++i) {
              const res = event.results[i];
              if (res && res[0]) {
                const chunk = res[0].transcript;
                if (res.isFinal) {
                  finalTranscript += ' ' + chunk;
                } else {
                  interimTranscript += ' ' + chunk;
                }
              }
            }

            interimTranscript = interimTranscript.trim();
            finalTranscript = finalTranscript.trim();

            if (interimTranscript) {
              if (this.onInterimCallback) {
                this.onInterimCallback(interimTranscript);
              }

              // Check for instant trigger keywords in interim results to eliminate wait time!
              const instantTrigger = this.checkInstantInterimExecution(interimTranscript);
              if (instantTrigger) {
                clearTimeout(this.interimFallbackTimeout);
                this.dispatchCommand(interimTranscript);
                return;
              }

              // If browser delays isFinal, auto-dispatch after 700ms of user silence
              clearTimeout(this.interimFallbackTimeout);
              this.interimFallbackTimeout = setTimeout(() => {
                if (interimTranscript && this.isListening) {
                  this.dispatchCommand(interimTranscript);
                  if (this.onInterimCallback) {
                    this.onInterimCallback('');
                  }
                }
              }, 700);
            }

            if (finalTranscript) {
              clearTimeout(this.interimFallbackTimeout);
              if (this.onInterimCallback) {
                this.onInterimCallback('');
              }
              this.dispatchCommand(finalTranscript);
            }
          };

          this.recognition.onerror = (e: any) => {
            console.warn('[VoiceEngine] Recognition notice:', e.error);
            if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
              this.isListening = false;
              this.micPermissionGranted = false;
              this.notifyStatus('unsupported');
              if (this.onErrorCallback) {
                this.onErrorCallback('Microphone permission was not allowed. Click the microphone button to grant access.');
              }
            } else if (e.error === 'no-speech') {
              // Expected pause from speaker; continuous listening handles this
            } else if (e.error === 'audio-capture') {
              this.notifyStatus('idle');
              if (this.onErrorCallback) {
                this.onErrorCallback('No microphone audio detected. Please check your mic connection.');
              }
            }
          };

          this.recognition.onend = () => {
            // Keep listening continuously if user activated voice
            if (this.isListening) {
              clearTimeout(this.restartTimeout);
              this.restartTimeout = setTimeout(() => {
                if (this.isListening && this.recognition) {
                  try {
                    this.recognition.lang = 'en-US';
                    this.recognition.start();
                  } catch (err: any) {
                    // Ignore if already starting or active
                    if (err.name !== 'InvalidStateError') {
                      console.warn('[VoiceEngine] Restart notice:', err);
                    }
                  }
                }
              }, 150);
            } else {
              this.notifyStatus('idle');
            }
          };
        } catch (err) {
          console.error('[VoiceEngine] Failed to initialize SpeechRecognition:', err);
        }
      }

      if ('speechSynthesis' in window) {
        this.synthesis = window.speechSynthesis;
      }
    }
  }

  /**
   * Fast recognition of single-word or short imperative commands in interim speech
   */
  private checkInstantInterimExecution(text: string): boolean {
    const clean = text.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '').trim();
    const instantWords = [
      'stop', 'quiet', 'silence', 'pause',
      'apply', 'apply now',
      'job seeker', 'recruiter',
      'next', 'next job',
      'previous', 'previous job',
      'read', 'read job',
      'summarize', 'simplify',
      'home', 'jobs', 'profile', 'applications'
    ];
    return instantWords.includes(clean);
  }

  private dispatchCommand(rawText: string) {
    const clean = rawText.trim();
    if (!clean) return;

    const normalized = clean.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '').trim();
    const now = Date.now();

    // Prevent duplicated triggers within 800ms
    if (normalized === this.lastExecutedTranscript && now - this.lastExecutedTime < 800) {
      return;
    }

    this.lastExecutedTranscript = normalized;
    this.lastExecutedTime = now;

    if (this.onCommandCallback) {
      this.onCommandCallback(clean);
    }
  }

  public isSupported(): boolean {
    return Boolean(this.recognition);
  }

  public getIsListening(): boolean {
    return this.isListening;
  }

  public setCallbacks(
    onCommand: (transcript: string) => void,
    onStatus: (status: VoiceStatus) => void,
    onInterim?: (interim: string) => void,
    onError?: (errorMsg: string) => void
  ) {
    this.onCommandCallback = onCommand;
    this.onStatusCallback = onStatus;
    if (onInterim) this.onInterimCallback = onInterim;
    if (onError) this.onErrorCallback = onError;
  }

  public setLanguage(_langCode: string) {
    // English only standard
    this.currentLanguage = 'en-US';
    if (this.recognition) {
      this.recognition.lang = 'en-US';
    }
  }

  public getLanguage(): string {
    return 'en-US';
  }

  private notifyStatus(status: VoiceStatus) {
    if (this.onStatusCallback) {
      this.onStatusCallback(status);
    }
  }

  public async startListening(): Promise<boolean> {
    if (!this.recognition) {
      this.notifyStatus('unsupported');
      return false;
    }
    clearTimeout(this.restartTimeout);

    try {
      this.isListening = true;
      this.recognition.lang = 'en-US';
      this.recognition.start();
      this.notifyStatus('listening');
      return true;
    } catch (err: any) {
      if (err.name === 'InvalidStateError') {
        // Recognition was already active
        this.isListening = true;
        this.notifyStatus('listening');
        return true;
      }
      console.warn('[VoiceEngine] Start recognition note:', err);
      // If error occurs, leave clean state so user can re-click
      this.isListening = false;
      this.notifyStatus('idle');
      return false;
    }
  }

  public stopListening() {
    this.isListening = false;
    clearTimeout(this.restartTimeout);
    clearTimeout(this.interimFallbackTimeout);
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // Ignored
      }
    }
    this.notifyStatus('idle');
  }

  public async toggleListening(): Promise<boolean> {
    if (this.isListening) {
      this.stopListening();
      return false;
    } else {
      return await this.startListening();
    }
  }

  /**
   * Programmatic / UI simulation of a voice command
   * Guaranteed to trigger through the exact same dispatch pipeline
   */
  public simulateCommand(commandText: string) {
    this.dispatchCommand(commandText);
  }

  public speak(text: string, rate: number = 1.0, onEnd?: () => void, _customLang?: string) {
    if (!this.synthesis) {
      if (onEnd) onEnd();
      return;
    }
    this.synthesis.cancel(); // Stop ongoing speech

    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-US';
    utterance.rate = Math.max(0.7, Math.min(1.4, rate));

    // Prefer natural English voices
    try {
      const voices = this.synthesis.getVoices();
      const englishVoice = voices.find(v =>
        v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel'))
      ) || voices.find(v => v.lang.startsWith('en'));

      if (englishVoice) {
        utterance.voice = englishVoice;
      }
    } catch {}

    this.notifyStatus('speaking');

    utterance.onend = () => {
      this.notifyStatus(this.isListening ? 'listening' : 'idle');
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.notifyStatus(this.isListening ? 'listening' : 'idle');
      if (onEnd) onEnd();
    };

    this.synthesis.speak(utterance);
  }

  public stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel();
      this.notifyStatus(this.isListening ? 'listening' : 'idle');
    }
  }
}

export const voiceEngine = new VoiceEngine();
