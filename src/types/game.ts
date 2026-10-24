export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameStatus = 'menu' | 'playing' | 'paused' | 'game-over';
export type RandomSource = () => number;

export type ShelfStock = Readonly<Record<string, number>>;

export interface Ingredient {
  readonly id: string;
  readonly name: string;
  readonly icon: string;
  readonly temperature: number;
  readonly density: number;
  readonly magicPower: number;
}

export interface GameRules {
  readonly difficulty: Difficulty;
  readonly shelfSize: number;
  readonly cauldronCapacity: number;
  readonly startingTimeSeconds: number;
  readonly recipeTolerance: number;
  readonly startingLives: number;
  readonly scorePerBrew: number;
  readonly timeBonusSeconds: number;
  readonly reactionCount: number;
}

export interface ParameterValues {
  readonly temperature: number;
  readonly density: number;
  readonly magicPower: number;
}

export interface RecipeRange {
  readonly min: number;
  readonly max: number;
}

export interface Recipe {
  readonly id: string;
  readonly name: string;
  readonly difficulty: Difficulty;
  readonly temperature: RecipeRange;
  readonly density: RecipeRange;
  readonly magicPower: RecipeRange;
}

export interface GameState {
  readonly status: GameStatus;
  readonly score: number;
  readonly timeLeft: number;
  readonly lives: number;
  readonly activeRecipe: Recipe | undefined;
  readonly shelfStock: ShelfStock;
  readonly cauldronIngredientIds: readonly string[];
}
