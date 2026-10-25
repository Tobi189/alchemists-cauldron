import cauldronEmblemUrl from '../assets/ui/cauldron-emblem.svg';
import cauldronFiligreeUrl from '../assets/ui/cauldron-filigree.svg';
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
    const icon = document.createElement('img');

    item.className = 'cauldron__ingredient';
    position.className = 'cauldron__ingredient-position';
    icon.className = 'cauldron__ingredient-icon';
    item.title = ingredient.name;
    position.textContent = String(index + 1);
    icon.src = ingredient.iconUrl;
    icon.alt = '';
    icon.setAttribute('aria-hidden', 'true');
    item.append(position, icon);
    contents.append(item);
  }

  return contents;
};

export const createCauldron = (state: GameState): HTMLElement => {
  const section = document.createElement('section');
  const stage = document.createElement('div');
  const glow = document.createElement('div');
  const vessel = document.createElement('div');
  const rim = document.createElement('div');
  const liquid = document.createElement('div');
  const body = document.createElement('div');
  const filigree = document.createElement('img');
  const emblem = document.createElement('img');
  const base = document.createElement('div');

  section.className = 'cauldron-area';
  stage.className = 'cauldron-stage';
  glow.className = 'cauldron-stage__glow';
  vessel.className = 'cauldron';
  rim.className = 'cauldron__rim';
  liquid.className = 'cauldron__liquid';
  body.className = 'cauldron__body';
  filigree.className = 'cauldron__filigree';
  emblem.className = 'cauldron__emblem';
  base.className = 'cauldron__base';
  filigree.src = cauldronFiligreeUrl;
  filigree.alt = '';
  filigree.setAttribute('aria-hidden', 'true');
  emblem.src = cauldronEmblemUrl;
  emblem.alt = '';
  emblem.setAttribute('aria-hidden', 'true');

  liquid.append(createCauldronContents(state));
  rim.append(liquid);
  body.append(filigree, emblem);
  vessel.append(rim, body, base);
  stage.append(glow, vessel);

  section.append(stage);

  return section;
};
