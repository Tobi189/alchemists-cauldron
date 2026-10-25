import { isValidPlayerName, sortLeaderboard } from '../logic/leaderboard.ts';
import type { LeaderboardEntry } from '../types/leaderboard.ts';

const LEADERBOARD_STORAGE_KEY = 'alchemists-cauldron:level-1-leaderboard';

const getBrowserStorage = (): Storage | undefined => {
  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
};

const isLeaderboardEntry = (value: unknown): value is LeaderboardEntry => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const entry = value as Record<string, unknown>;

  return (
    typeof entry.name === 'string' &&
    isValidPlayerName(entry.name) &&
    typeof entry.score === 'number' &&
    Number.isFinite(entry.score) &&
    entry.score >= 0 &&
    typeof entry.createdAt === 'number' &&
    Number.isFinite(entry.createdAt) &&
    entry.createdAt > 0
  );
};

export const loadLeaderboard = (): readonly LeaderboardEntry[] => {
  try {
    const savedValue = getBrowserStorage()?.getItem(LEADERBOARD_STORAGE_KEY);

    if (!savedValue) {
      return [];
    }

    const parsedValue: unknown = JSON.parse(savedValue);

    return Array.isArray(parsedValue)
      ? sortLeaderboard(parsedValue.filter(isLeaderboardEntry))
      : [];
  } catch {
    return [];
  }
};

export const didSaveLeaderboard = (entries: readonly LeaderboardEntry[]): boolean => {
  try {
    const storage = getBrowserStorage();

    if (!storage) {
      return false;
    }

    storage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(sortLeaderboard(entries)));

    return true;
  } catch {
    return false;
  }
};

export const didClearLeaderboard = (): boolean => {
  try {
    const storage = getBrowserStorage();

    if (!storage) {
      return false;
    }

    storage.removeItem(LEADERBOARD_STORAGE_KEY);

    return true;
  } catch {
    return false;
  }
};
