import type { GameOverReason, GameState } from '../types/game.ts';

const isShelfEmpty = (state: GameState): boolean =>
  Object.values(state.shelfStock).length > 0 &&
  Object.values(state.shelfStock).every((stock) => stock === 0);

export const getGameOverReason = (state: GameState): GameOverReason | undefined => {
  if (state.timeLeft === 0) {
    return 'time';
  }

  if (state.lives === 0) {
    return 'lives';
  }

  return state.cauldronIngredientIds.length === 0 && isShelfEmpty(state)
    ? 'ingredients'
    : undefined;
};

export const finishGameIfNeeded = (state: GameState): GameState => {
  if (state.status !== 'playing') {
    return state;
  }

  const gameOverReason = getGameOverReason(state);

  if (!gameOverReason) {
    return state;
  }

  return {
    ...state,
    status: 'game-over',
    timerEndsAt: undefined,
    gameOverReason,
  };
};
