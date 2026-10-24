import { MAX_INGREDIENT_STOCK, MIN_INGREDIENT_STOCK } from '../data/difficulty.ts';
import type { Ingredient, ShelfStock } from '../types/game.ts';

export type RandomSource = () => number;

const getRandomWholeNumber = (minimum: number, maximum: number, random: RandomSource): number =>
  Math.floor(random() * (maximum - minimum + 1)) + minimum;

export const createShelfStock = (
  ingredients: readonly Ingredient[],
  shelfSize: number,
  random: RandomSource = Math.random,
): ShelfStock => {
  const stock: Record<string, number> = {};

  for (const ingredient of ingredients.slice(0, shelfSize)) {
    stock[ingredient.id] = getRandomWholeNumber(MIN_INGREDIENT_STOCK, MAX_INGREDIENT_STOCK, random);
  }

  return stock;
};

export const decreaseIngredientStock = (
  shelfStock: ShelfStock,
  ingredientId: string,
): ShelfStock => ({
  ...shelfStock,
  [ingredientId]: Math.max((shelfStock[ingredientId] ?? 0) - 1, 0),
});
