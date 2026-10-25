import type { LeaderboardEntry } from '../types/leaderboard.ts';

export const LEADERBOARD_LIMIT = 10;

const PLAYER_NAME_PATTERN = /^[\p{L}\p{N} _-]{2,15}$/u;

export const isValidPlayerName = (name: string): boolean => PLAYER_NAME_PATTERN.test(name);

export const sortLeaderboard = (
  entries: readonly LeaderboardEntry[],
): readonly LeaderboardEntry[] =>
  entries
    .toSorted((first, second) => second.score - first.score || first.createdAt - second.createdAt)
    .slice(0, LEADERBOARD_LIMIT);

export const isTopTenScore = (score: number, entries: readonly LeaderboardEntry[]): boolean => {
  const rankedEntries = sortLeaderboard(entries);

  return (
    rankedEntries.length < LEADERBOARD_LIMIT || score > (rankedEntries.at(-1)?.score ?? -Infinity)
  );
};

export const addLeaderboardEntry = (
  entries: readonly LeaderboardEntry[],
  name: string,
  score: number,
  createdAt: number = Date.now(),
): readonly LeaderboardEntry[] => sortLeaderboard([...entries, { name, score, createdAt }]);

const padDatePart = (value: number): string => String(value).padStart(2, '0');

export const formatLeaderboardDate = (timestamp: number): string => {
  const date = new Date(timestamp);

  return `${padDatePart(date.getDate())}.${padDatePart(date.getMonth() + 1)}.${date.getFullYear()} ${padDatePart(date.getHours())}:${padDatePart(date.getMinutes())}`;
};
