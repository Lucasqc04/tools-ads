type Tone = { frequency: number; start: number; duration: number; gain: number; type: OscillatorType };

/** Rising two-note chime when someone joins. */
const JOIN_TONES: Tone[] = [
  { frequency: 659.25, start: 0, duration: 0.16, gain: 0.12, type: 'sine' },
  { frequency: 987.77, start: 0.13, duration: 0.24, gain: 0.11, type: 'sine' },
];

/** One soft blip for a new message or file. */
const MESSAGE_TONES: Tone[] = [
  { frequency: 1174.66, start: 0, duration: 0.11, gain: 0.08, type: 'sine' },
];

let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
  if (audioContext) return audioContext;
  const Constructor = window.AudioContext;
  if (typeof Constructor !== 'function') return null;
  audioContext = new Constructor();
  return audioContext;
};

const playTones = (tones: Tone[]) => {
  try {
    const context = getAudioContext();
    if (!context) return;
    // Browsers keep a new context suspended until the page has had a user gesture; by the time someone joins, the user has already interacted.
    if (context.state === 'suspended') void context.resume().catch(() => undefined);
    const now = context.currentTime;
    for (const tone of tones) {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const start = now + tone.start;
      oscillator.type = tone.type;
      oscillator.frequency.value = tone.frequency;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(tone.gain, start + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + tone.duration);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(start);
      oscillator.stop(start + tone.duration + 0.02);
    }
  } catch {
    // Sounds are a convenience; a blocked or missing audio API must never break the call.
  }
};

export const playJoinSound = () => playTones(JOIN_TONES);
export const playMessageSound = () => playTones(MESSAGE_TONES);
