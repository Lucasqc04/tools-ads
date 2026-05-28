import type { Cs2PlayerCrosshair, Cs2PlayerRole } from '@/data/cs2/crosshair-players';

export type Cs2CrosshairFilters = {
  query: string;
  country: string;
  team: string;
  role: '' | Cs2PlayerRole;
  withCodeOnly: boolean;
};

const normalize = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

const matchesQuery = (player: Cs2PlayerCrosshair, query: string): boolean => {
  if (!query) {
    return true;
  }

  const normalizedQuery = normalize(query);
  const searchField = [
    player.displayName,
    player.slug,
    player.team,
    player.country,
    player.role,
    ...player.aliases,
  ]
    .filter(Boolean)
    .join(' ');

  return normalize(searchField).includes(normalizedQuery);
};

export const filterCs2Players = (
  players: Cs2PlayerCrosshair[],
  filters: Cs2CrosshairFilters,
): Cs2PlayerCrosshair[] =>
  players.filter((player) => {
    if (filters.withCodeOnly && !player.crosshairCode) {
      return false;
    }

    if (filters.country && player.country !== filters.country) {
      return false;
    }

    if (filters.team && player.team !== filters.team) {
      return false;
    }

    if (filters.role && player.role !== filters.role) {
      return false;
    }

    return matchesQuery(player, filters.query);
  });

const sortValues = (values: string[]): string[] =>
  values.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

export const getCountryOptions = (players: Cs2PlayerCrosshair[]): string[] =>
  sortValues(
    Array.from(new Set(players.map((player) => player.country).filter(Boolean) as string[])),
  );

export const getTeamOptions = (players: Cs2PlayerCrosshair[]): string[] =>
  sortValues(
    Array.from(new Set(players.map((player) => player.team).filter(Boolean) as string[])),
  );

export const getRoleOptions = (players: Cs2PlayerCrosshair[]): Cs2PlayerRole[] =>
  sortValues(
    Array.from(new Set(players.map((player) => player.role).filter(Boolean) as Cs2PlayerRole[])),
  ) as Cs2PlayerRole[];
