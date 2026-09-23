/**
 * Web Audio API Synthesized Singing Bowl & Meditative Bell
 * Pure browser audio generation without external sound assets.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Plays a resonant Tibetan singing bowl chime harmonic
 */
export function playSingingBowl(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const baseFreq = 432; // Calming 432Hz tuning
    const harmonics = [1, 2.76, 5.4, 8.1];
    const gains = [0.4, 0.2, 0.1, 0.05];

    harmonics.forEach((h, i) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq * h, now);

      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(gains[i], now + 0.08);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 3.6);
    });
  } catch (err) {
    console.warn('Audio playback not permitted yet by user interaction.');
  }
}

/**
 * Plays a gentle breath cycle transition cue
 */
export function playBreathCue(pitch: 'inhale' | 'hold' | 'exhale'): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    const freq = pitch === 'inhale' ? 528 : pitch === 'hold' ? 440 : 396;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.12, now + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 1.3);
  } catch {
    // Ignore audio autoplay restrictions
  }
}
