import emojilib from 'emojilib';

export interface Emoji {
  emoji: string;
  key: string;
}

export const emoji = emojilib;

export const emojiNameMap = new Map<string, string>();
Object.entries(emoji).forEach(([emojiSymbol, names]) =>
  names.forEach((name) => emojiNameMap.set(name, emojiSymbol)),
);
