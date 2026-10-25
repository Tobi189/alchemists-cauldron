import type { Difficulty } from './game.ts';

export interface LeaderboardEntry {
  readonly name: string;
  readonly score: number;
  readonly createdAt: number;
  readonly difficulty: Difficulty;
}
