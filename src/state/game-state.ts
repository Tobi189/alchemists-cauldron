import { LEVEL_ONE_RULES } from '../data/difficulty.ts';
import { INGREDIENTS } from '../data/ingredients.ts';
import { selectRandomRecipe } from '../logic/recipe-generator.ts';
import { createShelfStock } from '../logic/stock.ts';
import type { GameState, RandomSource } from '../types/game.ts';

export const createMenuState = (): GameState => ({
  status: 'menu',
  score: 0,
  timeLeft: 0,
  lives: 0,
  activeRecipe: undefined,
  lastBrewResult: undefined,
  shelfStock: {},
  cauldronIngredientIds: [],
  previousCauldronIngredientIds: [],
});

export const createNewGameState = (random: RandomSource = Math.random): GameState => ({
  status: 'playing',
  score: 0,
  timeLeft: LEVEL_ONE_RULES.startingTimeSeconds,
  lives: LEVEL_ONE_RULES.startingLives,
  activeRecipe: selectRandomRecipe(LEVEL_ONE_RULES.difficulty, random),
  lastBrewResult: undefined,
  shelfStock: createShelfStock(INGREDIENTS, LEVEL_ONE_RULES.shelfSize, random),
  cauldronIngredientIds: [],
  previousCauldronIngredientIds: [],
});
