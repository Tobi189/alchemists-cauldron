import { LEVEL_ONE_RULES } from '../data/difficulty.ts';
import { calculateCauldronValues } from './calculate-cauldron.ts';
import { isValueInRange } from './range.ts';
import { selectRandomRecipe } from './recipe-generator.ts';
import { getRemainingTime } from './timer.ts';
import type {
  GameState,
  ParameterValues,
  RandomSource,
  Recipe,
  TimestampSource,
} from '../types/game.ts';

export const isSuccessfulBrew = (
  values: ParameterValues,
  recipe: Recipe,
  tolerance: number,
): boolean =>
  isValueInRange(values.temperature, recipe.temperature, tolerance) &&
  isValueInRange(values.density, recipe.density, tolerance) &&
  isValueInRange(values.magicPower, recipe.magicPower, tolerance);

export const brewPotion = (
  state: GameState,
  random: RandomSource = Math.random,
  getTimestamp: TimestampSource = Date.now,
): GameState => {
  if (
    state.status !== 'playing' ||
    state.cauldronIngredientIds.length === 0 ||
    !state.activeRecipe
  ) {
    return state;
  }

  const timestamp = getTimestamp();
  const timeLeft = getRemainingTime(state, () => timestamp);

  if (timeLeft === 0) {
    return { ...state, timeLeft };
  }

  const values = calculateCauldronValues(state.cauldronIngredientIds);
  const isSuccess = isSuccessfulBrew(values, state.activeRecipe, LEVEL_ONE_RULES.recipeTolerance);
  const clearedState = {
    ...state,
    timeLeft,
    previousCauldronIngredientIds: state.cauldronIngredientIds,
    cauldronIngredientIds: [],
  };

  if (isSuccess) {
    const nextTimeLeft = Math.min(
      timeLeft + LEVEL_ONE_RULES.timeBonusSeconds,
      LEVEL_ONE_RULES.startingTimeSeconds,
    );

    return {
      ...clearedState,
      score: state.score + LEVEL_ONE_RULES.scorePerBrew,
      timeLeft: nextTimeLeft,
      timerEndsAt: timestamp + nextTimeLeft * 1000,
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
