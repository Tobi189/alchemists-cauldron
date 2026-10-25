import causticAcidIconUrl from '../assets/ingredients/caustic-acid.svg';
import dragonTearsIconUrl from '../assets/ingredients/dragon-tears.svg';
import essenceVoidIconUrl from '../assets/ingredients/essence-void.svg';
import fairyDustIconUrl from '../assets/ingredients/fairy-dust.svg';
import frostLotusIconUrl from '../assets/ingredients/frost-lotus.svg';
import mandrakeRootIconUrl from '../assets/ingredients/mandrake-root.svg';
import phoenixFeatherIconUrl from '../assets/ingredients/phoenix-feather.svg';
import toadSlimeIconUrl from '../assets/ingredients/toad-slime.svg';
import acidSigilUrl from '../assets/ingredients/sigils/acid.svg';
import dragonSigilUrl from '../assets/ingredients/sigils/dragon.svg';
import fairySigilUrl from '../assets/ingredients/sigils/fairy.svg';
import frostSigilUrl from '../assets/ingredients/sigils/frost.svg';
import rootSigilUrl from '../assets/ingredients/sigils/root.svg';
import phoenixSigilUrl from '../assets/ingredients/sigils/phoenix.svg';
import toadSigilUrl from '../assets/ingredients/sigils/toad.svg';
import voidSigilUrl from '../assets/ingredients/sigils/void.svg';
import type { Ingredient } from '../types/game.ts';

export const INGREDIENTS = [
  {
    id: 'dragon-tears',
    name: 'Dragon Tears',
    iconUrl: dragonTearsIconUrl,
    sigilUrl: dragonSigilUrl,
    temperature: 25,
    density: 8,
    magicPower: 10,
  },
  {
    id: 'fairy-dust',
    name: 'Fairy Dust',
    iconUrl: fairyDustIconUrl,
    sigilUrl: fairySigilUrl,
    temperature: 12,
    density: 9,
    magicPower: 12,
  },
  {
    id: 'frost-lotus',
    name: 'Frost Lotus',
    iconUrl: frostLotusIconUrl,
    sigilUrl: frostSigilUrl,
    temperature: -18,
    density: 4,
    magicPower: 14,
  },
  {
    id: 'mandrake-root',
    name: 'Mandrake Root',
    iconUrl: mandrakeRootIconUrl,
    sigilUrl: rootSigilUrl,
    temperature: -5,
    density: 20,
    magicPower: 8,
  },
  {
    id: 'caustic-acid',
    name: 'Caustic Acid',
    iconUrl: causticAcidIconUrl,
    sigilUrl: acidSigilUrl,
    temperature: 10,
    density: 14,
    magicPower: 22,
  },
  {
    id: 'essence-of-the-void',
    name: 'Essence of the Void',
    iconUrl: essenceVoidIconUrl,
    sigilUrl: voidSigilUrl,
    temperature: -20,
    density: -10,
    magicPower: 40,
  },
  {
    id: 'phoenix-feather',
    name: 'Phoenix Feather',
    iconUrl: phoenixFeatherIconUrl,
    sigilUrl: phoenixSigilUrl,
    temperature: 50,
    density: -10,
    magicPower: 30,
  },
  {
    id: 'toad-slime',
    name: 'Toad Slime',
    iconUrl: toadSlimeIconUrl,
    sigilUrl: toadSigilUrl,
    temperature: 5,
    density: 30,
    magicPower: 0,
  },
] as const satisfies readonly Ingredient[];

export const getIngredientById = (ingredientId: string): Ingredient | undefined =>
  INGREDIENTS.find((ingredient) => ingredient.id === ingredientId);
