import { useState, useEffect } from 'react';
import { ActivityIndicator, SafeAreaView, Text, View } from 'react-native';

import WordList from '~/components/WordList';
import type { WordDictionary } from '~/types/WordDictionary';

export default function WordListPage() {
  const [wordDictionary, setWordDictionary] = useState<WordDictionary | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWordDictionary = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          'https://raw.githubusercontent.com/dwyl/english-words/refs/heads/master/words_dictionary.json'
        );

        if (!response.ok) {
          throw new Error('Failed to fetch word dictionary');
        }

        const data: Record<string, number> = await response.json();

        setWordDictionary(data);
      } catch (error) {
        console.error('Error loading JSON file:', error);
        setError('An error occurred while loading the word dictionary.');
      } finally {
        setLoading(false);
      }
    };

    fetchWordDictionary();
  }, []);

  return (
    <SafeAreaView className="flex-1">
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#000" />
          <Text className="mt-2">Loading...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-red-500">{error}</Text>
        </View>
      ) : (
        wordDictionary && <WordList wordDictionary={wordDictionary} />
      )}
    </SafeAreaView>
  );
}
