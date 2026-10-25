const INGREDIENT_DRAG_TYPE = 'application/x-alchemists-cauldron-ingredient';

export const didStartIngredientDrag = (event: DragEvent, ingredientId: string): boolean => {
  if (!event.dataTransfer) {
    return false;
  }

  event.dataTransfer.effectAllowed = 'copy';
  event.dataTransfer.setData(INGREDIENT_DRAG_TYPE, ingredientId);
  event.dataTransfer.setData('text/plain', ingredientId);

  return true;
};

export const isIngredientDrag = (event: DragEvent): boolean =>
  event.dataTransfer !== null && [...event.dataTransfer.types].includes(INGREDIENT_DRAG_TYPE);

export const getDraggedIngredientId = (event: DragEvent): string | undefined => {
  const ingredientId = event.dataTransfer?.getData(INGREDIENT_DRAG_TYPE);

  return ingredientId || undefined;
};
