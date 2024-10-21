import emojilib from 'emojilib';

export interface Emoji {
  emoji: string;
  key: string;
}

export const emoji = emojilib;

export const emojiNameMap = new Map<string, string>();
Object.entries(emoji).forEach(([emojiSymbol, names]) =>
  names.forEach((name) => emojiNameMap.set(name, emojiSymbol))
);

// export const emojiData = Object.entries(emojilib).map(
//   ([name, { char: emoji }]) => [name, emoji] as const,
// )

// export const emojiCodesByName = new Map(emojiData)

// export const emojiNamesByCode = new Map(
//   emojiData.map(([name, emoji]) => [normalizeCode(emoji), name]),
// )
