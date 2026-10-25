import { getDifficultySettings } from './difficulty.ts';
import { getIngredientById, INGREDIENTS } from './ingredients.ts';
import type { Difficulty, ParameterValues, RandomSource, Reaction } from '../types/game.ts';

const hasIngredients = (
  ingredientIds: readonly string[],
  ...requiredIds: readonly string[]
): boolean => requiredIds.every((requiredId) => ingredientIds.includes(requiredId));

const identity = (values: ParameterValues): ParameterValues => values;
const scale = (value: number, multiplier: number): number => Math.round(value * multiplier);

const createReaction = (
  reaction: Omit<Reaction, 'timePenaltySeconds' | 'lifePenalty' | 'clearsCauldron'> &
    Partial<Pick<Reaction, 'timePenaltySeconds' | 'lifePenalty' | 'clearsCauldron'>>,
): Reaction => ({
  timePenaltySeconds: 0,
  lifePenalty: 0,
  clearsCauldron: false,
  ...reaction,
});

export const REACTIONS = [
  createReaction({
    id: 'bubbling',
    name: 'Bubbling',
    type: 'ingredients',
    requiredIngredientIds: ['fairy-dust', 'caustic-acid'],
    isActive: (ids) => hasIngredients(ids, 'fairy-dust', 'caustic-acid'),
    apply: (values) => ({ ...values, magicPower: scale(values.magicPower, 1.5) }),
    timePenaltySeconds: 10,
  }),
  createReaction({
    id: 'volatile-mix',
    name: 'Volatile Mix',
    type: 'ingredients',
    requiredIngredientIds: ['phoenix-feather', 'essence-of-the-void'],
    isActive: (ids) => hasIngredients(ids, 'phoenix-feather', 'essence-of-the-void'),
    apply: identity,
    lifePenalty: 1,
    clearsCauldron: true,
  }),
  createReaction({
    id: 'solar-frost',
    name: 'Solar Frost',
    type: 'ingredients',
    requiredIngredientIds: ['dragon-tears', 'frost-lotus'],
    isActive: (ids) => hasIngredients(ids, 'dragon-tears', 'frost-lotus'),
    apply: (values) => ({
      ...values,
      temperature: 0,
      density: scale(values.density, 1.2),
    }),
  }),
  createReaction({
    id: 'rooted-steam',
    name: 'Rooted Steam',
    type: 'ingredients',
    requiredIngredientIds: ['mandrake-root', 'toad-slime'],
    isActive: (ids) => hasIngredients(ids, 'mandrake-root', 'toad-slime'),
    apply: (values) => ({
      ...values,
      density: scale(values.density, 1.25),
      magicPower: scale(values.magicPower, 0.9),
    }),
  }),
  createReaction({
    id: 'ashen-bloom',
    name: 'Ashen Bloom',
    type: 'ingredients',
    requiredIngredientIds: ['phoenix-feather', 'fairy-dust'],
    isActive: (ids) => hasIngredients(ids, 'phoenix-feather', 'fairy-dust'),
    apply: (values) => ({
      ...values,
      temperature: values.temperature + 10,
      magicPower: scale(values.magicPower, 1.25),
    }),
  }),
  createReaction({
    id: 'annihilation',
    name: 'Annihilation',
    type: 'stats',
    requiredIngredientIds: [],
    isActive: (ids) => {
      const ingredients = ids
        .map((ingredientId) => getIngredientById(ingredientId))
        .filter((ingredient) => ingredient !== undefined);

      return (
        ingredients.some((ingredient) => ingredient.temperature > 15) &&
        ingredients.some((ingredient) => ingredient.temperature < -15)
      );
    },
    apply: (values) => ({ ...values, temperature: 0, density: values.density * 2 }),
  }),
  createReaction({
    id: 'pressure-spike',
    name: 'Pressure Spike',
    type: 'stats',
    requiredIngredientIds: [],
    isActive: (_ids, values) => values.density >= 70,
    apply: (values) => ({
      ...values,
      density: 70,
      magicPower: scale(values.magicPower, 1.1),
    }),
  }),
  createReaction({
    id: 'magma-flux',
    name: 'Magma Flux',
    type: 'stats',
    requiredIngredientIds: [],
    isActive: (_ids, values) => values.temperature >= 60,
    apply: (values) => ({
      ...values,
      density: scale(values.density, 0.9),
      magicPower: scale(values.magicPower, 1.2),
    }),
  }),
  createReaction({
    id: 'deep-freeze',
    name: 'Deep Freeze',
    type: 'stats',
    requiredIngredientIds: [],
    isActive: (_ids, values) => values.temperature <= -20,
    apply: (values) => ({
      ...values,
      density: scale(values.density, 1.15),
      magicPower: scale(values.magicPower, 0.85),
    }),
  }),
  createReaction({
    id: 'arcane-saturation',
    name: 'Arcane Saturation',
    type: 'stats',
    requiredIngredientIds: [],
    isActive: (_ids, values) => values.magicPower >= 80,
    apply: (values) => ({ ...values, magicPower: 80, temperature: values.temperature + 5 }),
  }),
  createReaction({
    id: 'steam-burst',
    name: 'Steam Burst',
    type: 'mix',
    requiredIngredientIds: ['dragon-tears', 'caustic-acid'],
    isActive: (ids, values) =>
      hasIngredients(ids, 'dragon-tears', 'caustic-acid') && values.temperature >= 35,
    apply: (values) => ({ ...values, temperature: values.temperature + 10 }),
    timePenaltySeconds: 5,
  }),
  createReaction({
    id: 'black-ice',
    name: 'Black Ice',
    type: 'mix',
    requiredIngredientIds: ['frost-lotus', 'essence-of-the-void'],
    isActive: (ids, values) =>
      hasIngredients(ids, 'frost-lotus', 'essence-of-the-void') && values.density <= 0,
    apply: (values) => ({
      ...values,
      temperature: values.temperature - 10,
      magicPower: scale(values.magicPower, 1.2),
    }),
  }),
  createReaction({
    id: 'heavy-spark',
    name: 'Heavy Spark',
    type: 'mix',
    requiredIngredientIds: ['fairy-dust', 'toad-slime'],
    isActive: (ids, values) =>
      hasIngredients(ids, 'fairy-dust', 'toad-slime') && values.density >= 40,
    apply: (values) => ({
      ...values,
      density: scale(values.density, 1.2),
      magicPower: scale(values.magicPower, 1.1),
    }),
  }),
  createReaction({
    id: 'burning-root',
    name: 'Burning Root',
    type: 'mix',
    requiredIngredientIds: ['mandrake-root', 'phoenix-feather'],
    isActive: (ids, values) =>
      hasIngredients(ids, 'mandrake-root', 'phoenix-feather') && values.temperature >= 40,
    apply: (values) => ({
      ...values,
      temperature: values.temperature + 15,
      density: scale(values.density, 0.9),
    }),
  }),
  createReaction({
    id: 'void-resonance',
    name: 'Void Resonance',
    type: 'mix',
    requiredIngredientIds: ['essence-of-the-void', 'dragon-tears'],
    isActive: (ids, values) =>
      hasIngredients(ids, 'essence-of-the-void', 'dragon-tears') && values.magicPower >= 50,
    apply: (values) => ({
      ...values,
      temperature: values.temperature - 5,
      magicPower: scale(values.magicPower, 1.3),
    }),
  }),
] as const satisfies readonly Reaction[];

export const getReactionById = (reactionId: string): Reaction | undefined =>
  REACTIONS.find((reaction) => reaction.id === reactionId);

export const getReactionsForDifficulty = (difficulty: Difficulty): readonly Reaction[] => {
  const rules = getDifficultySettings(difficulty);
  const availableIds = new Set<string>(
    INGREDIENTS.slice(0, rules.shelfSize).map((ingredient) => ingredient.id),
  );

  return REACTIONS.filter((reaction) =>
    reaction.requiredIngredientIds.every((ingredientId) => availableIds.has(ingredientId)),
  );
};

export const selectRandomReactionIds = (
  count: number,
  difficulty: Difficulty,
  random: RandomSource = Math.random,
): readonly string[] => {
  const available = [...getReactionsForDifficulty(difficulty)];
  const selected: string[] = [];

  while (selected.length < count && available.length > 0) {
    const index = Math.floor(random() * available.length);
    const [reaction] = available.splice(index, 1);

    if (reaction) {
      selected.push(reaction.id);
    }
  }

  return selected;
};
