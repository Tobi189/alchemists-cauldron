import { formatLeaderboardDate, isValidPlayerName } from '../logic/leaderboard.ts';
import type { GameOverReason, GameState } from '../types/game.ts';
import type { LeaderboardEntry } from '../types/leaderboard.ts';

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
  shouldRequestPlayerName: boolean,
  onSubmitPlayerName: (name: string) => void,
  onPlayAgain: () => void,
  onOpenLeaderboard: () => void,
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
  const actions = document.createElement('div');
  const playAgainButton = createDialogButton('Play Again', 'primary-action', onPlayAgain);
  const leaderboardButton = createDialogButton(
    'Top Players',
    'secondary-action',
    onOpenLeaderboard,
  );

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
  actions.className = 'dialog-actions';
  eyebrow.textContent = 'The cauldron falls silent';
  title.textContent = 'Game Over';
  reason.textContent = GAME_OVER_MESSAGES[state.gameOverReason];
  score.textContent = `Final score: ${state.score}`;
  actions.append(playAgainButton, leaderboardButton);
  dialog.append(eyebrow, title, reason, score);

  if (shouldRequestPlayerName) {
    const form = document.createElement('form');
    const label = document.createElement('label');
    const input = document.createElement('input');
    const hint = document.createElement('p');
    const error = document.createElement('p');
    const submitButton = document.createElement('button');

    form.className = 'player-name-form';
    label.className = 'player-name-form__label';
    label.htmlFor = 'player-name';
    label.textContent = 'You reached the Top 10. Enter your name:';
    input.className = 'player-name-form__input';
    input.id = 'player-name';
    input.name = 'playerName';
    input.type = 'text';
    input.minLength = 2;
    input.maxLength = 15;
    input.required = true;
    input.autocomplete = 'off';
    input.autofocus = true;
    hint.className = 'player-name-form__hint';
    hint.textContent = '2–15 characters: letters, digits, spaces, _ or -';
    error.className = 'player-name-form__error';
    error.setAttribute('aria-live', 'polite');
    submitButton.className = 'primary-action player-name-form__submit';
    submitButton.type = 'submit';
    submitButton.textContent = 'Save Result';
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      if (!isValidPlayerName(input.value)) {
        input.setAttribute('aria-invalid', 'true');
        error.textContent = 'Enter a valid name using 2–15 allowed characters.';
        input.focus();
        return;
      }

      onSubmitPlayerName(input.value);
    });
    form.append(label, input, hint, error, submitButton);
    dialog.append(form);
  } else {
    playAgainButton.autofocus = true;
  }

  dialog.append(actions);
  overlay.append(dialog);

  return overlay;
};

const createLeaderboardTable = (entries: readonly LeaderboardEntry[]): HTMLElement => {
  const table = document.createElement('table');
  const head = document.createElement('thead');
  const headRow = document.createElement('tr');
  const body = document.createElement('tbody');

  table.className = 'leaderboard-table';

  for (const heading of ['Rank', 'Name', 'Score', 'Date']) {
    const cell = document.createElement('th');
    cell.scope = 'col';
    cell.textContent = heading;
    headRow.append(cell);
  }

  for (const [index, entry] of entries.entries()) {
    const row = document.createElement('tr');

    for (const value of [
      String(index + 1),
      entry.name,
      String(entry.score),
      formatLeaderboardDate(entry.createdAt),
    ]) {
      const cell = document.createElement('td');
      cell.textContent = value;
      row.append(cell);
    }

    body.append(row);
  }

  head.append(headRow);
  table.append(head, body);

  return table;
};

export const createLeaderboardDialog = (
  entries: readonly LeaderboardEntry[],
  notice: string | undefined,
  onClose: () => void,
  onRequestClear: () => void,
): HTMLElement => {
  const overlay = document.createElement('div');
  const dialog = document.createElement('section');
  const eyebrow = document.createElement('p');
  const title = document.createElement('h2');
  const content = document.createElement('div');
  const actions = document.createElement('div');
  const closeButton = createDialogButton('Close', 'primary-action', onClose);
  const clearButton = createDialogButton('Clear Leaderboard', 'secondary-action', onRequestClear);

  overlay.className = 'dialog-overlay';
  dialog.className = 'game-over-dialog leaderboard-dialog';
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-labelledby', 'leaderboard-title');
  eyebrow.className = 'game-over-dialog__eyebrow';
  eyebrow.textContent = 'Hall of alchemists';
  title.className = 'game-over-dialog__title leaderboard-dialog__title';
  title.id = 'leaderboard-title';
  title.textContent = 'Top Players';
  content.className = 'leaderboard-dialog__content';
  actions.className = 'dialog-actions';
  closeButton.autofocus = true;
  clearButton.disabled = entries.length === 0;

  if (notice) {
    const noticeElement = document.createElement('p');
    noticeElement.className = 'leaderboard-dialog__notice';
    noticeElement.setAttribute('aria-live', 'polite');
    noticeElement.textContent = notice;
    content.append(noticeElement);
  }

  if (entries.length === 0) {
    const emptyMessage = document.createElement('p');
    emptyMessage.className = 'leaderboard-dialog__empty';
    emptyMessage.textContent = 'No results yet. Brew a potion and claim the first place.';
    content.append(emptyMessage);
  } else {
    content.append(createLeaderboardTable(entries));
  }

  actions.append(closeButton, clearButton);
  dialog.append(eyebrow, title, content, actions);
  overlay.append(dialog);

  return overlay;
};

export const createClearLeaderboardDialog = (
  onConfirm: () => void,
  onCancel: () => void,
): HTMLElement => {
  const overlay = document.createElement('div');
  const dialog = document.createElement('section');
  const title = document.createElement('h2');
  const message = document.createElement('p');
  const actions = document.createElement('div');
  const confirmButton = createDialogButton('Clear', 'danger-action', onConfirm);
  const cancelButton = createDialogButton('Cancel', 'secondary-action', onCancel);

  overlay.className = 'dialog-overlay';
  dialog.className = 'game-over-dialog confirmation-dialog';
  dialog.setAttribute('role', 'alertdialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-labelledby', 'clear-leaderboard-title');
  title.className = 'game-over-dialog__title confirmation-dialog__title';
  title.id = 'clear-leaderboard-title';
  title.textContent = 'Clear Leaderboard?';
  message.className = 'game-over-dialog__reason';
  message.textContent = 'All saved Level 1 results will be permanently removed.';
  actions.className = 'dialog-actions';
  cancelButton.autofocus = true;
  actions.append(confirmButton, cancelButton);
  dialog.append(title, message, actions);
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
