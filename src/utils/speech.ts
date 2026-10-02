/**
 * Web Speech API Utility for VoiceHire AI (Module 1 & 4)
 * Handles SpeechRecognition (with cross-browser webkit support) and SpeechSynthesis.
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
}

export class VoiceEngine {
  private recognition: any = null;
  private synthesis: SpeechSynthesis | null = null;
  private isListening: boolean = false;
  private onCommandCallback: ((transcript: string) => void) | null = null;
  private onStatusCallback: ((status: 'idle' | 'listening' | 'speaking' | 'unsupported') => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';

        this.recognition.onstart = () => {
          this.isListening = true;
          this.notifyStatus('listening');
        };

        this.recognition.onresult = (event: SpeechRecognitionEvent) => {
          const current = event.results[event.results.length - 1];
          if (current && current[0]) {
            const transcript = current[0].transcript.trim();
            if (this.onCommandCallback) {
              this.onCommandCallback(transcript);
            }
          }
        };

        this.recognition.onerror = (e: any) => {
          console.warn('[VoiceEngine] Recognition error or silence:', e);
          if (e.error === 'not-allowed') {
            this.notifyStatus('unsupported');
          }
        };

        this.recognition.onend = () => {
          // Restart if user still wants it active
          if (this.isListening) {
            try {
              this.recognition.start();
            } catch {
              this.isListening = false;
              this.notifyStatus('idle');
            }
          } else {
            this.notifyStatus('idle');
          }
        };
      }

      if ('speechSynthesis' in window) {
        this.synthesis = window.speechSynthesis;
      }
    }
  }

  public isSupported(): boolean {
    return Boolean(this.recognition);
  }

  public setCallbacks(
    onCommand: (transcript: string) => void,
    onStatus: (status: 'idle' | 'listening' | 'speaking' | 'unsupported') => void
  ) {
    this.onCommandCallback = onCommand;
    this.onStatusCallback = onStatus;
  }

  private notifyStatus(status: 'idle' | 'listening' | 'speaking' | 'unsupported') {
    if (this.onStatusCallback) {
      this.onStatusCallback(status);
    }
  }

  public startListening() {
    if (!this.recognition) {
      this.notifyStatus('unsupported');
      return;
    }
    try {
      this.isListening = true;
      this.recognition.start();
    } catch {
      // Already running
    }
  }

  public stopListening() {
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // Ignored
      }
    }
    this.notifyStatus('idle');
  }

  public toggleListening(): boolean {
    if (this.isListening) {
      this.stopListening();
      return false;
    } else {
      this.startListening();
      return true;
    }
  }

  public speak(text: string, rate: number = 1.0, onEnd?: () => void) {
    if (!this.synthesis) return;
    this.synthesis.cancel(); // Stop any ongoing speech

    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = Math.max(0.7, Math.min(1.5, rate));
    utterance.lang = 'en-US';

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
