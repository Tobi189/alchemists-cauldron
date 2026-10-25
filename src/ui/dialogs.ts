import { DIFFICULTIES, DIFFICULTY_SETTINGS } from '../data/difficulty.ts';
import { formatLeaderboardDate, isValidPlayerName } from '../logic/leaderboard.ts';
import type { Difficulty, GameOverReason, GameState } from '../types/game.ts';
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

const formatDifficulty = (difficulty: Difficulty): string =>
  `${difficulty[0]?.toUpperCase() ?? ''}${difficulty.slice(1)}`;

const createLeaderboardTable = (entries: readonly LeaderboardEntry[]): HTMLElement => {
  const table = document.createElement('table');
  const head = document.createElement('thead');
  const headRow = document.createElement('tr');
  const body = document.createElement('tbody');

  table.className = 'leaderboard-table';

  for (const heading of ['Rank', 'Name', 'Difficulty', 'Score', 'Date']) {
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
      formatDifficulty(entry.difficulty),
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
  selectedDifficulty: Difficulty,
  notice: string | undefined,
  onSelectDifficulty: (difficulty: Difficulty) => void,
  onClose: () => void,
  onRequestClear: () => void,
): HTMLElement => {
  const overlay = document.createElement('div');
  const dialog = document.createElement('section');
  const eyebrow = document.createElement('p');
  const title = document.createElement('h2');
  const content = document.createElement('div');
  const difficultyTabs = document.createElement('div');
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
  difficultyTabs.className = 'difficulty-tabs';
  difficultyTabs.setAttribute('aria-label', 'Leaderboard difficulty');
  actions.className = 'dialog-actions';
  closeButton.autofocus = true;
  clearButton.disabled = entries.length === 0;

  for (const difficulty of DIFFICULTIES) {
    const button = createDialogButton(
      formatDifficulty(difficulty),
      'difficulty-tabs__button',
      () => {
        onSelectDifficulty(difficulty);
      },
    );

    button.classList.toggle('difficulty-tabs__button--selected', difficulty === selectedDifficulty);
    button.setAttribute('aria-pressed', String(difficulty === selectedDifficulty));
    difficultyTabs.append(button);
  }

  content.append(difficultyTabs);

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
    emptyMessage.textContent = `No ${formatDifficulty(selectedDifficulty)} results yet. Brew a potion and claim the first place.`;
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
  difficulty: Difficulty,
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
  message.textContent = `All saved ${formatDifficulty(difficulty)} results will be permanently removed.`;
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

export const createHelpDialog = (onClose: () => void): HTMLElement => {
  const overlay = document.createElement('div');
  const dialog = document.createElement('section');
  const eyebrow = document.createElement('p');
  const title = document.createElement('h2');
  const rules = document.createElement('ol');
  const tips = [
    'Choose a difficulty in Settings, then start a new game.',
    'Select ingredients to add them to the cauldron. Every portion is spent.',
    'Use the three parameter bars to match the active recipe ranges.',
    'Press Brew after adding at least one ingredient.',
    'During play, use 1–8 for ingredients, B to brew, O to pour out and P to pause.',
    'On the pause screen, press Enter or Space on the focused Resume button.',
    'A successful brew awards points and time. A failed brew costs one life.',
    'The game ends when time, lives, or all available ingredients run out.',
  ];

  overlay.className = 'dialog-overlay';
  dialog.className = 'game-over-dialog information-dialog';
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-labelledby', 'help-dialog-title');
  eyebrow.className = 'game-over-dialog__eyebrow';
  eyebrow.textContent = 'Apprentice handbook';
  title.className = 'game-over-dialog__title information-dialog__title';
  title.id = 'help-dialog-title';
  title.textContent = 'How to Play';
  rules.className = 'information-dialog__rules';

  for (const tip of tips) {
    const item = document.createElement('li');
    item.textContent = tip;
    rules.append(item);
  }

  const actions = document.createElement('div');
  const closeButton = createDialogButton('Close', 'primary-action', onClose);
  actions.className = 'dialog-actions';
  closeButton.autofocus = true;
  actions.append(closeButton);
  dialog.append(eyebrow, title, rules, actions);
  overlay.append(dialog);

  return overlay;
};

const createDifficultyCard = (
  difficulty: Difficulty,
  selectedDifficulty: Difficulty,
  onSelectDifficulty: (difficulty: Difficulty) => void,
): HTMLButtonElement => {
  const settings = DIFFICULTY_SETTINGS[difficulty];
  const button = document.createElement('button');
  const name = document.createElement('strong');
  const summary = document.createElement('span');
  const details = document.createElement('span');

  button.className = 'difficulty-card';
  button.classList.toggle('difficulty-card--selected', difficulty === selectedDifficulty);
  button.type = 'button';
  button.setAttribute('aria-pressed', String(difficulty === selectedDifficulty));
  name.className = 'difficulty-card__name';
  name.textContent = formatDifficulty(difficulty);
  summary.className = 'difficulty-card__summary';
  summary.textContent = `${settings.startingTimeSeconds}s · ${settings.startingLives} lives · ${settings.scorePerBrew} points`;
  details.className = 'difficulty-card__details';
  details.textContent = `${settings.shelfSize} shelf ingredients · ${settings.cauldronCapacity} cauldron limit · ±${settings.recipeTolerance} tolerance · +${settings.timeBonusSeconds}s bonus`;
  button.append(name, summary, details);
  button.addEventListener('click', () => {
    onSelectDifficulty(difficulty);
  });

  return button;
};

export const createSettingsDialog = (
  selectedDifficulty: Difficulty,
  onSelectDifficulty: (difficulty: Difficulty) => void,
  onClose: () => void,
): HTMLElement => {
  const overlay = document.createElement('div');
  const dialog = document.createElement('section');
  const eyebrow = document.createElement('p');
  const title = document.createElement('h2');
  const message = document.createElement('p');
  const choices = document.createElement('div');
  const actions = document.createElement('div');
  const closeButton = createDialogButton('Done', 'primary-action', onClose);

  overlay.className = 'dialog-overlay';
  dialog.className = 'game-over-dialog settings-dialog';
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-labelledby', 'settings-dialog-title');
  eyebrow.className = 'game-over-dialog__eyebrow';
  eyebrow.textContent = 'Prepare the workshop';
  title.className = 'game-over-dialog__title information-dialog__title';
  title.id = 'settings-dialog-title';
  title.textContent = 'Difficulty';
  message.className = 'settings-dialog__message';
  message.textContent = 'Choose the rules for your next game.';
  choices.className = 'settings-dialog__choices';
  actions.className = 'dialog-actions';
  closeButton.autofocus = true;

  for (const difficulty of DIFFICULTIES) {
    choices.append(createDifficultyCard(difficulty, selectedDifficulty, onSelectDifficulty));
  }

  actions.append(closeButton);
  dialog.append(eyebrow, title, message, choices, actions);
  overlay.append(dialog);

  return overlay;
};
