import { SubtitleCue } from './types';

/**
 * Splits a script into timed subtitle chunks for Remotion playback,
 * simulating precise speech delivery at 30 fps (~2.5 words per second).
 */
export function parseScriptToCues(
  scriptText: string,
  fps = 30,
  targetDurationSec = 20
): SubtitleCue[] {
  if (!scriptText || !scriptText.trim()) {
    return [
      {
        text: 'Découvrez notre produit exclusif',
        startFrame: 0,
        endFrame: targetDurationSec * fps
      }
    ];
  }

  // Split into punchy clauses / sentences
  const rawClauses = scriptText
    .replace(/([.?!…])\s+/g, '$1|')
    .split('|')
    .map((c) => c.trim())
    .filter(Boolean);

  // If clauses are too long (> 8 words), split them further for mobile readability
  const formattedPhrases: string[] = [];
  for (const clause of rawClauses) {
    const words = clause.split(/\s+/);
    if (words.length <= 7) {
      formattedPhrases.push(clause);
    } else {
      const mid = Math.ceil(words.length / 2);
      formattedPhrases.push(words.slice(0, mid).join(' '));
      formattedPhrases.push(words.slice(mid).join(' '));
    }
  }

  const totalFrames = targetDurationSec * fps;
  const framesPerPhrase = Math.floor(totalFrames / (formattedPhrases.length || 1));

  return formattedPhrases.map((phrase, index) => {
    const startFrame = index * framesPerPhrase;
    const endFrame = Math.min(totalFrames, (index + 1) * framesPerPhrase - 2);
    return {
      text: phrase,
      startFrame,
      endFrame
    };
  });
}
