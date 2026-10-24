import { LEVEL_ONE_RULES } from '../data/difficulty.ts';
import { INGREDIENTS } from '../data/ingredients.ts';
import type { GameState } from '../types/game.ts';

const createCauldronContents = (state: GameState): HTMLElement => {
  const contents = document.createElement('div');
  contents.className = 'cauldron__contents';

  if (state.cauldronIngredientIds.length === 0) {
    const emptyMessage = document.createElement('span');
    emptyMessage.className = 'cauldron__empty-message';
    emptyMessage.textContent =
      state.status === 'menu' ? 'The cauldron is dormant' : 'Add an ingredient';
    contents.append(emptyMessage);

    return contents;
  }

  for (const [index, ingredientId] of state.cauldronIngredientIds.entries()) {
    const ingredient = INGREDIENTS.find((item) => item.id === ingredientId);

    if (!ingredient) {
      continue;
    }

    const item = document.createElement('span');
    const position = document.createElement('span');
    const icon = document.createElement('span');

    item.className = 'cauldron__ingredient';
    position.className = 'cauldron__ingredient-position';
    icon.className = 'cauldron__ingredient-icon';
    item.title = ingredient.name;
    position.textContent = String(index + 1);
    icon.textContent = ingredient.icon;
    item.append(position, icon);
    contents.append(item);
  }

  return contents;
};

export const createCauldron = (
  state: GameState,
  onStartGame: () => void,
  onBrew: () => void,
): HTMLElement => {
  const section = document.createElement('section');
  const stage = document.createElement('div');
  const glow = document.createElement('div');
  const vessel = document.createElement('div');
  const rim = document.createElement('div');
  const body = document.createElement('div');
  const emblem = document.createElement('span');
  const counter = document.createElement('p');
  const actions = document.createElement('div');
  const count = state.cauldronIngredientIds.length;

  section.className = 'cauldron-area';
  stage.className = 'cauldron-stage';
  glow.className = 'cauldron-stage__glow';
  vessel.className = 'cauldron';
  rim.className = 'cauldron__rim';
  body.className = 'cauldron__body';
  emblem.className = 'cauldron__emblem';
  counter.className = 'cauldron-area__counter';
  actions.className = 'cauldron-area__actions';
  emblem.textContent = '△';
  counter.textContent = `Ingredients: ${count} / ${LEVEL_ONE_RULES.cauldronCapacity}`;

  rim.append(createCauldronContents(state));
  body.append(emblem);
  vessel.append(rim, body);
  stage.append(glow, vessel);

  if (state.status === 'menu') {
    const startButton = document.createElement('button');
    startButton.className = 'primary-action';
    startButton.type = 'button';
    startButton.textContent = 'Start Game';
    startButton.addEventListener('click', onStartGame);
    actions.append(startButton);
  } else {
    const brewButton = document.createElement('button');
    const status = document.createElement('p');

    brewButton.className = 'primary-action';
    brewButton.type = 'button';
    brewButton.textContent = 'Brew';
    brewButton.disabled = count === 0 || state.status !== 'playing';
    status.className = 'cauldron-area__status';

    if (state.lastBrewResult === 'success') {
      status.classList.add('cauldron-area__status--success');
      status.textContent = `Successful brew: +${LEVEL_ONE_RULES.scorePerBrew} points`;
    } else if (state.lastBrewResult === 'failure') {
      status.classList.add('cauldron-area__status--failure');
      status.textContent = 'The mixture failed: one life lost';
    } else if (count === LEVEL_ONE_RULES.cauldronCapacity) {
      status.textContent = 'Maximum capacity reached';
    } else {
      status.textContent = 'Select an ingredient from the shelf';
    }

    brewButton.addEventListener('click', onBrew);
    actions.append(brewButton, status);
  }

  section.append(stage, counter, actions);

  return section;
};
