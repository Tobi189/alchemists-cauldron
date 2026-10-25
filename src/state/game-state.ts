import { LEVEL_ONE_RULES } from '../data/difficulty.ts';
import { INGREDIENTS } from '../data/ingredients.ts';
import { selectRandomRecipe } from '../logic/recipe-generator.ts';
import { createShelfStock } from '../logic/stock.ts';
import type { GameState, RandomSource, TimestampSource } from '../types/game.ts';

export const createMenuState = (): GameState => ({
  status: 'menu',
  score: 0,
  timeLeft: 0,
  timerEndsAt: undefined,
  lives: 0,
  gameOverReason: undefined,
  activeRecipe: undefined,
  lastBrewResult: undefined,
  shelfStock: {},
  cauldronIngredientIds: [],
  previousCauldronIngredientIds: [],
});

export const createNewGameState = (
  random: RandomSource = Math.random,
  getTimestamp: TimestampSource = Date.now,
): GameState => {
  const timeLeft = LEVEL_ONE_RULES.startingTimeSeconds;

  return {
    status: 'playing',
    score: 0,
    timeLeft,
    timerEndsAt: getTimestamp() + timeLeft * 1000,
    lives: LEVEL_ONE_RULES.startingLives,
    gameOverReason: undefined,
    activeRecipe: selectRandomRecipe(LEVEL_ONE_RULES.difficulty, random),
    lastBrewResult: undefined,
    shelfStock: createShelfStock(INGREDIENTS, LEVEL_ONE_RULES.shelfSize, random),
    cauldronIngredientIds: [],
    previousCauldronIngredientIds: [],
  };
};
