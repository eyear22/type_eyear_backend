//test.d.ts
import './G_Function.js';

export function analyzeVideoTranscript(
  filename: string,
  video: Buffer,
  nameWords: string[],
  keywords: string[],
): string;
