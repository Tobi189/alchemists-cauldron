import { LEVEL_ONE_RULES } from '../data/difficulty.ts';
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

  status.className = 'game-controls__status';
  status.setAttribute('aria-live', 'polite');

  if (state.lastBrewResult === 'success') {
    status.classList.add('game-controls__status--success');
    status.textContent = `Successful brew: +${LEVEL_ONE_RULES.scorePerBrew} points`;
  } else if (state.lastBrewResult === 'failure') {
    status.classList.add('game-controls__status--failure');
    status.textContent = 'The mixture failed: one life lost';
  } else if (count === LEVEL_ONE_RULES.cauldronCapacity) {
    status.textContent = 'Maximum capacity reached';
  } else {
    status.textContent = 'Select ingredients, match all three parameters, then brew';
  }

  return status;
};

export const createGameControls = (
  state: GameState,
  onStartGame: () => void,
  onBrew: () => void,
  onOpenLeaderboard: () => void,
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
    leftSlot.append(
      createActionButton('Top Players', 'secondary-action game-controls__side-action', () => {
        onOpenLeaderboard();
      }),
    );
    centerSlot.append(createActionButton('Start Game', 'primary-action', onStartGame));
  } else {
    const brewButton = createActionButton('Brew', 'primary-action', onBrew);
    brewButton.disabled = state.cauldronIngredientIds.length === 0 || state.status !== 'playing';
    centerSlot.append(brewButton, createBrewStatus(state));

    if (state.status === 'playing') {
      rightSlot.append(
        createActionButton('Pause', 'secondary-action game-controls__side-action', onPause),
      );
    }
  }

  controls.append(leftSlot, centerSlot, rightSlot);

  return controls;
};
