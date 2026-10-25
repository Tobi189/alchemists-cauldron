import clockIconUrl from '../assets/ui/clock.svg';
import heartIconUrl from '../assets/ui/heart.svg';
import scoreIconUrl from '../assets/ui/score-emblem.svg';
import { getDifficultySettings } from '../data/difficulty.ts';
import type { Difficulty, GameState } from '../types/game.ts';
import type { LeaderboardEntry } from '../types/leaderboard.ts';
import { createCauldron } from './cauldron.ts';
import {
  createClearLeaderboardDialog,
  createHelpDialog,
  createGameOverDialog,
  createLeaderboardDialog,
  createPauseDialog,
  createSettingsDialog,
} from './dialogs.ts';
import { createGameControls } from './game-controls.ts';
import { createParameterBars } from './parameter-bars.ts';
import { createRecipePanel } from './recipe.ts';
import { createShelf } from './shelf.ts';

export interface AppHandlers {
  readonly leaderboardEntries: readonly LeaderboardEntry[];
  readonly leaderboardDifficulty: Difficulty;
  readonly leaderboardDialog: 'closed' | 'open' | 'confirm-clear';
  readonly menuDialog: 'closed' | 'help' | 'settings';
  readonly leaderboardNotice: string | undefined;
  readonly shouldRequestPlayerName: boolean;
  readonly hasSavedGame: boolean;
  readonly onStartGame: () => void;
  readonly onContinueGame: () => void;
  readonly onPlayAgain: () => void;
  readonly onOpenLeaderboard: () => void;
  readonly onSelectLeaderboardDifficulty: (difficulty: Difficulty) => void;
  readonly onCloseLeaderboard: () => void;
  readonly onRequestClearLeaderboard: () => void;
  readonly onCancelClearLeaderboard: () => void;
  readonly onConfirmClearLeaderboard: () => void;
  readonly onSubmitPlayerName: (name: string) => void;
  readonly onOpenHelp: () => void;
  readonly onOpenSettings: () => void;
  readonly onCloseMenuDialog: () => void;
  readonly onSelectDifficulty: (difficulty: Difficulty) => void;
  readonly onPause: () => void;
  readonly onResume: () => void;
  readonly onExitToMenu: () => void;
  readonly onAddIngredient: (ingredientId: string) => void;
  readonly onBrew: () => void;
  readonly onPourOut: () => void;
}

const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const createHudItem = (label: string, value: string, iconUrl: string): HTMLElement => {
  const item = document.createElement('div');
  const icon = document.createElement('img');
  const itemLabel = document.createElement('span');
  const itemValue = document.createElement('strong');

  item.className = 'hud__item';
  icon.className = 'hud__icon';
  icon.src = iconUrl;
  icon.alt = '';
  icon.setAttribute('aria-hidden', 'true');
  itemLabel.className = 'hud__label';
  itemValue.className = 'hud__value';
  itemLabel.textContent = label;
  itemValue.textContent = value;
  item.append(icon, itemLabel, itemValue);

  return item;
};

const createTimerHud = (state: GameState): HTMLElement => {
  const timer = document.createElement('div');
  const timerText = createHudItem('Time', formatTime(state.timeLeft), clockIconUrl);
  const progress = document.createElement('div');
  const fill = document.createElement('span');
  const rules = getDifficultySettings(state.difficulty);
  const progressPercentage = (state.timeLeft / rules.startingTimeSeconds) * 100;

  timer.className = 'hud__timer';
  progress.className = 'hud__timer-progress';
  fill.className = 'hud__timer-fill';
  progress.setAttribute('role', 'progressbar');
  progress.setAttribute('aria-label', 'Remaining time');
  progress.setAttribute('aria-valuemin', '0');
  progress.setAttribute('aria-valuemax', String(rules.startingTimeSeconds));
  progress.setAttribute('aria-valuenow', String(state.timeLeft));
  fill.style.setProperty('--timer-progress', `${progressPercentage}%`);

  if (state.status === 'playing' && state.timeLeft > 0 && state.timeLeft < 15) {
    timer.classList.add('hud__timer--urgent');
  }

  progress.append(fill);
  timer.append(timerText, progress);

  return timer;
};

const createHeader = (state: GameState): HTMLElement => {
  const header = document.createElement('header');
  const frame = document.createElement('div');
  const hud = document.createElement('div');
  const score = createHudItem('Score', String(state.score), scoreIconUrl);
  const titleGroup = document.createElement('div');
  const title = document.createElement('h1');
  const time = createTimerHud(state);

  const lives = document.createElement('div');

  header.className = 'game-header';
  frame.className = 'game-header__frame';
  hud.className = 'game-header__hud';
  score.classList.add('hud__score');
  titleGroup.className = 'game-header__title-group';
  title.className = 'game-header__title';
  title.textContent = "Alchemist's Cauldron";
  titleGroup.append(title);

  if (state.status === 'menu') {
    lives.className = 'hud__lives hud__lives--empty';
    lives.setAttribute('aria-hidden', 'true');
  } else {
    const livesLabel = document.createElement('span');
    const hearts = document.createElement('span');

    lives.className = 'hud__lives';
    livesLabel.className = 'visually-hidden';
    hearts.className = 'hud__hearts';
    livesLabel.textContent = 'Lives';
    hearts.setAttribute('aria-label', `${state.lives} lives remaining`);

    for (let life = 0; life < state.lives; life += 1) {
      const heart = document.createElement('img');
      heart.className = 'hud__heart';
      heart.src = heartIconUrl;
      heart.alt = '';
      heart.setAttribute('aria-hidden', 'true');
      hearts.append(heart);
    }

    lives.append(livesLabel, hearts);
  }

  hud.append(score, time, lives);
  frame.append(hud);
  header.append(frame, titleGroup);

  return header;
};

export const renderApp = (
  container: HTMLElement,
  state: GameState,
  handlers: AppHandlers,
): void => {
  const shell = document.createElement('main');
  const board = document.createElement('div');
  const shelf = createShelf(state, handlers.onAddIngredient);
  const cauldron = createCauldron(state, handlers.onAddIngredient);
  const recipe = createRecipePanel(state);
  const parameterBars = createParameterBars(state);
  const gameControls = createGameControls(
    state,
    handlers.onStartGame,
    handlers.onContinueGame,
    handlers.hasSavedGame,
    handlers.onBrew,
    handlers.onPourOut,
    handlers.onOpenLeaderboard,
    handlers.onOpenHelp,
    handlers.onOpenSettings,
    handlers.onPause,
  );
  const footer = document.createElement('footer');
  const gameOverDialog =
    handlers.leaderboardDialog === 'closed'
      ? createGameOverDialog(
          state,
          handlers.shouldRequestPlayerName,
          handlers.onSubmitPlayerName,
          handlers.onPlayAgain,
          handlers.onOpenLeaderboard,
        )
      : undefined;
  const pauseDialog = createPauseDialog(state, handlers.onResume, handlers.onExitToMenu);
  const leaderboard =
    handlers.leaderboardDialog === 'open'
      ? createLeaderboardDialog(
          handlers.leaderboardEntries,
          handlers.leaderboardDifficulty,
          handlers.leaderboardNotice,
          handlers.onSelectLeaderboardDifficulty,
          handlers.onCloseLeaderboard,
          handlers.onRequestClearLeaderboard,
        )
      : undefined;
  const helpDialog =
    handlers.menuDialog === 'help' ? createHelpDialog(handlers.onCloseMenuDialog) : undefined;
  const settingsDialog =
    handlers.menuDialog === 'settings'
      ? createSettingsDialog(
          state.difficulty,
          handlers.onSelectDifficulty,
          handlers.onCloseMenuDialog,
        )
      : undefined;
  const clearConfirmation =
    handlers.leaderboardDialog === 'confirm-clear'
      ? createClearLeaderboardDialog(
          handlers.leaderboardDifficulty,
          handlers.onConfirmClearLeaderboard,
          handlers.onCancelClearLeaderboard,
        )
      : undefined;

  shell.className = 'game-shell';
  shell.inert =
    state.status === 'paused' ||
    state.status === 'game-over' ||
    handlers.leaderboardDialog !== 'closed' ||
    handlers.menuDialog !== 'closed';

  if (state.status === 'paused') {
    shell.classList.add('game-shell--paused');
  }
  board.className = 'game-board';
  footer.className = 'game-footer';
  footer.textContent = 'Choose ingredients carefully. Every portion is spent.';

  board.append(shelf, cauldron, recipe);
  shell.append(createHeader(state), board, parameterBars, gameControls, footer);
  container.replaceChildren(
    shell,
    ...(pauseDialog ? [pauseDialog] : []),
    ...(gameOverDialog ? [gameOverDialog] : []),
    ...(leaderboard ? [leaderboard] : []),
    ...(clearConfirmation ? [clearConfirmation] : []),
    ...(helpDialog ? [helpDialog] : []),
    ...(settingsDialog ? [settingsDialog] : []),
  );
};
