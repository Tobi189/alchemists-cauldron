export type GameShortcut =
  | { readonly type: 'add-ingredient'; readonly ingredientIndex: number }
  | { readonly type: 'brew' }
  | { readonly type: 'pour-out' }
  | { readonly type: 'pause' };

const INGREDIENT_SHORTCUTS: Readonly<Record<string, number>> = {
  Digit1: 0,
  Digit2: 1,
  Digit3: 2,
  Digit4: 3,
  Digit5: 4,
  Digit6: 5,
  Digit7: 6,
  Digit8: 7,
  Numpad1: 0,
  Numpad2: 1,
  Numpad3: 2,
  Numpad4: 3,
  Numpad5: 4,
  Numpad6: 5,
  Numpad7: 6,
  Numpad8: 7,
};

const isTextEntryTarget = (target: EventTarget | null): boolean =>
  target instanceof HTMLInputElement ||
  target instanceof HTMLTextAreaElement ||
  target instanceof HTMLSelectElement ||
  (target instanceof HTMLElement && target.isContentEditable);

export const getGameShortcut = (event: KeyboardEvent): GameShortcut | undefined => {
  if (
    event.defaultPrevented ||
    event.repeat ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    isTextEntryTarget(event.target)
  ) {
    return undefined;
  }

  const ingredientIndex = INGREDIENT_SHORTCUTS[event.code];

  if (ingredientIndex !== undefined) {
    return { type: 'add-ingredient', ingredientIndex };
  }

  switch (event.code) {
    case 'KeyB': {
      return { type: 'brew' };
    }
    case 'KeyO': {
      return { type: 'pour-out' };
    }
    case 'KeyP': {
      return { type: 'pause' };
    }
    default: {
      return undefined;
    }
  }
};
