import { getIngredientById } from '../data/ingredients.ts';
import type { ParameterValues } from '../types/game.ts';

export const calculateCauldronValues = (
  cauldronIngredientIds: readonly string[],
): ParameterValues => {
  let temperature = 0;
  let density = 0;
  let magicPower = 0;

  for (const ingredientId of cauldronIngredientIds) {
    const ingredient = getIngredientById(ingredientId);

    if (!ingredient) {
      continue;
    }

    temperature += ingredient.temperature;
    density += ingredient.density;
    magicPower += ingredient.magicPower;
  }

  return { temperature, density, magicPower };
};
