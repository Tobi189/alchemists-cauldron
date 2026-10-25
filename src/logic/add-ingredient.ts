import { getDifficultySettings } from '../data/difficulty.ts';
import { decreaseIngredientStock } from './stock.ts';
import type { GameState } from '../types/game.ts';

export const canAddIngredient = (state: GameState, ingredientId: string): boolean => {
  const rules = getDifficultySettings(state.difficulty);

  return (
    state.status === 'playing' &&
    state.cauldronIngredientIds.length < rules.cauldronCapacity &&
    (state.shelfStock[ingredientId] ?? 0) > 0
  );
};

export const addIngredient = (state: GameState, ingredientId: string): GameState => {
  if (!canAddIngredient(state, ingredientId)) {
    return state;
  }

  return {
    ...state,
    lastBrewResult: undefined,
    shelfStock: decreaseIngredientStock(state.shelfStock, ingredientId),
    previousCauldronIngredientIds: state.cauldronIngredientIds,
    cauldronIngredientIds: [...state.cauldronIngredientIds, ingredientId],
  };
};
