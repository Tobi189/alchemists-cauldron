import type { GameOverReason, GameState } from '../types/game.ts';

const GAME_OVER_MESSAGES: Readonly<Record<GameOverReason, string>> = {
  time: 'Time has run out.',
  lives: 'No lives remain.',
  ingredients: 'Out of ingredients.',
};

export const createGameOverDialog = (
  state: GameState,
  onPlayAgain: () => void,
): HTMLElement | undefined => {
  if (state.status !== 'game-over' || !state.gameOverReason) {
    return undefined;
  }

  const overlay = document.createElement('div');
  const dialog = document.createElement('section');
  const eyebrow = document.createElement('p');
  const title = document.createElement('h2');
  const reason = document.createElement('p');
  const score = document.createElement('p');
  const playAgainButton = document.createElement('button');

  overlay.className = 'dialog-overlay';
  dialog.className = 'game-over-dialog';
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-labelledby', 'game-over-title');
  eyebrow.className = 'game-over-dialog__eyebrow';
  title.className = 'game-over-dialog__title';
  title.id = 'game-over-title';
  reason.className = 'game-over-dialog__reason';
  score.className = 'game-over-dialog__score';
  playAgainButton.className = 'primary-action';
  playAgainButton.type = 'button';
  playAgainButton.autofocus = true;
  eyebrow.textContent = 'The cauldron falls silent';
  title.textContent = 'Game Over';
  reason.textContent = GAME_OVER_MESSAGES[state.gameOverReason];
  score.textContent = `Final score: ${state.score}`;
  playAgainButton.textContent = 'Play Again';
  playAgainButton.addEventListener('click', onPlayAgain);
  dialog.append(eyebrow, title, reason, score, playAgainButton);
  overlay.append(dialog);

  return overlay;
};
