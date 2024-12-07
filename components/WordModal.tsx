import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';

import type { Word } from '../types/Word';

import { useFavorites } from '~/app/_contexts/FavoritesContext';
import { useHistory } from '~/app/_contexts/HistoryContext';

type WordModalProps = {
  word: Word;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
};

export default function WordModal({
  word,
  onClose,
  onNext,
  onPrevious,
  hasPrevious,
  hasNext,
}: WordModalProps) {
  const { addToHistory, isAccessed } = useHistory();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [currentMeaningIndex] = useState(0);
  const [audio, setAudio] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(false);

  useEffect(() => {
    if (word && !isAccessed(word)) addToHistory(word);
  }, [word, addToHistory, isAccessed]);

  useEffect(() => {
    return () => {
      if (audio) audio.unloadAsync();
    };
  }, [audio]);

  const playAudio = async () => {
    if (!word.audio) {
      Alert.alert('Audio not available', 'No pronunciation audio found for this word.');
      return;
    }

    try {
      setLoadingAudio(true);
      if (audio) {
        await audio.replayAsync();
      } else {
        const { sound } = await Audio.Sound.createAsync({ uri: word.audio });
        setAudio(sound);
        await sound.playAsync();
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && !status.isPlaying) {
            setIsPlaying(false);
          }
        });
      }
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing audio:', error);
      Alert.alert('Error', 'Could not play audio. Please try again.');
    } finally {
      setLoadingAudio(false);
    }
  };

  const getButtonStyle = (enabled: boolean) => ({
    color: enabled ? 'black' : 'gray',
  });

  const currentMeaning = word.meanings ? word.meanings[currentMeaningIndex] : null;

  const handleToggleFavorite = () => {
    toggleFavorite(word);
  };

  return (
    <Modal animationType="slide" transparent visible>
      <View className="flex-1 justify-end">
        <View className="h-3/4 rounded-t-3xl bg-white p-6">
          {/* Header */}
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-2xl font-bold">{word.word}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {/* Phonetic */}
          {word.phonetic && <Text className="mb-4 text-lg text-gray-600">{word.phonetic}</Text>}

          {/* Audio Button */}
          {word.audio && (
            <TouchableOpacity
              onPress={playAudio}
              className="mb-4 flex-row items-center"
              disabled={loadingAudio}>
              {loadingAudio ? (
                <ActivityIndicator size="large" color="black" />
              ) : (
                <Ionicons
                  name={isPlaying ? 'pause-circle' : 'play-circle'}
                  size={36}
                  color="black"
                />
              )}
              <Text className="ml-2 text-base">
                {loadingAudio ? 'Loading audio...' : 'Play Pronunciation'}
              </Text>
            </TouchableOpacity>
          )}

          {/* Current Meaning */}
          {currentMeaning && (
            <View className="mb-4">
              <Text className="mb-2 text-lg font-semibold">Meanings</Text>
              {currentMeaning.definitions.map((definition, index) => (
                <View key={`${definition.definition}-${index}`} className="mb-2">
                  <Text className="text-base">
                    <Text className="capitalize">{currentMeaning.partOfSpeech}</Text> -{' '}
                    {definition.definition}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Favorite Button */}
          <TouchableOpacity onPress={handleToggleFavorite} className="flex-row items-center">
            <Ionicons
              name={isFavorite(word) ? 'star' : 'star-outline'}
              size={24}
              color={isFavorite(word) ? 'gold' : 'gray'}
            />
            <Text className="ml-2 text-base">
              {isFavorite(word) ? 'Remove from Favorites' : 'Add to Favorites'}
            </Text>
          </TouchableOpacity>

          {/* Navigation Buttons */}
          <View className="mt-6 flex-row justify-between">
            <TouchableOpacity
              onPress={onPrevious}
              disabled={!hasPrevious}
              className="flex-row items-center"
              accessibilityLabel="Show previous meaning"
              accessibilityRole="button">
              <Ionicons name="arrow-back" size={24} style={getButtonStyle(hasPrevious)} />
              <Text className="ml-2 text-base" style={getButtonStyle(hasPrevious)}>
                Voltar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onNext}
              disabled={!hasNext}
              className="flex-row items-center"
              accessibilityLabel="Show next meaning"
              accessibilityRole="button">
              <Text className="mr-2 text-base" style={getButtonStyle(hasNext)}>
                Próximo
              </Text>
              <Ionicons name="arrow-forward" size={24} style={getButtonStyle(hasNext)} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
