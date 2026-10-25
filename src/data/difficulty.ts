import type { GameRules } from '../types/game.ts';

export const MIN_INGREDIENT_STOCK = 2;
export const MAX_INGREDIENT_STOCK = 15;

export const LEVEL_ONE_RULES = {
  difficulty: 'medium',
  shelfSize: 6,
  cauldronCapacity: 4,
  startingTimeSeconds: 150,
  recipeTolerance: 8,
  startingLives: 3,
  scorePerBrew: 200,
  timeBonusSeconds: 10,
  reactionCount: 0,
} as const satisfies GameRules;
