import type { Difficulty, GameRules } from '../types/game.ts';

export const MIN_INGREDIENT_STOCK = 2;
export const MAX_INGREDIENT_STOCK = 15;

export const DIFFICULTIES = ['easy', 'medium', 'hard'] as const satisfies readonly Difficulty[];

export const DIFFICULTY_SETTINGS = {
  easy: {
    difficulty: 'easy',
    shelfSize: 4,
    cauldronCapacity: 4,
    startingTimeSeconds: 180,
    recipeTolerance: 12,
    startingLives: 5,
    scorePerBrew: 100,
    timeBonusSeconds: 15,
    reactionCount: 0,
  },
  medium: {
    difficulty: 'medium',
    shelfSize: 6,
    cauldronCapacity: 4,
    startingTimeSeconds: 150,
    recipeTolerance: 8,
    startingLives: 3,
    scorePerBrew: 200,
    timeBonusSeconds: 10,
    reactionCount: 2,
  },
  hard: {
    difficulty: 'hard',
    shelfSize: 8,
    cauldronCapacity: 5,
    startingTimeSeconds: 150,
    recipeTolerance: 5,
    startingLives: 3,
    scorePerBrew: 300,
    timeBonusSeconds: 5,
    reactionCount: 3,
  },
} as const satisfies Readonly<Record<Difficulty, GameRules>>;

export const DEFAULT_DIFFICULTY: Difficulty = 'medium';

export const getDifficultySettings = (difficulty: Difficulty): GameRules =>
  DIFFICULTY_SETTINGS[difficulty];
