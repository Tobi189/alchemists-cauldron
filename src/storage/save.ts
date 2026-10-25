import { DIFFICULTIES, getDifficultySettings } from '../data/difficulty.ts';
import { INGREDIENTS } from '../data/ingredients.ts';
import { RECIPES } from '../data/recipes.ts';
import type { Difficulty, GameState, Recipe, ShelfStock } from '../types/game.ts';

const SAVE_STORAGE_KEY = 'alchemists-cauldron:saved-game';
const SAVE_VERSION = 1;

interface SavedGame {
  readonly version: number;
  readonly difficulty: Difficulty;
  readonly score: number;
  readonly timeLeft: number;
  readonly lives: number;
  readonly activeRecipe: Recipe;
  readonly cauldronIngredients: readonly string[];
  readonly shelfStock: ShelfStock;
  readonly status: 'playing' | 'paused';
}

const getBrowserStorage = (): Storage | undefined => {
  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isDifficulty = (value: unknown): value is Difficulty =>
  typeof value === 'string' && DIFFICULTIES.includes(value as Difficulty);

const isWholeNumberInRange = (value: unknown, minimum: number, maximum: number): value is number =>
  typeof value === 'number' && Number.isSafeInteger(value) && value >= minimum && value <= maximum;

const getCanonicalRecipe = (value: unknown, difficulty: Difficulty): Recipe | undefined => {
  if (!isRecord(value) || typeof value.id !== 'string') {
    return undefined;
  }

  const recipe = RECIPES.find((item) => item.id === value.id && item.difficulty === difficulty);

  return recipe && JSON.stringify(value) === JSON.stringify(recipe) ? recipe : undefined;
};

const parseShelfStock = (value: unknown, difficulty: Difficulty): ShelfStock | undefined => {
  if (!isRecord(value)) {
    return undefined;
  }

  const rules = getDifficultySettings(difficulty);
  const allowedIngredients = INGREDIENTS.slice(0, rules.shelfSize);

  if (Object.keys(value).length !== allowedIngredients.length) {
    return undefined;
  }

  const stock: Record<string, number> = {};

  for (const ingredient of allowedIngredients) {
    const amount = value[ingredient.id];

    if (!isWholeNumberInRange(amount, 0, 15)) {
      return undefined;
    }

    stock[ingredient.id] = amount;
  }

  return stock;
};

const parseCauldronIngredients = (
  value: unknown,
  difficulty: Difficulty,
): readonly string[] | undefined => {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const rules = getDifficultySettings(difficulty);
  const allowedIds = new Set<string>(
    INGREDIENTS.slice(0, rules.shelfSize).map((ingredient) => ingredient.id),
  );

  return value.length <= rules.cauldronCapacity &&
    value.every((ingredientId) => typeof ingredientId === 'string' && allowedIds.has(ingredientId))
    ? value
    : undefined;
};

const parseSavedGame = (value: unknown): GameState | undefined => {
  if (!isRecord(value) || value.version !== SAVE_VERSION || !isDifficulty(value.difficulty)) {
    return undefined;
  }

  const difficulty = value.difficulty;
  const rules = getDifficultySettings(difficulty);
  const activeRecipe = getCanonicalRecipe(value.activeRecipe, difficulty);
  const shelfStock = parseShelfStock(value.shelfStock, difficulty);
  const cauldronIngredientIds = parseCauldronIngredients(value.cauldronIngredients, difficulty);
  const hasValidStatus = value.status === 'playing' || value.status === 'paused';

  if (!hasValidStatus || !activeRecipe || !shelfStock || !cauldronIngredientIds) {
    return undefined;
  }

  const hasIngredientsRemaining =
    Object.values(shelfStock).some((amount) => amount > 0) || cauldronIngredientIds.length > 0;

  if (
    !hasIngredientsRemaining ||
    !isWholeNumberInRange(value.score, 0, Number.MAX_SAFE_INTEGER) ||
    !isWholeNumberInRange(value.timeLeft, 1, rules.startingTimeSeconds) ||
    !isWholeNumberInRange(value.lives, 1, rules.startingLives)
  ) {
    return undefined;
  }

  return {
    difficulty,
    status: 'paused',
    score: value.score,
    timeLeft: value.timeLeft,
    timerEndsAt: undefined,
    lives: value.lives,
    gameOverReason: undefined,
    activeRecipe,
    lastBrewResult: undefined,
    shelfStock,
    cauldronIngredientIds,
    previousCauldronIngredientIds: cauldronIngredientIds,
  };
};

export const didSaveGame = (state: GameState): boolean => {
  if (
    (state.status !== 'playing' && state.status !== 'paused') ||
    !state.activeRecipe ||
    state.timeLeft <= 0 ||
    state.lives <= 0
  ) {
    return false;
  }

  const savedGame: SavedGame = {
    version: SAVE_VERSION,
    difficulty: state.difficulty,
    score: state.score,
    timeLeft: state.timeLeft,
    lives: state.lives,
    activeRecipe: state.activeRecipe,
    cauldronIngredients: state.cauldronIngredientIds,
    shelfStock: state.shelfStock,
    status: state.status,
  };

  try {
    const storage = getBrowserStorage();

    if (!storage) {
      return false;
    }

    storage.setItem(SAVE_STORAGE_KEY, JSON.stringify(savedGame));

    return true;
  } catch {
    return false;
  }
};

export const loadGame = (): GameState | undefined => {
  try {
    const storage = getBrowserStorage();
    const savedValue = storage?.getItem(SAVE_STORAGE_KEY);

    if (!storage || !savedValue) {
      return undefined;
    }

    const parsedValue: unknown = JSON.parse(savedValue);
    const gameState = parseSavedGame(parsedValue);

    if (!gameState) {
      storage.removeItem(SAVE_STORAGE_KEY);
    }

    return gameState;
  } catch {
    try {
      getBrowserStorage()?.removeItem(SAVE_STORAGE_KEY);
    } catch {
      // Storage is unavailable, so there is nothing else to recover.
    }

    return undefined;
  }
};

export const didClearSavedGame = (): boolean => {
  try {
    const storage = getBrowserStorage();

    if (!storage) {
      return false;
    }

    storage.removeItem(SAVE_STORAGE_KEY);

    return true;
  } catch {
    return false;
  }
};
