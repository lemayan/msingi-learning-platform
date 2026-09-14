export function chunkTranscript(cues) {
  const chunks = [];
  let currentChunk = null;

  for (const cue of cues) {
    if (!currentChunk) {
      currentChunk = { startSeconds: cue.offset / 1000, text: cue.text, duration: cue.duration / 1000 };
      continue;
    }

    const newDuration = currentChunk.duration + (cue.duration / 1000);
    const newText = currentChunk.text + " " + cue.text;

    // chunk if it exceeds ~45s or ~350 chars
    if (newDuration >= 45 || newText.length >= 350) {
      chunks.push({
        _key: `chunk-${chunks.length}`,
        startSeconds: currentChunk.startSeconds,
        text: currentChunk.text
      });
      currentChunk = { startSeconds: cue.offset / 1000, text: cue.text, duration: cue.duration / 1000 };
    } else {
      currentChunk.text = newText;
      currentChunk.duration = newDuration;
    }
  }

  if (currentChunk) {
    chunks.push({
      _key: `chunk-${chunks.length}`,
      startSeconds: currentChunk.startSeconds,
      text: currentChunk.text
    });
  }

  return chunks;
}

