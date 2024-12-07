export type WordMeaning = {
  partOfSpeech: string;
  definitions: { definition: string }[];
};

export type Word = {
  id: number;
  word: string;
  phonetic?: string;
  meanings?: WordMeaning[];
  audio?: string;
};
