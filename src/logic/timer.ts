import type { GameState, TimestampSource } from '../types/game.ts';

export const getRemainingTime = (
  state: GameState,
  getTimestamp: TimestampSource = Date.now,
): number =>
  state.status !== 'playing' || state.timerEndsAt === undefined
    ? state.timeLeft
    : Math.max(Math.ceil((state.timerEndsAt - getTimestamp()) / 1000), 0);

export const syncTimer = (
  state: GameState,
  getTimestamp: TimestampSource = Date.now,
): GameState => {
  const timeLeft = getRemainingTime(state, getTimestamp);

  return timeLeft === state.timeLeft ? state : { ...state, timeLeft };
};
