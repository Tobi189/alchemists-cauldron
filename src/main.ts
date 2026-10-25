import './styles/main.scss';
import { addIngredient } from './logic/add-ingredient.ts';
import { brewPotion } from './logic/brew-check.ts';
import { finishGameIfNeeded } from './logic/game-over.ts';
import { addLeaderboardEntry, isTopTenScore } from './logic/leaderboard.ts';
import { pauseGame, resumeGame } from './logic/pause.ts';
import { syncTimer } from './logic/timer.ts';
import { createMenuState, createNewGameState } from './state/game-state.ts';
import { didClearLeaderboard, didSaveLeaderboard, loadLeaderboard } from './storage/leaderboard.ts';
import type { GameState } from './types/game.ts';
import type { LeaderboardEntry } from './types/leaderboard.ts';
import { renderApp } from './ui/app.ts';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('App root element was not found');
}

const startApp = (container: HTMLElement): void => {
  let gameState: GameState = createMenuState();
  let leaderboardEntries: readonly LeaderboardEntry[] = loadLeaderboard();
  let leaderboardDialog: 'closed' | 'open' | 'confirm-clear' = 'closed';
  let leaderboardNotice: string | undefined;
  let hasHandledCurrentResult = false;

  const startNewGame = (): void => {
    gameState = createNewGameState();
    leaderboardDialog = 'closed';
    leaderboardNotice = undefined;
    hasHandledCurrentResult = false;
    render();
  };

  const pauseCurrentGame = (): void => {
    const nextState = finishGameIfNeeded(pauseGame(gameState));

    if (nextState === gameState) {
      return;
    }

    gameState = nextState;
    render();
  };

  const render = (): void => {
    renderApp(container, gameState, {
      leaderboardEntries,
      leaderboardDialog,
      leaderboardNotice,
      shouldRequestPlayerName:
        gameState.status === 'game-over' &&
        !hasHandledCurrentResult &&
        isTopTenScore(gameState.score, leaderboardEntries),
      onStartGame: startNewGame,
      onPlayAgain: startNewGame,
      onOpenLeaderboard: () => {
        leaderboardDialog = 'open';
        leaderboardNotice = undefined;
        render();
      },
      onCloseLeaderboard: () => {
        leaderboardDialog = 'closed';
        leaderboardNotice = undefined;
        render();
      },
      onRequestClearLeaderboard: () => {
        leaderboardDialog = 'confirm-clear';
        render();
      },
      onCancelClearLeaderboard: () => {
        leaderboardDialog = 'open';
        render();
      },
      onConfirmClearLeaderboard: () => {
        if (didClearLeaderboard()) {
          leaderboardEntries = [];
          leaderboardNotice = 'Leaderboard cleared.';
        } else {
          leaderboardNotice = 'The leaderboard could not be cleared in this browser.';
        }

        leaderboardDialog = 'open';
        render();
      },
      onSubmitPlayerName: (name) => {
        leaderboardEntries = addLeaderboardEntry(leaderboardEntries, name, gameState.score);
        hasHandledCurrentResult = true;
        leaderboardNotice = didSaveLeaderboard(leaderboardEntries)
          ? 'Your result was added to the Top 10.'
          : 'Your result could not be saved in this browser.';
        leaderboardDialog = 'open';
        render();
      },
      onPause: pauseCurrentGame,
      onResume: () => {
        const nextState = resumeGame(gameState);

        if (nextState === gameState) {
          return;
        }

        gameState = nextState;
        render();
      },
      onExitToMenu: () => {
        gameState = createMenuState();
        leaderboardDialog = 'closed';
        leaderboardNotice = undefined;
        hasHandledCurrentResult = false;
        render();
      },
      onAddIngredient: (ingredientId) => {
        const nextState = finishGameIfNeeded(addIngredient(gameState, ingredientId));

        if (nextState === gameState) {
          return;
        }

        gameState = nextState;
        render();
      },
      onBrew: () => {
        const nextState = finishGameIfNeeded(brewPotion(gameState));

        if (nextState === gameState) {
          return;
        }

        gameState = nextState;
        render();
      },
    });

    if (gameState.previousCauldronIngredientIds !== gameState.cauldronIngredientIds) {
      gameState = {
        ...gameState,
        previousCauldronIngredientIds: gameState.cauldronIngredientIds,
      };
    }
  };

  render();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      pauseCurrentGame();
    }
  });

  globalThis.setInterval(() => {
    const nextState = finishGameIfNeeded(syncTimer(gameState));

    if (nextState === gameState) {
      return;
    }

    gameState = nextState;
    render();
  }, 250);
};

startApp(app);
