import type { GameState } from '../types/game.ts';

export const clearCauldron = (state: GameState): GameState => ({
  ...state,
  previousCauldronIngredientIds: state.cauldronIngredientIds,
  cauldronIngredientIds: [],
  lastReactionIds: [],
});
