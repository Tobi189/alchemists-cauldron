import './styles/main.scss';
import { DEFAULT_DIFFICULTY } from './data/difficulty.ts';
import { addIngredient } from './logic/add-ingredient.ts';
import { brewPotion } from './logic/brew-check.ts';
import { finishGameIfNeeded } from './logic/game-over.ts';
import { addLeaderboardEntry, isTopTenScore } from './logic/leaderboard.ts';
import { pauseGame, resumeGame } from './logic/pause.ts';
import { syncTimer } from './logic/timer.ts';
import { createMenuState, createNewGameState } from './state/game-state.ts';
import { didClearLeaderboard, didSaveLeaderboard, loadLeaderboard } from './storage/leaderboard.ts';
import type { Difficulty, GameState } from './types/game.ts';
import type { LeaderboardEntry } from './types/leaderboard.ts';
import { renderApp } from './ui/app.ts';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('App root element was not found');
}

const startApp = (container: HTMLElement): void => {
  let gameState: GameState = createMenuState();
  let leaderboards: Readonly<Record<Difficulty, readonly LeaderboardEntry[]>> = {
    easy: loadLeaderboard('easy'),
    medium: loadLeaderboard('medium'),
    hard: loadLeaderboard('hard'),
  };
  let leaderboardDifficulty: Difficulty = DEFAULT_DIFFICULTY;
  let leaderboardDialog: 'closed' | 'open' | 'confirm-clear' = 'closed';
  let menuDialog: 'closed' | 'help' | 'settings' = 'closed';
  let leaderboardNotice: string | undefined;
  let hasHandledCurrentResult = false;

  const startNewGame = (): void => {
    gameState = createNewGameState(gameState.difficulty);
    leaderboardDialog = 'closed';
    menuDialog = 'closed';
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
    const currentLeaderboard = leaderboards[gameState.difficulty];

    renderApp(container, gameState, {
      leaderboardEntries: leaderboards[leaderboardDifficulty],
      leaderboardDifficulty,
      leaderboardDialog,
      menuDialog,
      leaderboardNotice,
      shouldRequestPlayerName:
        gameState.status === 'game-over' &&
        !hasHandledCurrentResult &&
        isTopTenScore(gameState.score, currentLeaderboard),
      onStartGame: startNewGame,
      onPlayAgain: startNewGame,
      onOpenLeaderboard: () => {
        leaderboardDifficulty = gameState.difficulty;
        leaderboardDialog = 'open';
        menuDialog = 'closed';
        leaderboardNotice = undefined;
        render();
      },
      onSelectLeaderboardDifficulty: (difficulty) => {
        leaderboardDifficulty = difficulty;
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
        if (didClearLeaderboard(leaderboardDifficulty)) {
          leaderboards = { ...leaderboards, [leaderboardDifficulty]: [] };
          leaderboardNotice = `${leaderboardDifficulty} leaderboard cleared.`;
        } else {
          leaderboardNotice = 'The leaderboard could not be cleared in this browser.';
        }

        leaderboardDialog = 'open';
        render();
      },
      onSubmitPlayerName: (name) => {
        const difficulty = gameState.difficulty;
        const nextEntries = addLeaderboardEntry(
          leaderboards[difficulty],
          name,
          gameState.score,
          difficulty,
        );
        leaderboards = { ...leaderboards, [difficulty]: nextEntries };
        leaderboardDifficulty = difficulty;
        hasHandledCurrentResult = true;
        leaderboardNotice = didSaveLeaderboard(difficulty, nextEntries)
          ? 'Your result was added to the Top 10.'
          : 'Your result could not be saved in this browser.';
        leaderboardDialog = 'open';
        render();
      },
      onOpenHelp: () => {
        menuDialog = 'help';
        render();
      },
      onOpenSettings: () => {
        menuDialog = 'settings';
        render();
      },
      onCloseMenuDialog: () => {
        menuDialog = 'closed';
        render();
      },
      onSelectDifficulty: (difficulty) => {
        if (gameState.status !== 'menu') {
          return;
        }

        gameState = createMenuState(difficulty);
        leaderboardDifficulty = difficulty;
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
        gameState = createMenuState(gameState.difficulty);
        leaderboardDialog = 'closed';
        menuDialog = 'closed';
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
