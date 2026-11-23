export const CLUE_VALUES = [100, 200, 300, 400, 500] as const;
export type ClueValue = (typeof CLUE_VALUES)[number];
export const BOARD_COLUMNS = 6;

export type LibraryCategory = { id: number; name: string; filled: number };
export type FinalPrompt = { id: number; category: string; answer: string; question: string };
export type GameSummary = {
  id: number;
  title: string;
  createdLabel: string;
  played: number;
  finalPlayed: boolean;
  categories: string[];
};
export type ClueDraft = { value: ClueValue; answer: string; question: string };
export type CategoryDetail = { id: number; name: string; clues: ClueDraft[] };
export type TeamNames = [string, string];
export type TeamScore = { id: number; slot: number; name: string; score: number };
export type BoardClue = { position: number; value: number; answer: string; question: string };
export type BoardData = {
  id: number;
  title: string;
  categories: { position: number; name: string }[];
  clues: BoardClue[];
  played: { position: number; value: number }[];
  teams: TeamScore[];
  final: { category: string; answer: string; question: string; played: boolean };
};

export function formatDollars(n: number): string {
  const abs = Math.abs(Math.trunc(n)).toLocaleString("en-US");
  return n < 0 ? `−$${abs}` : `$${abs}`;
}

export function clueKey(position: number, value: number): string {
  return `${position}:${value}`;
}

export function teamLabel(name: string | undefined, slot: number): string {
  const trimmed = name?.trim();
  return trimmed ? trimmed : `Team ${slot + 1}`;
}
