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

export const createCauldron = (state: GameState, onStartGame: () => void): HTMLElement => {
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
    const status = document.createElement('p');
    status.className = 'cauldron-area__status';
    status.textContent =
      count === LEVEL_ONE_RULES.cauldronCapacity
        ? 'Maximum capacity reached'
        : 'Select an ingredient from the shelf';
    actions.append(status);
  }

  section.append(stage, counter, actions);

  return section;
};
