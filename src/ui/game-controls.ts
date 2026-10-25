import { getDifficultySettings } from '../data/difficulty.ts';
import { getReactionById } from '../data/reactions.ts';
import type { GameState } from '../types/game.ts';

const createActionButton = (
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

const createBrewStatus = (state: GameState): HTMLElement => {
  const status = document.createElement('p');
  const count = state.cauldronIngredientIds.length;
  const rules = getDifficultySettings(state.difficulty);

  status.className = 'game-controls__status';
  status.setAttribute('aria-live', 'polite');

  if (state.lastReactionIds.length > 0) {
    const reactionNames = state.lastReactionIds
      .map((reactionId) => getReactionById(reactionId)?.name)
      .filter((name) => name !== undefined);
    status.classList.add('game-controls__status--reaction');
    status.textContent = `Reaction: ${reactionNames.join(', ')}`;
  } else if (state.lastBrewResult === 'success') {
    status.classList.add('game-controls__status--success');
    status.textContent = `Successful brew: +${rules.scorePerBrew} points`;
  } else if (state.lastBrewResult === 'failure') {
    status.classList.add('game-controls__status--failure');
    status.textContent = 'The mixture failed: one life lost';
  } else if (count === rules.cauldronCapacity) {
    status.textContent = 'Maximum capacity reached';
  } else if (state.enabledReactionIds.length > 0) {
    const reactionNames = state.enabledReactionIds
      .map((reactionId) => getReactionById(reactionId)?.name)
      .filter((name) => name !== undefined);
    status.textContent = `Enabled reactions: ${reactionNames.join(', ')}`;
  } else {
    status.textContent = 'Select ingredients, match all three parameters, then brew';
  }

  return status;
};

export const createGameControls = (
  state: GameState,
  onStartGame: () => void,
  onContinueGame: () => void,
  hasSavedGame: boolean,
  onBrew: () => void,
  onPourOut: () => void,
  onOpenLeaderboard: () => void,
  onOpenHelp: () => void,
  onOpenSettings: () => void,
  onPause: () => void,
): HTMLElement => {
  const controls = document.createElement('section');
  const leftSlot = document.createElement('div');
  const centerSlot = document.createElement('div');
  const rightSlot = document.createElement('div');

  controls.className = 'game-controls';
  controls.setAttribute('aria-label', 'Game controls');
  leftSlot.className = 'game-controls__side game-controls__side--left';
  centerSlot.className = 'game-controls__main';
  rightSlot.className = 'game-controls__side game-controls__side--right';

  if (state.status === 'menu') {
    const selectedDifficulty = document.createElement('p');
    selectedDifficulty.className = 'game-controls__difficulty';
    selectedDifficulty.textContent = `Difficulty: ${state.difficulty[0]?.toUpperCase() ?? ''}${state.difficulty.slice(1)}`;
    leftSlot.append(
      createActionButton('Top Players', 'secondary-action game-controls__side-action', () => {
        onOpenLeaderboard();
      }),
    );
    const startActions = document.createElement('div');
    startActions.className = 'game-controls__start-actions';
    startActions.append(createActionButton('Start Game', 'primary-action', onStartGame));

    if (hasSavedGame) {
      startActions.append(createActionButton('Continue Game', 'secondary-action', onContinueGame));
    }

    centerSlot.append(startActions, selectedDifficulty);
    rightSlot.append(
      createActionButton('Help', 'secondary-action game-controls__side-action', onOpenHelp),
      createActionButton('Settings', 'secondary-action game-controls__side-action', onOpenSettings),
    );
  } else {
    const playActions = document.createElement('div');
    const brewButton = createActionButton('Brew', 'primary-action', onBrew);
    const pourOutButton = createActionButton(
      'Pour Out −10s',
      'secondary-action game-controls__pour-out',
      onPourOut,
    );

    playActions.className = 'game-controls__play-actions';
    brewButton.disabled = state.cauldronIngredientIds.length === 0 || state.status !== 'playing';
    pourOutButton.disabled = state.cauldronIngredientIds.length === 0 || state.status !== 'playing';
    playActions.append(brewButton, pourOutButton);
    centerSlot.append(playActions, createBrewStatus(state));

    if (state.status === 'playing') {
      rightSlot.append(
        createActionButton('Pause', 'secondary-action game-controls__side-action', onPause),
      );
    }
  }

  controls.append(leftSlot, centerSlot, rightSlot);

  return controls;
};
