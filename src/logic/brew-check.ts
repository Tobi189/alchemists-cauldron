import { LEVEL_ONE_RULES } from '../data/difficulty.ts';
import { calculateCauldronValues } from './calculate-cauldron.ts';
import { isValueInRange } from './range.ts';
import { selectRandomRecipe } from './recipe-generator.ts';
import type { GameState, ParameterValues, RandomSource, Recipe } from '../types/game.ts';

export const isSuccessfulBrew = (
  values: ParameterValues,
  recipe: Recipe,
  tolerance: number,
): boolean =>
  isValueInRange(values.temperature, recipe.temperature, tolerance) &&
  isValueInRange(values.density, recipe.density, tolerance) &&
  isValueInRange(values.magicPower, recipe.magicPower, tolerance);

export const brewPotion = (state: GameState, random: RandomSource = Math.random): GameState => {
  if (
    state.status !== 'playing' ||
    state.cauldronIngredientIds.length === 0 ||
    !state.activeRecipe
  ) {
    return state;
  }

  const values = calculateCauldronValues(state.cauldronIngredientIds);
  const isSuccess = isSuccessfulBrew(values, state.activeRecipe, LEVEL_ONE_RULES.recipeTolerance);
  const clearedState = {
    ...state,
    previousCauldronIngredientIds: state.cauldronIngredientIds,
    cauldronIngredientIds: [],
  };

  if (isSuccess) {
    return {
      ...clearedState,
      score: state.score + LEVEL_ONE_RULES.scorePerBrew,
      timeLeft: Math.min(
        state.timeLeft + LEVEL_ONE_RULES.timeBonusSeconds,
        LEVEL_ONE_RULES.startingTimeSeconds,
      ),
      activeRecipe: selectRandomRecipe(LEVEL_ONE_RULES.difficulty, random),
      lastBrewResult: 'success',
    };
  }

  return {
    ...clearedState,
    lives: Math.max(state.lives - 1, 0),
    lastBrewResult: 'failure',
  };
};
