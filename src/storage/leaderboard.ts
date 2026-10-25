import { isValidPlayerName, sortLeaderboard } from '../logic/leaderboard.ts';
import type { Difficulty } from '../types/game.ts';
import type { LeaderboardEntry } from '../types/leaderboard.ts';

const LEGACY_LEADERBOARD_STORAGE_KEY = 'alchemists-cauldron:level-1-leaderboard';

const getLeaderboardStorageKey = (difficulty: Difficulty): string =>
  `alchemists-cauldron:leaderboard:${difficulty}`;

const getBrowserStorage = (): Storage | undefined => {
  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
};

const parseLeaderboardEntry = (
  value: unknown,
  difficulty: Difficulty,
): LeaderboardEntry | undefined => {
  if (!value || typeof value !== 'object') {
    return undefined;
  }

  const entry = value as Record<string, unknown>;

  const isValid =
    typeof entry.name === 'string' &&
    isValidPlayerName(entry.name) &&
    typeof entry.score === 'number' &&
    Number.isFinite(entry.score) &&
    entry.score >= 0 &&
    typeof entry.createdAt === 'number' &&
    Number.isFinite(entry.createdAt) &&
    entry.createdAt > 0 &&
    (entry.difficulty === undefined || entry.difficulty === difficulty);

  return isValid
    ? {
        name: entry.name as string,
        score: entry.score as number,
        createdAt: entry.createdAt as number,
        difficulty,
      }
    : undefined;
};

export const loadLeaderboard = (difficulty: Difficulty): readonly LeaderboardEntry[] => {
  try {
    const storage = getBrowserStorage();
    const savedValue =
      storage?.getItem(getLeaderboardStorageKey(difficulty)) ??
      (difficulty === 'medium' ? storage?.getItem(LEGACY_LEADERBOARD_STORAGE_KEY) : undefined);

    if (!savedValue) {
      return [];
    }

    const parsedValue: unknown = JSON.parse(savedValue);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    const entries = parsedValue
      .map((entry) => parseLeaderboardEntry(entry, difficulty))
      .filter((entry): entry is LeaderboardEntry => entry !== undefined);

    return sortLeaderboard(entries);
  } catch {
    return [];
  }
};

export const didSaveLeaderboard = (
  difficulty: Difficulty,
  entries: readonly LeaderboardEntry[],
): boolean => {
  try {
    const storage = getBrowserStorage();

    if (!storage) {
      return false;
    }

    storage.setItem(getLeaderboardStorageKey(difficulty), JSON.stringify(sortLeaderboard(entries)));

    if (difficulty === 'medium') {
      storage.removeItem(LEGACY_LEADERBOARD_STORAGE_KEY);
    }

    return true;
  } catch {
    return false;
  }
};

export const didClearLeaderboard = (difficulty: Difficulty): boolean => {
  try {
    const storage = getBrowserStorage();

    if (!storage) {
      return false;
    }

    storage.removeItem(getLeaderboardStorageKey(difficulty));

    if (difficulty === 'medium') {
      storage.removeItem(LEGACY_LEADERBOARD_STORAGE_KEY);
    }

    return true;
  } catch {
    return false;
  }
};
