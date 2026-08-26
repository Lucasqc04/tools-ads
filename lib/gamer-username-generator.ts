export type UsernameStyle = 'classic' | 'leet' | 'symbols';

type WordBank = {
  adjectives: string[];
  nouns: string[];
};

const genericWordBank: WordBank = {
  adjectives: [
    'Shadow', 'Silent', 'Crimson', 'Frozen', 'Savage', 'Rogue', 'Toxic', 'Phantom',
    'Rapid', 'Golden', 'Iron', 'Neon', 'Cosmic', 'Cyber', 'Dark', 'Wild',
    'Lunar', 'Solar', 'Venom', 'Blaze', 'Ghost', 'Storm', 'Mystic', 'Feral',
  ],
  nouns: [
    'Wolf', 'Ninja', 'Hunter', 'Phoenix', 'Dragon', 'Falcon', 'Reaper', 'Viper',
    'Titan', 'Knight', 'Raven', 'Panther', 'Sniper', 'Warrior', 'Rebel', 'Nomad',
    'Specter', 'Fury', 'Blade', 'Comet', 'Rider', 'Hawk', 'Cobra', 'Legend',
  ],
};

const flavorWordBankByGameId: Record<string, WordBank> = {
  fortnite: {
    adjectives: ['Victory', 'Storm', 'Battle', 'Loot', 'Turbo', 'Boogie'],
    nouns: ['Llama', 'Builder', 'Royale', 'Glider', 'Skirmish', 'Fortress'],
  },
  'free-fire': {
    adjectives: ['Blazing', 'Squad', 'Rush', 'Booyah', 'Combat', 'Desert'],
    nouns: ['Survivor', 'Grenade', 'Sniper', 'Warrior', 'Bandit', 'Falcon'],
  },
  roblox: {
    adjectives: ['Blocky', 'Pixel', 'Studio', 'Quirky', 'Bouncy', 'Robo'],
    nouns: ['Builder', 'Avatar', 'Noob', 'Creator', 'Brick', 'Cube'],
  },
  valorant: {
    adjectives: ['Tactical', 'Radiant', 'Phantom', 'Silent', 'Precision', 'Neon'],
    nouns: ['Agent', 'Duelist', 'Sentinel', 'Vandal', 'Ghost', 'Phoenix'],
  },
  'cod-mobile': {
    adjectives: ['Tactical', 'Combat', 'Elite', 'Rapid', 'Stealth', 'Frontline'],
    nouns: ['Operator', 'Soldier', 'Marksman', 'Recon', 'Trooper', 'Warfighter'],
  },
  'pubg-mobile': {
    adjectives: ['Chicken', 'Desert', 'Airdrop', 'Squad', 'Zone', 'Camo'],
    nouns: ['Survivor', 'Sniper', 'Looter', 'Trooper', 'Nomad', 'Ranger'],
  },
  'counter-strike-2': {
    adjectives: ['Tactical', 'Clutch', 'Rifle', 'Smoke', 'Headshot', 'Rank'],
    nouns: ['Sniper', 'Rusher', 'Anchor', 'Ace', 'Fragger', 'Support'],
  },
  minecraft: {
    adjectives: ['Blocky', 'Crafty', 'Diamond', 'Redstone', 'Enchanted', 'Pixel'],
    nouns: ['Miner', 'Builder', 'Creeper', 'Steve', 'Golem', 'Villager'],
  },
  'brawl-stars': {
    adjectives: ['Brawly', 'Turbo', 'Gadget', 'Super', 'Chromatic', 'Rowdy'],
    nouns: ['Brawler', 'Bandit', 'Gadgeteer', 'Sharpshooter', 'Rascal', 'Champion'],
  },
  'rocket-league': {
    adjectives: ['Turbo', 'Aerial', 'Boosted', 'Nitro', 'Supersonic', 'Clutch'],
    nouns: ['Striker', 'Goalie', 'Rocketeer', 'Demolisher', 'Flipper', 'Rally'],
  },
};

const decorativeSymbols = ['✦', '★', '⚔', '☠', '♛', '☆', '⚡', 'ϟ'];

const randomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const pickRandom = <T,>(items: T[]): T => items[randomInt(0, items.length - 1)];

const getWordBank = (gameId?: string): WordBank =>
  (gameId ? flavorWordBankByGameId[gameId] : undefined) ?? genericWordBank;

const leetMap: Record<string, string> = {
  a: '4', A: '4',
  e: '3', E: '3',
  i: '1', I: '1',
  o: '0', O: '0',
  s: '5', S: '5',
  t: '7', T: '7',
};

export const toLeetSpeak = (value: string): string =>
  Array.from(value)
    .map((char) => leetMap[char] ?? char)
    .join('');

export const decorateWithSymbols = (value: string): string => {
  const symbol = pickRandom(decorativeSymbols);
  return `${symbol}${value}${symbol}`;
};

export type GenerateUsernameOptions = {
  gameId?: string;
  style?: UsernameStyle;
  includeNumber?: boolean;
};

export const generateUsername = ({
  gameId,
  style = 'classic',
  includeNumber = true,
}: GenerateUsernameOptions = {}): string => {
  const bank = getWordBank(gameId);
  const adjective = pickRandom(bank.adjectives);
  const noun = pickRandom(bank.nouns);

  let name = `${adjective}${noun}`;

  if (includeNumber) {
    name += String(randomInt(1, 999));
  }

  if (style === 'leet') {
    name = toLeetSpeak(name);
  } else if (style === 'symbols') {
    name = decorateWithSymbols(name);
  }

  return name;
};

export const generateUsernameBatch = (
  count: number,
  options: GenerateUsernameOptions = {},
): string[] => Array.from({ length: count }, () => generateUsername(options));
