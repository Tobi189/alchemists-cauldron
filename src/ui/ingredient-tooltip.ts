import type { Ingredient } from '../types/game.ts';

const VIEWPORT_MARGIN = 12;

const formatModifier = (value: number): string =>
  value > 0 ? `+${value}` : String(value).replace('-', '−');

const createTooltipRow = (label: string, value: number, className: string): HTMLElement => {
  const row = document.createElement('span');
  const rowLabel = document.createElement('span');
  const rowValue = document.createElement('strong');

  row.className = `ingredient-tooltip__row ${className}`;
  rowLabel.textContent = label;
  rowValue.textContent = formatModifier(value);
  row.append(rowLabel, rowValue);

  return row;
};

const updateTooltipPosition = (card: HTMLElement, tooltip: HTMLElement): void => {
  tooltip.classList.remove('ingredient-tooltip--left', 'ingredient-tooltip--up');

  const cardBounds = card.getBoundingClientRect();
  const tooltipBounds = tooltip.getBoundingClientRect();
  const shouldOpenLeft =
    cardBounds.right + VIEWPORT_MARGIN + tooltipBounds.width > globalThis.innerWidth;
  const shouldOpenUp =
    cardBounds.top + cardBounds.height / 2 + tooltipBounds.height / 2 + VIEWPORT_MARGIN >
    globalThis.innerHeight;

  tooltip.classList.toggle('ingredient-tooltip--left', shouldOpenLeft);
  tooltip.classList.toggle('ingredient-tooltip--up', shouldOpenUp);
};

export const createIngredientTooltip = (ingredient: Ingredient, card: HTMLElement): HTMLElement => {
  const tooltip = document.createElement('span');
  const title = document.createElement('strong');

  tooltip.className = 'ingredient-tooltip';
  tooltip.id = `ingredient-tooltip-${ingredient.id}`;
  tooltip.setAttribute('role', 'tooltip');
  title.className = 'ingredient-tooltip__title';
  title.textContent = ingredient.name;
  tooltip.append(
    title,
    createTooltipRow('Temperature', ingredient.temperature, 'ingredient-tooltip__row--temperature'),
    createTooltipRow('Density', ingredient.density, 'ingredient-tooltip__row--density'),
    createTooltipRow('Magic Power', ingredient.magicPower, 'ingredient-tooltip__row--magic'),
  );

  const positionTooltip = (): void => {
    updateTooltipPosition(card, tooltip);
  };

  card.addEventListener('pointerenter', positionTooltip);
  card.addEventListener('focus', positionTooltip);

  return tooltip;
};
