/**
 * Whisper can occasionally fall into a short, repeated phrase loop. Keep a
 * few repetitions (which may be intentional in speech or music), and trim
 * only long consecutive loops from a single timestamped chunk.
 */
export const reduceRepeatedPhraseLoops = (text: string): string => {
  const tokens = text.trim().split(/\s+/).filter(Boolean);
  if (tokens.length < 12) {
    return text.trim();
  }

  const normalize = (token: string): string =>
    token.normalize('NFKC').toLocaleLowerCase().replaceAll(/[^\p{L}\p{N}']/gu, '');
  const normalized = tokens.map(normalize);
  const output: string[] = [];
  const minRepeats = 6;
  const keepRepeats = 3;
  const maxPhraseLength = 8;

  for (let index = 0; index < tokens.length;) {
    let bestLength = 0;
    let bestRepeats = 0;

    for (let phraseLength = 2; phraseLength <= maxPhraseLength; phraseLength += 1) {
      if (index + phraseLength * minRepeats > tokens.length) {
        break;
      }

      let repeats = 1;
      while (index + phraseLength * (repeats + 1) <= tokens.length) {
        let matches = true;
        for (let offset = 0; offset < phraseLength; offset += 1) {
          if (
            normalized[index + offset] === '' ||
            normalized[index + offset] !== normalized[index + phraseLength * repeats + offset]
          ) {
            matches = false;
            break;
          }
        }

        if (!matches) {
          break;
        }

        repeats += 1;
      }

      if (
        repeats >= minRepeats &&
        (repeats - keepRepeats) * phraseLength > (bestRepeats - keepRepeats) * bestLength
      ) {
        bestLength = phraseLength;
        bestRepeats = repeats;
      }
    }

    if (bestLength > 0) {
      output.push(...tokens.slice(index, index + bestLength * keepRepeats));
      index += bestLength * bestRepeats;
    } else {
      output.push(tokens[index]);
      index += 1;
    }
  }

  return output.join(' ').replaceAll(/\s+([,.;:!?])/g, '$1').trim();
};
