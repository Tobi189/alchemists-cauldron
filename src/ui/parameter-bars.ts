import { isValueInRange } from '../logic/range.ts';
import { calculateReactedCauldronValues } from '../logic/reactions.ts';
import type { GameState, ParameterValues, RecipeRange } from '../types/game.ts';

type ParameterKey = keyof ParameterValues;

interface ParameterDefinition {
  readonly key: ParameterKey;
  readonly label: string;
  readonly shortLabel: string;
  readonly minimum: number;
  readonly maximum: number;
  readonly className: string;
}

const PARAMETER_DEFINITIONS = [
  {
    key: 'temperature',
    label: 'Temperature',
    shortLabel: 'T',
    minimum: -250,
    maximum: 250,
    className: 'parameter-bar--temperature',
  },
  {
    key: 'density',
    label: 'Density',
    shortLabel: 'D',
    minimum: -150,
    maximum: 150,
    className: 'parameter-bar--density',
  },
  {
    key: 'magicPower',
    label: 'Magic Power',
    shortLabel: 'MP',
    minimum: 0,
    maximum: 200,
    className: 'parameter-bar--magic',
  },
] as const satisfies readonly ParameterDefinition[];

const clamp = (value: number, minimum: number, maximum: number): number =>
  Math.min(Math.max(value, minimum), maximum);

const getPosition = (value: number, definition: ParameterDefinition): number =>
  ((clamp(value, definition.minimum, definition.maximum) - definition.minimum) /
    (definition.maximum - definition.minimum)) *
  100;

const createScaleLabel = (value: number, className: string): HTMLElement => {
  const label = document.createElement('span');
  label.className = className;
  label.textContent = String(value).replace('-', '−');

  return label;
};

const createParameterBar = (
  definition: ParameterDefinition,
  value: number,
  previousValue: number,
  targetRange: RecipeRange | undefined,
): HTMLElement => {
  const article = document.createElement('article');
  const header = document.createElement('div');
  const label = document.createElement('h3');
  const currentValue = document.createElement('strong');
  const track = document.createElement('div');
  const marker = document.createElement('span');
  const zeroLine = document.createElement('span');
  const scale = document.createElement('div');
  const currentPosition = getPosition(value, definition);
  const previousPosition = getPosition(previousValue, definition);
  const zeroPosition = getPosition(0, definition);
  const isWithinTarget = targetRange ? isValueInRange(value, targetRange) : false;

  article.className = `parameter-bar ${definition.className}`;
  header.className = 'parameter-bar__header';
  label.className = 'parameter-bar__label';
  currentValue.className = 'parameter-bar__value';
  track.className = 'parameter-bar__track';
  marker.className = 'parameter-bar__marker';
  zeroLine.className = 'parameter-bar__zero';
  scale.className = 'parameter-bar__scale';
  label.textContent = definition.label;
  currentValue.textContent = `${definition.shortLabel} ${String(value).replace('-', '−')}`;
  article.setAttribute('role', 'meter');
  article.setAttribute('aria-label', definition.label);
  article.setAttribute('aria-valuemin', String(definition.minimum));
  article.setAttribute('aria-valuemax', String(definition.maximum));
  article.setAttribute('aria-valuenow', String(value));
  marker.style.setProperty('--current-position', `${currentPosition}%`);
  marker.style.setProperty('--previous-position', `${previousPosition}%`);
  zeroLine.style.setProperty('--zero-position', `${zeroPosition}%`);

  if (targetRange) {
    const target = document.createElement('span');
    const targetStart = getPosition(targetRange.min, definition);
    const targetEnd = getPosition(targetRange.max, definition);
    target.className = 'parameter-bar__target';
    target.style.setProperty('--target-start', `${targetStart}%`);
    target.style.setProperty('--target-width', `${targetEnd - targetStart}%`);
    track.append(target);
  }

  if (isWithinTarget) {
    article.classList.add('parameter-bar--in-range');
  }

  scale.append(
    createScaleLabel(definition.minimum, 'parameter-bar__scale-min'),
    createScaleLabel(0, 'parameter-bar__scale-zero'),
    createScaleLabel(definition.maximum, 'parameter-bar__scale-max'),
  );
  header.append(label, currentValue);
  track.append(zeroLine, marker);
  article.append(header, track, scale);

  return article;
};

export const createParameterBars = (state: GameState): HTMLElement => {
  const section = document.createElement('section');
  const heading = document.createElement('h2');
  const values = calculateReactedCauldronValues(
    state.cauldronIngredientIds,
    state.enabledReactionIds,
  );
  const previousValues = calculateReactedCauldronValues(
    state.previousCauldronIngredientIds,
    state.enabledReactionIds,
  );

  section.className = 'parameter-panel';
  heading.className = 'visually-hidden';
  heading.textContent = 'Cauldron parameters';
  section.append(heading);

  for (const definition of PARAMETER_DEFINITIONS) {
    const targetRange = state.activeRecipe?.[definition.key];
    section.append(
      createParameterBar(
        definition,
        values[definition.key],
        previousValues[definition.key],
        targetRange,
      ),
    );
  }

  return section;
};
