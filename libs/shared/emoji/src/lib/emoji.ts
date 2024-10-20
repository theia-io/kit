import emojilib from 'emojilib';

export interface Emoji {
  emoji: string;
  key: string;
}

const emoji = emojilib;
console.log('emoji', emoji);

export { emoji };

// export const emojiData = Object.entries(emojilib).map(
//   ([name, { char: emoji }]) => [name, emoji] as const,
// )

// export const emojiCodesByName = new Map(emojiData)

// export const emojiNamesByCode = new Map(
//   emojiData.map(([name, emoji]) => [normalizeCode(emoji), name]),
// )
