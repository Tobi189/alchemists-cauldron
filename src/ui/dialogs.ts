import type { GameOverReason, GameState } from '../types/game.ts';

const createDialogButton = (
  label: string,
  className: string,
  onClick: () => void,
): HTMLButtonElement => {
  const button = document.createElement('button');

  button.className = className;
  button.type = 'button';
  button.textContent = label;
  button.addEventListener('click', onClick);

  return button;
};

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
  const playAgainButton = createDialogButton('Play Again', 'primary-action', onPlayAgain);

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
  playAgainButton.autofocus = true;
  eyebrow.textContent = 'The cauldron falls silent';
  title.textContent = 'Game Over';
  reason.textContent = GAME_OVER_MESSAGES[state.gameOverReason];
  score.textContent = `Final score: ${state.score}`;
  dialog.append(eyebrow, title, reason, score, playAgainButton);
  overlay.append(dialog);

  return overlay;
};

export const createPauseDialog = (
  state: GameState,
  onResume: () => void,
  onExitToMenu: () => void,
): HTMLElement | undefined => {
  if (state.status !== 'paused') {
    return undefined;
  }

  const overlay = document.createElement('div');
  const dialog = document.createElement('section');
  const eyebrow = document.createElement('p');
  const title = document.createElement('h2');
  const message = document.createElement('p');
  const actions = document.createElement('div');
  const resumeButton = createDialogButton('Resume', 'primary-action', onResume);
  const exitButton = createDialogButton('Exit to Menu', 'secondary-action', onExitToMenu);

  overlay.className = 'dialog-overlay';
  dialog.className = 'game-over-dialog pause-dialog';
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-labelledby', 'pause-dialog-title');
  eyebrow.className = 'game-over-dialog__eyebrow';
  title.className = 'game-over-dialog__title pause-dialog__title';
  title.id = 'pause-dialog-title';
  message.className = 'game-over-dialog__reason';
  actions.className = 'pause-dialog__actions';
  resumeButton.autofocus = true;
  eyebrow.textContent = 'The workshop waits';
  title.textContent = 'Game Paused';
  message.textContent = 'Your ingredients, recipe, score and remaining time are preserved.';
  actions.append(resumeButton, exitButton);
  dialog.append(eyebrow, title, message, actions);
  overlay.append(dialog);

  return overlay;
};
