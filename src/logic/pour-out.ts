import { clearCauldron } from './clear-cauldron.ts';
import { getRemainingTime } from './timer.ts';
import type { GameState, TimestampSource } from '../types/game.ts';

export const POUR_OUT_TIME_COST_SECONDS = 10;

export const pourOutCauldron = (
  state: GameState,
  getTimestamp: TimestampSource = Date.now,
): GameState => {
  if (state.status !== 'playing' || state.cauldronIngredientIds.length === 0) {
    return state;
  }

  const timestamp = getTimestamp();
  const timeLeft = Math.max(
    getRemainingTime(state, () => timestamp) - POUR_OUT_TIME_COST_SECONDS,
    0,
  );

  return clearCauldron({
    ...state,
    timeLeft,
    timerEndsAt: timeLeft > 0 ? timestamp + timeLeft * 1000 : undefined,
  });
};
