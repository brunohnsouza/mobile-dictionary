import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

import type { Word } from '~/types/Word';

type WordItemProps = {
  word: Word;
  onPress: () => void;
};

export default function WordItem({ word, onPress }: WordItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        aspectRatio: 1,
        width: '50%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        borderColor: '#000',
        borderWidth: 1,
        backgroundColor: '#ffffff',
      }}>
      <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>{word.word}</Text>
    </TouchableOpacity>
  );
}
