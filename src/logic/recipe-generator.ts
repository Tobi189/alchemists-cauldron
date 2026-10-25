import { RECIPES } from '../data/recipes.ts';
import type { Difficulty, RandomSource, Recipe } from '../types/game.ts';

export const getRecipesByDifficulty = (difficulty: Difficulty): readonly Recipe[] =>
  RECIPES.filter((recipe) => recipe.difficulty === difficulty);

export const selectRandomRecipe = (
  difficulty: Difficulty,
  random: RandomSource = Math.random,
): Recipe => {
  const recipes = getRecipesByDifficulty(difficulty);
  const index = Math.floor(random() * recipes.length);
  const recipe = recipes[index];

  if (!recipe) {
    throw new Error(`No recipes configured for difficulty: ${difficulty}`);
  }

  return recipe;
};
