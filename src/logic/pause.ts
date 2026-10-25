import { getRemainingTime } from './timer.ts';
import type { GameState, TimestampSource } from '../types/game.ts';

export const pauseGame = (
  state: GameState,
  getTimestamp: TimestampSource = Date.now,
): GameState => {
  if (state.status !== 'playing') {
    return state;
  }

  const timeLeft = getRemainingTime(state, getTimestamp);

  if (timeLeft === 0) {
    return { ...state, timeLeft };
  }

  return {
    ...state,
    status: 'paused',
    timeLeft,
    timerEndsAt: undefined,
  };
};

export const resumeGame = (
  state: GameState,
  getTimestamp: TimestampSource = Date.now,
): GameState => {
  if (state.status !== 'paused' || state.timeLeft === 0) {
    return state;
  }

  return {
    ...state,
    status: 'playing',
    timerEndsAt: getTimestamp() + state.timeLeft * 1000,
  };
};
