import type { RecipeRange } from '../types/game.ts';

export const isValueInRange = (value: number, range: RecipeRange, tolerance = 0): boolean =>
  value >= range.min - tolerance && value <= range.max + tolerance;
