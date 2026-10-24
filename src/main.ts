import './styles/main.scss';
import { addIngredient } from './logic/add-ingredient.ts';
import { brewPotion } from './logic/brew-check.ts';
import { createMenuState, createNewGameState } from './state/game-state.ts';
import type { GameState } from './types/game.ts';
import { renderApp } from './ui/app.ts';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('App root element was not found');
}

const startApp = (container: HTMLElement): void => {
  let gameState: GameState = createMenuState();

  const render = (): void => {
    renderApp(container, gameState, {
      onStartGame: () => {
        gameState = createNewGameState();
        render();
      },
      onAddIngredient: (ingredientId) => {
        const nextState = addIngredient(gameState, ingredientId);

        if (nextState === gameState) {
          return;
        }

        gameState = nextState;
        render();
      },
      onBrew: () => {
        const nextState = brewPotion(gameState);

        if (nextState === gameState) {
          return;
        }

        gameState = nextState;
        render();
      },
    });
  };

  render();
};

startApp(app);
