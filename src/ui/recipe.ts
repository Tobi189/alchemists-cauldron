import { LEVEL_ONE_RULES } from '../data/difficulty.ts';
import type { GameState, RecipeRange } from '../types/game.ts';

const formatRange = (range: RecipeRange): string => `${range.min}–${range.max}`;

const createRangeRow = (label: string, value: string, className: string): HTMLElement => {
  const row = document.createElement('div');
  const rowLabel = document.createElement('span');
  const rowValue = document.createElement('strong');

  row.className = `recipe-panel__range ${className}`;
  rowLabel.textContent = label;
  rowValue.textContent = value;
  row.append(rowLabel, rowValue);

  return row;
};

export const createRecipePanel = (state: GameState): HTMLElement => {
  const panel = document.createElement('aside');
  const eyebrow = document.createElement('p');
  const title = document.createElement('h2');
  const content = document.createElement('div');
  const counter = document.createElement('p');
  const count = state.cauldronIngredientIds.length;

  panel.className = 'recipe-panel';
  eyebrow.className = 'recipe-panel__eyebrow';
  title.className = 'recipe-panel__title';
  content.className = 'recipe-panel__content';
  counter.className = 'recipe-panel__counter';
  eyebrow.textContent = 'Current Recipe';
  counter.textContent = `Ingredients: ${count} / ${LEVEL_ONE_RULES.cauldronCapacity}`;

  if (state.activeRecipe) {
    title.textContent = state.activeRecipe.name;
    content.classList.add('recipe-panel__ranges');
    content.append(
      createRangeRow(
        'Temperature',
        formatRange(state.activeRecipe.temperature),
        'recipe-panel__range--temperature',
      ),
      createRangeRow(
        'Density',
        formatRange(state.activeRecipe.density),
        'recipe-panel__range--density',
      ),
      createRangeRow(
        'Magic Power',
        formatRange(state.activeRecipe.magicPower),
        'recipe-panel__range--magic',
      ),
    );
  } else {
    const message = document.createElement('p');
    title.textContent = 'The Grimoire Sleeps';
    message.className = 'recipe-panel__message';
    message.textContent = 'Begin a new game to open the recipe book.';
    content.append(message);
  }

  if (count === LEVEL_ONE_RULES.cauldronCapacity) {
    counter.classList.add('recipe-panel__counter--full');
  }

  panel.append(eyebrow, title, content, counter);

  return panel;
};
