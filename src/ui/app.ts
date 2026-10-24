import type { GameState } from '../types/game.ts';
import { createCauldron } from './cauldron.ts';
import { createParameterBars } from './parameter-bars.ts';
import { createRecipePanel } from './recipe.ts';
import { createShelf } from './shelf.ts';

export interface AppHandlers {
  readonly onStartGame: () => void;
  readonly onAddIngredient: (ingredientId: string) => void;
}

const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const createHudItem = (label: string, value: string): HTMLElement => {
  const item = document.createElement('div');
  const itemLabel = document.createElement('span');
  const itemValue = document.createElement('strong');

  item.className = 'hud__item';
  itemLabel.className = 'hud__label';
  itemValue.className = 'hud__value';
  itemLabel.textContent = label;
  itemValue.textContent = value;
  item.append(itemLabel, itemValue);

  return item;
};

const createHeader = (state: GameState): HTMLElement => {
  const header = document.createElement('header');
  const score = createHudItem('Score', String(state.score));
  const titleGroup = document.createElement('div');
  const eyebrow = document.createElement('span');
  const title = document.createElement('h1');
  const time = createHudItem('Time', formatTime(state.timeLeft));

  header.className = 'game-header';
  titleGroup.className = 'game-header__title-group';
  eyebrow.className = 'game-header__eyebrow';
  title.className = 'game-header__title';
  eyebrow.textContent = 'The Arcane Workshop';
  title.textContent = "Alchemist's Cauldron";
  titleGroup.append(eyebrow, title);

  const rightHud = document.createElement('div');
  rightHud.className = 'hud__right';
  rightHud.append(time);

  if (state.status !== 'menu') {
    const lives = document.createElement('div');
    const livesLabel = document.createElement('span');
    const hearts = document.createElement('span');

    lives.className = 'hud__lives';
    livesLabel.className = 'visually-hidden';
    hearts.className = 'hud__hearts';
    livesLabel.textContent = 'Lives';
    hearts.textContent = '♥'.repeat(state.lives);
    hearts.setAttribute('aria-label', `${state.lives} lives remaining`);
    lives.append(livesLabel, hearts);
    rightHud.append(lives);
  }

  header.append(score, titleGroup, rightHud);

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
  const cauldron = createCauldron(state, handlers.onStartGame);
  const recipe = createRecipePanel(state);
  const parameterBars = createParameterBars(state);
  const footer = document.createElement('footer');

  shell.className = 'game-shell';
  board.className = 'game-board';
  footer.className = 'game-footer';
  footer.textContent = 'Choose ingredients carefully. Every portion is spent.';

  board.append(shelf, cauldron, recipe);
  shell.append(createHeader(state), board, parameterBars, footer);
  container.replaceChildren(shell);
};
