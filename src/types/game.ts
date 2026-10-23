export type Difficulty = 'easy' | 'medium' | 'hard';

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
